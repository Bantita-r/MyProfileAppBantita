"""Read product JSON from stdin and return K-Means clusters as JSON."""

import json
import sys

import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


def number(value, field_name):
    try:
        result = float(value)
    except (TypeError, ValueError) as error:
        raise ValueError(f"Product {field_name} must be numeric.") from error
    if not np.isfinite(result):
        raise ValueError(f"Product {field_name} must be finite.")
    return result


def cluster_label(avg_price, avg_stock, all_price, all_stock):
    price_level = "High value" if avg_price >= all_price else "Lower value"
    stock_level = "high stock" if avg_stock >= all_stock else "low stock"
    return f"{price_level} / {stock_level}"


def main():
    products = json.load(sys.stdin)
    if not isinstance(products, list):
        raise ValueError("Expected a JSON array of products.")
    if len(products) < 2:
        raise ValueError("Add at least 2 products before running K-Means.")

    matrix = np.array(
        [[number(product.get("price"), "price"), number(product.get("stock"), "stock")]
         for product in products],
        dtype=float,
    )
    cluster_count = min(3, len(products))
    normalized = StandardScaler().fit_transform(matrix)
    model = KMeans(n_clusters=cluster_count, random_state=42, n_init=10)
    labels = model.fit_predict(normalized)
    all_price = float(matrix[:, 0].mean())
    all_stock = float(matrix[:, 1].mean())
    groups = []

    for cluster_id in range(cluster_count):
        indexes = np.where(labels == cluster_id)[0]
        members = []
        for index in indexes:
            product = dict(products[int(index)])
            product["price"] = float(matrix[index, 0])
            product["stock"] = int(matrix[index, 1])
            product["cluster"] = int(cluster_id + 1)
            members.append(product)
        avg_price = float(matrix[indexes, 0].mean())
        avg_stock = float(matrix[indexes, 1].mean())
        groups.append({
            "id": int(cluster_id + 1),
            "label": cluster_label(avg_price, avg_stock, all_price, all_stock),
            "averagePrice": round(avg_price, 2),
            "averageStock": round(avg_stock, 2),
            "products": members,
        })

    groups.sort(key=lambda group: (-group["averagePrice"], group["averageStock"]))
    for display_id, group in enumerate(groups, start=1):
        group["id"] = display_id
        for product in group["products"]:
            product["cluster"] = display_id

    print(json.dumps({
        "algorithm": "K-Means",
        "features": ["price", "stock"],
        "normalization": "StandardScaler",
        "clusterCount": cluster_count,
        "clusters": groups,
    }))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
