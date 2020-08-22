from sklearn.decomposition import PCA
from openTSNE import TSNE
import pandas as pd
import numpy as np


def tsne(features, dims=2, write_to=None, tsne_kwargs=None):
    if tsne_kwargs is None:
        tsne_kwargs = {}
    id_col_name = features.columns[0]
    tsne_kwargs['n_components'] = dims
    tsne_kwargs['random_state'] = np.random.RandomState(0)

    print('t-SNE: Reducing features to {} dimensions'.format(dims))

    # Don't consider the first unique ID column
    features_salient = features.copy().drop(columns=[id_col_name], axis=1)

    reduced = pd.DataFrame(TSNE(**tsne_kwargs).fit(features_salient))
    reduced.insert(0, id_col_name, features[[id_col_name]])

    if write_to is not None:
        try:
            reduced.to_csv(write_to, index=False)
            print('Wrote reduced features to "{}"'.format(write_to))
        except Exception as e:
            print('\nWARNING - Could not write results to file: "{}"'.format(e))

    return reduced


def pca(features, dims=2, write_to=None, pca_kwargs=None):
    if pca_kwargs is None:
        pca_kwargs = {}
    id_col_name = features.columns[0]
    pca_kwargs['n_components'] = dims

    print('PCA: Reducing features to {} dimensions'.format(dims))

    # Don't consider the first unique ID column
    features_salient = features.copy().drop(columns=[id_col_name], axis=1)

    reduced = pd.DataFrame(PCA(**pca_kwargs).fit_transform(features_salient))
    reduced.insert(0, id_col_name, features[[id_col_name]])

    if write_to is not None:
        try:
            reduced.to_csv(write_to, index=False)
            print('Wrote reduced features to "{}"'.format(write_to))
        except Exception as e:
            print('\nWARNING - Could not write results to file: "{}"'.format(e))

    return reduced
