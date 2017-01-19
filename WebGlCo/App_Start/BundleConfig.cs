using System.Web.Optimization;

namespace WebGlCo
{
    public class BundleConfig
    {
        public static void RegisterBundles( BundleCollection bundles )
        {
            RegisterBundlesDefault( bundles );

            bundles.Add(new ScriptBundle("~/bundles/common").Include(
                "~/Scripts.append/custom/common/common.js" ));

            bundles.Add(new ScriptBundle("~/bundles/three").Include(
                "~/Scripts.append/three/three.min.js",
                "~/Scripts.append/three/Projector.js",
                "~/Scripts.append/three/TrackballControls.js",
                "~/Scripts.append/custom/common/customMvWrapper.js" ));

            bundles.Add(new ScriptBundle("~/bundles/graph3d").Include(
                "~/Scripts.append/custom/graph3d/graph3d.js" ));

            bundles.Add(new ScriptBundle("~/bundles/erDiagram").Include(
                "~/Scripts.append/custom/erDiagram/erDiagram.js"));
        }

        static void RegisterBundlesDefault( BundleCollection bundles )
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // 開発と学習には、Modernizr の開発バージョンを使用します。次に、実稼働の準備が
            // できたら、http://modernizr.com にあるビルド ツールを使用して、必要なテストのみを選択します。
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}
