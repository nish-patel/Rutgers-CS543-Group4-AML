# reads JSON distribution files
# constructs a 3d mesh
import json
import math
import numpy as np
# from matplotlib import cm
import matplotlib.cm as cm

def triangulate(lower, upper):
    faces = []
    if (len(lower) == len(upper)):
        l = len(lower)
        for i in range(len(lower)):
            face = []
            face.append(lower[i % l])
            face.append(upper[i % l])
            face.append(upper[(i + 1) % l])
            faces.append(face)
            face = []
            face.append(lower[(i + 1) % l])
            face.append(lower[i % l])
            face.append(upper[(i + 1) % l])
            faces.append(face)
        # print(len(faces))
        return faces
    else:
        lower_l = len(lower)
        upper_l = len(upper)
        if (lower_l < upper_l):
            ratio = upper_l / lower_l
            lower_c = 0
            upper_c = 0
            while (lower_c < lower_l or upper_c < upper_l):
                if (upper_c > ratio * lower_c):
                    face = []
                    face.append(lower[lower_c])
                    face.append(upper[upper_c % upper_l])
                    face.append(lower[(lower_c + 1) % lower_l])
                    lower_c = lower_c + 1
                    faces.append(face)
                else:
                    face = []
                    face.append(upper[upper_c])
                    face.append(upper[(upper_c + 1) % upper_l])
                    face.append(lower[lower_c % lower_l])
                    upper_c = upper_c + 1
                    faces.append(face)
        elif (lower_l > upper_l):
            ratio = lower_l / upper_l
            lower_c = 0
            upper_c = 0
            while (lower_c < lower_l or upper_c < upper_l):
                if (upper_c * ratio > lower_c):
                    face = []
                    face.append(lower[lower_c % lower_l])
                    face.append(upper[upper_c % upper_l])
                    face.append(lower[(lower_c + 1) % lower_l])
                    lower_c = lower_c + 1
                    faces.append(face)
                else:
                    face = []
                    face.append(upper[upper_c % upper_l])
                    face.append(upper[(upper_c + 1) % upper_l])
                    face.append(lower[lower_c % lower_l])
                    upper_c = upper_c + 1
                    faces.append(face)
        return faces
    return []


def draw_mesh_1():
    """star shaped polygon"""
    # f = open('movies-layers-dists.json')
    # f2 = open('movies.off','w')
    # f2.write('OFF\n933 1850 0\n')

    # f = open('cit-Patents-layers-dists.json')
    # f2 = open('cit-Patents.off','w')
    # f2.write('OFF\n1006 1996 0\n')

    # f = open('com-friendster-layers-dists.json')
    # f2 = open('com-friendster.off','w')
    # f2.write('OFF\n1340 2670 0\n')

    f = open('movies-excerpt.json')
    f2 = open('movies-excerpt.off', 'w')
    f2.write('OFF\n55 55 0\n')

    data = json.load(f)
    Y = 0  # base height
    X = Z = 0
    default_edges = 8
    v_count = f_count = 0
    start_pos = []
    for i in data:
        # print(i)
        # print(data[i])
        # print(len(data[i]),'\n')
        start_pos.append(v_count)
        if (len(data[i]) == 1):
            R = 10  # default radius
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
        else:
            toInt = []
            for j in data[i]:
                toInt.append(int(j))
            maximum = max(toInt)
            for j in toInt:
                theta = (j / maximum) * 2 * math.pi
                toStr = str(j)
                value = data[i][toStr]
                R = math.log2(value)
                # R = max(10,value)
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                if (R > 10000):
                    print('R>10000', i, j, R, v_0, v_1, v_2)

                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
        Y = Y + 10
    start_pos.append(v_count)
    # print(start_pos)
    for i in range(len(start_pos) - 2):
        lower = [*range(start_pos[i], start_pos[i + 1])]
        upper = [*range(start_pos[i + 1], start_pos[i + 2])]
        # print('i',i,'lower')
        # print(lower)
        # print('upper')
        # print(upper)
        faces = triangulate(lower, upper)
        if (len(faces) > 0):
            for f in faces:
                f2.write('3 ' + str(f[0]) + ' ' + str(f[1]) + ' ' + str(f[2]) + '\n')
                f_count = f_count + 1
    f2.close()
    print(v_count)
    print(f_count)


def draw_mesh_2():
    """disk stacks to be cylinder"""
    # f = open('movies-layers-dists.json')
    # f2 = open('movies-cylinder.off','w')
    # f2.write('OFF\n20672 41312 0\n')

    # f = open('cit-Patents-layers-dists.json')
    # f2 = open('cit-Patents-cylinder.off','w')
    # f2.write('OFF\n30400 60768 0\n')

    f = open('com-friendster-layers-dists.json')
    f2 = open('com-friendster-cylinder.off', 'w')
    f2.write('OFF\n35712 71392 0\n')

    data = json.load(f)
    Y = 0  # base height
    X = Z = 0
    default_edges = 16
    v_count = f_count = 0
    start_pos = []
    for i in data:
        # print(i)
        # print(data[i])
        # print(len(data[i]),'\n')
        for k in (data[i]):
            log_k = math.log2(int(data[i][k]))  # height = frequency
            start_pos.append(v_count)
            R = 10 * (math.log2(int(k)) + 1)  # radius = second key
            # print("k =",k)
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
            Y = Y + log_k
            start_pos.append(v_count)
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
            Y = Y + 1

    start_pos.append(v_count)  # last v_count
    # print(start_pos)
    for i in range(len(start_pos) - 2):
        lower = [*range(start_pos[i], start_pos[i + 1])]
        upper = [*range(start_pos[i + 1], start_pos[i + 2])]
        # print('i',i,'lower')
        # print(lower)
        # print('upper')
        # print(upper)
        faces = triangulate(lower, upper)
        if (len(faces) > 0):
            for f in faces:
                f2.write('3 ' + str(f[0]) + ' ' + str(f[1]) + ' ' + str(f[2]) + '\n')
                f_count = f_count + 1
    f2.close()
    print(v_count)
    print(f_count)


def draw_mesh_3():
    """disk stacks to be cylinder, and scaled"""
    # f = open('movies-layers-dists.json')
    # f2 = open('movies-cylinder.off', 'w')
    # f2.write('OFF\n20672 41312 0\n')

    # f = open('cit-Patents-layers-dists.json')
    # f2 = open('cit-Patents-cylinder.off', 'w')
    # f2.write('OFF\n30400 60768 0\n')

    f = open('com-friendster-layers-dists.json')
    f2 = open('com-friendster-cylinder.off', 'w')
    f2.write('OFF\n35712 71392 0\n')

    # f = open('movies-excerpt.json')
    # f2 = open('movies-excerpt.off','w')
    # f2.write('OFF\n1760 3488 0\n')

    data = json.load(f)
    # return data
    Y = 0  # base height
    X = Z = 0
    default_edges = 16
    v_count = f_count = 0
    start_pos = []
    # print(data)
    peel_values = [int(i) for i in list(data.keys())]
    peel_value_range = max(peel_values) - min(peel_values)
    peel_value_count = len(peel_values)
    peel_layer_ratio = peel_value_range / peel_value_count
    print("peel_layer_ratio", peel_layer_ratio)
    max_radius = 0
    original_height_sum = 0
    # original_height_sum = len(data)
    for i in data:
        original_height_sum = original_height_sum + sum([math.log2(int(j) + 1) for j in data[i].keys()])
        layer_max_radius = max([math.log2(int(j)) for j in data[i].values()])
        if max_radius < layer_max_radius:
            max_radius = layer_max_radius
    print("max height", original_height_sum)
    print("max radius", max_radius)
    print("height total", peel_layer_ratio * max_radius)
    # original_height_radius_ratio = original_height_sum/max_radius
    # print("original_height_radius_ratio", original_height_radius_ratio)
    scale_factor = peel_layer_ratio * max_radius / original_height_sum
    print("scale_factor", scale_factor)
    for i in data:
        # print(i)
        # print(data[i].values())
        # print(len(data[i]),'\n')
        for k in (data[i]):
            # log_k = math.log2(int(data[i][k]))
            start_pos.append(v_count)
            Y_dis = math.log2(int(k) + 1) * scale_factor  # height = second key
            R = math.log2(int(data[i][k]) + 1)  # radius = frequency
            # print("k =",k)
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
            Y = Y + Y_dis
            start_pos.append(v_count)
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
            # between layers
            # Y = Y + 0.1

    start_pos.append(v_count)  # last v_count
    # print(start_pos)
    color_str = "255 0 0"
    for i in range(len(start_pos) - 2):
        lower = [*range(start_pos[i], start_pos[i + 1])]
        upper = [*range(start_pos[i + 1], start_pos[i + 2])]
        # print('i',i,'lower')
        # print(lower)
        # print('upper')
        # print(upper)
        faces = triangulate(lower, upper)
        if (len(faces) > 0):
            for f in faces:
                f2.write('3 ' + str(f[0]) + ' ' + str(f[1]) + ' ' + str(f[2]) + ' ' + color_str + '\n')
                f_count = f_count + 1
    f2.close()
    print(v_count)
    print(f_count)


def cylinderRadius(vh_h):
    return math.sqrt(math.log2(vh_h + 0.1) / math.pi)
    # return math.log2(math.sqrt(vh_h / math.pi))
    # return math.sqrt(vh_h / math.pi)


def draw_mesh_3_5():
    """disk stacks to be cylinder, and scaled"""
    # f = open('movies-layers-dists.json')
    # f2 = open('movies-cylinder.off', 'w')
    # f2.write('OFF\n20672 41312 0\n')
    # num_edges = 115050370

    f = open('cit-Patents-layers-dists.json')
    f2 = open('cit-Patents-cylinder.off', 'w')
    f2.write('OFF\n30400 60768 0\n')
    # num_edges = 16518947

    # f = open('com-friendster-layers-dists.json')
    # f2 = open('com-friendster-cylinder.off', 'w')
    # f2.write('OFF\n29280 58528 0\n') # without layer 1 
    # f2.write('OFF\n35712 71392 0\n')
    # num_edges = 1806067135

    # f = open('movies-excerpt.json')
    # f2 = open('movies-excerpt.off','w')
    # f2.write('OFF\n1760 3488 0\n')

    data = json.load(f)
    # return data
    Y = 0  # base height
    X = Z = 0
    default_edges = 16
    v_count = f_count = 0
    start_pos = []
    # print(data)
    peel_values = [int(i) for i in list(data.keys())]
    peel_value_max = max(peel_values)    
    peel_value_range = peel_value_max - min(peel_values)
    peel_value_count = len(peel_values)
    peel_layer_ratio = peel_value_range / peel_value_count
    print("peel_value_range",peel_value_range)
    print("peel_value_count",peel_value_count)
    print("peel_layer_ratio", peel_layer_ratio)
    max_radius = 0
    arg_max_radius = 0
    original_height_sum = 0
    # original_height_sum = len(data)

    # add color to different peel values
    peel_value_color = [1-1/(math.log2(1+i)) for i in peel_values]
    print("peel_value_color", peel_value_color)
    
    for i in data:
        # if i == '1':
        #     continue

        # original_height_sum = original_height_sum + sum([int(j) for j in data[i].keys()])
        original_height_sum = original_height_sum + sum([math.log2(int(j) + 1) for j in data[i].keys()])
        print("list ",[data[i].keys()],[math.log2(int(j) + 1) for j in data[i].keys()])
        # print("max height", original_height_sum)
        layer_max_radius = max([int(j) for j in data[i].values()])
        rad = cylinderRadius(layer_max_radius)
        # rad = cylinderRadius(math.log2(layer_max_radius + 1))
        if max_radius < rad:
            max_radius = rad
    print("max height", original_height_sum)
    print("max radius", max_radius)
    print("height total", peel_layer_ratio * max_radius)
    # original_height_radius_ratio = original_height_sum/max_radius
    # print("original_height_radius_ratio", original_height_radius_ratio)
    scale_factor = peel_layer_ratio * max_radius / original_height_sum
    print("scale_factor", scale_factor)
    
    # to use color to differentiate peel values, store index of first vertex for a new peel value
    first_index = []
    
    for i in data:
        # if i == '1':
        #     continue
        # print(i)
        # print(data[i].values())
        # print(len(data[i]),'\n')
        
        # index of first vertex of a new peel value
        first_index.append(v_count)
        for k in (data[i]):
            # log_k = math.log2(int(data[i][k]))
            start_pos.append(v_count)
            # Y_dis = int(k) * scale_factor  # height = second key
            Y_dis = math.log2(int(k) + 1) * scale_factor  # height = second key
            R = cylinderRadius(int(data[i][k]))  # radius = frequency
            # R = cylinderRadius(math.log2(int(data[i][k]) + 1))  # radius = frequency
            # print("k =",k)
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
            Y = Y + Y_dis
            start_pos.append(v_count)
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
            # between layers
            # Y = Y + 0.1
    
    start_pos.append(v_count)  # last v_count
    # print(start_pos)
    print("first_index",first_index)
    for i in range(len(start_pos) - 2):
        lower = [*range(start_pos[i], start_pos[i + 1])]
        upper = [*range(start_pos[i + 1], start_pos[i + 2])]
        # print('i',i,'lower')
        # print(lower)
        # print('upper')
        # print(upper)
        
        # obtain color of current peel value
        face_color_int = faceColor(peel_value_color,start_pos[i],first_index)
        face_color = [str(i) for i in face_color_int]
        faces = triangulate(lower, upper)
        if (len(faces) > 0):
            for f in faces:
                f2.write('3 ' + str(f[0]) + ' ' + str(f[1]) + ' ' + str(f[2]) + ' ' + face_color[0] + ' ' + face_color[1] + ' ' + face_color[2] + '\n')
                f_count = f_count + 1
    f2.close()
    print(v_count)
    print(f_count)

def draw_mesh_4():
    """disk stacks to be cylinder, and scaled"""
    # f = open('movies-layers-dists.json')
    # f2 = open('movies-cylinder.off', 'w')
    # f2.write('OFF\n20672 41312 0\n')

    # f = open('cit-Patents-layers-dists.json')
    # f2 = open('cit-Patents-cylinder.off', 'w')
    # f2.write('OFF\n30400 60768 0\n')

    f = open('com-friendster-layers-dists.json')
    f2 = open('com-friendster-cylinder.off', 'w')
    f2.write('OFF\n35712 71392 0\n')

    # f = open('movies-excerpt.json')
    # f2 = open('movies-excerpt.off','w')
    # f2.write('OFF\n1760 3488 0\n')

    data = json.load(f)
    Y = 0  # base height
    X = Z = 0
    default_edges = 16
    v_count = f_count = 0
    start_pos = []
    # print(data)
    peel_values = [int(i) for i in list(data.keys())]
    peel_value_range = max(peel_values) - min(peel_values)
    peel_value_count = len(peel_values)
    peel_layer_ratio = peel_value_range / peel_value_count
    print("peel_layer_ratio", peel_layer_ratio)
    max_radius = 0
    original_height_sum = 0
    # original_height_sum = len(data)
    data2 = {}
    for i in data:
        # original_height_sum = original_height_sum + sum([math.log2(int(j) + 1) for j in data[i].keys()])
        # layer_max_radius = max([math.log2(int(j)) for j in data[i].values()])
        # if max_radius < layer_max_radius:
        #     max_radius = layer_max_radius
        arr = [int(j) for j in data[i].keys()]
        mean = np.mean(arr)
        stdev = np.std(arr)
        amax = np.max(arr)
        amin = np.min(arr)
        # print(mean, stdev, amax, amin)
        bins = [amin - 1, amax + 1]
        j = 1
        low = mean - stdev
        high = mean + stdev
        while low + stdev > amin or high - stdev < amax:
            if low > amin:
                bins.append(max(low, 0))
            if high < amax:
                bins.append(high)
            low -= stdev
            high += stdev
        bins = sorted(bins)
        # print(bins)

        # total = sum(list(data[i].values()))
        vals, keys = np.histogram(arr, weights=list(data[i].values()), bins=bins)
        keys = [int(np.mean(x)) for x in zip(keys[:-1], keys[1:])]
        data2[int(i)] = {k: v for k, v in zip(keys, vals)}

    for i in data2:
        original_height_sum = original_height_sum + sum([math.log2(j + 1) for j in data2[i].keys()])
        layer_max_radius = max([math.log2(j + 1) for j in list(data2[i].values())])
        # original_height_sum = original_height_sum + sum([j for j in data2[i].keys()])
        # layer_max_radius = max([i for i in data2[i].values()])
        if max_radius < layer_max_radius:
            max_radius = layer_max_radius

    print("max height", original_height_sum)
    print("max radius", max_radius)
    print("height total", peel_layer_ratio * max_radius)
    # original_height_radius_ratio = original_height_sum/max_radius
    # print("original_height_radius_ratio", original_height_radius_ratio)
    scale_factor = peel_layer_ratio * max_radius / original_height_sum
    print("scale_factor", scale_factor)
    for i in data2:
        # print(i)
        # print(data[i].values())
        # print(len(data[i]),'\n')
        for k in data2[i]:
            # log_k = math.log2(int(data[i][k]))
            start_pos.append(v_count)
            Y_dis = math.log2(k + 1) * scale_factor  # height = second key
            R = math.log2(data2[i][k] + 1)  # radius = frequency
            # Y_dis = k * scale_factor  # height = second key
            # R = data2[i][k]  # radius = frequency
            # print("k =",k)
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
            Y = Y + Y_dis
            start_pos.append(v_count)
            for j in range(default_edges):
                theta = j * 2 * math.pi / default_edges
                X = R * math.cos(theta)
                Z = R * math.sin(theta)
                v_0 = "{:06f}".format(X)
                v_1 = "{:06f}".format(Y)
                v_2 = "{:06f}".format(Z)
                f2.write(v_0 + ' ' + v_1 + ' ' + v_2 + '\n')
                v_count = v_count + 1
            # between layers
            # Y = Y + 0.1

    start_pos.append(v_count)  # last v_count
    # print(start_pos)
    color_str = "255 0 0"
    for i in range(len(start_pos) - 2):
        lower = [*range(start_pos[i], start_pos[i + 1])]
        upper = [*range(start_pos[i + 1], start_pos[i + 2])]
        # print('i',i,'lower')
        # print(lower)
        # print('upper')
        # print(upper)
        faces = triangulate(lower, upper)
        if (len(faces) > 0):
            for f in faces:
                f2.write('3 ' + str(f[0]) + ' ' + str(f[1]) + ' ' + str(f[2]) + ' ' + color_str + '\n')
                f_count = f_count + 1
    f2.close()
    print(v_count)
    print(f_count)


def test_mesh():
    f2 = open('test.off', 'w')
    f2.write('OFF\n16 16 0\n')
    Y = 0
    default_edges = 8
    R = 10  # default radius
    v_count = 0
    for _ in range(2):
        for j in range(default_edges):
            theta = j * 2 * math.pi / default_edges
            X = R * math.cos(theta)
            Z = R * math.sin(theta)
            f2.write(str(X) + ' ' + str(Y) + ' ' + str(Z) + '\n')
            v_count = v_count + 1
        Y = Y + 10
    lower = [*range(0, 8)]
    upper = [*range(8, 16)]
    faces = triangulate(lower, upper)
    for f in faces:
        f2.write('3 ' + str(f[0]) + ' ' + str(f[1]) + ' ' + str(f[2]) + '\n')


def test_mesh_2():
    f2 = open('test_2.off', 'w')
    f2.write('OFF\n8 8 0\n')
    Y = 0
    R = 10  # default radius
    v_count = 0

    default_edges = 3
    for j in range(default_edges):
        theta = j * 2 * math.pi / default_edges
        X = R * math.cos(theta)
        Z = R * math.sin(theta)
        f2.write(str(X) + ' ' + str(Y) + ' ' + str(Z) + '\n')
        v_count = v_count + 1
    Y = Y + 10
    default_edges = 5
    for j in range(default_edges):
        theta = j * 2 * math.pi / default_edges
        X = R * math.cos(theta)
        Z = R * math.sin(theta)
        f2.write(str(X) + ' ' + str(Y) + ' ' + str(Z) + '\n')
        v_count = v_count + 1
    lower = [*range(0, 3)]
    upper = [*range(3, 8)]
    faces = triangulate(lower, upper)
    for f in faces:
        f2.write('3 ' + str(f[0]) + ' ' + str(f[1]) + ' ' + str(f[2]) + '\n')



def ToRgb(h):

    # h = 1 - math.log(h + 0.0001, 0.0001)
    # color = cm.jet(h)[:-1]

    # color = [int(round(255 * x)) for x in cm.jet(h)[:-1]]
    
    # h = 1 / (1 + exp(-5 * (h - 0.25)))  # logisitic curve to bias towards blue
    # h = math.log2(h)
    color = [int(round(255 * x)) for x in cm.jet(h)[:-1]]
    return color

def faceColor(colormap_input_list,vertex,first_index_list):
    i = 0
    # print("vertex", vertex)
    while (vertex > first_index_list[i]):
        i = i + 1
    #     print(i)
    # print(i)
    color_input = colormap_input_list[i]
    color = ToRgb(color_input)
    return color

if __name__ == "__main__":
    # draw_mesh_1()
    # draw_mesh_2()
    # draw_mesh_3()
    draw_mesh_3_5()
    # draw_mesh_4()
    # test_mesh()
    # test_mesh_2()
