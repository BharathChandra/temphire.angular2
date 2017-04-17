using Newtonsoft.Json;

namespace TempHire.Controllers
{
    public class Credential
    {
        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }
    }
}