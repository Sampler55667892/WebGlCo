using System;
using System.Web.Mvc;

namespace WebGlCo.Controllers.ERDiagram
{
    public class ERDiagramController : Controller
    {
        // GET: ERDiagram
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetEntities(string layerId)
        {
            if (layerId == "A") {
                var entities = new[] {
                    new { title = "会社", columnNames = new[] { "会社コード", "会社名" }, countPKs = 1 },
                    new { title = "社員", columnNames = new[] { "会社コード(FK)", "社員ID", "社員名", "年齢", "部署コード(FK)" }, countPKs = 2 },
                    new { title = "部署", columnNames = new[] { "部署コード", "部署名" }, countPKs = 1 }
                };
                return this.Json(entities, JsonRequestBehavior.AllowGet);
            } else if (layerId == "B") {
                var entities = new[] {
                    new { title = "支社", columnNames = new[] { "支社コード", "支社名" }, countPKs = 1 },
                    new { title = "支店", columnNames = new[] { "支社コード(FK)", "支店コード", "支店名" }, countPKs = 2 },
                    new { title = "支店商品", columnNames = new[] { "支社コード(FK)", "支店コード(FK)", "商品コード(FK)" }, countPKs = 3 },
                    new { title = "商品", columnNames = new[] { "商品コード", "商品名", "商品分類コード(FK)" }, countPKs = 1 },
                    new { title = "商品分類", columnNames = new[] { "商品分類コード", "分類名" }, countPKs = 1 }
                };
                return this.Json(entities, JsonRequestBehavior.AllowGet);
            } else {
                throw new NotImplementedException();
            }
        }
    }
}