FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY UAAS.Api.csproj ./
RUN dotnet restore UAAS.Api.csproj

COPY . .
RUN dotnet publish UAAS.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "UAAS.Api.dll"]