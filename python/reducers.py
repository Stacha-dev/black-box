from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import pandas as pd


def tsne(features, dims=2, write_to=None, tsne_kwargs=None):
    if tsne_kwargs is None:
        tsne_kwargs = {}
    id_col_name = features.columns[0]
    tsne_kwargs['n_components'] = dims
    tsne_kwargs['perplexity'] = 40
    tsne_kwargs['n_iter'] = 10000
    tsne_kwargs['early_exaggeration'] = 12
    tsne_kwargs['n_iter_without_progress'] = 5000
    tsne_kwargs['random_state'] = 0
    features_salient = features.copy().drop(columns=[id_col_name], axis=1)
    reduced = pd.DataFrame(TSNE(**tsne_kwargs).fit_transform(features_salient))
    reduced.insert(0, id_col_name, features[[id_col_name]])
    reduced.to_csv(write_to, index=False)
    return reduced


def pca(features, dims=2, write_to=None, pca_kwargs=None):
    if pca_kwargs is None:
        pca_kwargs = {}
    id_col_name = features.columns[0]
    pca_kwargs['n_components'] = dims
    features_salient = features.copy().drop(columns=[id_col_name], axis=1)

    reduced = pd.DataFrame(PCA(**pca_kwargs).fit_transform(features_salient))
    reduced.insert(0, id_col_name, features[[id_col_name]])
    reduced.to_csv(write_to, index=False)
    return reduced
