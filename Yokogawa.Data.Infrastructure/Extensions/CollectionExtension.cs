using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Yokogawa.Data.Infrastructure.Extensions
{
    public static class CollectionExtensions
    {
        public static IEnumerable<T> DistinctBy<T, TKey>(this IEnumerable<T> items, Func<T, TKey> property)
        {
            return items.GroupBy(property).Select(x => x.First());
        }
        public static void RemoveAll<T>(this ICollection<T> col, Func<T, bool> predicate)
        {
            List<T> list = col as List<T>;

            if (list != null)
            {
                list.RemoveAll(new Predicate<T>(predicate));
            }
            else
            {
                List<T> itemsToDelete = col.Where(predicate)
                    .ToList();

                foreach (var item in itemsToDelete)
                {
                    col.Remove(item);
                }
            }
        }
    }
}
