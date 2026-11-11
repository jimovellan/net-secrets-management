using Microsoft.Extensions.Configuration;

var configuration = new ConfigurationBuilder()
	.AddUserSecrets<Program>()
	.Build();

foreach (var key in new[] { "prueba1", "prueba2" })
{
	var value = configuration[key];
	Console.WriteLine($"{key}: {value ?? "(no configurado)"}");
}
