var starMap = new THREE.TextureLoader().load('images/star.png');
var glowMap = new THREE.TextureLoader().load('images/glow.png');
var particleMap = new THREE.TextureLoader().load('images/particle.png');
var dotMap = new THREE.TextureLoader().load('images/dot.png');

var redColor = new THREE.Color(1, 0, 0);
var greenColor = new THREE.Color(0, 1, 0);
var whiteColor = new THREE.Color(1, 1, 1);
var greyColor = new THREE.Color(0.5, 0.5, 0.5);

var CAMERA_DISTANCE2NODES_FACTOR = 90;
let orangeTemp = d3.scaleSequential(d3.interpolateOranges);
//let orangeTemp2=d3.scaleSequential(d3.interpolateYlOrRd);


function interpolateLinearly(x, values) {

  // Split values into four lists
  var x_values = [];
  var r_values = [];
  var g_values = [];
  var b_values = [];
  for (i in values) {
    x_values.push(values[i][0]);
    r_values.push(values[i][1][0]);
    g_values.push(values[i][1][1]);
    b_values.push(values[i][1][2]);
  }

  var i = 1;
  while (x_values[i] < x) {
    i = i + 1;
  }
  i = i - 1;

  var width = Math.abs(x_values[i] - x_values[i + 1]);
  var scaling_factor = (x - x_values[i]) / width;

  // Get the new color values though interpolation
  var r = r_values[i] + scaling_factor * (r_values[i + 1] - r_values[i])
  var g = g_values[i] + scaling_factor * (g_values[i + 1] - g_values[i])
  var b = b_values[i] + scaling_factor * (b_values[i + 1] - b_values[i])

  return [enforceBounds(r), enforceBounds(g), enforceBounds(b)];
}

function enforceBounds(x) {
  if (x < 0) {
    return 0;
  } else if (x > 1) {
    return 1;
  } else {
    return x;
  }
}

const grey2red = [[0.000, [0.780, 0.780, 0.780]], [0.002, [0.778, 0.779, 0.780]], [0.004, [0.776, 0.778, 0.780]], [0.006, [0.774, 0.778, 0.780]], [0.008, [0.772, 0.777, 0.780]], [0.010, [0.769, 0.776, 0.781]], [0.012, [0.767, 0.775, 0.781]], [0.014, [0.765, 0.774, 0.781]], [0.016, [0.763, 0.774, 0.781]], [0.018, [0.761, 0.773, 0.781]], [0.020, [0.758, 0.772, 0.782]], [0.022, [0.756, 0.772, 0.782]], [0.024, [0.754, 0.771, 0.782]], [0.026, [0.752, 0.770, 0.782]], [0.028, [0.750, 0.770, 0.782]], [0.030, [0.747, 0.769, 0.783]], [0.032, [0.745, 0.769, 0.783]], [0.034, [0.743, 0.768, 0.783]], [0.036, [0.741, 0.767, 0.783]], [0.038, [0.738, 0.767, 0.784]], [0.040, [0.736, 0.766, 0.784]], [0.042, [0.734, 0.766, 0.784]], [0.044, [0.731, 0.765, 0.785]], [0.046, [0.729, 0.765, 0.785]], [0.048, [0.727, 0.765, 0.785]], [0.050, [0.724, 0.764, 0.786]], [0.052, [0.722, 0.764, 0.786]], [0.054, [0.720, 0.763, 0.786]], [0.056, [0.717, 0.763, 0.787]], [0.058, [0.715, 0.763, 0.787]], [0.060, [0.712, 0.762, 0.788]], [0.062, [0.710, 0.762, 0.788]], [0.064, [0.708, 0.762, 0.788]], [0.066, [0.705, 0.762, 0.789]], [0.068, [0.703, 0.762, 0.789]], [0.070, [0.700, 0.761, 0.790]], [0.072, [0.698, 0.761, 0.790]], [0.074, [0.695, 0.761, 0.791]], [0.076, [0.693, 0.761, 0.791]], [0.078, [0.690, 0.761, 0.792]], [0.080, [0.688, 0.761, 0.792]], [0.082, [0.685, 0.761, 0.793]], [0.084, [0.683, 0.761, 0.793]], [0.086, [0.680, 0.761, 0.794]], [0.088, [0.678, 0.761, 0.794]], [0.090, [0.675, 0.761, 0.795]], [0.092, [0.673, 0.761, 0.795]], [0.094, [0.670, 0.761, 0.796]], [0.096, [0.668, 0.761, 0.796]], [0.098, [0.665, 0.761, 0.797]], [0.100, [0.662, 0.761, 0.797]], [0.102, [0.660, 0.762, 0.798]], [0.104, [0.657, 0.762, 0.799]], [0.106, [0.655, 0.762, 0.799]], [0.108, [0.652, 0.762, 0.800]], [0.110, [0.649, 0.763, 0.801]], [0.112, [0.647, 0.763, 0.801]], [0.114, [0.644, 0.764, 0.802]], [0.116, [0.641, 0.764, 0.803]], [0.118, [0.639, 0.764, 0.803]], [0.120, [0.636, 0.765, 0.804]], [0.122, [0.633, 0.765, 0.805]], [0.124, [0.631, 0.766, 0.805]], [0.126, [0.628, 0.766, 0.806]], [0.128, [0.625, 0.767, 0.807]], [0.130, [0.622, 0.767, 0.808]], [0.132, [0.620, 0.768, 0.808]], [0.134, [0.617, 0.769, 0.809]], [0.136, [0.614, 0.769, 0.810]], [0.138, [0.611, 0.770, 0.811]], [0.140, [0.608, 0.771, 0.812]], [0.142, [0.606, 0.772, 0.812]], [0.144, [0.603, 0.772, 0.813]], [0.146, [0.600, 0.773, 0.814]], [0.148, [0.597, 0.774, 0.815]], [0.150, [0.594, 0.775, 0.816]], [0.152, [0.592, 0.776, 0.816]], [0.154, [0.589, 0.777, 0.817]], [0.156, [0.586, 0.778, 0.818]], [0.158, [0.583, 0.779, 0.819]], [0.160, [0.580, 0.780, 0.820]], [0.162, [0.577, 0.781, 0.821]], [0.164, [0.574, 0.782, 0.822]], [0.166, [0.571, 0.783, 0.823]], [0.168, [0.568, 0.785, 0.824]], [0.170, [0.565, 0.786, 0.825]], [0.172, [0.562, 0.787, 0.826]], [0.174, [0.559, 0.788, 0.827]], [0.176, [0.556, 0.790, 0.828]], [0.178, [0.553, 0.791, 0.829]], [0.180, [0.550, 0.792, 0.829]], [0.182, [0.547, 0.794, 0.831]], [0.184, [0.544, 0.795, 0.832]], [0.186, [0.541, 0.797, 0.833]], [0.188, [0.538, 0.798, 0.834]], [0.190, [0.535, 0.800, 0.835]], [0.192, [0.532, 0.801, 0.836]], [0.194, [0.529, 0.803, 0.837]], [0.196, [0.526, 0.805, 0.838]], [0.198, [0.523, 0.806, 0.839]], [0.200, [0.520, 0.808, 0.840]], [0.202, [0.517, 0.810, 0.841]], [0.204, [0.514, 0.812, 0.842]], [0.206, [0.511, 0.813, 0.843]], [0.208, [0.508, 0.815, 0.844]], [0.210, [0.504, 0.817, 0.846]], [0.212, [0.501, 0.819, 0.847]], [0.214, [0.498, 0.821, 0.848]], [0.216, [0.495, 0.823, 0.849]], [0.218, [0.492, 0.825, 0.850]], [0.220, [0.489, 0.827, 0.851]], [0.222, [0.485, 0.829, 0.853]], [0.224, [0.482, 0.832, 0.854]], [0.226, [0.479, 0.834, 0.855]], [0.228, [0.476, 0.836, 0.856]], [0.230, [0.472, 0.838, 0.858]], [0.232, [0.469, 0.841, 0.859]], [0.234, [0.466, 0.843, 0.860]], [0.236, [0.463, 0.845, 0.861]], [0.238, [0.459, 0.848, 0.863]], [0.240, [0.456, 0.850, 0.864]], [0.242, [0.453, 0.853, 0.865]], [0.244, [0.449, 0.855, 0.867]], [0.246, [0.446, 0.858, 0.868]], [0.248, [0.443, 0.861, 0.869]], [0.250, [0.439, 0.863, 0.871]], [0.252, [0.436, 0.866, 0.872]], [0.254, [0.433, 0.869, 0.873]], [0.256, [0.429, 0.872, 0.875]], [0.258, [0.426, 0.875, 0.876]], [0.260, [0.422, 0.877, 0.877]], [0.262, [0.419, 0.879, 0.877]], [0.264, [0.416, 0.880, 0.877]], [0.266, [0.412, 0.882, 0.877]], [0.268, [0.409, 0.883, 0.877]], [0.270, [0.405, 0.885, 0.877]], [0.272, [0.402, 0.886, 0.876]], [0.274, [0.398, 0.888, 0.876]], [0.276, [0.395, 0.889, 0.876]], [0.278, [0.391, 0.891, 0.876]], [0.280, [0.388, 0.892, 0.875]], [0.282, [0.384, 0.894, 0.875]], [0.284, [0.381, 0.895, 0.874]], [0.286, [0.377, 0.897, 0.874]], [0.288, [0.374, 0.898, 0.874]], [0.290, [0.370, 0.900, 0.873]], [0.292, [0.367, 0.901, 0.873]], [0.294, [0.363, 0.903, 0.872]], [0.296, [0.360, 0.904, 0.872]], [0.298, [0.356, 0.906, 0.871]], [0.300, [0.353, 0.907, 0.871]], [0.302, [0.349, 0.909, 0.870]], [0.304, [0.345, 0.911, 0.869]], [0.306, [0.342, 0.912, 0.869]], [0.308, [0.338, 0.914, 0.868]], [0.310, [0.334, 0.916, 0.867]], [0.312, [0.331, 0.917, 0.866]], [0.314, [0.327, 0.919, 0.866]], [0.316, [0.323, 0.921, 0.865]], [0.318, [0.320, 0.922, 0.864]], [0.320, [0.316, 0.924, 0.863]], [0.322, [0.312, 0.926, 0.862]], [0.324, [0.309, 0.927, 0.861]], [0.326, [0.305, 0.929, 0.860]], [0.328, [0.301, 0.931, 0.860]], [0.330, [0.297, 0.933, 0.859]], [0.332, [0.294, 0.934, 0.857]], [0.334, [0.290, 0.936, 0.856]], [0.336, [0.286, 0.938, 0.855]], [0.338, [0.282, 0.940, 0.854]], [0.340, [0.278, 0.942, 0.853]], [0.342, [0.275, 0.943, 0.852]], [0.344, [0.271, 0.945, 0.851]], [0.346, [0.267, 0.947, 0.849]], [0.348, [0.263, 0.949, 0.848]], [0.350, [0.259, 0.951, 0.847]], [0.352, [0.256, 0.952, 0.846]], [0.354, [0.252, 0.954, 0.844]], [0.356, [0.248, 0.956, 0.843]], [0.358, [0.244, 0.958, 0.841]], [0.360, [0.240, 0.960, 0.840]], [0.362, [0.236, 0.962, 0.839]], [0.364, [0.232, 0.964, 0.837]], [0.366, [0.228, 0.966, 0.835]], [0.368, [0.224, 0.968, 0.834]], [0.370, [0.220, 0.970, 0.832]], [0.372, [0.216, 0.972, 0.831]], [0.374, [0.212, 0.974, 0.829]], [0.376, [0.208, 0.976, 0.827]], [0.378, [0.204, 0.978, 0.825]], [0.380, [0.200, 0.980, 0.824]], [0.382, [0.196, 0.982, 0.822]], [0.384, [0.192, 0.984, 0.820]], [0.386, [0.188, 0.986, 0.818]], [0.388, [0.184, 0.988, 0.816]], [0.390, [0.180, 0.990, 0.814]], [0.392, [0.176, 0.992, 0.812]], [0.394, [0.172, 0.994, 0.810]], [0.396, [0.168, 0.996, 0.808]], [0.398, [0.164, 0.998, 0.806]], [0.400, [0.160, 1.000, 0.804]], [0.402, [0.161, 1.000, 0.806]], [0.404, [0.174, 1.000, 0.794]], [0.406, [0.174, 1.000, 0.794]], [0.408, [0.187, 1.000, 0.781]], [0.410, [0.187, 1.000, 0.781]], [0.412, [0.199, 1.000, 0.769]], [0.414, [0.199, 1.000, 0.769]], [0.416, [0.212, 1.000, 0.756]], [0.418, [0.225, 1.000, 0.743]], [0.420, [0.225, 1.000, 0.743]], [0.422, [0.237, 1.000, 0.731]], [0.424, [0.237, 1.000, 0.731]], [0.426, [0.250, 1.000, 0.718]], [0.428, [0.250, 1.000, 0.718]], [0.430, [0.262, 1.000, 0.705]], [0.432, [0.262, 1.000, 0.705]], [0.434, [0.275, 1.000, 0.693]], [0.436, [0.275, 1.000, 0.693]], [0.438, [0.288, 1.000, 0.680]], [0.440, [0.288, 1.000, 0.680]], [0.442, [0.300, 1.000, 0.667]], [0.444, [0.300, 1.000, 0.667]], [0.446, [0.313, 1.000, 0.655]], [0.448, [0.313, 1.000, 0.655]], [0.450, [0.326, 1.000, 0.642]], [0.452, [0.326, 1.000, 0.642]], [0.454, [0.338, 1.000, 0.629]], [0.456, [0.338, 1.000, 0.629]], [0.458, [0.351, 1.000, 0.617]], [0.460, [0.351, 1.000, 0.617]], [0.462, [0.364, 1.000, 0.604]], [0.464, [0.364, 1.000, 0.604]], [0.466, [0.376, 1.000, 0.591]], [0.468, [0.376, 1.000, 0.591]], [0.470, [0.389, 1.000, 0.579]], [0.472, [0.389, 1.000, 0.579]], [0.474, [0.402, 1.000, 0.566]], [0.476, [0.402, 1.000, 0.566]], [0.478, [0.414, 1.000, 0.553]], [0.480, [0.414, 1.000, 0.553]], [0.482, [0.427, 1.000, 0.541]], [0.484, [0.427, 1.000, 0.541]], [0.486, [0.440, 1.000, 0.528]], [0.488, [0.440, 1.000, 0.528]], [0.490, [0.452, 1.000, 0.515]], [0.492, [0.452, 1.000, 0.515]], [0.494, [0.465, 1.000, 0.503]], [0.496, [0.465, 1.000, 0.503]], [0.498, [0.478, 1.000, 0.490]], [0.500, [0.490, 1.000, 0.478]], [0.502, [0.490, 1.000, 0.478]], [0.504, [0.503, 1.000, 0.465]], [0.506, [0.503, 1.000, 0.465]], [0.508, [0.515, 1.000, 0.452]], [0.510, [0.515, 1.000, 0.452]], [0.512, [0.528, 1.000, 0.440]], [0.514, [0.528, 1.000, 0.440]], [0.516, [0.541, 1.000, 0.427]], [0.518, [0.541, 1.000, 0.427]], [0.520, [0.553, 1.000, 0.414]], [0.522, [0.553, 1.000, 0.414]], [0.524, [0.566, 1.000, 0.402]], [0.526, [0.566, 1.000, 0.402]], [0.528, [0.579, 1.000, 0.389]], [0.530, [0.579, 1.000, 0.389]], [0.532, [0.591, 1.000, 0.376]], [0.534, [0.591, 1.000, 0.376]], [0.536, [0.604, 1.000, 0.364]], [0.538, [0.604, 1.000, 0.364]], [0.540, [0.617, 1.000, 0.351]], [0.542, [0.617, 1.000, 0.351]], [0.544, [0.629, 1.000, 0.338]], [0.546, [0.629, 1.000, 0.338]], [0.548, [0.642, 1.000, 0.326]], [0.550, [0.642, 1.000, 0.326]], [0.552, [0.655, 1.000, 0.313]], [0.554, [0.655, 1.000, 0.313]], [0.556, [0.667, 1.000, 0.300]], [0.558, [0.667, 1.000, 0.300]], [0.560, [0.680, 1.000, 0.288]], [0.562, [0.680, 1.000, 0.288]], [0.564, [0.693, 1.000, 0.275]], [0.566, [0.693, 1.000, 0.275]], [0.568, [0.705, 1.000, 0.262]], [0.570, [0.705, 1.000, 0.262]], [0.572, [0.718, 1.000, 0.250]], [0.574, [0.718, 1.000, 0.250]], [0.576, [0.731, 1.000, 0.237]], [0.578, [0.731, 1.000, 0.237]], [0.580, [0.743, 1.000, 0.225]], [0.582, [0.743, 1.000, 0.225]], [0.584, [0.756, 1.000, 0.212]], [0.586, [0.769, 1.000, 0.199]], [0.588, [0.769, 1.000, 0.199]], [0.590, [0.781, 1.000, 0.187]], [0.592, [0.781, 1.000, 0.187]], [0.594, [0.794, 1.000, 0.174]], [0.596, [0.794, 1.000, 0.174]], [0.598, [0.806, 1.000, 0.161]], [0.600, [0.806, 1.000, 0.161]], [0.602, [0.819, 1.000, 0.149]], [0.604, [0.819, 1.000, 0.149]], [0.606, [0.832, 1.000, 0.136]], [0.608, [0.832, 1.000, 0.136]], [0.610, [0.844, 1.000, 0.123]], [0.612, [0.844, 1.000, 0.123]], [0.614, [0.857, 1.000, 0.111]], [0.616, [0.857, 1.000, 0.111]], [0.618, [0.870, 1.000, 0.098]], [0.620, [0.870, 1.000, 0.098]], [0.622, [0.882, 1.000, 0.085]], [0.624, [0.882, 1.000, 0.085]], [0.626, [0.895, 1.000, 0.073]], [0.628, [0.895, 1.000, 0.073]], [0.630, [0.908, 1.000, 0.060]], [0.632, [0.908, 1.000, 0.060]], [0.634, [0.920, 1.000, 0.047]], [0.636, [0.920, 1.000, 0.047]], [0.638, [0.933, 1.000, 0.035]], [0.640, [0.933, 1.000, 0.035]], [0.642, [0.946, 0.988, 0.022]], [0.644, [0.946, 0.988, 0.022]], [0.646, [0.958, 0.974, 0.009]], [0.648, [0.958, 0.974, 0.009]], [0.650, [0.971, 0.959, 0.000]], [0.652, [0.971, 0.959, 0.000]], [0.654, [0.984, 0.945, 0.000]], [0.656, [0.984, 0.945, 0.000]], [0.658, [0.996, 0.930, 0.000]], [0.660, [0.996, 0.930, 0.000]], [0.662, [1.000, 0.916, 0.000]], [0.664, [1.000, 0.916, 0.000]], [0.666, [1.000, 0.901, 0.000]], [0.668, [1.000, 0.887, 0.000]], [0.670, [1.000, 0.887, 0.000]], [0.672, [1.000, 0.872, 0.000]], [0.674, [1.000, 0.872, 0.000]], [0.676, [1.000, 0.858, 0.000]], [0.678, [1.000, 0.858, 0.000]], [0.680, [1.000, 0.843, 0.000]], [0.682, [1.000, 0.843, 0.000]], [0.684, [1.000, 0.829, 0.000]], [0.686, [1.000, 0.829, 0.000]], [0.688, [1.000, 0.814, 0.000]], [0.690, [1.000, 0.814, 0.000]], [0.692, [1.000, 0.800, 0.000]], [0.694, [1.000, 0.800, 0.000]], [0.696, [1.000, 0.785, 0.000]], [0.698, [1.000, 0.785, 0.000]], [0.700, [1.000, 0.771, 0.000]], [0.702, [1.000, 0.771, 0.000]], [0.704, [1.000, 0.756, 0.000]], [0.706, [1.000, 0.756, 0.000]], [0.708, [1.000, 0.741, 0.000]], [0.710, [1.000, 0.741, 0.000]], [0.712, [1.000, 0.727, 0.000]], [0.714, [1.000, 0.727, 0.000]], [0.716, [1.000, 0.712, 0.000]], [0.718, [1.000, 0.712, 0.000]], [0.720, [1.000, 0.698, 0.000]], [0.722, [1.000, 0.698, 0.000]], [0.724, [1.000, 0.683, 0.000]], [0.726, [1.000, 0.683, 0.000]], [0.728, [1.000, 0.669, 0.000]], [0.730, [1.000, 0.669, 0.000]], [0.732, [1.000, 0.654, 0.000]], [0.734, [1.000, 0.654, 0.000]], [0.736, [1.000, 0.640, 0.000]], [0.738, [1.000, 0.640, 0.000]], [0.740, [1.000, 0.625, 0.000]], [0.742, [1.000, 0.625, 0.000]], [0.744, [1.000, 0.611, 0.000]], [0.746, [1.000, 0.611, 0.000]], [0.748, [1.000, 0.596, 0.000]], [0.750, [1.000, 0.582, 0.000]], [0.752, [1.000, 0.582, 0.000]], [0.754, [1.000, 0.567, 0.000]], [0.756, [1.000, 0.567, 0.000]], [0.758, [1.000, 0.553, 0.000]], [0.760, [1.000, 0.553, 0.000]], [0.762, [1.000, 0.538, 0.000]], [0.764, [1.000, 0.538, 0.000]], [0.766, [1.000, 0.524, 0.000]], [0.768, [1.000, 0.524, 0.000]], [0.770, [1.000, 0.509, 0.000]], [0.772, [1.000, 0.509, 0.000]], [0.774, [1.000, 0.495, 0.000]], [0.776, [1.000, 0.495, 0.000]], [0.778, [1.000, 0.480, 0.000]], [0.780, [1.000, 0.480, 0.000]], [0.782, [1.000, 0.466, 0.000]], [0.784, [1.000, 0.466, 0.000]], [0.786, [1.000, 0.451, 0.000]], [0.788, [1.000, 0.451, 0.000]], [0.790, [1.000, 0.436, 0.000]], [0.792, [1.000, 0.436, 0.000]], [0.794, [1.000, 0.422, 0.000]], [0.796, [1.000, 0.422, 0.000]], [0.798, [1.000, 0.407, 0.000]], [0.800, [1.000, 0.407, 0.000]], [0.802, [1.000, 0.393, 0.000]], [0.804, [1.000, 0.393, 0.000]], [0.806, [1.000, 0.378, 0.000]], [0.808, [1.000, 0.378, 0.000]], [0.810, [1.000, 0.364, 0.000]], [0.812, [1.000, 0.364, 0.000]], [0.814, [1.000, 0.349, 0.000]], [0.816, [1.000, 0.349, 0.000]], [0.818, [1.000, 0.335, 0.000]], [0.820, [1.000, 0.335, 0.000]], [0.822, [1.000, 0.320, 0.000]], [0.824, [1.000, 0.320, 0.000]], [0.826, [1.000, 0.306, 0.000]], [0.828, [1.000, 0.306, 0.000]], [0.830, [1.000, 0.291, 0.000]], [0.832, [1.000, 0.291, 0.000]], [0.834, [1.000, 0.277, 0.000]], [0.836, [1.000, 0.262, 0.000]], [0.838, [1.000, 0.262, 0.000]], [0.840, [1.000, 0.248, 0.000]], [0.842, [1.000, 0.248, 0.000]], [0.844, [1.000, 0.233, 0.000]], [0.846, [1.000, 0.233, 0.000]], [0.848, [1.000, 0.219, 0.000]], [0.850, [1.000, 0.219, 0.000]], [0.852, [1.000, 0.204, 0.000]], [0.854, [1.000, 0.204, 0.000]], [0.856, [1.000, 0.190, 0.000]], [0.858, [1.000, 0.190, 0.000]], [0.860, [1.000, 0.175, 0.000]], [0.862, [1.000, 0.175, 0.000]], [0.864, [1.000, 0.160, 0.000]], [0.866, [1.000, 0.160, 0.000]], [0.868, [1.000, 0.146, 0.000]], [0.870, [1.000, 0.146, 0.000]], [0.872, [1.000, 0.131, 0.000]], [0.874, [1.000, 0.131, 0.000]], [0.876, [1.000, 0.117, 0.000]], [0.878, [1.000, 0.117, 0.000]], [0.880, [1.000, 0.102, 0.000]], [0.882, [1.000, 0.102, 0.000]], [0.884, [1.000, 0.088, 0.000]], [0.886, [1.000, 0.088, 0.000]], [0.888, [0.999, 0.073, 0.000]], [0.890, [0.999, 0.073, 0.000]], [0.892, [0.981, 0.059, 0.000]], [0.894, [0.981, 0.059, 0.000]], [0.896, [0.963, 0.044, 0.000]], [0.898, [0.963, 0.044, 0.000]], [0.900, [0.946, 0.030, 0.000]], [0.902, [0.946, 0.030, 0.000]], [0.904, [0.928, 0.015, 0.000]], [0.906, [0.928, 0.015, 0.000]], [0.908, [0.910, 0.001, 0.000]], [0.910, [0.910, 0.001, 0.000]], [0.912, [0.892, 0.000, 0.000]], [0.914, [0.892, 0.000, 0.000]], [0.916, [0.874, 0.000, 0.000]], [0.918, [0.857, 0.000, 0.000]], [0.920, [0.857, 0.000, 0.000]], [0.922, [0.839, 0.000, 0.000]], [0.924, [0.839, 0.000, 0.000]], [0.926, [0.821, 0.000, 0.000]], [0.928, [0.821, 0.000, 0.000]], [0.930, [0.803, 0.000, 0.000]], [0.932, [0.803, 0.000, 0.000]], [0.934, [0.785, 0.000, 0.000]], [0.936, [0.785, 0.000, 0.000]], [0.938, [0.767, 0.000, 0.000]], [0.940, [0.767, 0.000, 0.000]], [0.942, [0.750, 0.000, 0.000]], [0.944, [0.750, 0.000, 0.000]], [0.946, [0.732, 0.000, 0.000]], [0.948, [0.732, 0.000, 0.000]], [0.950, [0.714, 0.000, 0.000]], [0.952, [0.714, 0.000, 0.000]], [0.954, [0.696, 0.000, 0.000]], [0.956, [0.696, 0.000, 0.000]], [0.958, [0.678, 0.000, 0.000]], [0.960, [0.678, 0.000, 0.000]], [0.962, [0.660, 0.000, 0.000]], [0.964, [0.660, 0.000, 0.000]], [0.966, [0.643, 0.000, 0.000]], [0.968, [0.643, 0.000, 0.000]], [0.970, [0.625, 0.000, 0.000]], [0.972, [0.625, 0.000, 0.000]], [0.974, [0.607, 0.000, 0.000]], [0.976, [0.607, 0.000, 0.000]], [0.978, [0.589, 0.000, 0.000]], [0.980, [0.589, 0.000, 0.000]], [0.982, [0.571, 0.000, 0.000]], [0.984, [0.571, 0.000, 0.000]], [0.986, [0.553, 0.000, 0.000]], [0.988, [0.553, 0.000, 0.000]], [0.990, [0.536, 0.000, 0.000]], [0.992, [0.536, 0.000, 0.000]], [0.994, [0.518, 0.000, 0.000]], [0.996, [0.518, 0.000, 0.000]], [0.998, [0.500, 0.000, 0.000]], [1.000, [0.500, 0.000, 0.000]]];

G.colorScales = { //[0,1], use with THREE.Color.setStyle()
  rainbow: d3.scaleSequential(d3.interpolateRainbow),
  cool: d3.scaleSequential(d3.interpolateCool),
  warm: d3.scaleSequential(d3.interpolateWarm),
  plasma: d3.scaleSequential(d3.interpolatePlasma),
  spring: d3.scaleSequential(d3.interpolateHslLong("#ff0000", "#f8f")),
  spectral: d3.scaleSequential(d3.interpolateSpectral),
  lightSpectral: d3.scaleSequential(d3.interpolateCubehelixLong("#d7d0ff", "#f7b6ab")),
  orange: d3.scaleSequential(d3.interpolateHslLong("#EF110D", "#FFE035")),
  orangeLight: (value) => orangeTemp(1 - value),
  //blackRed:(value)=>orangeTemp(1-(value/2)),
  blackRed: d3.scaleSequential(d3.interpolateCubehelix("#200000", "#ff2020")),
  //blueRed:d3.scaleSequential(d3.interpolateHslLong("#63daff","#ff2020")),
  blueRed: d3.scaleSequential(d3.interpolateHslLong("hsl(289,100%,50%)", "hsl(0,100%,50%)")),
  // blueRed:d3.scaleSequential(d3.interpolateHslLong("hsl(0,100%,50%)","hsl(289,100%,50%)")),
  //lightBlueRed:d3.scaleSequential(d3.interpolateHslLong("hsl(216,65%,82%)","hsl(0,65%,82%)")), //too dark links (their colors are normalized)
  lightBlueRed: d3.scaleSequential(d3.interpolateHslLong("hsl(216,77%,70%)", "hsl(0,77%,70%)")),
  // lightBlueRed:d3.scaleSequential(d3.interpolateHslLong("hsl(0,77%,70%)","hsl(216,77%,70%)")),
  greyRed: (value) => d3.rgb(...interpolateLinearly(value, grey2red).map(x => x * 255)).darker(2),
};
G.colorScale = "lightBlueRed";
G.brightColors = true;
Object.cast = function cast(rawObj, constructor) {
  var obj = new constructor();
  for (var i in rawObj)
    obj[i] = rawObj[i];
  return obj;
}

function onColorScaleUpdated() {
  if (G.view.model) {
    /*for(let value in G.view.model.colorIndexMap){
    	//colors[value]=c; ??
    	let index=G.view.model.colorIndexMap[value];
    	if(value==-1){}else {G.view.model.colorList[index].setStyle(colorScale(value));}

    };*/
    for (let i = 0; i < G.view.model.colors.length; i++) {
      let value = G.view.model.colorValues[i];
      G.view.model.colors[i].setStyle(colorScale(value));

    }
  }
  G.view.sharedUniforms.colorList.needsUpdate = true;
}

function colorScale(value) {
  return G.colorScales[G.controls.get("colorScales", "lightBlueRed", G.colorScales, onColorScaleUpdated)](value); //controls getting of options returns the value of that option
}




//note: the view doesn't care what's the logical top level graph, but only what's the displayed top level (meta)graph. So this.graph should be that graph.
//some modules are basically processors of datasets that add stuff to it and pass it along; others create new data from it(subview); the view is only accepting it on displayGraph and (almost) not changing the data, like the UI module. However now I use the same pipeline and don't distinguish between the types of datasets explicitly. I guess others may have subclassed Dataset into Subview etc.
G.addModule("view", {
  textures: {
    glow: glowMap,
    particle: particleMap,
    dot: dotMap
  },
  shaderSources: {},
  nodeMovement: new THREE.Vector3(),
  nodeScreenTarget: new THREE.Vector3(),
  loadShaders: function() {
    if (this.shaderPromise) return this.shaderPromise;
    let promises = [];
    for (let name in this.templates) {
      if (!this.templates[name].object3dType) continue;
      promises.push(d3.text("shaders/" + name + ".vs").then((data) => {
        if (data) {
          this.shaderSources[name + ".vs"] = data;
        }
      }));
      promises.push(d3.text("shaders/" + name + ".fs").then((data) => {
        if (data) {
          this.shaderSources[name + ".fs"] = data;
        }
      }));
    }
    promises.push(d3.text("shaders/sharedShaderLib.vs").then((data) => {
      if (data) {
        this.shaderLib = data;
      }
    }));
    promises.push(d3.text("shaders/simulation.vs").then((data) => {
      if (data) {
        this.shaderSources["simulation.vs"] = data;
      }
    }));
    promises.push(d3.text("shaders/simulation.fs").then((data) => {
      if (data) {
        this.shaderSources["simulation.fs"] = data;
      }
    }));
    this.shaderPromise = Promise.all(promises);
  },
  init: function(object, canvasName = "canvas") {
    this.raycaster = new THREE.Raycaster();
    window.addEventListener("resize", this.resizeCanvas, false);
    this.loadShaders();
    G.zoomOutDistance = () => {
      let maxHeight = G.view.model ? (500.0 * Math.sqrt(Math.log(G.view.model.heights.max + 1.)) * G.controls.get("heightFactor") + 9000) : 0;
      let maxRadius = G.view.model ? (this.sharedUniforms.radialLimit.value() * G.controls.get("radialLimitFactor") * 3 + 5000) : 0; //radialLimitFactor is 1 by default, it affects the heuristic-based radial limit force, but we want to use a plain stretching that doesn't affect the forces
      return Math.max(10000, maxHeight, maxRadius);
    };
    G.resetView = this.resetView;
    let canvas = d3.select("#" + canvasName).append("canvas").node();
    //add listeners before context creation
    canvas.addEventListener("webglcontextlost", function(event) {
      event.preventDefault();
      alert("Sorry, WebGL crashed because the hardware couldn't handle this view. Please refresh the page.");
    }, false);

    let context = canvas.getContext("webgl2"); //,{premultipliedAlpha: false});
    if (!context) {
      alert("This demo requires WebGL2, please use Chrome or Firefox");
      return;
    }


    G.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      context: context,
      alpha: true,
      clearColor: 0xffffff,
      preserveDrawingBuffer: true,
    });
    //var canvas=G.renderer.domElement;
    //var context = G.renderer.context;
    //G.renderer=new THREE.WebGLRenderer( { antialias: false } );
    G.renderer.setSize(window.innerWidth, window.innerHeight);
    //G.canvasContainer.appendChild( G.renderer.domElement );
    G.canvasElement = G.renderer.domElement;
    G.gl = G.renderer.getContext();
    //if ( ! G.gl.getExtension( 'OES_texture_float' ) ) {alert( 'Your browser does not support this application:	OES_texture_float is not available' );}
    this.maxTextureSize = G.gl.getParameter(G.gl.MAX_TEXTURE_SIZE);
    if (G.DEBUG) console.log("max texture size is " + this.maxTextureSize);
    let maxVertexTextureImageUnits = G.gl.getParameter(G.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    if (maxVertexTextureImageUnits == 0) {
      alert("Your browser does not support this application:  vertex texture image units is 0");
      return;
    } else {
      if (G.DEBUG) console.log("max vertex texture image size is " + maxVertexTextureImageUnits);
    }

    G.cameras = {
      perspective: new THREE.PerspectiveCamera(),
      orthographic: new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 20000)
    }; //50, window.innerWidth / window.innerHeight, 0.1, 50000
    G.cameras.perspective.far = 20000;
    G.cameras.perspective.near = 0.01;
    G["camera type"] = "perspective";
    G.camera = G.cameras.perspective; //new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    //scene.add( camera );
    for (let name in G.cameras) {
      G.cameras[name].position.x = 0;
      G.cameras[name].position.y = 0;
      G.cameras[name].position.z = 1000; //sqrt instead of cbrt because the layout is often quite flat
    }
    G.cameraControls = new MyControls(G.cameras, G.renderer.domElement, G);
    G.scene = new THREE.Scene();
    var scene = G.scene;
    scene.background = new THREE.Color(0xffffff);
    G.lightStyle = true;
    scene.fog = new THREE.FogExp2(0xaaaaaa, 0.005);
    //debugging
    this.testBuffer = new Float32Array(4);


    let objectOrder = Object.keys(this.templates).sort(compareBy((x) => (this.templates[x].priority ? this.templates[x].priority : 0), true));
    for (let name of objectOrder) {
      let obj = this.templates[name];
      if (obj.object3dType) {
        obj.geometry = new THREE.BufferGeometry(name);
        obj.geometry.name = name;
        obj.object3d = new obj.object3dType(obj.geometry, obj.material);
        obj.object3d.frustumCulled = false; //get rid of annoying disappearing problem -- the camera doesn't know the GPU-based positions!
        G.scene.add(obj.object3d);
      }
      if (obj.simulate) {
        this.sim.addObject(name); //simulation is currently being used

      }
    }

    dpr = 1;
    if (window.devicePixelRatio !== undefined) {
      dpr = window.devicePixelRatio;
    }


    var stats = new Stats();
    G.stats = stats;
    stats.showPanel(0);
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "";
    stats.dom.style.bottom = "5px";
    stats.dom.style.left = "5px";
    document.querySelector("#graph-plot-bar").appendChild(stats.dom);
    this.animateBound = this.animate.bind(this);
    setTimeout(this.animateBound, 0); //this may happen after a mouse event fires but it's OK because graph is not set at the start

    this.clock = new THREE.Clock();
    this.resizeCanvas();

    //init some controls
    this.initModifierControls();

    let objectsVisibilityObj = {};
    for (let name of objectOrder) {
      let obj = this.templates[name];
      if (obj.object3dType) {
        objectsVisibilityObj[name] = () => obj.object3d.visible = (!obj.object3d.visible);
      }
    }
    let viewButtomsElem = getE("view-buttons-area");
    G.controls.addDropdownMenu(viewButtomsElem, "show/hide", objectsVisibilityObj, {
      upward: true
    });
    //the simulation shouldn't need to know the camera position, but the movement needs to happen in the simulation and
    //we need to calculate the real movemnet for it

    //canvas.tabIndex=1;//to make it focusable and accept key events
    let moveLength = 50;
    G.controls.addKeyListener(canvas, 37, () => {
      G.view.nodeMovement.copy(G.cameraControls.leftVector).multiplyScalar(moveLength);
    }, () => {
      G.view.nodeMovement.set(0, 0, 0)
    });
    G.controls.addKeyListener(canvas, 38, () => {
      G.view.nodeMovement.copy(G.cameraControls.forwardVector).multiplyScalar(moveLength);
    }, () => {
      G.view.nodeMovement.set(0, 0, 0)
    });
    G.controls.addKeyListener(canvas, 39, () => {
      G.view.nodeMovement.copy(G.cameraControls.leftVector).multiplyScalar(-moveLength);
    }, () => {
      G.view.nodeMovement.set(0, 0, 0)
    });
    G.controls.addKeyListener(canvas, 40, () => {
      G.view.nodeMovement.copy(G.cameraControls.forwardVector).multiplyScalar(-moveLength);
    }, () => {
      G.view.nodeMovement.set(0, 0, 0)
    });
  },
  createSubscene: function() { //actually creates a logical sub-canvas with its own view model, layout, scene and cameras, (and optionally controls later??)
    //now there's one main scene/subcanvas, ad another subscene with its own layout which is a filtered part of the main view model - I don't want to actually manage two independent graphs? maybe we can manage not just scenes but infdependent graphs being displayed


  },
  shaderConstants: {
    textureSize: () => {
      return G.view.simulationTextureSize ? G.view.simulationTextureSize : 1;
    }
  },
  beforeDisplayGraph(newGraph) {
    //save positions for old graphs - based on vertices
    if (this.model && this.model.nodes) {
      let layouts = this.getVerticesPos(true);
      if (layouts) {
        for (let i = 0; i < this.subviews.length; i++) {
          //addHiddenProperty(this.subviews[i].graph.vertices,"layout",layouts[i]);
          this.subviews[i].graph.vertices.addProperty("layout", null, layouts[i]);
          for (let v of layouts[i]) {
            if (!v) throw Error();
          }
        }
        //try reusing parts of the old (main) layout if the new graph has no layout and there's a significant overlap (but if the overlap is tiny, don't reuse as it could make the layout look worse)
        if ((!newGraph.vertices.layout) && (newGraph.datasetID == this.subviews[0].graph.datasetID)) {
          //here if it has a layout it should have been loaded
          let newLayout = new Array(newGraph.vertices.length);
          let overlapCount = 0;
          let threshold = 1; //newGraph.vertices.length*0.5;
          let oldLayout = layouts[0],
            oldIDs = this.subviews[0].graph.vertices.id,
            oldIDMap = this.subviews[0].graph.vertexMap;
          for (let i = 0; i < newGraph.vertices.length; i++) {
            let id = newGraph.vertices.id[i];
            if (id in oldIDMap) {
              newLayout[i] = new THREE.Vector3().copy(oldLayout[oldIDMap[id]]);
              overlapCount++;
            }
          }
          if (overlapCount >= threshold) {
            for (let i = 0; i < newGraph.vertices.length; i++) {
              if (newLayout[i]) continue;
              let v = new THREE.Vector3();
              newLayout[i] = v;
              do {
                v.x = THREE.Math.randFloatSpread(100);
                v.y = THREE.Math.randFloatSpread(100);
                v.z = THREE.Math.randFloatSpread(100);
              }
              while (v.length() > Math.random() * 50 + 50);
            }
            //must fill in missing entries
            newGraph.vertices.addProperty("layout", null, newLayout);
          }
        }

      }
    }
    let minimap = getE("minimap");
    //save minimap before the child graph is shown
    if (this.graph && (!this.graph.imageData) && (this.graph.vertices.length > 0 || this.graph.globalRings && this.graph.globalRings.length > 0)) {
      this.graph.imageData = G.renderer.domElement.toDataURL("image/png");
    }
    if (newGraph.parent && newGraph.parent.imageData) {
      minimap.src = newGraph.parent.imageData;
      minimap.style.display = "block";
    } //works even if the parent is not the current graph
    else {
      minimap.src = "images/blank.png";
      minimap.style.display = "none";
    }
  },
  beforeDisplayingGraphLayer(graph) {
    if (graph.dataPath.includes("layer") && (graph.dataPath.includes("1") || graph.dataPath.includes("2"))) {
      getE("layer-1-info").innerHTML = ""
      ccs = Algs.getSortedCCsAndCCIDs(graph);
      info = getE("layer-1-info");
      G.graph.showingSparsenet = false;
      items = Algs.getMainVertexInCC(graph);
      for (item in items) {
        if (graph.labelsByID[items[item]] && graph.labelsByID[items[item]][0]) {
          if (graph.labelsByID[items[item]][0].indexOf("–") != -1) {
            textlabel = graph.labelsByID[items[item]][0].substring(0, graph.labelsByID[items[item]][0].indexOf("–"));
          } else if (graph.labelsByID[items[item]][0].indexOf("(") != -1) {
            textlabel = graph.labelsByID[items[item]][0].substring(0, graph.labelsByID[items[item]][0].indexOf("("));
          } else if (graph.labelsByID[items[item]][0].indexOf("-") != -1) {
            textlabel = graph.labelsByID[items[item]][0].substring(0, graph.labelsByID[items[item]][0].indexOf("-"));
          } else {
            textlabel = graph.labelsByID[items[item]][0];
          }
          for (cc in ccs) {
            if (ccs[cc].vertexList.indexOf(Number(items[item])) != -1) {
              G.graph.selectedccId = cc;
              ccg = Algs.getInducedSubgraph(graph, ccs[G.graph.selectedccId].vertexList);
              v = ccg.vertices.length;
              e = ccg.edges.length;
              break;
            }
          }
          let image = "";
          if (graph.dataPath.includes("2")) {
            if (v <= 7) image = "/images/shortline.png";
            if (v > 7 && v <= 10) image = "/images/longline.png";
            if (v > 10) image = "/images/twolines.png";
          } else {
            if (v <= 31) image = "/images/longline.png";
            if (v > 31 && v < 211) image = "/images/star1.png";
            if (v >= 211) image = "/images/starwithtail.png";
          }
          if (G.view.graph.nodes) {
            G.setcolorsorig = G.view.graph.nodes.colorValue;
          }
          G.controls.addCheckbox(info, toNormalText(textlabel), (value, id) => {
            if (value) {
              G.view.graph.trees = true;
              for (cc in ccs) {
                if (ccs[cc].vertexList.indexOf(Number(id)) != -1) {
                  G.graph.selectedccId = cc;
                  G.graph.selectedId = id;
                  ccg = Algs.getInducedSubgraph(graph, ccs[G.graph.selectedccId].vertexList);
                  G.ccgv = ccg.vertices.length;
                  G.ccge = ccg.edges.length;
                  break;
                }
              }
              document.getElementById("vertical").style.display = "none";
              document.getElementById("path").style.display = "block";

              var img = new Image();
              G.view.graph.selectedCCVertices = ccs[G.graph.selectedccId].vertexList;
              G.setcolorsnow = G.view.graph.nodes.colorValue;
              for (let m = 0; m < G.setcolorsnow.length; m++) {
                if (G.view.graph.selectedCCVertices.indexOf(m) != -1) {
                  G.setcolorsnow[m] = undefined;
                }
              }
              G.view.refreshStyles(true, true);
              G.renderer.render(G.scene, G.camera);
              img.src = G.renderer.domElement.toDataURL();
              G.setcolors = G.view.graph.nodes.colorValue;
              G.analytics.showSparseNet(G.graph);
              G.cameraControls.setTarget(null);
              let vec = G.view.getNodePos(id);
              if (vec.x != undefined || vec.y != undefined || vec.z != undefined)
                G.cameraControls.setTarget(vec, true);
              myDiv = document.getElementById("parent-image");
              myDiv.innerHTML = "";
              var elem = document.createElement("img");
              elem.setAttribute("src", img.src);
              elem.setAttribute("height", "250");
              elem.setAttribute("width", "500");
              elem.setAttribute("border", "5");
              elem.addEventListener("click", function() {
                G.view.resetView();
                G.view.graph.trees = false;
                graph.snPaths = undefined;
                G.cameraControls.setTarget(null);
                getE("num-edges-vertices").innerHTML = "";
                myDiv = document.getElementById("parent-image");
                myDiv.innerHTML = "";
                G.setcolorsnow = G.setcolorsorig;
                G.subview.disableModifier("sparsenet");
              });
              myDiv.appendChild(elem)
            } else {
              let a = getE(G.graph.selectedId + "a");
              a.innerHTML = "";
              a.style.border = "";
              a.style.borderStyle = "";
              G.view.resetView();
              G.view.graph.trees = false;
              graph.snPaths = undefined;
              G.cameraControls.setTarget(null);
              getE("num-edges-vertices").innerHTML = "";
              myDiv = document.getElementById("parent-image");
              myDiv.innerHTML = "";
              G.setcolorsnow = G.setcolorsorig;
              G.subview.disableModifier("sparsenet");
            }
          }, null, items[item], true, image);
          g = document.createElement('div');
          g.setAttribute("style", "text-align:left; font-size:small; margin: 5px;");
          g.setAttribute("id", items[item] + "a");
          info.append(g);
        }
      }


    } else {
      info = getE("layer-1-info").innerHTML = "";
    }
  },
  displayGraph: async function(graph, options) {
    if (!options) options = {};
    if (G.drawFixedPoints) {
      graph.colorScaleName = "orange";
    }
    if (G.drawFixedPoints && G.drawsparsenet) {
      graph.colorScaleName = "blueRed";
    }
    myDiv = document.getElementById("parent-image");
    myDiv.innerHTML = "";
    $("#sparsenet-info-menu").html("");
    if (graph.vertices.layout)
      for (let i = 0; i < graph.vertices.layout.length; i++) {
        if (!graph.vertices.layout[i]) throw Error();
      }
    while (graph.representation) graph = G.getGraph(graph.dataPath + "/metagraphs/" + graph.representation); //only use the real displayed top level graph
    graph.snPathsTemp = [];
    graph.snPathsNeigbors = [];
    graph.trackIndex = 0;
    let vc = graph.vertices.length;
    let options2 = null;
    if (vc > G.controls.get("approximateSNThreshold", 1)) {
      options = {
        variant: "approximate"
      };
    } //todo: the exact SN code has a problem
    let data = {};
    if ((!graph.dataPath) || graph.isCustom) {
      data.data = this.getGraphVerticesAndEdges(graph);
    }
    if (graph.dataPath && (graph.dataPath.indexOf("custom") == -1)) {
      data.dataPath = graph.dataPath;
    }

    if (options2) data.options = options2;
    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    if (G.drawsparsenet) {
      if (!graph.snPaths) {
        G.messaging.requestCustomData("sparsenet", data, (result) => {
          if (result && result.length > 0) {
            graph.snPaths = result;
            graph.snPathsColor = graph.snPaths.map((path, i) => {
              if (i == 0) return redColor;
              let c = new THREE.Color();
              c.setHSL(((i / (path.length)) * 0.7 + 0.1), 1, 0.5);
              return c;
            })
            graph.snPathsTemp.push(graph.snPaths.slice(0, 1));
            let paths = G.graph.snPathsTemp;
            let snPathEdgeMap = {};
            for (let pathID = 0; pathID < paths.length; pathID++) {
              let path = paths[pathID].flat(1);
              for (let i = 0; i < path.length; i++) {
                let tempID = path[i];
                let vertex = G.graph.vertices[tempID];
                if (i > 0) {
                  snPathEdgeMap[G.graph.vertices.edges[tempID][path[i - 1]]] = pathID;
                }
              }
            }
            G.graph.edgePaths = snPathEdgeMap;
            graph.snPathsFlat = graph.snPaths.slice(0, 1).flat(1);
            if (graph.snPaths) {
              getE("showing-paths").textContent = "" + 1 + " sparsenet paths out of " + graph.snPaths.length;
            }
          } else {
            G.addLog("invalid sparsenet result");
          }
        });
      }
    }
    if (graph.vertices.id.isAbstract) {
      console.log("warning: showing abstract graph");
      return;
    }
    if (graph.dataPath && graph.vertices.length > 0 && (graph.vertices.layout === undefined) && (!graph.isCustom)) { //don't load layout for abstract top level
      await d3.json("datasets/" + graph.dataPath + "/layout.json.gz").then((layout) => {
        if (!Array.isArray(layout)) {
          if (layout == null) {} else {
            console.log("error: precomputed layout invalid");
            console.log(layout);
          }
        } else {
          if (layout) {
            G.addLog("using precomputed layout");
          }
          if (Array.isArray(layout[0])) {
            //make sure the number of items is the same as the vertex count, in case the graph changed
            if (layout[0].length > graph.vertices.length) {
              layout = layout[0].slice(0, graph.vertices.length);
            }
            while (layout[0].length < graph.vertices.length) {
              layout[0].push(new THREE.Vector3())
            }
            for (let i = 0; i < layout[0].length; i++) {
              if (!layout[0][i]) throw Error();
            }
            graph.vertices.addProperty("layout", null, layout[0]);
            if (Array.isArray(layout[1]))
              graph.savedNodes = layout[1];
            if (Array.isArray(layout[2]) || Array.isArray(Object.keys(layout[2])))
              graph.savedLinks = layout[2];
            if (Array.isArray(layout[3]))
              graph.explored = layout[3];
          } else {
            if (layout) {
              G.addLog("using precomputed layout");
            }
            //make sure the number of items is the same as the vertex count, in case the graph changed
            if (layout.length > graph.vertices.length) {
              layout = layout.slice(0, graph.vertices.length);
            }
            while (layout.length < graph.vertices.length) {
              layout.push(new THREE.Vector3())
            }
            for (let i = 0; i < layout.length; i++) {
              if (!layout[i]) throw Error();
            }
            graph.vertices.addProperty("layout", null, layout);
          }
        }


      });
      annpath = "";
      if (G.graph.wholeGraph) {
        annpath = G.graph.wholeGraph;
      } else {
        annpath = G.graph.dataPath;
      }
      await d3.json("datasets/" + annpath + "/annotations.json.gz").then((annotations) => {

        if (annotations) {
          if (annotations == "") {
            graph.annotatedVertices = {};
            this.refreshStyles(true, true);
          }
          $('#textBox').each(function() {
            this.contentEditable = true;
          });
          graph.annotations = annotations;
          document.getElementById('textBox').innerHTML = annotations;
        } else {
          document.getElementById('textBox').innerHTML = "";
          graph.annotations = "";
          graph.annotatedVertices = {};
        }

      });
      await d3.json("datasets/" + annpath + "/annotationsdatetime.json.gz").then((annotationsdatetime) => {

        if (annotationsdatetime) {
          graph.annotationEditTime = annotationsdatetime;
          document.getElementById('lastSaved').innerHTML = annotationsdatetime;
        }

      });
      await d3.json("datasets/" + graph.dataPath + "/annotatedVertices.json.gz").then((annotatedVertices) => {

        if (annotatedVertices) {
          graph.annotatedVertices = annotatedVertices;

        } else {
          graph.annotatedVertices = {};
        }

      });

      //either load the layout or know it's missing
    }
    this.beforeDisplayGraph(graph);

    // subgraph = Algs.getInducedSubgraph(graph, graph.snPaths, this.indexCount);
    // this.indexCount += 10;
    // if(graph.wholeGraph == undefined) {
    //		 graph.wholeGraph = Object.cast(JSON.parse(JSON.stringify(graph)), Graph);
    // }
    // graph.vertices = subgraph.vertices;
    // graph.edges = subgraph.edges;
    // graph.vertexMap = subgraph.vertexMap;
    // graph.vertices = subgraph.vertices;
    this.step = 0;
    this.timer = 0; //reset the time since simulation started
    if ((this.graph != graph) && (!options.noMoveCamera)) G.resetView(); //exclude expansion in-place
    this.graph = graph;

    this.beforeDisplayingGraphLayer(graph);
    if (graph.annotations && graph.annotations == "")
      graph.annotatedVertices = {};

    if (G.drawFixedPoints) {
      graph.heightProperty = "fixedPointLayer";
    }
    let heightPropertyName = graph.heightProperty,
      heightPropertyType;
    if (heightPropertyName) {
      if (heightPropertyName in graph.edges.properties) {
        heightPropertyType = "edges"; //??!!
        if (graph.heightPropertyTypeHint) {
          heightPropertyType = graph.heightPropertyTypeHint;
        }
      } else heightPropertyType = "vertices";
    }
    graph.heightPropertyType = heightPropertyType;
    graph.heightPropertyName = heightPropertyName;
    let results = this.getObjectsFromHierarchy(graph);
    if (graph.savedNodes && graph.savedLinks) {
      graph.nodes.size = graph.savedNodes;
      graph.links.brightness = graph.savedLinks;
    }
    Object.assign(this, results); //model etc are now defined globally on the view module
    this.setModifiersTarget(this.model); //the global modifiers are different from local ones;

    this.applyTemplates(this.model, true); //subviews are applied on each graph and do not contain attrs and uniforms, but the global template is applied on the global model (and we use that for attrs and uniforms)
    G.subview.setModifiersTarget(this.graph); //target the top graph by default
    var simulationUniforms = {
      timer: {
        type: "f",
        value: 0
      },
    };
    for (let uniformName in this.sharedUniforms) {
      let uniform = this.sharedUniforms[uniformName]; //every one must be created, even dynamic ones
      uniform.needsUpdate = true;
      if (uniform.noSimulate) continue; //must skip the ones that cannot be used in the simulation, ie its own output
      this.initUniform(uniform, this.model);
      this.updateUniform(uniform, simulationUniforms, uniformName, this.model);
    }
    await this.loadShaders();

    this.refreshUniforms(true);
    this.refreshAttrs(true); //they do not use the textureSize constant

    var textureSize = Math.max(1, Math.ceil(Math.sqrt(this.model.nodes.length)));
    this.simulationTextureSize = textureSize; //stupid bug: using graph.nodes.length like before we had a model, would break the simulation but only when subgraphs increase the texture size!
    //but the simulation shader uses the constant so we have to set it before creating the simulation.
    let vertexShader = this.getVertexShader("simulation"),
      fragmentShader = this.getFragmentShader("simulation");
    var sim = new THREE.Simulation(G.renderer, G.view.templates.nodes.object3d.geometry.attributes.initialPosition.array, simulationUniforms, vertexShader, fragmentShader);
    this.simulation = sim;
    this.simulationShader = sim.simulationShader;

    G.cameraControls.setTarget(null); //stop zooming into the old node
    G.cameraControls.lastZoomTime = new Date().getTime(); //prevent immediate zoom-out due to camera position

    if (this.model.nodes.length > 20000) {
      G.simulationRunning = false;
    } else {
      G.simulationRunning = true;
    }

    this.clock.getDelta();
    this.animateOnce(); //it only animates one frame, and doesn't create an (extra) requestAnimationFrame loop for itself. without this, between load graph and the next animate() frame, a mouse event may happen and get invalid positions.
  },
  step: 0,
  simulationStarted: false,
  animateOnce: function animateOnce() {
    G.stats.begin();

    if (!this.simulationShader) {
      //G.composer.render(delta);
      G.renderer.render(G.scene, G.camera);
      return;
    }
    if (!this.model || !this.model.nodes) {
      return;
    }

    var delta = this.clock.getDelta();
    this.timer += delta;
    this.simulationShader.uniforms.timer.value = this.timer;
    if (G.simulationRunning) {
      this.simulation.nextStep();
      this.positionsChanged = true;
      if (!this.simulationStarted) {
        this.simulationStarted = true;
        console.log("started simulation");
      }
    }
    this.refreshStyles();
    if (this.syncing) this.getPositions();
    G.cameraControls.update();
    //G.composer.render(delta);
    G.renderer.render(G.scene, G.camera);
    G.broadcast("animateFrame", this.graph, delta);
    G.stats.end();
  },
  animate: function animate(timestamp) {
    requestAnimationFrame(this.animateBound);
    this.animateOnce();
  },
  timer: 0,
  //data inputs
  sharedUniforms: {
    timer: {
      value: () => G.view.timer,
      dynamic: true
    },
    tPositions: {
      value: () => G.view.simulation ? G.view.simulation.in.texture : null,
      dynamic: true,
      noSimulate: true
    }, //why this must not be set for the simulation?
    tPositionsPrev: {
      value: () => G.view.simulation ? G.view.simulation.in_prev.texture : null,
      dynamic: true,
      noSimulate: true
    },
    layoutData: {
      value: () => {
        return G.view.simulation ? G.view.simulation.out.texture : null;
      },
      dynamic: true,
      noSimulate: true
    },
    layoutDataSize: {
      value: () => G.view.simulationTextureSize,
      dynamic: true,
    },
    nodeData: {
      isArray: true,
      value: (model) => {
        let nodes = model.nodes,
          nodeHeights = nodes.height,
          nodeCharges = nodes.charge;
        let result = [];
        for (let i = 0; i < nodes.length; i++) {
          result[i] = {
            x: nodeHeights[i],
            y: nodeCharges[i], //0,//node.layerSetID, //should replace with correct values
            z: nodes.original[i], //node.original,//note: we can get the original ID inside each subview, but the limitation is that cross-subgraph alignment (such as in layer/cc metagraphs) doesn't work unless we have a global vertex intrinsic identity no matter what subgraph it's in
            w: nodes.subgraphLevel[i], //was node.ccSize but not needed now
          };
        }; //todo: 1. better ways to pass in individual float values; 2. to get accurate "original" info for all graphs, we must know which larger graph each subgraph is part of. I think it's OK to pretend a metanode is different from all other real nodes - but can a metanode have meaningful layer set information? for now both original and layer set are disabled?
        return result;
      }
    },
    nodeColorData: {
      isArray: true,
      value: (model) => {
        let nodes = model.nodes;
        let colorValues = nodes.colorValue;
        let result = nodes.map((node, i, array) => {
          return {
            x: colorValues[i],
            y: 0,
            z: 0,
            w: 0
          };
        });
        return result;
      }
    },
    nodePriorityData: {
      isArray: true,
      value: (model) => {
        let nodes = model.nodes;
        let values = nodes.forceEffectiveness;
        let values2 = nodes.forcePriority;
        let result = nodes.map((node, i, array) => {
          return {
            x: values[i],
            y: values2[i],
            z: 0,
            w: 0
          };
        });
        return result;
      }
    },
    clusteringData: {
      isArray: true,
      value: (model) => {
        //map of all nodes to the node it's clustered to (if available)
        let nodes = model.nodes,
          clusterCenters = nodes.clusterCenter;
        let result = nodes.map((node, i) => {
          return {
            x: clusterCenters[i],
            y: ((clusterCenters[i] != null) ? 1 : 0)
          };
        });
        return result;
      }
    },
    metanodeData: {
      isArray: true,
      value: (model) => {
        //map of all nodes to the node it's clustered to (if available)
        let nodes = model.nodes,
          metanodeIDs = nodes.metanodeID;
        let result = [];
        for (let i = 0; i < nodes.length; i++) {
          result[i] = {
            x: metanodeIDs[i]
          };
          //return {x:node.clusterCenter,y:((node.clusterCenter!=null)?1:0)};
        };
        return result;
      }
    },
    nodePinData: {
      isArray: true,
      value: (model) => {
        let nodes = model.nodes,
          layout, pinned = nodes.pinned;
        let result = nodes.map((node, i) => {
          return {
            x: 0,
            y: 0,
            z: 0,
            w: (pinned[i] ? 1 : 0)
          }; //should we get the newest positions?
          //if(node.pinned){console.log("pinned "+node.id);}
          //return {x:node.x,y:node.y,z:node.z,w:(node.pinned?1:0)}
        });
        return result;
      }
    },
    nodeSelectionData: {
      isArray: true,
      value: (model) => {
        let nodes = model.nodes;
        let result = nodes.map((node, i, array) => {
          return {
            x: array.isSelected[i],
            y: 0,
            z: 0,
            w: 0
          };
          //the underlying selection and teh viisual styles should be local, but I think user selection (especially elastic window) and selection movement should only apply to the top level, or selection on a hierarchical graph would be very annoying
        });
        return result;
      }
    },
    nodeTargetRadiusData: { //now radius data has 3 components so we use another texture for angles. z is the max radius ( one way restriction)
      isArray: true,
      value: (model) => {
        let nodes = model.nodes;
        let result = nodes.map((node, i, array) => {
          return {
            x: array.targetRadius[i].x,
            y: array.targetRadius[i].y,
            z: array.targetRadius[i].z,
            w: 0
          };
        });
        return result;
      }
    },
    nodeTargetAnglesData: {
      isArray: true,
      value: (model) => {
        let nodes = model.nodes;
        let result = nodes.map((node, i, array) => {
          return {
            x: array.targetAngles[i].x,
            y: array.targetAngles[i].y,
            z: 0,
            w: 0
          };
        });
        return result;
      }
    },
    nodeMovement: {
      value: () => G.view.nodeMovement,
      dynamic: true,
    },
    nodeScreenTarget: {
      value: () => G.view.nodeScreenTarget,
      dynamic: true,
    },
    leftVector: {
      value: () => G.cameraControls.leftVector,
      dynamic: true,
    },
    forwardVector: {
      value: () => G.cameraControls.forwardVector,
      dynamic: true,
    },
    screenUpVector: {
      value: () => G.cameraControls.screenUpVector,
      dynamic: true,
    },
    screenWidth: {
      value: () => G.view.canvasWidth,
      dynamic: true,
    },
    screenHeight: {
      value: () => G.view.canvasHeight,
      dynamic: true,
    },
    mousePos: {
      value: () => G.mousePos,
      dynamic: true,
    },
    mouseShaderPos: {
      value: () => G.mouseShaderPos,
      dynamic: true,
    },
    mouseScreenPos: {
      value: () => G.mouseScreenPos,
      dynamic: true,
    },
    cameraProjectionMatrix: {
      value: () => G.camera.projectionMatrix,
      dynamic: true,
    },
    cameraMatrixWorld: {
      value: () => G.camera.matrixWorld,
      dynamic: true,
    },
    cameraMatrixWorldInverse: {
      value: () => G.camera.matrixWorldInverse,
      dynamic: true,
    },
    nodeModelViewMatrix: {
      value: () => G.view.templates.nodes.object3d.modelViewMatrix,
      dynamic: true,
    },
    edgeList: {
      isArray: true,
      value: (model) => {
        let links = model.links,
          linkSources = links.source,
          linkTargets = links.target,
          linkStrengths = links.strength,
          linkDistances = links.distance;
        let result = [];
        //edges may not be prepared for all nodes, especially subgraphs that were never loaded, just calculate the adjacency here
        let adjlist = model.nodes.adjlist;
        model.nodes.forEach((node, i) => {
          for (let j in adjlist[i]) {
            let linkID = adjlist[i][j],
              link = model.links[linkID];
            result.push({
              x: Number(j),
              y: linkStrengths[linkID],
              z: linkDistances[linkID]
            }); //,y:edge.strength,z:edge.distance
          }
        });
        return result;
      }
    },
    nodeCount: {
      value: (model) => model.nodes.length
    },
    edgeCount: {
      value: (model) => {
        let links = model.links;
        return links.length;
      }
    },
    nodeEdgeIndex: { //each node's starting index in the edge list
      isArray: true,
      value: (model) => {
        let count = 0;
        let adjlist = model.nodes.adjlist;
        let result = model.nodes.map((node, i) => {
          let temp = {
            x: count
          };
          for (let other in adjlist[i]) {
            count++;
          }
          return temp;
        });
        return result;
      }
    },
    layerCount: {
      value: (model) => model.heights.count,
    },
    logLayerHeightRatio: {
      value: (model) => {
        if (G.view.graph.layerHeightOption == "linear") return 0;
        return G.view.graph.showingInterlayers ? 0 : G.controls.get("logLayerHeightRatio");
      },
      dynamic: true
    },
    reverseHeight: {
      value: () => {
        return G.view.graph.showingInterlayers ? 1 : 0;
      },
      dynamic: true
    },
    linkForceEnabled: {
      value: () => G.controls.get("linkForceEnabled", true),
      dynamic: true
    }, //linkForceEnabled:{value:()=>G.linkForceEnabled,dynamic:true},
    activeLayerEnabled: {
      value: () => G.activeLayer != null,
      dynamic: true
    },
    activeLayer: {
      value: () => G.activeLayer,
      dynamic: true,
    },
    maxLayer: {
      value: () => arrayMax(G.view.model.nodes.height)
    }, //G.graph.nodeHeights

    radiusFactor: {
      value: () => G.controls.get("radiusFactor", 1),
      dynamic: true
    },

    radialLimit: {
      value: () => (7 * Math.pow(G.view.subviews[0].nodes.length, 0.5) + 5 * Math.pow(G.view.subviews[0].nodes.length, 0.33)),
      dynamic: true
    }, //hack - the idea is it reflects both size and how flat the graph is, but the numbers are not really justified
    radialLimitFactor: {
      value: () => G.controls.get("radialLimitFactor", 1),
      dynamic: true
    },
    heightFactor: {
      value: () => G.controls.get("heightFactor"),
      dynamic: true
    },
    nodeSizeFactor: {
      value: () => G.controls.get("nodeSizeFactor"),
      dynamic: true
    },
    linkBrightnessFactor: {
      value: () => G.controls.get("linkBrightnessFactor"),
      dynamic: true
    },
    linkDistanceFactor: {
      value: () => G.controls.get("linkDistanceFactor"),
      dynamic: true
    },
    linkStrengthFactor: {
      value: () => G.controls.get("linkStrengthFactor", 3),
      dynamic: true
    },
    clusteringStrengthFactor: {
      value: () => G.controls.get("clusteringStrengthFactor", 1),
      dynamic: true
    },
    alignmentStrengthFactor: {
      value: () => G.controls.get("alignmentStrengthFactor", 1),
      dynamic: true
    },
    angleTargetStrengthFactor: {
      value: () => G.controls.get("angleTargetStrengthFactor", 1),
      dynamic: true
    },
    camera: {
      value: () => G.camera.position,
      dynamic: true
    },

    linkLayerColorRatio: {
      value: () => clamp(G.controls.get("linkLayerColorRatio", 0.75), 0, 1),
      dynamic: true
    },
    lineLayerColorRatio: {
      value: () => clamp(G.controls.get("lineLayerColorRatio"), 0, 1),
      dynamic: true
    },

    colorList: {
      isArray: true,
      value: (model) => model.colors,
    },

    layerHeights: {
      isArray: true,
      value: (model) => { //assuming they are non negative, scale to between -0.5 and 0.5
        let max = model.heights.max,
          min = model.heights.min,
          layerCount = Object.keys(model.heights).length,
          logLayerHeightRatio = ((model.showingInterlayers || (model.layerHeightOption == "linear") || (layerCount == max + 1)) ? 0 : G.controls.get("logLayerHeightRatio"));
        if (getQueryVariable("linearHeight")) logLayerHeightRatio = 0;
        //allow forcing certain heights to be more separate from others? Or even just separate more at one height value (>=)?
        let separateAtHeight = undefined;
        if (getQueryVariable("separateAtHeight")) separateAtHeight = Number(unescape(getQueryVariable("separateAtHeight")).trim());
        if (isNaN(separateAtHeight)) {
          separateAtHeight = 0;
        } //console.log("separateAtHeight is "+separateAtHeight);
        let result = new Array(max + 1);
        for (let i = 0; i <= max; i++) {
          let temp;
          if (layerCount * max == 0.) temp = 0.5;
          else if (layerCount == 1 || max == min) temp = 0.5;
          else {
            let logH = (Math.log(i + 1.) - Math.log(min + 1)) / (Math.log(max + 1.) - Math.log(min + 1));
            let linearH = (i - min) / (max - min);
            temp = (1 - logLayerHeightRatio) * linearH + logLayerHeightRatio * logH;
          }
          if (G.view.graph.modifiers && G.view.graph.modifiers.dimming && (G.view.graph.modifiers.dimming.separate == true)) { //separateAtHeight
            let reverse = G.view.graph.modifiers.dimming.reverse;
            let threshold = G.view.graph.modifiers.dimming.threshold;
            if (reverse) {
              temp *= 0.5;
              if (i > threshold) temp += 0.5;
            } else {
              temp *= 0.5;
              if (i >= threshold) temp += 0.5;
            }

          }
          result[i] = (temp - 0.5) * 500.0 * Math.sqrt(Math.log(max + 1.));
        }
        return result;
      }
    }
  },
  "node texture": "dot",
  templates: {
    nodes: {
      object3dType: THREE.Points,
      priority: 2,
      selectionPriority: 1,
      properties: {
        metanodeID: { //global metanode ID in the list of nodes if applicable; if not, use -1
          isArray: true,
          value: (model) => {
            let result = [].concat.apply([], G.view.subviews.map((subview) => new Array(subview.nodes.length).fill((subview.globalMetanodeID !== undefined) ? subview.globalMetanodeID : -1)));
            return result;
          },
        },
        subgraphLevel: {
          isArray: true,
          value: (model) => [].concat.apply([], G.view.subviews.map((subview) => new Array(subview.nodes.length).fill(subview.subgraphLevel))),
        },
        original: { //note the limitation of lack of cross-subgraph alignment
          isArray: true,
          value: (model) => {
            let maxOriginal = 0; //it's not a node reference, and I don't want to assume the number of nodes is always not less than the numebr of vertices in a subview
            return [].concat.apply([], G.view.subviews.map((subview) => {
              let result = subview.nodes.map((node, i, nodes) => {
                return nodes.original[i] + maxOriginal; //offset by the existing max "global" original ID
              });
              if (subview.nodes.length > 0) maxOriginal += arrayMax(subview.nodes.original);
              return result;
            }));
          },
        },
        isExpanded: {
          value: (node, i, array) => array.isExpanded ? array.isExpanded[i] : 0,
        },
        isSelected: {
          value: (node, i, array) => array.isSelected ? array.isSelected[i] : 0,
        },
        isAnnotated: {
          value: (node, i, array) => array.isAnnotated ? array.isAnnotated[i] : 0,
        },
        isFullyDiscovered: {
          value: (node, i, array) => array.isFullyDiscovered ? array.isFullyDiscovered[i] : 0,
        },
        size: {
          value: (node, i, array) => {
            let result = array.size[i];
            if (array.isExpanded[i] && array.metanodeSize[i]) result += array.metanodeSize[i];
            if (G.view.graph.hoveredVertex && G.view.graph.showingEgonets && G.view.graph.hoveredVertex == i) {
              result = 1;
            }


            result = result * .3;
            return result;
          },
        },
        charge: {
          value: (node, i, array) => {
            let result = array.charge[i];
            if (array.isExpanded[i] && array.metanodeSize[i]) {
              result += array.metanodeSize[i] * array.metanodeSize[i];
            }
            result = result * Math.pow(0.5, array.subgraphLevel[i]);
            return result;
          },
        },
        height: {
          isArray: true,
          value: (model) => {
            let nodes = model.nodes,
              heights = nodes.height,
              metanodeIDs = nodes.metanodeID;
            nodes.forEach((node, i, array) => {
              let value = heights[i];
              if (value === undefined) {
                let metanodeID = metanodeIDs[i];
                value = heights[metanodeID];
              }
              if (value === undefined) {
                value = 0;
              } //undefined height is not allowed in the global view
              heights[i] = value; //if a metagraph has heights and a second-level metagraph does not, the inherited height will not propagate to the subgraph of a second level metanode if property updates are not immediately replacing. so we have to use an array
            });
            return heights;
          }
        },
        colorValue: {
          isArray: true,
          isAttribute: false, //this is only used for calculating the color index
          value: (model) => {
            let nodes = model.nodes,
              colorValues = nodes.colorValue,
              metanodeIDs = nodes.metanodeID;
            nodes.forEach((node, i, array) => {
              let value = colorValues[i];
              if (value == undefined) {
                let metanodeID = metanodeIDs[i];
                value = colorValues[metanodeID];
              }
              if (value == undefined) {
                value = -1;
                if (G.view.graph.colorScale) {
                  value = 0.5;
                }
              } //0 is the first color, -1 is a neutral color (grey?)
              if (G.view.graph.hoveredVertex && G.view.graph.showingEgonets && G.view.graph.hoveredVertex == i) {
                value = 2;
              }
              // if(G.view.graph.snWorms && [...new Set(Object.keys(G.view.graph.snWorms))].indexOf(i.toString())!=-1)
              //		 value = -1;
              colorValues[i] = value;
            });
            return colorValues;
          }
        },

        adjlist: {
          isArray: true,
          isAttribute: false, //for building some uniforms
          value: (model) => {
            let adjlist = [];
            for (let i = 0; i < model.nodes.length; i++) {
              adjlist[i] = {};
            }
            let linkSources = model.links.source,
              linkTargets = model.links.target;

            model.links.forEach((link, i) => {
              let s = linkSources[i],
                t = linkTargets[i];
              adjlist[s][t] = i;
              adjlist[t][s] = i;

            });

            return adjlist;
          },
        },
        initialPosition: {
          dimensions: 4,
          isArray: true, //help to set the position around its metanode center
          value: (model) => {
            let newLayout = new Array(model.nodes.length); //old layout is based on each subview, may be precomputed or randomized
            let metanodeIDs = model.nodes.metanodeID;
            model.nodes.forEach((node, i, nodes) => {
              var v = new THREE.Vector4();
              let result = G.view.getOriginalObject("nodes", i);
              let layout = result.graph.vertices.layout,
                vID = result.originalObjectID;
              /*if(layout){
              	if(!layout[vID]){throw Error();}
              	if(isNaN(layout[vID].x))throw Error();
              	v.x=layout[vID].x;v.y=layout[vID].y;v.z=layout[vID].z;
              }*/
              if (layout && layout[vID] && (!isNaN(layout[vID].x))) {
                v.x = layout[vID].x;
                v.y = layout[vID].y;
                v.z = layout[vID].z;
              } else {
                do {
                  v.x = THREE.Math.randFloatSpread(100);
                  v.y = THREE.Math.randFloatSpread(100);
                  v.z = THREE.Math.randFloatSpread(100);
                }
                while (v.length() > Math.random() * 50 + 50);
                let metanodeID = metanodeIDs[i];
                if (metanodeID != -1) {
                  let metavertexResult = G.view.getOriginalObject("nodes", metanodeID);
                  v.add(newLayout[metavertexResult.originalObjectID]);
                  //v.add(newLayout[metanodeID]);
                }
              }
              //note: add metanode position to random initial position - if there's a cached position, it sould not be modified. when I load a subgraph in place, its layout is not loaded from the server so the initial positions have to be random and we can add the metanode position. If it were loaded from teh server, we would have to differentiate between saved (presumably origin-centered) layouts and cached (possibly metanode-centered) layouts.
              v.w = 1; //would be 0 for extra space that correspond to no nodes
              newLayout[i] = v;
            });
            return newLayout;
          },
        },
        position: {
          dimensions: 3,
          perObject: true,
          value: ((node, i) => {
            let v = new THREE.Vector3();
            v.x = i;
            return v;
          }), //now the data items cannot be shared, must create all vectors.
        },
        //brightness:{value:(node)=>1},
        customColor: {
          dimensions: 3,
          value: (node, i, array) => (array.color ? (array.color[i] || whiteColor) : whiteColor)
        },
        usingCustomColor: {
          value: (node, i, array) => ((array.color && array.color[i]) ? 1 : 0)
        },
      },

      uniforms: { //shared ones are automatically added
        t: {
          type: "t",
          value: () => G.view.textures[G.view["node texture"]]
        },
        pointSize: {
          type: "f",
          value: function() {
            return (250 / Math.log2(16 + this.simulationTextureSize))
          }
        },
        layerColorRatio: {
          type: "f",
          value: function() {
            return G.nodeLayerColorRatio
          },
          dynamic: true
        },
      },
      shader: "nodes",
      getObjectAtPos: function(pos) {
        let buffer = G.view.getPositions(),
          vec = new THREE.Vector3(),
          tolerance = 0.03; //ratio of the screen size
        let bestDist = Infinity,
          bestObjID = null,
          bestScreenPos = new THREE.Vector2(); //todo: shouldn't the nodes at the front have priority, not just considering which one's center is closest?
        //let up=-Infinity,down=Infinity,right=-Infinity,left=Infinity;//debug bounding box
        //debug weird links between different layers:
        let map = {};
        let nodes = G.view.model.nodes;
        let matrixWorld = G.view.templates.nodes.object3d.matrixWorld;
        for (let i = 0, i4 = 0; i < nodes.length; i++, i4 += 4) {
          let node = nodes[i];
          if (nodes.size[i] == 0) continue; //skip invisible nodes
          vec.x = buffer[i4];
          vec.y = buffer[i4 + 1];
          vec.z = buffer[i4 + 2];
          let screenPos = vec.applyMatrix4(matrixWorld).project(G.camera);
          let dx = screenPos.x - pos.x,
            dy = screenPos.y - pos.y,
            dist = Math.sqrt(dx * dx + dy * dy);
          //if((distToCamera>G.camera.far)||(distToCamera<G.camera.near)){continue;}
          if ((dist < tolerance) && (dist < bestDist)) {
            bestDist = dist;
            bestObjID = i;
            bestScreenPos.copy(screenPos);
          }
        }
        if (G.DEBUG) console.log(map);
        return bestObjID;
      }
    },

    links: {
      object3dType: THREE.Mesh, //the array value is set elsewhere
      properties: {
        subgraphLevel: { //currently I'm going to make the adjustments directly in the shader, making them thinner and shorter according to which level of subgraph they are in. note: simple linear scaling might be a bad idea here, because the different subgraph values would skew the range and average.
          isArray: true,
          value: (model) => {
            let links = model.links;
            let nodes = model.nodes;
            let nodeSubgraphLevels = nodes.subgraphLevel;
            return links.map((link, i) => nodeSubgraphLevels[links.source[i]]); //todo: later would we have cross-subgraph edges??
          }
        },
        colorIndex: {
          isArray: true,
          value: (model) => {
            let linkColorValues = model.links.colorValue; //todo:should make it work for all objects?
            //has model.colorIndexMap
            return linkColorValues.map((v) => {
              if (v == -1) return -1;
              else return model.colorIndexMap[v]
            }); //-1 means interpolate
          }
        },

        customColor: { //put here to avoid having to specify these in subview modifier effects
          dimensions: 3,
          value: (link, i, array) => {
            if (G.view.graph.egonet && Object.keys(G.graph.egonet).length > 0 && G.graph.showingEgonets) {
              let source = G.view.graph.edges.source[i],
                target = G.view.graph.edges.target[i];
              if (G.view.graph.egonet && Object.keys(G.graph.egonet).length > 0) {
                if (Object.keys(G.graph.egonet.vertexMap).indexOf(source.toString()) != -1 && Object.keys(G.graph.egonet.vertexMap).indexOf(target.toString()) != -1) {
                  return redColor;
                }
              }
            }
            if ((array.color[i])) {
              return array.color[i];
            } else {
              return whiteColor;
            }

          },
        },
        usingCustomColor: {
          value: (link, i, array) => {
            return ((array.color[i] != null) ? 1 : 0);
          }
        },
        position: {
          dimensions: 3,
          value: (d, i, array) => {
            var v = new THREE.Vector3();
            v.x = array.source[i];
            v.y = array.target[i];
            v.z = 0;
            return v;
          },
        },
        coord: {
          dimensions: 3,
          perPoint: true,
          value: quadCoordFunc, //this reuse is OK because it's the same value for all
        },
      },
      pointsPerObject: 6,
      uniforms: {
        brightnessFactor: {
          value: () => G.controls.get("snlinkBrightnessFactor"),
          dynamic: true
        },
        thicknessFactor: {
          value: () => G.controls.get("linkThicknessFactor", 0.2),
          dynamic: true
        }
      },
      shader: "links",
    },
    colors: {
      //a palette of colors based on the color scale. assuming the colors are continuous, there only need to be so many colors in the palette, and every obejct can use their own color values without having to worry about color indices. (assuming everything has the same color scale. if not, then we may need an array of textures or some clever mapping of color values...)
      value: (model) => {
        let colorList = [],
          colorValues = [];
        let scale = colorScale; //G.colorScale
        let graph = G.view.graph;

        if (graph.heightProperty == "wave" || graph.heightProperty == "originalWaveLevel" || graph.embeddedWaveMap || graph.embeddedLevelMap) {
          scale = G.colorScales.lightBlueRed;
        }
        if (graph.colorScaleName) {
          scale = G.colorScales[G.view.graph.colorScaleName];
        }
        if (graph.colorScale) {
          let [begin, end] = graph.colorScale.split(":");
          G.colorScales.dynamic = d3.scaleSequential(d3.interpolateHslLong(begin, end)),
            scale = G.colorScales.dynamic;
        }
        let colorCount = 256;
        for (let i = 0; i < colorCount; i++) {
          let colorValue = i / colorCount;
          let color = new THREE.Color();
          color.setStyle(scale(colorValue));
          colorList[i] = color;
          colorValues[i] = colorValue;
        }
        model.colorValues = colorValues;
        return colorList;
      }
    },
    heights: {
      //a map of all different (integer, discrete) logical heights that appear in the view, like the old "layers". All model objects can have heights and the scaling is applied to the range of all of them, and all objects that have heights should use the heights uniform for that (note: if the max height is very large the uniform texture could be much larger than it has to be, but I don't think an index of heights is needed now.)
      value: (model) => {
        let heights = {};
        //if(model.nodes.length==0){for(let l in G.graph.layers){heights[l]=G.graph.layers[l];}}
        //??//special case for top-level abstract graphs

        for (let objName in model.objects) {
          let dataObj = model[objName];
          if (!dataObj.height) continue;
          if (dataObj.length == 0) continue;
          let objectHeights = dataObj.height;
          let maxHeight = -Infinity,
            minHeight = Infinity;
          objectHeights.forEach((height, index) => {
            //if(Number.isNaN(height))throw Error();
            if (height in heights == false) {
              if (height === null) return; //throw Error();
              if (height > maxHeight) maxHeight = height;
              if (height < minHeight) minHeight = height;
              heights[height] = {
                v: 0,
                e: 0
              };
            }
            heights[height].v++;
          });
          //console.log("height range for "+objName+": "+minHeight+", "+maxHeight);
        }
        /*
        let linkSources=model.links.source,linkTargets=model.links.target;
        model.links.forEach((link,index)=>{	//when should we count edges taht only have one side in it?
        	//if(Number.isNaN(edge.layer))throw Error();
        	let sl=nodeHeights[linkSources[index]],tl=nodeHeights[linkTargets[index]],l;
        	if(sl==tl){
        		heights[sl].e++;
        		heights[sl].links.push(link);
        	}
        });
        */

        let heightsList = Object.keys(heights).map((n) => Number(n));
        let max = arrayMax(heightsList);
        if (max == -Infinity) max = 0;
        addHiddenProperty(heights, "max", max);
        let min = arrayMin(heightsList);
        if (min == Infinity) min = 0;
        addHiddenProperty(heights, "min", min);
        addHiddenProperty(heights, "count", heightsList.length);
        return heights;
      }
    },
    lines: {
      object3dType: THREE.Mesh,
      properties: {
        position: {
          dimensions: 3,
          value: (line, i, array) => {
            var v = new THREE.Vector3();
            v.x = array.source[i];
            v.y = array.target[i];
            return v;
          },
        },
        coord: {
          dimensions: 3,
          value: quadCoordFunc,
          perPoint: true,
        },
      },
      pointsPerObject: 6,
      uniforms: {
        brightnessFactor: {
          value: () => G.controls.get("lineBrightnessFactor", 0.2),
          dynamic: true
        },
        thicknessFactor: {
          value: () => G.controls.get("lineThicknessFactor", 0.4),
          dynamic: true
        }
      },
      shader: "lines",
      //shaderParams:{},
    },
    waveLayers: {
      priority: 3,
      object3dType: THREE.Mesh,
      properties: {
        lineLength: {
          value: (d) => Math.sqrt(d.v) * 10 //Math.log(v.v+0.5)
        },
        position: {
          dimensions: 3,
          value: (d, i, array) => {
            var v = new THREE.Vector3();
            v.x = array.nodeID[i];
            v.y = d.layerInVertex;
            return v;
          }
        },
      },
      pointsPerObject: 6,
      uniforms: {},
      shader: "waveLayers",
      getObjectAtPos: function(pos) {
        //if(G.graph.vertexCount>1)return null;//only allow clicking when in the one wave view
        let buffer = G.view.getPositions(),
          vec = new THREE.Vector3(),
          tolerance = 0.03; //ratio of the screen size
        let p1 = new THREE.Vector2(),
          p2 = new THREE.Vector2(),
          p3 = new THREE.Vector2(),
          p4 = new THREE.Vector2(),
          point = new THREE.Vector2().copy(pos);
        let nodePos = new THREE.Vector3(),
          eye = new THREE.Vector3(),
          horizontal = new THREE.Vector3(),
          vertical = new THREE.Vector3();
        let worldUp = new THREE.Vector3(0, 0, 1),
          tempPos = new THREE.Vector3();
        let bestDist = Infinity,
          bestObjID = null,
          bestScreenPos = new THREE.Vector2();
        let waveLayers = G.view.model.waveLayers; //G.view.templates.waveLayers.dataCache;
        let shape = new THREE.Vector2();
        for (let i = 0; i < waveLayers.length; i++) {
          let layerObj = waveLayers[i]; //{nodeID:nodeID,layerInVertex:j};
          let i4 = layerObj.nodeID * 4;
          vec.x = buffer[i4];
          vec.y = buffer[i4 + 1];
          vec.z = buffer[i4 + 2];
          //for now just pick the closest layer, without calculating which ellipse is clicked?
          //for now just pick the closest layer, without calculating which ellipse is clicked?
          //shape.x and shape.y are length of half axes
          nodePos.copy(vec);
          nodePos.z -= layerObj.layerInVertex * 5; //nodePos.z-=position.y*5.;//y is layerInVertex
          eye.copy(G.camera.position).addScaledVector(nodePos, -1); //vec3 eye=camera-nodePos;
          shape.x = Math.sqrt(layerObj.v) * 10;
          shape.y = Math.max(0.07, (2 * layerObj.e / (layerObj.v * layerObj.v))) * shape.x;
          horizontal.copy(worldUp).cross(eye).normalize().multiplyScalar(0.5 * shape.x); //vec3 horizontal=normalize(cross(worldUp,eye))/2.;//*10.;
          vertical.copy(horizontal).cross(worldUp).normalize().multiplyScalar(0.5 * shape.y);; //vec3 vertical=normalize(cross(worldUp,horizontal))/2.;//*10.;
          //vec3 up=normalize(cross(horizontal,eye));
          tempPos.copy(nodePos).addScaledVector(horizontal, 1).addScaledVector(vertical, 1).applyMatrix4(G.view.templates.nodes.object3d.matrixWorld).project(G.camera);
          p1.copy(tempPos);
          tempPos.copy(nodePos).addScaledVector(horizontal, 1).addScaledVector(vertical, -1).applyMatrix4(G.view.templates.nodes.object3d.matrixWorld).project(G.camera);
          p2.copy(tempPos);
          tempPos.copy(nodePos).addScaledVector(horizontal, -1).addScaledVector(vertical, -1).applyMatrix4(G.view.templates.nodes.object3d.matrixWorld).project(G.camera);
          p3.copy(tempPos);
          tempPos.copy(nodePos).addScaledVector(horizontal, -1).addScaledVector(vertical, 1).applyMatrix4(G.view.templates.nodes.object3d.matrixWorld).project(G.camera);
          p4.copy(tempPos);

          let result = pointInPolygon(point, [p1, p2, p3, p4]);
          //let screenPos = vec.applyMatrix4(G.view.templates.nodes.object3d.matrixWorld).project(G.camera);
          //let dx=screenPos.x-pos.x,dy=screenPos.y-pos.y,dist=Math.sqrt(dx*dx+dy*dy);

          if (result) {
            //console.log("clicked "+pos.x+","+pos.y+" inside layer "+layerObj.layerInVertex+" polygon: ("+p1.x+","+p1.y+") "+"("+p2.x+","+p2.y+") "+"("+p3.x+","+p3.y+") "+"("+p4.x+","+p4.y+") ");
            bestObjID = i;
          }
        }
        return bestObjID;
      },
      onrightclick: function() {

      },
    },
    waveInterlayers: {
      priority: 2,
      object3dType: THREE.Mesh,
      properties: {
        position: {
          dimensions: 3,
          value: (d, i, array) => {
            var v = new THREE.Vector3();
            v.x = array.nodeID[i];
            v.y = d.sourceLayer;
            v.z = d.targetLayer;
            return v;
          },
        },
      },
      pointsPerObject: 6,
      uniforms: {},
      shader: "waveInterlayers",
    },

    collapsedRings: {
      object3dType: THREE.Mesh,
      pointsPerObject: 6,
      properties: {
        position: {
          dimensions: 3,
          value: (d, i, array) => {
            var v = new THREE.Vector3();
            return v;
          },
        },
      },

      getDescription: function(ring, ringID, rings) {
        if (ring.isGlobal) {
          return "Global CC bucket ring " + ringID + ", |V|:" + ring.totalV + ", |E|:" + ring.totalE + ", # CCs: " + ring.CCs.length;
        } else {
          return "Local ring " + ringID + " of vertices of degree " + ring.degree + " in CC " + ring.originalCC + ", |V|: " + ring.totalV;
          //{isLocal:true,originalCC:ccID,center:vMap[ccRecord.center],maxDegree:maxDegree,degree:Number(degree),originalCCSize:ccRecord["|V|"],vertices:localDegrees[degree],totalV:totalV,prevV:prevV,vertexRatio:totalV/ccRecord["|V|"],prevVertexRatio:prevV/ccRecord["|V|"]}
        }
        //{isGlobal:true,originalCC:undefined,center:undefined,maxV:maxV,minV:minV,totalV:totalVertexCount,totalE:totalEdgeCount,prevV:previousVertexCount,vertices:vertices,CCs:bucket,vertexRatio:totalVertexCount/vertexCount,prevVertexRatio:previousVertexCount/vertexCount}

      },
      getObjectAtPos: function(pos) {
        let buffer = G.view.getPositions(),
          vec = new THREE.Vector3();
        let rings = G.view.model.collapsedRings; //center, isGlobal, maxRadius,minRadius,
        let globalRadiusFactor = G.view.sharedUniforms.radialLimit.valueCache * G.view.sharedUniforms.radialLimitFactor.dataCache;
        let ringCenter = new THREE.Vector3();
        let intersection = new THREE.Vector3();
        G.view.raycaster.setFromCamera(pos, G.camera);
        let ray = G.view.raycaster.ray;
        if (ray.direction.z == 0) return null; //in case of division by 0
        let bestObjID = null;
        let bestMargin = 0; //rings can be very thin so a fixed minimum margin is not good
        for (let i = 0; i < rings.length; i++) {
          let ring = rings[i],
            ringRadiusFactor, maxRadius, minRadius;; //
          if (ring.isGlobal) {
            ringRadiusFactor = globalRadiusFactor * 3;
            ringCenter.x = 0;
            ringCenter.y = 0;
            ringCenter.z = 0;
          } else {
            let i4 = rings.center[i] * 4; //ring.center is the original, not offseted index
            ringCenter.x = buffer[i4];
            ringCenter.y = buffer[i4 + 1];
            ringCenter.z = buffer[i4 + 2];
            ringRadiusFactor = 25 * rings.radiusMultiplier[i];
          }
          maxRadius = rings.maxRadius[i];
          minRadius = rings.minRadius[i];
          //calculate the intersection point of the mouse-camera ray and the horizontal plane that the ring is on
          intersection.copy(ray.origin);
          let multiplier = (ringCenter.z - ray.origin.z) / ray.direction.z;
          intersection.addScaledVector(ray.direction, multiplier);
          let radialDistance = intersection.distanceTo(ringCenter);
          let radialRatio = radialDistance / ringRadiusFactor;
          if (maxRadius > radialRatio && radialRatio > minRadius) {
            let margin = Math.min(Math.abs(maxRadius - radialRatio), Math.abs(radialRatio - minRadius));
            if (margin > bestMargin) {
              bestMargin = margin;
              bestObjID = i;
            }
          }
        }
        return bestObjID;
      },
      uniforms: {},
      shader: "collapsedRings",
    },
    waveArcs: {
      object3dType: THREE.Mesh,
      priority: 3,
      pointsPerObject: 6,
      properties: {},
      getDescription: function(arc, arcID, arcs) {
        return "wave " + arc.waveID;
      },
      getObjectAtPos: function(pos) {
        let buffer = G.view.getPositions(),
          vec = new THREE.Vector3();
        let arcs = G.view.model.waveArcs;
        let center = new THREE.Vector3();
        let intersection = new THREE.Vector3();
        G.view.raycaster.setFromCamera(pos, G.camera);
        let ray = G.view.raycaster.ray;
        if (ray.direction.z == 0) return null; //in case of division by 0
        let bestObjID = null;
        let bestMargin = 0; //rings can be very thin so a fixed minimum margin is not good
        let pi = Math.PI;
        for (let i = 0; i < arcs.length; i++) {
          let maxRadius = arcs.maxRadius[i],
            minRadius = maxRadius - arcs.thickness[i],
            centerAngle = arcs.centerAngle[i],
            angleWidth = arcs.angleWidth[i];
          center.z = arcs.height[i];
          //calculate the intersection point of the mouse-camera ray and the horizontal plane that the arc is on
          intersection.copy(ray.origin);
          let multiplier = (center.z - ray.origin.z) / ray.direction.z;
          intersection.addScaledVector(ray.direction, multiplier);
          let radialDistance = intersection.distanceTo(center);
          let radialRatio = radialDistance;

          if (maxRadius > radialRatio && radialRatio > minRadius) {
            let margin1 = Math.min(Math.abs(maxRadius - radialRatio), Math.abs(radialRatio - minRadius));
            let thisAngle = Math.atan2(intersection.x, intersection.y);
            let angleDist1 = mod(thisAngle - centerAngle, pi * 2.);
            let angleDist2 = mod(thisAngle - centerAngle, pi * 2.) - pi * 2.;
            let angleDist = Math.min(Math.abs(angleDist1), abs(angleDist2)); //mod 2pi?
            let angleDelta = angleDist1;
            if (Math.abs(angleDist1) > Math.abs(angleDist2)) {
              angleDelta = angleDist2;
            }
            let margin2 = 1 - angleDist / angleWidth;
            let margin = Math.min(margin1, margin2);
            if (margin > bestMargin) {
              bestMargin = margin;
              bestObjID = i;
            }
          }
        }
        return bestObjID;
      },
      uniforms: {},
      shader: "waveArcs",
    },
    waveArcLinks: {
      object3dType: THREE.Mesh,
      priority: 2,
      pointsPerObject: 6,
      properties: {},
      uniforms: {
        brightnessFactor: {
          value: () => G.controls.get("linkBrightnessFactor"),
          dynamic: true
        },
        thicknessFactor: {
          value: () => G.controls.get("linkThicknessFactor", 0.5),
          dynamic: true
        }
      },
      shader: "waveArcLinks",
    },
  },
  getObjectsFromGraph: function(graph) { //heightPropertyType can be tested as G.graph.heightPropertyType
    let result = {};
    if (!graph.isAbstract()) G.subview.applyTemplates(graph, true); //needs updating when eg.eight proeprty changes
    for (let name in G.subview.templates) {
      result[name] = graph[name]; //?graph[name]:new DataObject(name);
      if (!result[name]) {
        result[name] = new DataObject(name);
        for (let propName in G.subview.templates[name].properties) result[name].addProperty(propName);
      }
    }
    return result;
  },
  getObjectsFromHierarchy(graph) { //heightPropertyType,heightPropertyName are defined on the top level graph
    //try to reuse the old model object?
    let subviews = [];
    let queue = [];
    queue.push(graph);
    while (queue.length > 0) {
      let newGraph = queue.shift();
      let originalNewGraph = newGraph;
      while (newGraph.representation) newGraph = G.getGraph(newGraph.dataPath + "/metagraphs/" + newGraph.representation);
      //while(newGraph.representation)newGraph=newGraph.representation;
      let result = this.getObjectsFromGraph(newGraph);
      result.graph = newGraph;
      result.originalGraph = originalNewGraph;
      subviews.push(result);
      if (newGraph.isMetagraph) {
        for (let vID = 0; vID < newGraph.vertices.length; vID++) {
          let vs = newGraph.vertices;
          if (vs.isExpanded && vs.isExpanded[vID]) {
            //the subgraph is now accessed by its dataPath
            let path;
            if (newGraph.subgraphPrefix) {
              path = newGraph.subgraphPrefix + "/" + vs.id[vID];
              let subgraph = G.getGraph(path);
              subgraph.currentParent = newGraph.dataPath;
              subgraph.currentMetanodeID = vID;
              queue.push(subgraph);
            } else console.warn("no subgraph prefix");
          }
        }
      }
    }
    //now, put all the objects from different graphs into a consistent list
    let results = DataSet.concatDataSets(subviews, G.subview.templates); //{dataset:results,offsets:offsets}
    let offsets = results.offsets;
    let model = results.dataset;
    let graphMap = {}; //new Map();
    let graphList = [];
    for (let graphID = 0; graphID < subviews.length; graphID++) {
      let subview = subviews[graphID];
      let g = subview.graph;
      let offset = offsets[graphID];
      //graphMap.set(g,graphID);
      graphMap[g.dataPath] = graphID;
      graphList.push(g);
      let metanodeID = null,
        globalMetanodeID = null,
        subgraphLevel = 0;
      if (g.currentParent && (g != graph)) { //don't reference the parent of the current top graph
        let parentViewID = graphMap[g.currentParent]; //graphMap[g.parent];
        let parentView = subviews[parentViewID];
        metanodeID = g.currentMetanodeID;
        globalMetanodeID = metanodeID + offsets[parentViewID].nodes; //offset.nodes;
        subview.globalMetanodeID = globalMetanodeID;
        subview.metanodeID = metanodeID;
        subgraphLevel = parentView.subgraphLevel + 1;
      }
      subview.subgraphLevel = subgraphLevel;
      for (let name in subview) {
        if (subview[name] instanceof DataObject && name in offset) addHiddenProperty(subview[name], "offset", offset[name]);
      } //offset is the offset before this subview is added
    }
    if (graph.embeddedWaveMap || graph.embeddedLevelMap) model.layerHeightOption = "linear";
    return {
      subviews: subviews,
      model: model,
      offsets: offsets,
      graphList: graphList,
      graphMap: graphMap
    };
  },
  getOriginalObject: function(type, ID) {
    if (ID === undefined) {
      ID = type;
      type = "nodes";
    }
    let model = G.view.model;
    let graphList = G.view.graphList;
    let subviews = G.view.subviews;
    let offsets = G.view.offsets;
    let gID = 0,
      found = false;
    for (gID = 0; gID < graphList.length; gID++) {
      let graphObject = subviews[gID];
      let offset = offsets[gID];
      if (graphObject[type] && (offset[type] + graphObject[type].length > ID)) {
        found = true;
        break;
      }
    }
    if (!found) throw Error();
    let originalGraph = G.view.graphList[gID];
    let subview = G.view.subviews[gID];
    let offset = offsets[gID][type];
    let subviewObjectID = ID - offset;
    let originalObjectID, originalObject, originalObjectType = G.subview.templates[type].originalObjectType;
    if (originalObjectType) {
      originalObjectID = G.subview.templates[type].getOriginalObjectID(originalGraph, subviewObjectID);
      originalObject = originalGraph[originalObjectType][originalObjectID];
    } //some, eg. nodes and links, have original objects (one view objec has up to one original object. but one original object can have more than one view objects) and some do not, eg. levelDisks
    return {
      graph: originalGraph,
      globalViewObjectID: ID,
      subview: subview,
      subviewObjectID: subviewObjectID,
      originalObjectType: G.subview.templates[type].originalObjectType,
      originalObjectID: originalObjectID,
      originalObject: originalObject,
      originalObjects: originalGraph[originalObjectType]
    };
  },
  //most modifiers are moved to subview. modifier control code is now shared by all modules.
  onModifiersChanged: function() {
    this.refreshStyles(true, true);
  },
  modifiers: {
    nodeFilter: { //this may need to be global because we want to hide subgraphs as well
      params: {
        property: {
          value: "height",
          type: "select",
          options: ["height", "size", "subgraphLevel"], //note these proeprties belong to nodes, not vertices. should all vertex-based modifiers be in subview?
          func: () => {
            G.addLog("value range updated");
            G.view.refreshModifierControls("nodeFilter");
          },
        },
        threshold: {
          value: 0,
          type: "integer",
          min: (graph, params) => minPropertyValue(graph.nodes, params.property),
          max: (graph, params) => maxPropertyValue(graph.nodes, params.property),
        },
        reversed: {
          type: "boolean",
          value: false
        },
      },
      effects: {
        nodes: {
          size: [
            (data, oldValue, node, index, array) => {
              if (data.reversed) {
                if (getProperty(array, index, data.property) > data.threshold) return 0;
              } else {
                if (getProperty(array, index, data.property) < data.threshold) return 0;
              }

            },
          ]
        },
        links: {
          brightness: [
            (data, oldValue, link, index, array, model) => {
              let sID = array.source[index],
                tID = array.target[index];
              if (G.snHighlightPathNodesColor && G.snNodesColorByLabel && G.view.graph.snVertexPaths && G.view.graph.labelsByID[sID] && G.controls.getLabel(sID).includes("ATU")) {
                a = G.view.graph.getNeighbors(sID);
                first = false;
                second = false;
                for (let b in a) {
                  if (G.view.graph.labelsByID[a[b]] && G.controls.getLabel(a[b]).includes("TMI") && Object.keys(G.view.graph.snVertexPaths).indexOf(a[b]) != -1)
                    first = true;
                  if (G.view.graph.labelsByID[a[b]] && G.controls.getLabel(a[b]).includes("ETK") && Object.keys(G.view.graph.snVertexPaths).indexOf(a[b]) != -1)
                    second = true;

                }
                if (G.view.graph.labelsByID[sID] && first && second && G.view.graph.labelsByID && G.controls.getLabel(sID).includes("ATU") && (G.view.graph.labelsByID[tID] && G.controls.getLabel(tID).includes("TMI") || G.controls.getLabel(tID).includes("ETK"))) {
                  return 10;
                }
              }
              if (data.reversed) {
                if (getProperty(model.nodes, sID, data.property) > data.threshold) return 0;
                if (getProperty(model.nodes, tID, data.property) > data.threshold) return 0;
              } else {
                if (getProperty(model.nodes, sID, data.property) < data.threshold) return 0;
                if (getProperty(model.nodes, tID, data.property) < data.threshold) return 0;
              }

            }
          ],
        },
        lines: {
          brightness: [
            (data, oldValue, line, index, array, model) => {
              let sID = array.source[index],
                tID = array.target[index];
              if (data.reversed) {
                if (getProperty(model.nodes, sID, data.property) > data.threshold) return 0;
                if (getProperty(model.nodes, tID, data.property) > data.threshold) return 0;
              } else {
                if (getProperty(model.nodes, sID, data.property) < data.threshold) return 0;
                if (getProperty(model.nodes, tID, data.property) < data.threshold) return 0;
              }
            }
          ],
        }
      }
    },
  },

  //some helpers
  resizeCanvas: function resizeCanvas() {
    var w = G.canvasContainer.clientWidth;
    var h = G.canvasContainer.clientHeight;
    this.canvasWidth = w;
    this.canvasHeight = h;
    G.renderer.setSize(w, h);
    G.cameras.perspective.aspect = w / h;
    G.cameras.perspective.updateProjectionMatrix();
    let ortho = G.cameras.orthographic;
    ortho.left = window.innerWidth / -2;
    ortho.right = window.innerWidth / 2;
    ortho.top = window.innerHeight / -2;
    ortho.bottom = window.innerWidth / 2;
    ortho.updateProjectionMatrix();
    //G.effectFXAA.uniforms['resolution'].value.set(1 / (G.canvasContainer.clientWidth * dpr), 1 / (G.canvasContainer.clientHeight * dpr));
    //G.composer.setSize(G.canvasContainer.clientWidth * dpr, G.canvasContainer.clientHeight * dpr);
    G.renderer.setSize(G.canvasContainer.clientWidth, G.canvasContainer.clientHeight); // * dpr
  },
  getNodePos: function(nodeID) {
    //if((typeof node)!="object")node=G.graph.vArray[node];if(!node)return;
    let buffer = this.getPositions(),
      vec = new THREE.Vector3();
    let i = nodeID,
      i4 = i * 4;
    vec.x = buffer[i4];
    vec.y = buffer[i4 + 1];
    vec.z = buffer[i4 + 2];
    return vec;
  },
  getVerticesPos: function(allSubviews = false) {
    let buffer = this.getPositions(),
      g = this.graph,
      layouts = [];
    if (!g) return null;
    if (!buffer) return null;
    for (let gID = 0; gID < this.subviews.length; gID++) {
      let subview = this.subviews[gID];
      let graph = subview.graph;
      if (!graph.vertices.layout) {
        let layout = [];
        for (let i = 0; i < graph.vertices.length; i++) layout[i] = new THREE.Vector3();
        graph.vertices.addProperty("layout", null, layout);
      }
      let layout = graph.vertices.layout;
      let nodeOffset = this.offsets[gID].nodes;
      for (let i = 0; i < subview.nodes.length; i++) {
        let ID = i + nodeOffset;
        let vertexID = G.subview.templates.nodes.getOriginalObjectID(graph, i);
        //let node=this.model.nodes[ID];
        let i4 = ID * 4,
          vec = layout[vertexID];
        vec.x = buffer[i4];
        vec.y = buffer[i4 + 1];
        vec.z = buffer[i4 + 2];
      }
      if (!allSubviews) {
        return layout;
      } //the first is the top level one
      layouts.push(layout);
    }
    return layouts;
  },
  getVerticesScreenPos: function(allSubviews = false) {
    if (allSubviews) {

    } else {
      let layout = this.getVerticesPos(false);
      let tempPos = new THREE.Vector3();
      if (!this.cachedScreenPosArray || this.cachedScreenPosArray.length != layout.length) {
        this.cachedScreenPosArray = new Array(layout.length);
        for (let i = 0; i < this.cachedScreenPosArray.length; i++) {
          this.cachedScreenPosArray[i] = new THREE.Vector2();
        }
      }
      layout.forEach((pos, i) => {
        tempPos.copy(pos);
        this.cachedScreenPosArray[i].copy(tempPos.applyMatrix4(G.view.templates.nodes.object3d.matrixWorld).project(G.camera));
      });
      return this.cachedScreenPosArray;
    }
  },
  getObjectAtPos: function(pos) {
    if (!this.model) return null;
    let highestPriority = 0;
    let bestResult = null;
    let bestType = null;
    for (let type in this.templates) {
      let obj = this.templates[type];
      let priority = obj.selectionPriority ? obj.selectionPriority : 0;
      if ((priority >= highestPriority) && (obj.getObjectAtPos)) {
        let result = obj.getObjectAtPos(pos);
        if (result != null) {
          bestResult = result;
          highestPriority = priority;
          bestType = type;
        }
      }
    }
    if (bestResult == null) return null;
    else {
      //get the original object and belonging graph
      let obj = this.templates[bestType];
      let record = this.getOriginalObject(bestType, bestResult);
      record.type = bestType;
      record.objectID = bestResult;
      record.viewObject = this.model[bestType][bestResult];
      return record; //type:bestType,objectID:bestResult,graph:originalGraph,subview:subview,subviewObjectID:subviewObjectID,originalObjectType:G.subview[type].originalObjectType,originalObjectID:originalObjectID
    }
  },
  getObjectsInBBox: function(region) { //todo: now this only selects vertices of the top level graph
    let selected = {},
      pos = new THREE.Vector3();
    let layout = this.getVerticesPos();
    if (!layout) return; //top level graph only?
    for (let i = 0; i < this.graph.vertices.length; i++) {
      pos.copy(layout[i]);
      let screenPos = pos.applyMatrix4(G.view.templates.nodes.object3d.matrixWorld).project(G.camera);
      if (((screenPos.x - region.left) * (screenPos.x - region.right) < 0) && ((screenPos.y - region.top) * (screenPos.y - region.bottom) < 0)) {
        selected[i] = true; //todo: this only tests one (the last) position for each vertex even if it may have multiple nodes
      }
    }
    return selected;
  },
  getVerticesInBBox: function(region) { //todo: now this only selects vertices of the top level graph
    let selected = {},
      pos = new THREE.Vector3();
    let layout = this.getVerticesPos();
    if (!layout) return; //top level graph only?
    let buffer = this.getPositions(),
      vec = new THREE.Vector3();
    let getVertexID = G.subview.templates.nodes.getViewObjectID; //getViewObjectID:(graph,vertexID,preferredHeightValue)
    for (let i = 0; i < this.graph.nodes.length; i++) { //getVerticesPos works for this.graph, not always the same as G.graph
      //the global node ID is the same as i here
      let record = this.getOriginalObject("nodes", i); //tests all nodes for a vertex
      if (record.originalObjectID !== undefined) {
        let i4 = record.originalObjectID * 4;
        pos.x = buffer[i4];
        pos.y = buffer[i4 + 1];
        pos.z = buffer[i4 + 2];
        let screenPos = pos.applyMatrix4(G.view.templates.nodes.object3d.matrixWorld).project(G.camera);
        if (((screenPos.x - region.left) * (screenPos.x - region.right) < 0) && ((screenPos.y - region.top) * (screenPos.y - region.bottom) < 0)) {
          selected[record.originalObjectID] = true;
        }
      }

    }
    return selected;
  },
  inspect: function inspect(t) { //for layout debug
    G.renderer.readRenderTargetPixels(t, 0, 0, 1, 1, this.testBuffer);
    console.log(this.testBuffer.join(","));
  },
  positionsChanged: false,
  getPositions: function() {

    if (!(this.simulation && this.simulation.dataBuffer)) return null; //throw Error("no position buffer");
    if (this.positionsChanged) {
      G.renderer.readRenderTargetPixels(this.simulation.out, 0, 0, this.simulation.textureSize, this.simulation.textureSize, this.simulation.dataBuffer);
      this.positionsChanged = false;
    }
    return this.simulation.dataBuffer;
  },

  refreshAttrs: function(updateAll) { //now, it creates attrs directly from properties marked as such, turning arrays of vectors into typed arrays using the dimensions property.
    //geometry and attrs
    let model = this.model;
    for (let name in this.templates) {
      let obj = this.templates[name];
      let data = model[name],
        length = data.length; //should only be created once - todo: attach as a module to graph objects?
      let subviewObjTemplate = G.subview.templates[name];
      if (G.DEBUG) console.log("scene object " + name);
      //properties are computed before textures are created
      let geometry = obj.geometry; //new THREE.BufferGeometry();geometry.name=name;obj.geometry=geometry;obj.object3d.geometry=geometry;
      if (!geometry) continue;
      let ppo = obj.pointsPerObject ? obj.pointsPerObject : 1;
      //do this both for properties on subviews and properties of the global view - without having to define them twice
      function makeAttrFromProperty(attrName, propertyTemplate) {
        let attr = propertyTemplate; //obj.properties[attrName];
        if (attr.isAttribute === false) return;;
        let dimensions = attr.dimensions ? attr.dimensions : 1;
        let propertyData = model[name][attrName];

        let bufferAttr = geometry.attributes[attrName];
        let oldLength = (bufferAttr ? (bufferAttr.array.length) : null),
          newLength = length * dimensions * ppo;
        if (oldLength !== newLength) {
          if (geometry.attributes[attrName]) geometry.removeAttribute(attrName);
          let dimensions = attr.dimensions ? attr.dimensions : 1;
          bufferAttr = new THREE.BufferAttribute(new Float32Array(newLength), dimensions);
          if (attr.dynamic) bufferAttr.setDynamic(true);
          geometry.addAttribute(attrName, bufferAttr);
          geometry.getAttribute(attrName).needsUpdate = true;
        }
        let buffer = bufferAttr.array;
        if (attr.needsUpdate || updateAll) {
          var warned = false;
          if (attrName == "color") {
            console.log("attr from color for " + name);
          }
          propertyData.forEach((d, i, array) => {
            let offset = i * dimensions * ppo;
            let value = attr.attrValue ? attr.attrValue : d; //different from the property value, the attrValue function may return values per point.
            //if it's a function, the return value is for each data object, not for the whole buffer; if there's no such function, just use the property value(note: can we use the typed array if the property is already typed?)
            if (typeof value == "function") {
              value = value(d, i, array);
            } //same arguments as forEach; if ppo>1 return an array(or if it's not an array, we use the same value for all points in the object)
            //the attr value should depend on the property value, not the whole object data, otherwise we should make it another property?
            for (let j = 0; j < ppo; j++) {
              let pointValue = value;
              //distinguish between per-object and per-point initializations, and give a warning for unexpected values
              if (!attr.perPoint) { //no point index
              } else { //now per point has to be flagged, and per object is the default (because only link coords and such afe per point)
                if (ppo != 1) { //must use an array for points and objects for vectors??
                  if (Array.isArray(pointValue)) {
                    pointValue = value[j];
                  } else {
                    if (!warned) {
                      console.log("Warning: per point attribute result is not an array: " + attrName);
                      warned = true;
                    }
                  }
                }
              }
              setArrayDataItem(pointValue, buffer, offset, dimensions);
              offset += dimensions;
            }
          });
          geometry.getAttribute(attrName).needsUpdate = true;

        }
      }
      for (let attrName in obj.properties) {
        makeAttrFromProperty(attrName, obj.properties[attrName]);
      }
      if (subviewObjTemplate)
        for (let attrName in subviewObjTemplate.properties) {
          makeAttrFromProperty(attrName, subviewObjTemplate.properties[attrName]);
        }
    }
  },
  "blending type": 1,
  refreshUniforms: function(updateAll) {
    let model = this.model;
    for (let name in this.templates) {
      let obj = this.templates[name];
      let data = model[name],
        length = data.length; //should only be created once - todo: attach as a module to graph objects?
      if (!obj.object3d) {
        continue;
      }
      let materialUniforms = obj.object3d.material.uniforms;
      if (!materialUniforms) { //initialize material, because it must be done after module init after loading shaders
        materialUniforms = {}; //must init all uniforms in it before creating the material?
        for (let uniformName in obj.uniforms) {
          materialUniforms[uniformName] = {};
          if (obj.uniforms[uniformName].isArray) {
            materialUniforms[uniformName + "Size"] = {};
            materialUniforms[uniformName + "Count"] = {};
          }
        }
        for (let uniformName in this.sharedUniforms) {
          materialUniforms[uniformName] = {};
          if (this.sharedUniforms[uniformName].isArray) {
            materialUniforms[uniformName + "Size"] = {};
            materialUniforms[uniformName + "Count"] = {};
          }
        }
        obj.material = new THREE.ShaderMaterial({
          uniforms: materialUniforms,
          vertexShader: this.getVertexShader(obj.shader),
          fragmentShader: this.getFragmentShader(obj.shader),
          transparent: true,
          depthTest: false,
          side: THREE.DoubleSide,
          blending: G.view["blending type"],
        });
        obj.object3d.material = obj.material;
      }
      for (let uniformName in obj.uniforms) {
        let uniform = obj.uniforms[uniformName];
        if (uniform.dynamic) {
          uniform.needsUpdate = true;
        }
        if (uniform.needsUpdate || updateAll) {
          this.updateUniform(uniform, materialUniforms, uniformName, model);

        }
      }
    }
    //dynamic ones or updated ones; needsUpdate can be set from outside
    //since this is reused to initialize all uniforms too, it must attach shared ones as well
    for (let uniformName in this.sharedUniforms) {
      let uniform = this.sharedUniforms[uniformName];
      if (uniform.dynamic) {
        uniform.needsUpdate = true;
      }
      if (uniform.needsUpdate || updateAll) { //don't change the uniforms on the GPU if it doesn't need updating
        for (let name in this.templates) {
          if (!this.templates[name].object3d) continue;
          let us = this.templates[name].material.uniforms;
          if (us[uniformName]) {
            this.updateUniform(uniform, us, uniformName, model);
          }
        }
        //update for the simulation too
        if (this.simulationShader) {
          let us = this.simulationShader.uniforms;
          //if(!us[uniformName]){}
          this.updateUniform(uniform, us, uniformName, model);
        }
      }
    }
  },

  refreshStyles: function(updateAll, updateModel) {
    //this.refreshProperties(updateAll);
    //update subviews?
    if (updateModel) {
      let oldMods = this.model.modifiers;
      Object.assign(this, this.getObjectsFromHierarchy(G.view.graph));
      this.model.modifiers = this.modifiers;
      this.setModifiersTarget(this.model);
    } //todo: what should be kept?

    this.applyTemplates(this.model, updateAll ? true : false);

    this.refreshAttrs(updateAll);
    this.refreshUniforms(updateAll);
  },
  updateStyle: function(objectType, propertyName) {
    //the args are the reason for teh upate if any, and obejct type can be global -  global JS value, or a logical view object, and te property refers to a property of it (or a global data name), and this can only be used for properties/globals, and not update attrs/uniforms directly, since those are updated when properties are afected.
    //the update caller should specify which property/properties need updating if possible, otherwise everything is updated.
    //todo
  },

  resetView: function() {
    let cameraHeight = 100;
    if (G.view.graph) {
      let g = G.view.graph;
      cameraHeight = Math.sqrt((g.vertexCount ? g.vertexCount : (g.vertices ? g.vertices.length : 0)) + 1);
      if (Number(g.sparsity) > 0 && Number(g.edgeProbability) > 0) {
        cameraHeight /= Math.min(Math.max(Math.sqrt(Number(g.sparsity) * Math.sqrt(Number(g.edgeProbability)) * 1.3), 1), 3);
      }
    }; //Math.sqrt(G.graph.edgeProbability)
    for (let name in G.cameras) {
      G.cameras[name].position.x = 0;
      G.cameras[name].position.y = 0;
      G.cameras[name].position.z = Math.min(15000, cameraHeight * CAMERA_DISTANCE2NODES_FACTOR + 1); //sqrt instead of cbrt because the layout is often quite flat
    }
    if (cameraHeight * CAMERA_DISTANCE2NODES_FACTOR + 1 == 0) throw Error("view control error");
    G.cameraControls.target.x = 0;
    G.cameraControls.target.y = 0;
    G.cameraControls.target.z = 0;
  },
  focusViewAtHeight: function(h) {
    let realHeight = this.sharedUniforms.layerHeights.dataCache[h];
    let oldHeight = G.cameraControls.target.z;
    for (let name in G.cameras) {
      G.cameras[name].position.z += (realHeight - oldHeight);
    }
    G.cameraControls.target.z = realHeight;
  },
  sideView: function() {
    G.cameraControls.reset(); //necessary here

    let zCenter = 0; //G.zHeight({layer:G.graph.maxLayer})/2,
    let radialDistance = 15000; //Math.min(G.radialLimit*3,15000);//camera far?
    for (let name in G.cameras) {
      G.cameras[name].position.x = radialDistance;
      G.cameras[name].position.y = 0;
      G.cameras[name].position.z = zCenter;
    }

    G.cameraControls.target.x = 0;
    G.cameraControls.target.y = 0;
    G.cameraControls.target.z = zCenter;
  },
  randomizeLayout: function() {
    if (!G.view.graph.vArray) {
      console.log("layout not initialized");
      return;
    }
    let size = G.view.graph.vArray.length;
    let radius = Math.cbrt(size);
    for (var i = 0; i < size; i++) {
      let v = G.view.graph.vArray[i];
      v.x = (Math.random() - 0.5) * radius;
      v.y = (Math.random() - 0.5) * radius;
      v.z = (Math.random() - 0.5) * radius;
    }
    this.displayGraph(G.view.graph);
  },


  //helpers


  initUniform(template, args) { //for one uniform template
    let value = template.value;
    if (typeof value == "function") {
      value = value(args);
    }
    let realValue = value;
    if (template.isArray) {
      //let uniformSizeName=uniformName+"Size";
      let length = value.length;
      let size = Math.max(Math.ceil(Math.sqrt(length)), 1);
      if (size > this.maxTextureSize / 2) {
        let result = confirm("Your browser is likely unable to support " + size + " objects because its max texture size is " + this.maxTextureSize + " which needs to be significantly bigger than the square root of the object count. Do you want to proceed anyway? (Please reopen the whole browser window, not just the tab, if it crashes this way.)");
        if (!result) {
          throw Error();
        }
      }
      let data = new Float32Array(size * size * 4);
      for (let i = 0; i < length; i++) {
        let point = value[i];
        if (typeof point == "number") {
          data[i * 4] = point;
          data[i * 4 + 1] = point;
          data[i * 4 + 2] = point;
          data[i * 4 + 3] = point;
        } else {
          data[i * 4] = ("r" in point) ? point.r : (point.x ? point.x : 0);
          data[i * 4 + 1] = ("g" in point) ? point.g : (point.y ? point.y : 0);
          data[i * 4 + 2] = ("b" in point) ? point.b : (point.z ? point.z : 0);
          data[i * 4 + 3] = ("a" in point) ? point.a : (point.w ? point.w : 0);
        }
      }
      var texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
      realValue = texture;
      template.sizeCache = size;
      template.countCache = length;
    }
    template.dataCache = value;
    template.valueCache = realValue;
  },
  updateUniform(template, uniformsObj, uniformName, args) {
    //template.dynamic is not tested here, instead it sets needsUpdate every frame - no point updating more often than that
    if ((template.needsUpdate) || (template.valueCache === undefined)) {
      this.initUniform(template, args);
    }
    template.needsUpdate = false;

    let newobj = {
      value: template.valueCache
    };

    if (template.type) {
      newobj.type = template.type;
    }
    uniformsObj[uniformName] = newobj;
    if (template.isArray) {
      let uniformSizeName = uniformName + "Size";
      let newSizeObj = {
        value: template.sizeCache
      };
      uniformsObj[uniformSizeName] = newSizeObj;
      let uniformCountName = uniformName + "Count";
      let newCountObj = {
        value: template.countCache
      };
      uniformsObj[uniformCountName] = newCountObj;
    }
  },
  checkUniforms() {
    for (let name in G.view.sharedUniforms) {
      let value = G.view.sharedUniforms[name].dataCache;
      if (value == undefined) {
        console.log(name + " is undefined/null: " + value);
      }
      if (typeof value == "number" && isNaN(value)) {
        console.log(name + " is NaN");
      }
      if (isArrayLike(value)) {
        for (let i = 0; i < value.length; i++) {
          let val = value[i];
          if (val == null || Number.isNaN(val)) {
            console.log(name + " NaN/null at " + i + " : " + val);
          }
        }
      }
    }
    //G.view.templates.nodes.object3d.material.uniforms
  },
  getVertexShader(text) {
    if (!this.shaderSources[text + ".vs"]) throw Error();
    let params = {};
    for (let name in this.shaderConstants) {
      let value = this.shaderConstants[name];
      if (typeof value == "function") value = value.call(this, G.view.graph);
      params[name] = value;
    }

    return replaceShaderParams(this.shaderLib + "\n" + this.shaderSources[text + ".vs"], params); //params can take numbers
  },
  getFragmentShader(text) {
    if (!this.shaderSources[text + ".fs"]) throw Error();
    let params = {};
    for (let name in this.shaderConstants) {
      let value = this.shaderConstants[name];
      if (typeof value == "function") value = value.call(this, G.view.graph);
      params[name] = value;
    }
    return replaceShaderParams(this.shaderLib + "\n" + this.shaderSources[text + ".fs"], params);
  },
});
