using System;

namespace WebGlCo.Model
{
    public class WorkingHours
    {
        public static double[] Find(int year, int month)
        {
            var key = $"{year}{month.ToString().PadLeft(2, '0')}";
            if (key == "201701") {
                return new double[] {
                    0.0, 0.0, 0.0, 0.0, 0.0, 9.0, 0.0,
                    0.0, 0.0, 9.0, 9.0, 8.5, 9.0, 0.0,
                    0.0, 8.5, 8.0, 8.5, 8.0
                };
            } else if (key == "201612") {
                return new double[] {
                                           9.5, 10.0, 0.0,
                    0.0, 9.5, 10.0,  8.0, 11.0,  9.5, 0.0,
                    0.0, 8.5,  8.5,  8.5,  8.0,  8.5, 0.0,
                    0.0, 8.5,  8.5, 10.5,  8.5,  0.0, 0.0,
                    0.0, 8.0,  8.0,  0.0,  0.0,  0.0, 0.0
                };
            } else if (key == "201611") {
                return new double[] {
                               8.5, 8.5, 0.0,  8.5, 0.0,
                    0.0,  8.5, 8.5, 8.0, 8.0, 10.0, 0.0,
                    0.0,  8.0, 8.0, 9.0, 8.5,  8.0, 0.0,
                    0.0, 10.0, 8.0, 0.0, 8.5,  8.5, 0.0,
                    0.0,  8.0, 8.5, 9.0
                };
            } else {
                throw new Exception("Data Not Found.");
            }
        }
    }
}