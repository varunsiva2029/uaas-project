using System.Net.Http.Json;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddHttpClient("Supabase", client =>
{
    client.Timeout = TimeSpan.FromSeconds(15);
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("UaasFrontend", policy =>
    {
        policy.WithOrigins(
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "https://uaas-website.onrender.com",
            "https://uaas.co.in",
            "https://www.uaas.co.in"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("UaasFrontend");
app.UseHttpsRedirection();

app.MapGet("/", () => Results.Ok(new
{
    business = "Ultra Automation Solutions",
    message = "UAAS API is running successfully!",
    status = "Running"
}));

app.MapGet("/api/supabase-https-check", CheckSupabaseHttpsAsync);

app.MapGet("/api/enquiries", () => Results.Ok(new
{
    message = "UAAS enquiry API is ready.",
    submitEndpoint = "POST /api/enquiries",
    trackingEndpoint = "POST /api/enquiries/track"
}));

app.MapPost("/api/enquiries", SubmitEnquiryAsync);
app.MapPost("/api/enquiries/track", TrackEnquiryAsync);

// Log Book endpoints
/*app.MapGet("/api/logbook", GetLogbookAsync);
app.MapPost("/api/logbook", CreateLogbookEntryAsync);
//app.MapDelete("/api/logbook/{id:guid}", DeleteLogbookEntryAsync);
app.MapPut("/api/logbook/{id:guid}", UpdateLogbookEntryAsync);*/
app.MapGet("/api/logbook", GetLogbookAsync);
app.MapPost("/api/logbook", CreateLogbookEntryAsync);
app.MapPut("/api/logbook/{id:guid}", UpdateLogbookEntryAsync);
app.MapDelete("/api/logbook/{id:guid}", DeleteLogbookEntryAsync);

app.Run();

static bool TryGetSupabaseSettings(
    IConfiguration configuration,
    out string baseUrl,
    out string apiKey)
{
    baseUrl = configuration["Supabase:Url"]?.TrimEnd('/') ?? "";
    apiKey = configuration["Supabase:PublishableKey"] ?? "";

    return Uri.TryCreate(baseUrl, UriKind.Absolute, out var uri)
        && uri.Scheme == Uri.UriSchemeHttps
        && !string.IsNullOrWhiteSpace(apiKey);
}

static async Task<IResult> CheckSupabaseHttpsAsync(
    IConfiguration configuration,
    IHttpClientFactory clients,
    ILogger<Program> logger)
{
    if (!TryGetSupabaseSettings(configuration, out var baseUrl, out var key))
        return Results.Problem("Supabase URL or Publishable key is missing.");

    try
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Get, $"{baseUrl}/auth/v1/health");

        request.Headers.TryAddWithoutValidation("apikey", key);

        using var response = await clients.CreateClient("Supabase")
            .SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("Supabase health check returned HTTP {Status}",
                (int)response.StatusCode);

            return Results.Problem(
                "Supabase health check failed.",
                statusCode: StatusCodes.Status502BadGateway);
        }

        return Results.Ok(new
        {
            status = "Connected",
            message = "C# reached Supabase over HTTPS."
        });
    }
    catch (Exception ex) when (
        ex is HttpRequestException or TaskCanceledException)
    {
        logger.LogError(ex, "Supabase health check failed.");

        return Results.Problem(
            "Could not reach Supabase over HTTPS.",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
}

static async Task<IResult> SubmitEnquiryAsync(
    EnquiryRequest input,
    IConfiguration configuration,
    IHttpClientFactory clients,
    ILogger<Program> logger)
{
    if (string.IsNullOrWhiteSpace(input.Name) ||
        string.IsNullOrWhiteSpace(input.Phone))
    {
        return Results.BadRequest(new
        {
            message = "Name and phone are required."
        });
    }

    if (!TryGetSupabaseSettings(configuration, out var baseUrl, out var key))
        return Results.Problem("Supabase URL or Publishable key is missing.");

    var reference =
        $"UAAS-{DateTime.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";

    var payload = new Dictionary<string, object?>
    {
        ["ref"] = reference,
        ["name"] = input.Name.Trim(),
        ["company"] = Clean(input.Company),
        ["phone"] = input.Phone.Trim(),
        ["email"] = Clean(input.Email),
        ["type"] = Clean(input.Type),
        ["brand"] = Clean(input.Brand),
        ["model"] = Clean(input.Model),
        ["details"] = Clean(input.Details),
        ["status"] = "Received",
        ["result"] = ""
    };

    try
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Post, $"{baseUrl}/rest/v1/enquiries")
        {
            Content = JsonContent.Create(payload)
        };

        request.Headers.TryAddWithoutValidation("apikey", key);
        request.Headers.TryAddWithoutValidation("Prefer", "return=minimal");

        using var response = await clients.CreateClient("Supabase")
            .SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();

            logger.LogWarning(
                "Supabase enquiry insert failed. HTTP {Status}: {Error}",
                (int)response.StatusCode, error);

            return Results.Problem(
                "Supabase did not save the enquiry. Check the API logs.",
                statusCode: StatusCodes.Status502BadGateway);
        }

        return Results.Ok(new
        {
            message = "Enquiry submitted successfully.",
            reference
        });
    }
    catch (Exception ex) when (
        ex is HttpRequestException or TaskCanceledException)
    {
        logger.LogError(ex, "Enquiry submission request failed.");

        return Results.Problem(
            "Could not contact Supabase. Please try again.",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
}

static async Task<IResult> TrackEnquiryAsync(
    TrackEnquiryRequest input,
    IConfiguration configuration,
    IHttpClientFactory clients,
    ILogger<Program> logger)
{
    if (string.IsNullOrWhiteSpace(input.Reference) ||
        string.IsNullOrWhiteSpace(input.Phone))
    {
        return Results.BadRequest(new
        {
            message = "Reference and phone are required."
        });
    }

    if (!TryGetSupabaseSettings(configuration, out var baseUrl, out var key))
        return Results.Problem("Supabase URL or Publishable key is missing.");

    var payload = new
    {
        p_ref = input.Reference.Trim(),
        p_phone = input.Phone.Trim()
    };

    try
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Post, $"{baseUrl}/rest/v1/rpc/track_enquiry")
        {
            Content = JsonContent.Create(payload)
        };

        request.Headers.TryAddWithoutValidation("apikey", key);

        using var response = await clients.CreateClient("Supabase")
            .SendAsync(request);

        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning(
                "Supabase tracking request failed. HTTP {Status}: {Error}",
                (int)response.StatusCode, json);

            return Results.Problem(
                "Could not track the enquiry. Check the API logs.",
                statusCode: StatusCodes.Status502BadGateway);
        }

        return Results.Content(
            json, "application/json", statusCode: StatusCodes.Status200OK);
    }
    catch (Exception ex) when (
        ex is HttpRequestException or TaskCanceledException)
    {
        logger.LogError(ex, "Enquiry tracking request failed.");

        return Results.Problem(
            "Could not contact Supabase. Please try again.",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
}

static string? Clean(string? value) =>


    string.IsNullOrWhiteSpace(value) ? null : value.Trim();
static bool TryGetStaffAuthorization(
    HttpRequest incoming,
    out string authorization)
{
    authorization = incoming.Headers.Authorization.ToString();

    if (!authorization.StartsWith(
            "Bearer ",
            StringComparison.OrdinalIgnoreCase) ||
        string.IsNullOrWhiteSpace(authorization["Bearer ".Length..]))
    {
        authorization = "";
        return false;
    }

    return true;
}
static async Task<IResult> UpdateLogbookEntryAsync(
    Guid id,
    LogbookEntryRequest input,
    HttpRequest incoming,
    IConfiguration configuration,
    IHttpClientFactory clients,
    ILogger<Program> logger)
{
    if (!TryGetStaffAuthorization(incoming, out var authorization))
        return Results.Unauthorized();

    if (string.IsNullOrWhiteSpace(input.CustomerName) ||
        string.IsNullOrWhiteSpace(input.MaterialDetails))
    {
        return Results.BadRequest(new
        {
            message = "Customer name and material details are required."
        });
    }

    if (!DateOnly.TryParseExact(
            input.RecDate ?? "",
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var receivedDate))
    {
        return Results.BadRequest(new
        {
            message = "Received date must use YYYY-MM-DD format."
        });
    }

    if (!TryGetSupabaseSettings(
            configuration, out var baseUrl, out var key))
    {
        return Results.Problem(
            "Supabase URL or Publishable key is missing.");
    }

    var payload = new Dictionary<string, object?>
    {
        ["rec_date"] = receivedDate.ToString("yyyy-MM-dd"),
        ["customer_name"] = input.CustomerName.Trim(),
        ["material_details"] = input.MaterialDetails.Trim(),
        ["model_number"] = Clean(input.ModelNumber),
        ["serial_number"] = Clean(input.SerialNumber),
        ["part_number"] = Clean(input.PartNumber),
        ["quotation_number"] = Clean(input.QuotationNumber),
        ["failure_analysis"] = Clean(input.FailureAnalysis),
        ["invoice_number"] = Clean(input.InvoiceNumber),
        ["payment"] = Clean(input.Payment),
        ["payment_rec_amount"] = input.PaymentRecAmount,
        ["payment_rec_date"] = null,
        ["courier_company"] = Clean(input.CourierCompany),
        ["courier_tracking_number"] = Clean(input.CourierTrackingNumber),
        ["courier_dispatch_date"] = null,
        ["courier_status"] = Clean(input.CourierStatus)
    };

    if (!string.IsNullOrWhiteSpace(input.CourierDispatchDate))
    {
        if (!DateOnly.TryParseExact(
                input.CourierDispatchDate,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var dispatchDate))
        {
            return Results.BadRequest(new
            {
                message = "Courier dispatch date must use YYYY-MM-DD format."
            });
        }

        payload["courier_dispatch_date"] = dispatchDate.ToString("yyyy-MM-dd");
    }

    if (!string.IsNullOrWhiteSpace(input.PaymentRecDate))
    {
        if (!DateOnly.TryParseExact(
                input.PaymentRecDate,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var paymentDate))
        {
            return Results.BadRequest(new
            {
                message = "Payment received date must use YYYY-MM-DD format."
            });
        }

        payload["payment_rec_date"] =
            paymentDate.ToString("yyyy-MM-dd");
    }

    try
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Patch,
            $"{baseUrl}/rest/v1/logbook_entries?id=eq.{id:D}")
        {
            Content = JsonContent.Create(payload)
        };

        request.Headers.TryAddWithoutValidation("apikey", key);
        request.Headers.TryAddWithoutValidation(
            "Authorization", authorization);
        request.Headers.TryAddWithoutValidation(
            "Prefer", "return=representation");

        using var response = await clients
            .CreateClient("Supabase")
            .SendAsync(request);

        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning(
                "Log Book update failed. HTTP {Status}",
                (int)response.StatusCode);

            return Results.Content(
                json,
                "application/json",
                statusCode: (int)response.StatusCode);
        }

        using var document =
            System.Text.Json.JsonDocument.Parse(json);

        if (document.RootElement.ValueKind !=
                System.Text.Json.JsonValueKind.Array ||
            document.RootElement.GetArrayLength() == 0)
        {
            return Results.NotFound(new
            {
                message = "Record not found or update not permitted."
            });
        }

        return Results.Content(
            json,
            "application/json",
            statusCode: StatusCodes.Status200OK);
    }
    catch (Exception ex) when (
        ex is HttpRequestException or TaskCanceledException)
    {
        logger.LogError(ex, "Log Book update request failed.");

        return Results.Problem(
            "Could not contact Supabase.",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
    catch (System.Text.Json.JsonException ex)
    {
        logger.LogError(ex, "Could not verify the Log Book update.");

        return Results.Problem(
            "Could not verify the update.",
            statusCode: StatusCodes.Status502BadGateway);
    }
}

static async Task<IResult> GetLogbookAsync(
    HttpRequest incoming,
    IConfiguration configuration,
    IHttpClientFactory clients,
    ILogger<Program> logger)
{
    if (!TryGetStaffAuthorization(incoming, out var authorization))
    {
        return Results.Unauthorized();
    }

    if (!TryGetSupabaseSettings(
            configuration, out var baseUrl, out var key))
    {
        return Results.Problem(
            "Supabase URL or Publishable key is missing.");
    }

    const string columns =
        "id,created_at,updated_at,rec_date,month,customer_name," +
        "material_details,model_number,serial_number,part_number," +
        "quotation_number,failure_analysis,invoice_number," +
        "payment,payment_rec_amount,payment_rec_date," +
        "courier_company,courier_tracking_number," +
        "courier_dispatch_date,courier_status";

    var url =
        $"{baseUrl}/rest/v1/logbook_entries" +
        $"?select={columns}&order=rec_date.desc,created_at.desc";

    try
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Get, url);

        request.Headers.TryAddWithoutValidation("apikey", key);
        request.Headers.TryAddWithoutValidation(
            "Authorization", authorization);

        using var response = await clients.CreateClient("Supabase")
            .SendAsync(request);

        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning(
                "Log Book read failed. HTTP {Status}",
                (int)response.StatusCode);
        }

        return Results.Content(
            json,
            "application/json",
            statusCode: (int)response.StatusCode);
    }
    catch (Exception ex) when (
        ex is HttpRequestException or TaskCanceledException)
    {
        logger.LogError(ex, "Log Book read request failed.");

        return Results.Problem(
            "Could not retrieve Log Book entries.",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
}


static async Task<IResult> CreateLogbookEntryAsync(
    LogbookEntryRequest input,
    HttpRequest incoming,
    IConfiguration configuration,
    IHttpClientFactory clients,
    ILogger<Program> logger)
{
    if (!TryGetStaffAuthorization(incoming, out var authorization))
    {
        return Results.Unauthorized();
    }

    if (string.IsNullOrWhiteSpace(input.CustomerName) ||
        string.IsNullOrWhiteSpace(input.MaterialDetails))
    {
        return Results.BadRequest(new
        {
            message = "Customer name and material details are required."
        });
    }

    if (!TryGetSupabaseSettings(
            configuration, out var baseUrl, out var key))
    {
        return Results.Problem(
            "Supabase URL or Publishable key is missing.");
    }

    var payload = new Dictionary<string, object?>
    {
        ["customer_name"] = input.CustomerName.Trim(),
        ["material_details"] = input.MaterialDetails.Trim(),
        ["model_number"] = Clean(input.ModelNumber),
        ["serial_number"] = Clean(input.SerialNumber),
        ["part_number"] = Clean(input.PartNumber),
        ["quotation_number"] = Clean(input.QuotationNumber),
        ["failure_analysis"] = Clean(input.FailureAnalysis),
        ["invoice_number"] = Clean(input.InvoiceNumber),
        ["payment"] = Clean(input.Payment),
        ["payment_rec_amount"] = input.PaymentRecAmount,
        ["courier_company"] = Clean(input.CourierCompany),
        ["courier_tracking_number"] = Clean(input.CourierTrackingNumber),
        ["courier_dispatch_date"] = null,
        ["courier_status"] = Clean(input.CourierStatus)
    };

    if (!string.IsNullOrWhiteSpace(input.RecDate))
    {
        if (!DateOnly.TryParseExact(
                input.RecDate,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var receivedDate))
        {
            return Results.BadRequest(new
            {
                message = "Received date must use YYYY-MM-DD format."
            });
        }

        payload["rec_date"] = receivedDate.ToString("yyyy-MM-dd");
    }

    if (!string.IsNullOrWhiteSpace(input.PaymentRecDate))
    {
        if (!DateOnly.TryParseExact(
                input.PaymentRecDate,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var paymentDate))
        {
            return Results.BadRequest(new
            {
                message = "Payment received date must use YYYY-MM-DD format."
            });
        }

        payload["payment_rec_date"] = paymentDate.ToString("yyyy-MM-dd");
    }

    if (!string.IsNullOrWhiteSpace(input.CourierDispatchDate))
    {
        if (!DateOnly.TryParseExact(
                input.CourierDispatchDate,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var dispatchDate))
        {
            return Results.BadRequest(new
            {
                message = "Courier dispatch date must use YYYY-MM-DD format."
            });
        }

        payload["courier_dispatch_date"] = dispatchDate.ToString("yyyy-MM-dd");
    }

    try
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"{baseUrl}/rest/v1/logbook_entries")
        {
            Content = JsonContent.Create(payload)
        };

        request.Headers.TryAddWithoutValidation("apikey", key);
        request.Headers.TryAddWithoutValidation(
            "Authorization", authorization);
        request.Headers.TryAddWithoutValidation(
            "Prefer", "return=representation");

        using var response = await clients.CreateClient("Supabase")
            .SendAsync(request);

        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning(
                "Log Book insert failed. HTTP {Status}",
                (int)response.StatusCode);
        }

        return Results.Content(
            json,
            "application/json",
            statusCode: (int)response.StatusCode);
    }
    catch (Exception ex) when (
        ex is HttpRequestException or TaskCanceledException)
    {
        logger.LogError(ex, "Log Book insert request failed.");

        return Results.Problem(
            "Could not save the Log Book entry.",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
}
static async Task<IResult> DeleteLogbookEntryAsync(
    Guid id,
    HttpRequest incoming,
    IConfiguration configuration,
    IHttpClientFactory clients,
    ILogger<Program> logger)
{
    if (!TryGetStaffAuthorization(
            incoming, out var authorization))
    {
        return Results.Unauthorized();
    }

    if (!TryGetSupabaseSettings(
            configuration, out var baseUrl, out var key))
    {
        return Results.Problem(
            "Supabase URL or Publishable key is missing.");
    }

    try
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Delete,
            $"{baseUrl.TrimEnd('/')}/rest/v1/logbook_entries?id=eq.{id:D}");

        request.Headers.TryAddWithoutValidation("apikey", key);
        request.Headers.TryAddWithoutValidation(
            "Authorization", authorization);
        request.Headers.TryAddWithoutValidation(
            "Prefer", "return=representation");

        using var response = await clients
            .CreateClient("Supabase")
            .SendAsync(request);

        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning(
                "Log Book deletion failed. HTTP {Status}",
                (int)response.StatusCode);

            return Results.Content(
                json,
                "application/json",
                statusCode: (int)response.StatusCode);
        }

        using var document =
            System.Text.Json.JsonDocument.Parse(json);

        if (document.RootElement.ValueKind !=
                System.Text.Json.JsonValueKind.Array ||
            document.RootElement.GetArrayLength() == 0)
        {
            return Results.NotFound(new
            {
                message =
                    "Record not found or deletion not permitted."
            });
        }

        return Results.Content(
            json,
            "application/json",
            statusCode: StatusCodes.Status200OK);
    }
    catch (Exception ex) when (
        ex is HttpRequestException or TaskCanceledException)
    {
        logger.LogError(
            ex, "Log Book deletion request failed.");

        return Results.Problem(
            "Could not contact Supabase.",
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
    catch (System.Text.Json.JsonException ex)
    {
        logger.LogError(
            ex, "Could not verify the Log Book deletion.");

        return Results.Problem(
            "Could not verify the deletion.",
            statusCode: StatusCodes.Status502BadGateway);
    }
}
public sealed class EnquiryRequest
{
    public string? Name { get; set; }
    public string? Company { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Type { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Details { get; set; }
}

public sealed class TrackEnquiryRequest
{
    public string? Reference { get; set; }
    public string? Phone { get; set; }
}
public sealed class LogbookEntryRequest
{
    public string? RecDate { get; set; }
    public string? CustomerName { get; set; }
    public string? MaterialDetails { get; set; }
    public string? ModelNumber { get; set; }
    public string? SerialNumber { get; set; }
    public string? PartNumber { get; set; }
    public string? QuotationNumber { get; set; }
    public string? FailureAnalysis { get; set; }
    public string? InvoiceNumber { get; set; }
    public string? Payment { get; set; }
    public decimal? PaymentRecAmount { get; set; }
    public string? PaymentRecDate { get; set; }
    public string? CourierCompany { get; set; }
    public string? CourierTrackingNumber { get; set; }
    public string? CourierDispatchDate { get; set; }
    public string? CourierStatus { get; set; }
}
