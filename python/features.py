import os
from keras import applications
from keras.models import Model
import numpy as np
import cv2 as cv
from pandas import DataFrame as DF
from model_test import create_model
import tensorflow as tf


os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
IMG_EXTS = ['jpg', 'jpeg', 'bmp', 'png']


def named_model(name):
    # include_top=False removes the fully connected layer at the end/top of the network
    # This allows us to get the feature vector as opposed to a classification
    pooling = 'avg'
    if name == 'ResNet50':
        return applications.resnet50.ResNet50(weights='imagenet', include_top=False, pooling=pooling)

    elif name == 'Xception':
        return applications.xception.Xception(weights='imagenet', include_top=False, pooling=pooling)

    elif name == 'VGG16':
        return applications.vgg16.VGG16(weights='imagenet', include_top=False, pooling=pooling)

    elif name == 'VGG19':
        return applications.vgg19.VGG19(weights='imagenet', include_top=False, pooling=pooling)

    elif name == 'InceptionV3':
        return applications.inception_v3.InceptionV3(weights='imagenet', include_top=False, pooling=pooling)

    elif name == 'MobileNet':
        return applications.mobilenet.MobileNet(weights='imagenet', include_top=False, pooling=pooling)

    elif name == 'Autoencoder':
        model_weights_path = 'models/model.06-0.0805.hdf5'
        model = create_model((256, 256, 3))
        model.load_weights(model_weights_path)
        inter_output_model = Model(model.input, model.get_layer(index=31).output)
        return inter_output_model
    else:
        raise ValueError('Unrecognised model: "{}"'.format(name))


def _extract(fp, model, rgb=True):
    # Load the image, setting the size to 224 x 224
    # img = image.load_img(fp, target_size=(224, 224))
    # img_data = image.img_to_array(img)
    # Convert the image to a numpy array, resize it (1, 2, 244, 244), and preprocess it

    bgr_img = cv.imread(fp)
    bgr_img = cv.resize(bgr_img, (256, 256), interpolation=cv.INTER_AREA)
    if rgb:
        rgb_img = cv.cvtColor(bgr_img, cv.COLOR_BGR2RGB)
    else:
        rgb_img = cv.cvtColor(bgr_img, cv.COLOR_BGR2GRAY)
    rgb_img = rgb_img / 255.
    rgb_img = np.expand_dims(rgb_img, axis=0)

    np_features = model.predict(rgb_img).flatten()  # [0]
    return np.char.mod('%f', np_features)


def extract_features(filepath, model='VGG16', write_to=None):
    """ Reads an input image file, or directory containing images, and returns
    resulting extracted features. Use write_to=<some_filepath> to save the
    features somewhere. """

    # print('Extracting features')

    # Get the model
    # print('Acquiring model "{}"'.format(model), end='')
    m = named_model(model)
    # print('\rAcquired model\t\t\t\t\t')

    # Get the image filepaths
    filepath = filepath.replace('\\', '/')
    img_fps = []

    assert os.path.exists(filepath), \
        'Filepath does not exist: "{}"'.format(filepath)

    if os.path.isfile(filepath):
        ext = filepath.lower().rsplit('.', 1)[-1]
        assert ext in IMG_EXTS, \
            'Specified file "{}" is not in recognised image formats'.format(filepath)
        img_fps = img_fps.append(filepath)

    elif os.path.isdir(filepath):
        for fn in os.listdir(filepath):
            ext = fn.rsplit('.', 1)[-1]
            if ext in IMG_EXTS:
                img_fps.append(os.path.join(filepath, fn))

    else:
        raise ValueError('Filepath should be an image, or a directory containing images')

    # And the image filenames
    img_fns = [fp.replace('\\', '/').rsplit('/', 1)[-1] for fp in img_fps]

    # print('Found {} images'.format(len(img_fns)))

    # Run the extraction over each image
    features = []
    for (i, fp) in enumerate(img_fps):
        # print('\rProcessing: {:.2f}%\t\t'.format((i + 1) / len(img_fps) * 100), end='', flush=True)
        features.append(_extract(fp, m))

    # print('\nSuccess')

    # Make into a DataFrame and add an ID column
    features_df = DF(features, dtype=object)
    id_col = DF(img_fns, dtype=str)
    features_df.insert(0, 'ID', id_col)
    features_df.to_csv(write_to, index=False)

    return features_df
