var builder = WebApplication.CreateBuilder(args);

// Add Razor Components with Interactive Server
builder.Services
    .AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

// Configure HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAntiforgery();

// Enable Blazor Interactive Server
app.MapRazorComponents<UAASWebsite.Components.App>()
    .AddInteractiveServerRenderMode();

app.Run();