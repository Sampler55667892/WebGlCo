using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebGlCo.Startup))]
namespace WebGlCo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
