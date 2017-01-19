using System.Web.Mvc;
using WebGlCo.Model;

namespace WebGlCo.Controllers.Graph3D
{
    public class Graph3DController : Controller
    {
        // GET: Graph3D
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetWorkingHours(int year, int month) =>
            this.Json(WorkingHours.Find(year, month), JsonRequestBehavior.AllowGet);
    }
}