import os
import numpy as np
import csv
from reducers import tsne, pca
from features import extract_features
from sklearn.cluster import MeanShift, estimate_bandwidth
from time import time
import cgi


def normalize(feat_matrix, dataframe):
    for i in range(np.shape(feat_matrix)[1]):
        curr_dim = feat_matrix[:, i]
        curr_dim = (curr_dim - np.mean(curr_dim)) / np.std(curr_dim)
        dataframe[i] = curr_dim
    return dataframe


def get_labels(features, config):
    t0 = time()
    x = features.to_numpy()
    x = x[:, 1:].astype(np.float)

    features = normalize(x, features)
    reduced = pca(features, dims=16, write_to='reduced/pca_{}.csv'.format(config['name']))
    _ = tsne(reduced, dims=config['n_dims'], write_to='reduced/tsne_{}.csv'.format(config['name']))
    datapoints = []
    images = []

    with open('reduced/tsne_{}.csv'.format(config['name']), newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            datapoints.append((float(row['0']), float(row['1'])))
            images.append(os.path.join(config['image_path'], row['ID']))

    datapoints = np.array(datapoints)

    tx, ty = datapoints[:, 0], datapoints[:, 1]
    tx = (tx - np.min(tx)) / (np.max(tx) - np.min(tx))
    ty = (ty - np.min(ty)) / (np.max(ty) - np.min(ty))

    feature_matrix = np.vstack([tx, ty]).T
    bandwidth = estimate_bandwidth(feature_matrix, quantile=0.1)
    labels = MeanShift(bandwidth=bandwidth).fit_predict(feature_matrix)

    n_clusters = len(set(labels))

    t1 = time()
    #    print('Clustering done,', t1 - t0, 'seconds, n of clusters:', n_clusters)
    return labels


# if not os.path.exists('features/features.pkl'):
#     print('No features found, starting computation')
#     t0 = time()
#     features = extract_features(config['image_path'], model=config['model'])
#     features.to_pickle('features/features.pkl')
#     t1 = time()
#     print('Features extracted in', t1 - t0, 's')
#
# elif os.path.exists('features/features.pkl'):
#     print('Features found, loading...')
#     features = pd.read_pickle('features/features.pkl')
#
#     file_list = features['ID'].tolist()
#     contents = os.listdir(config['image_path'])

def main():
    #   parser = argparse.ArgumentParser(description='BLACKBOX CLUSTERING')
    #   parser.add_argument('--image_path', type=str, default='images/',
    #                        help='directory of images')
    #    args, _ = parser.parse_known_args()
    data = cgi.FieldStorage()
    if "path" in data:
        url = data["path"].value
        config = {'image_path': url,
                  'n_dims': 2,
                  'name': 'blackbox_cluster',
                  'model': 'VGG16'}

        features = extract_features(config['image_path'], model=config['model'])
        # features = pd.read_pickle('features/features.pkl')
        images = features['ID'].tolist()
        labels = get_labels(features, config)

        clusters = [[] for _ in range(len(set(labels)))]

        for i, (img, label) in enumerate(zip(images, labels)):
            img.replace("'", '"')
            clusters[label].append(img)

        result = {
            "success": True,
            "error": [],
            "clusters": clusters
        }
        print(result)
    else:
        result = {
            "success": False,
            "error": "No path",
            "clusters": []
        }
        print(result)


if __name__ == '__main__':
    main()
