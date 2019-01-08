exports.ids = [2];
exports.modules = {

/***/ 2318:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"btn":"tjs-augmented_virtuality_tool__btn tjs-_buttons__btn tjs-_buttons__btn tjs-nav__btn tjs-_buttons__btn","btn-primary":"tjs-augmented_virtuality_tool__btn-primary tjs-_buttons__btn tjs-_buttons__btn tjs-nav__btn tjs-_buttons__btn","btnPrimary":"tjs-augmented_virtuality_tool__btn-primary tjs-_buttons__btn tjs-_buttons__btn tjs-nav__btn tjs-_buttons__btn","btn-blink":"tjs-augmented_virtuality_tool__btn-blink tjs-_buttons__btn tjs-_buttons__btn tjs-nav__btn tjs-_buttons__btn","btnBlink":"tjs-augmented_virtuality_tool__btn-blink tjs-_buttons__btn tjs-_buttons__btn tjs-nav__btn tjs-_buttons__btn","btn-primary--hover":"tjs-augmented_virtuality_tool__btn-primary--hover","btnPrimaryHover":"tjs-augmented_virtuality_tool__btn-primary--hover","blinker":"tjs-augmented_virtuality_tool__blinker","toolButton":"tjs-augmented_virtuality_tool__toolButton","augmentedVirtualityTool":"tjs-augmented_virtuality_tool__augmentedVirtualityTool tjs-tool_button__toolButton"};

/***/ }),

/***/ 2319:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _defined = __webpack_require__(0);

var _defined2 = _interopRequireDefault(_defined);

var _defaultValue = __webpack_require__(1);

var _defaultValue2 = _interopRequireDefault(_defaultValue);

var _knockout = __webpack_require__(13);

var _knockout2 = _interopRequireDefault(_knockout);

var _Math = __webpack_require__(9);

var _Math2 = _interopRequireDefault(_Math);

var _Matrix = __webpack_require__(40);

var _Matrix2 = _interopRequireDefault(_Matrix);

var _Cartesian = __webpack_require__(10);

var _Cartesian2 = _interopRequireDefault(_Cartesian);

var _EllipsoidTerrainProvider = __webpack_require__(437);

var _EllipsoidTerrainProvider2 = _interopRequireDefault(_EllipsoidTerrainProvider);

var _sampleTerrainMostDetailed = __webpack_require__(807);

var _sampleTerrainMostDetailed2 = _interopRequireDefault(_sampleTerrainMostDetailed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Manages state for Augmented Virtuality mode.
 *
 * This mode uses the devices orientation sensors to change the viewers viewport to match the change in orientation.
 *
 * Term Augmented Virtuality:
 * "The use of real-world sensor information (e.g., gyroscopes) to control a virtual environment is an additional form
 * of augmented virtuality, in which external inputs provide context for the virtual view."
 * {@link https://en.wikipedia.org/wiki/Mixed_reality}
 *
 * @alias AugmentedVirtuality
 * @constructor
 */
var AugmentedVirtuality = function AugmentedVirtuality(terria) {
    var that = this;

    this._terria = terria;

    // Note: We create a persistant object and define a transient property, since knockout needs a persistant variable
    //       to track, but for state we want a 'maybe' intervalId.
    this._eventLoopState = {};

    this._manualAlignment = false;

    this._maximumUpdatesPerSecond = AugmentedVirtuality.DEFAULT_MAXIMUM_UPDATES_PER_SECOND;

    this._orientationUpdated = false;
    this._alpha = 0;
    this._beta = 0;
    this._gamma = 0;
    this._realignAlpha = 0;
    this._realignHeading = 0;

    // Set the default height to be the last height so that when we first toggle (and increment) we cycle and go to the first height.
    this._hoverLevel = AugmentedVirtuality.PRESET_HEIGHTS.length - 1;

    // Always run the device orientation event, this way as soon as we enable we know where we are and set the
    // orientation rather then having to wait for the next update.
    // The following is disabled because chrome does not currently support deviceorientationabsolute correctly:
    // if ('ondeviceorientationabsolute' in window)
    // {
    //     window.addEventListener('deviceorientationabsolute', function(event) {that._orientationUpdate(event);} );
    // }
    // else
    if ('ondeviceorientation' in window) {
        window.addEventListener('deviceorientation', function (event) {
            that._storeOrientation(event);
        });
    }

    // Make the variables used by the object properties knockout observable so that changes in the state notify the UI
    // and cause a UI update. Note: These are all of the variables used just by the getters (not the setters), since
    // these unqiquely define what the current state is and are the only things that can effect/cause the state to change
    // (note: _eventLoopState is hidden behind ._eventLoopRunning() ).
    _knockout2.default.track(this, ['_eventLoopState', '_manualAlignment', '_maximumUpdatesPerSecond', '_realignAlpha', '_realignHeading', '_hoverLevel']);

    // Note: The following properties are defined as knockout properties so that they can be used to trigger updates on the UI.
    /**
     * Gets or sets whether Augmented Virtuality mode is currently enabled (true) or not (false).
     *
     * Note: If {@link AugmentedVirtuality#manualAlignment} is enabled and the state is changed it will be disabled.
     *
     * @memberOf AugmentedVirtuality.prototype
     * @member {Boolean} enabled
     */
    _knockout2.default.defineProperty(this, 'enabled', {
        get: function get() {
            return this._eventLoopRunning() || this._manualAlignment;
        },
        set: function set(enable) {
            if (enable !== true) {
                enable = false;

                this.resetAlignment();
            }

            if (enable !== this.enabled) {
                // If we are changing the enabled state then disable manual alignment.
                // We only do this if we are changing the enabled state so that the client can repeatedly call the
                // setting without having any effect if they aren't changing the enabled state, but so that every time
                // that the state is changed that the manual alignment is turned back off initally.
                this._manualAlignment = false;

                this._startEventLoop(enable);
            }
        }
    });

    /**
     * Gets or sets whether manual realignment mode is currently enabled (true) or not (false).
     *
     * @memberOf AugmentedVirtuality.prototype
     * @member {Boolean} manualAlignment
     */
    _knockout2.default.defineProperty(this, 'manualAlignment', {
        get: function get() {
            return this._getManualAlignment();
        },
        set: function set(startEnd) {
            this._setManualAlignment(startEnd);
        }
    });

    /**
     * Gets whether a manual realignment has been specified (true) or not (false).
     *
     * @memberOf AugmentedVirtuality.prototype
     * @member {Boolean} manualAlignmentSet
     */
    _knockout2.default.defineProperty(this, 'manualAlignmentSet', {
        get: function get() {
            return this._realignAlpha !== 0.0 || this._realignHeading !== 0.0;
        }
    });

    /**
     * Gets the index of the current hover level.
     *
     * Use <code>AugmentedVirtuality.PRESET_HEIGHTS.length</code> to find the total avaliable levels.
     *
     * @memberOf AugmentedVirtuality.prototype
     * @member {int} hoverLevel
     */
    _knockout2.default.defineProperty(this, 'hoverLevel', {
        get: function get() {
            return this._hoverLevel;
        }
    });

    /**
     * Gets or sets the the maximum number of times that the camera orientation will be updated per second. This is
     * the number of camera orientation updates per seconds is capped to (explicitly the number of times the
     * orientation is updated per second might be less but it won't be more then this number). We want the number of
     * times that the orientation is updated capped so that we don't consume to much battery life updating to
     * frequently, but responsiveness is still acceptable.
     *
     * @memberOf AugmentedVirtuality.prototype
     * @member {Float} maximumUpdatesPerSecond
     */
    _knockout2.default.defineProperty(this, 'maximumUpdatesPerSecond', {
        get: function get() {
            return this._maximumUpdatesPerSecond;
        },
        set: function set(maximumUpdatesPerSecond) {
            this._maximumUpdatesPerSecond = maximumUpdatesPerSecond;

            // If we are currently enabled reset to update the timing interval used.
            if (this._eventLoopRunning()) {
                this._startEventLoop(false);
                this._startEventLoop(true);
            }
        }
    });

    this.enabled = false;
};

/**
 * Gets the the maximum number of times that the camera orientation will be updated per second by default. This is the
 * number of camera orientation updates per seconds is capped to by default (explicitly the number of times the
 * orientation is updated per second might be less but it won't be more then this number). We want the number of times
 * that the orientation is updated capped so that we don't consume to much battery life updating to frequently, but
 * responsiveness is still acceptable.
 */
AugmentedVirtuality.DEFAULT_MAXIMUM_UPDATES_PER_SECOND = 10.0;

/**
 * The minimum height that the viewer is allowed to hover at.
 */
AugmentedVirtuality.MINIMUM_HOVER_HEIGHT = 20.0;

/* These are the heights that we can toggle through (in meters - above the surface height).
 */
AugmentedVirtuality.PRESET_HEIGHTS = [1000, 250, 20];

/**
 * Toggles whether the AugmentedVirutuality mode is enabled or disabled.
 */
AugmentedVirtuality.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
};

/**
 * Toggles whether manual alignement is enabled or disabled.
 */
AugmentedVirtuality.prototype.toggleManualAlignment = function () {
    this.manualAlignment = !this.manualAlignment;
};

/**
 * Resets the alignment so that the alignement matches the devices absolute alignment.
 */
AugmentedVirtuality.prototype.resetAlignment = function () {
    this._orientationUpdated = true;
    this._realignAlpha = 0;
    this._realignHeading = 0;
};

/**
 * Toggles the viewer between a range of predefined heights, setting the cameras orientation so that it matches the
 * correct orientation.
 */
AugmentedVirtuality.prototype.toggleHoverHeight = function () {
    this._hoverLevel = (this._hoverLevel + 1) % AugmentedVirtuality.PRESET_HEIGHTS.length;

    this.hover(AugmentedVirtuality.PRESET_HEIGHTS[this._hoverLevel]);
};

/**
 * Moves the viewer to a specified height, setting the orientation so that it matches the correct Augmented Virtuality
 * orientation.
 *
 * @param {Float} height The height in Meters above the globe surface. Note: If height is below
 *                       {@link AugmentedVirtuality.MINIMUM_HOVER_HEIGHT} the height will be set to
 *                       {@link AugmentedVirtuality.MINIMUM_HOVER_HEIGHT} to avoid visual artifacts when the viewer
 *                       becomes to close to the surface.
 * @param {Cartographic} [position] The location to hover over. If not specified the current camera location will be used.
 * @param {Boolean} [flyTo=true] Whether to fly to the location (true) or whether to jump to the location (false).
 */
AugmentedVirtuality.prototype.hover = function (height, position, flyTo) {
    var that = this;

    // Get access to the camera...if it is not avaliable we can't set the new height so just return now.
    if (!(0, _defined2.default)(this._terria.cesium) || !(0, _defined2.default)(this._terria.cesium.viewer) || !(0, _defined2.default)(this._terria.cesium.viewer.camera)) {

        return;
    }
    var camera = this._terria.cesium.viewer.camera;

    if (!(0, _defined2.default)(position)) {
        position = camera.positionCartographic.clone();
    }

    flyTo = (0, _defaultValue2.default)(flyTo, true);

    // Clamp the minimum hover height (heights below this value could lead to poor visual artifacts).
    if (height < AugmentedVirtuality.MINIMUM_HOVER_HEIGHT) {
        height = AugmentedVirtuality.MINIMUM_HOVER_HEIGHT;
    }

    // Reset the viewer height.
    function flyToHeight(surfaceHeight) {
        if ((0, _defined2.default)(surfaceHeight)) {
            height += surfaceHeight;
        }

        var newPosition = _Cartesian2.default.fromRadians(position.longitude, position.latitude, height);
        var pose = that._getCurrentOrientation();
        pose.destination = newPosition;

        if (flyTo) {
            camera.flyTo(pose);
        } else {
            camera.setView(pose);
        }

        // Needed on mobile to make sure that the render is marked as dirty so that once AV mode has been disabled for a
        // while and then is reenabled the .setView() function still has effect (otherwise dispite the call the .setView()
        // the view orientation does not visually update until the user manualy moves the camera position).
        that._terria.currentViewer.notifyRepaintRequired();
    }

    // Get the ground surface height at this location and offset the height by it.
    if (!(0, _defined2.default)(this._terria.cesium) || !(0, _defined2.default)(this._terria.cesium.scene) || !(0, _defined2.default)(this._terria.cesium.scene.terrainProvider) || this._terria.cesium.scene.terrainProvider instanceof _EllipsoidTerrainProvider2.default) {
        // If we can't get access to the terrain provider or we can get access to the terrain provider and the provider is just the Ellipsoid then use the height of 0.
        flyToHeight(0);
    } else {
        var terrainProvider = this._terria.cesium.scene.terrainProvider;
        (0, _sampleTerrainMostDetailed2.default)(terrainProvider, [position]).then(function (updatedPosition) {
            flyToHeight(updatedPosition[0].height);
        });
    }
};

/**
 * Moves the viewer to a specified location while maintaining the current height and the correct Augmented Virtuality
 * orientation.
 *
 * @param {Cartographic} position The location to hover move to.
 * @param {Float} [maximumHeight] The maximum height (in meters) to cap the current camera height to (if this value is
 *                                specified and the viewer is above this height the camera will be restricted to this height).
 * @param {Boolean} [flyTo] Whether to fly to the location (true) or whether to jump to the location (false).
 *
 * When the manual alignment is enabled this function has no effect.
 */
AugmentedVirtuality.prototype.moveTo = function (position, maximumHeight, flyTo) {
    var that = this;

    // If we are in manual alignment mode we don't allow the viewer to move (since this would create a jaring UX for most use cases).
    if (this._manualAlignment) {
        return;
    }

    // Get access to the camera...if it is not avaliable we can't get the current height (or set the new location) so just return now.
    if (!(0, _defined2.default)(this._terria.cesium) || !(0, _defined2.default)(this._terria.cesium.viewer) || !(0, _defined2.default)(this._terria.cesium.viewer.camera)) {

        return;
    }
    var camera = this._terria.cesium.viewer.camera;

    var cameraPosition = camera.positionCartographic.clone();
    var viewerHeight = cameraPosition.height;

    // Reset the viewer height.
    function moveToLocation(surfaceHeight) {
        if (!(0, _defined2.default)(surfaceHeight)) {
            surfaceHeight = 0;
        }

        var hoverHeight = viewerHeight - surfaceHeight;
        if ((0, _defined2.default)(maximumHeight) && hoverHeight > maximumHeight) {

            hoverHeight = maximumHeight;
        }

        that.hover(hoverHeight, position, flyTo);
    }

    // Get the ground surface height at this location and offset the height by it.
    if (!(0, _defined2.default)(this._terria.cesium) || !(0, _defined2.default)(this._terria.cesium.scene) || !(0, _defined2.default)(this._terria.cesium.scene.terrainProvider) || this._terria.cesium.scene.terrainProvider instanceof _EllipsoidTerrainProvider2.default) {
        // If we can't get access to the terrain provider or we can get access to the terrain provider and the provider is just the Ellipsoid then use the height of 0.
        moveToLocation(undefined);
    } else {
        var terrainProvider = this._terria.cesium.scene.terrainProvider;
        (0, _sampleTerrainMostDetailed2.default)(terrainProvider, [cameraPosition]).then(function (updatedPosition) {
            moveToLocation(updatedPosition[0].height);
        });
    }
};

/**
 * Whether the user is currently setting a manual alignment.
 *
 * See also {@link AugmentedVirtuality#_setManualAlignment}.
 *
 * @return {Boolean} Whether the user is currently setting a manual alignment (true) or not (false).
 * @private
 */
AugmentedVirtuality.prototype._getManualAlignment = function () {
    return this.enabled && this._manualAlignment;
};

/**
 * Starts / stops manual alignment.
 *
 * When manual realignment is enabled it allows the user to specify a new origin for the alignment between the devices
 * physical and virtual alignment. When manual alignment is enabled the orientation is locked, to allow the user to
 * realign a visual landmark with a physical landmark.
 *
 * Note: Manual alignment is only done for the heading axis, this is because in practice we have found that the heading
 * axis is often out as mobile devices seem to have difficulty obtaining the compass direction, but seem to perform
 * relatively well in the other axes.
 *
 * Note: Realignment is only possible when AugmentedVirtuality is enabled. If AugmentedVirtuality is disabled while
 *       manual alignment is in progress it will be cancelled.
 *
 * See also {@link AugmentedVirtuality#_getManualAlignment}.
 *
 * @param {Boolean} startEnd Whether the user is starting (true) or ending (false) the realignment.
 * @private
 */
AugmentedVirtuality.prototype._setManualAlignment = function (startEnd) {
    // Only allow manual alignment changes when the module is enabled.
    if (this.enabled !== true) {
        return;
    }

    // Sanitise the input value to a boolean.
    if (startEnd !== true) {
        startEnd = false;
    }

    if (startEnd === false && (0, _defined2.default)(this._terria.cesium) && (0, _defined2.default)(this._terria.cesium.viewer) && (0, _defined2.default)(this._terria.cesium.viewer.camera)) {

        this._realignAlpha = this._alpha;
        this._realignHeading = _Math2.default.toDegrees(this._terria.cesium.viewer.camera.heading);
    }

    if (this._manualAlignment !== startEnd) {
        this._manualAlignment = startEnd;
        this._startEventLoop(!this._manualAlignment);
    }
};

/**
 * Whether the event loop is currently running.
 *
 * @return {Boolean} enable Whether to start the event loop is currently running (true) or not (false).
 * @private
 */
AugmentedVirtuality.prototype._eventLoopRunning = function () {
    return (0, _defined2.default)(this._eventLoopState.intervalId);
};

/**
 * Start or stop the Augmented Virutuality mode event loop. When enabled the orientation will effect the cameras
 * view and when disabled the device orientation will not effect the cameras view.
 *
 * @param {Boolean} enable Whether to start the event loop (true) or stop the event loop (false).
 * @private
 */
AugmentedVirtuality.prototype._startEventLoop = function (enable) {
    // Are we actually changing the state?
    if (this._eventLoopRunning() !== enable) {
        if (enable === true) {
            var that = this;

            this._orientationUpdated = true;

            var intervalMs = 1000 / this._maximumUpdatesPerSecond;
            var id = setInterval(function () {
                that._updateOrientation();
            }, intervalMs);
            this._eventLoopState = { intervalId: id };
        } else {
            clearInterval(this._eventLoopState.intervalId);
            this._eventLoopState = {};
        }
    }
};

/**
 * Device orientation update event callback function. Stores the updated orientation into the object state.
 *
 * @param {Object} event Contains the updated device orientation (in .alpha, .beta, .gamma).
 * @private
 */
AugmentedVirtuality.prototype._storeOrientation = function (event) {
    this._alpha = event.alpha;
    this._beta = event.beta;
    this._gamma = event.gamma;
    this._orientationUpdated = true;
};

/**
 * This function updates the cameras orientation using the last orientation recorded and the current screen orientation.
 *
 * @private
 */
AugmentedVirtuality.prototype._updateOrientation = function () {

    // Check if the screen orientation has changed and mark the orientation updated if it has.
    var screenOrientation = this._getCurrentScreenOrientation();
    if (screenOrientation !== this._lastScreenOrientation) {
        this._orientationUpdated = true;
    }
    this._lastScreenOrientation = screenOrientation;

    // Optomise by only updating the camera view if some part of the orientation calculation has changed.
    if (!this._orientationUpdated) {
        // The orientation has not been updated so don't waste time changing the orientation.
        return;
    }
    this._orientationUpdated = false;

    // Get access to the camera...if it is not avaliable we can't set the orientation so just return now.
    if (!(0, _defined2.default)(this._terria.cesium) || !(0, _defined2.default)(this._terria.cesium.viewer) || !(0, _defined2.default)(this._terria.cesium.viewer.camera)) {

        return;
    }
    var camera = this._terria.cesium.viewer.camera;

    camera.setView(this._getCurrentOrientation(screenOrientation));

    // Needed on mobile to make sure that the render is marked as dirty so that once AV mode has been disabled for a
    // while and then is reenabled the .setView() function still has effect (otherwise dispite the call the .setView()
    // the view orientation does not visually update until the user manualy moves the camera position).
    this._terria.currentViewer.notifyRepaintRequired();
};

/**
 * Gets the current orientation stored in the object state and returns the roll, pitch and heading which can be used to set the cameras orientation.
 *
 * @param {Float} screenOrientation The screen orientation in degrees. Note: This field is optional, if supplied this value will be used for the screen orientation, otherwise the screen orientation will be obtained during the execution of this function.
 * @return {Object} A object with the roll, pitch and heading stored into the orientation.
 * @private
 */
AugmentedVirtuality.prototype._getCurrentOrientation = function (screenOrientation) {
    var alpha = this._alpha;
    var beta = this._beta;
    var gamma = this._gamma;

    var realignAlpha = this._realignAlpha;
    var realignHeading = this._realignHeading;

    if (!(0, _defined2.default)(screenOrientation)) {
        screenOrientation = this._getCurrentScreenOrientation();
    }

    return this._computeTerriaOrientation(alpha, beta, gamma, screenOrientation, realignAlpha, realignHeading);
};

/**
 * Turns the orientation in the device frame of reference into an orientation suitable for specifying the Terria camera orientation.
 *
 * @param {Float} alpha The alpha value of the device orientation in degrees (this is the alpha value in the device's frame of reference).
 * @param {Float} beta  The beta  value of the device orientation in degrees (this is the beta  value in the device's frame of reference).
 * @param {Float} gamma The gamma value of the device orientation in degrees (this is the gamma value in the device's frame of reference).
 * @param {Float} screenOrientation The screen orientation in degrees.
 * @param {Float} realignAlpha   The value of the alpha   value the last time realignment was completed (supply zero if realignment is not supported).
 * @param {Float} realignHeading The value of the heading value the last time realignment was completed (supply zero if realignment is not supported).
 * @return {Object} An object with the roll, pitch and heading stored into the orientation.
 * @private
 */
AugmentedVirtuality.prototype._computeTerriaOrientation = function (alpha, beta, gamma, screenOrientation, realignAlpha, realignHeading) {
    // Note: The algorithmic formulation in this function is for simplicity of mathematical expression, readability,
    //       maintainability and modification (i.e. it is easy to understand how to update or insert new offsets or features).
    //       This is not the simplest form which clearly flows from the current formuleation and clearly simplify the
    //       logic and operations but would increase the cost of future modifications and reduce the readability of the
    //       expression. It is not anticipated that the current verbose implementation would have a significant impact
    //       on performance or accuracy, but obviously there will be some impact on both and it can be simplified in
    //       future if needed.

    var rotation = _Matrix2.default.clone(_Matrix2.default.IDENTITY, rotation);
    var rotationIncrement = void 0;

    // Roll - Counteract the change in the (orientation) frame of reference when the screen is rotated and the
    //        rotation lock is not on (the browser reorients the frame of reference to align with the new screen
    //        orientation - where as we want it of the device relative to the world).
    rotationIncrement = _Matrix2.default.fromRotationZ(_Math2.default.toRadians(screenOrientation));
    _Matrix2.default.multiply(rotation, rotationIncrement, rotation);

    // Pitch - Align the device orientation frame with the ceasium orientation frame.
    rotationIncrement = _Matrix2.default.fromRotationX(_Math2.default.toRadians(90));
    _Matrix2.default.multiply(rotation, rotationIncrement, rotation);

    // Roll - Apply the deivce roll.
    rotationIncrement = _Matrix2.default.fromRotationZ(_Math2.default.toRadians(gamma));
    _Matrix2.default.multiply(rotation, rotationIncrement, rotation);

    // Pitch - Apply the deivce pitch.
    rotationIncrement = _Matrix2.default.fromRotationX(_Math2.default.toRadians(-beta));
    _Matrix2.default.multiply(rotation, rotationIncrement, rotation);

    // Heading - Apply the incremental deivce heading (from when start was last triggered).
    rotationIncrement = _Matrix2.default.fromRotationY(_Math2.default.toRadians(-(alpha - realignAlpha)));
    _Matrix2.default.multiply(rotation, rotationIncrement, rotation);

    // Heading - Use the offset when the orientation was last started.
    //           Note: This is logically different from the alpha value and can only be applied here in the same way
    //                 since Cesium camera is RPH (Heading last - most local). See Cesium camera rotation decomposition
    //                 for more information on the Cesium camera formuleation.
    rotationIncrement = _Matrix2.default.fromRotationY(_Math2.default.toRadians(realignHeading));
    _Matrix2.default.multiply(rotation, rotationIncrement, rotation);

    // Decompose rotation matrix into roll, pitch and heading to supply to Cesium camera.
    //
    // Use notation:
    //     R = Roll, P = Pitch, H = Heading
    //     SH = Sin(Heading), CH = Cos(Heading)
    //
    // Ceasium camera rotation = RPH:
    //     [ CR, -SR,   0][  1,   0,   0][ CH,   0,  SH]   [CRCH-SRSPSH, -SRCP, CRSH-SRSPCH]
    //     [ SR,  CR,   0][  0,  CP,  SP][  0,   1,   0] = [SRCH-CRSPSH,  CRCP, SRSH+CRSPCH]
    //     [  0,   0,   1][  0, -SP,  CP][-SH,   0,  CH]   [   -CPSH   ,   -SP,    CPCH    ]
    //     Note: The sign difference of the Sin terms in pitch is different to the standard right handed rotation since
    //           Cesium rotates pitch in the left handed direction. Both heading and roll are right handed rotations.
    //
    // Use the following notation to refer to elements in the Cesium camera rotation matrix:
    //     [R00, R10, R20]
    //     [R01, R11, R21]
    //     [R02, R12, R22]
    //
    // Also note: Tan(X) = Sin(X) / Cos(X)
    //
    // Decompose matrix:
    //    H = ATan(Tan(H)) = ATan(Sin(H)/Cos(H)) = ATan (SH / CH) = ATan(CPSH/CPCH) = ATan (-R02 / R22)
    //    R = ATan(Tan(R)) = ATan(Sin(R)/Cos(R)) = ATan (SR / CR) = ATan(SRCP/CRCP) = ATan (-R10 / R11)
    //    P = ATan(Tan(P)) = ATan(Sin(P)/Cos(P)) = ATan (SP / CP)
    //                                             SP = -R12
    //                                             Need to find CP:
    //                                                 CP = Sqrt(CP^2)
    //                                                    = Sqrt(CP^2*(CH^2+SH^2))              Since: (Cos@^2 + Sin@^2) = 1
    //                                                    = Sqrt((CP^2)*(CH^2) + (CP^2)*(SH^2)) Expand
    //                                                    = Sqrt((CPCH)^2 + (CPSH)^2)           Since: N^2*M^2 = (NM)^2
    //                                                    = Sqrt(R22^2 + (-R02)^2)              Substitute
    //                                                    = Sqrt(R22^2 + R02^2)                 Since: (-N)^2 = N^2
    //  So P = ATan (-R12 / Sqrt(R22^2 + R02^2))


    // Simplify notation for readability:
    var r10 = rotation[_Matrix2.default.COLUMN1ROW0];
    var r11 = rotation[_Matrix2.default.COLUMN1ROW1];
    var r02 = rotation[_Matrix2.default.COLUMN0ROW2];
    var r12 = rotation[_Matrix2.default.COLUMN1ROW2];
    var r22 = rotation[_Matrix2.default.COLUMN2ROW2];

    var heading = _Math2.default.toDegrees(Math.atan2(-r02, r22));
    var roll = _Math2.default.toDegrees(Math.atan2(-r10, r11));
    var pitch = _Math2.default.toDegrees(Math.atan2(-r12, Math.sqrt(r02 * r02 + r22 * r22)));

    // Create an object with the roll, pitch and heading we just computed.
    return {
        orientation: {
            roll: _Math2.default.toRadians(roll),
            pitch: _Math2.default.toRadians(pitch),
            heading: _Math2.default.toRadians(heading)
        }
    };
};

/**
 * Gets the current screen orientation.
 *
 * @return {Object} The current screen orientation in degrees.
 * @private
 */
AugmentedVirtuality.prototype._getCurrentScreenOrientation = function () {
    if ((0, _defined2.default)(screen.orientation) && (0, _defined2.default)(screen.orientation.angle)) {
        return screen.orientation.angle;
    }

    if ((0, _defined2.default)(window.orientation)) {
        return window.orientation;
    }

    return 0;
};

module.exports = AugmentedVirtuality;

/***/ }),

/***/ 814:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _createReactClass = __webpack_require__(8);

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _propTypes = __webpack_require__(5);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ObserveModelMixin = __webpack_require__(11);

var _ObserveModelMixin2 = _interopRequireDefault(_ObserveModelMixin);

var _augmented_virtuality_tool = __webpack_require__(2318);

var _augmented_virtuality_tool2 = _interopRequireDefault(_augmented_virtuality_tool);

var _Icon = __webpack_require__(26);

var _Icon2 = _interopRequireDefault(_Icon);

var _ViewerMode = __webpack_require__(133);

var _ViewerMode2 = _interopRequireDefault(_ViewerMode);

var _defined = __webpack_require__(0);

var _defined2 = _interopRequireDefault(_defined);

var _AugmentedVirtuality = __webpack_require__(2319);

var _AugmentedVirtuality2 = _interopRequireDefault(_AugmentedVirtuality);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AugmentedVirtualityTool = (0, _createReactClass2.default)({
    displayName: 'AugmentedVirtualityTool',
    mixins: [_ObserveModelMixin2.default],

    propTypes: {
        terria: _propTypes2.default.object.isRequired,
        viewState: _propTypes2.default.object.isRequired,
        experimentalWarning: _propTypes2.default.bool
    },

    getInitialState: function getInitialState() {
        return {
            augmentedVirtuality: new _AugmentedVirtuality2.default(this.props.terria),
            experimentalWarningShown: false,
            realignHelpShown: false,
            resetRealignHelpShown: false
        };
    },
    handleClickAVTool: function handleClickAVTool() {
        // Make the AugmentedVirtuality module avaliable elsewhere.
        this.props.terria.augmentedVirtuality = this.state.augmentedVirtuality;

        if ((0, _defined2.default)(this.props.experimentalWarning) && this.props.experimentalWarning !== false && !this.state.experimentalWarningShown) {

            this.setState({ experimentalWarningShown: true });

            this.props.viewState.notifications.push({
                title: 'Experimental Feature: Augmented Reality',
                message: 'Augmented Reality mode is currently in beta. ' + 'This mode is only designed for use on the latest high end mobile devices. ' + '<br /><br />WARNING: This mode can consume a lot of data, please be mindful of data usage charges from your network provider. ' + '<br /><br />The accuracy of this mode depends on the accuracy of your mobile devices internal compass.',
                confirmText: 'Got it'
            });
        }

        this.state.augmentedVirtuality.toggleEnabled();
    },
    handleClickRealign: function handleClickRealign() {
        if (!this.state.realignHelpShown) {
            this.setState({ realignHelpShown: true });

            this.props.viewState.notifications.push({
                title: 'Manual Alignment',
                message: 'Align your mobile device so that it corresponds with the maps current alignment, then click the blinking compass.' + ' If no landmarks to align with are currently visible on the map, you can move the map using' + ' drag and pinch actions until a recognisable landmark is visible before aligning the device with the map.' + '<br /><div><img width="100%" src="./build/TerriaJS/images/ar-realign-guide.gif" /></div>' + '<br />Tip: The sun or moon are often good landmarks to align with if you are in a location you aren\x27t familiar with (be careful not to look at the sun - it can hurt your eyes).',
                confirmText: 'Got it'
            });
        }

        this.state.augmentedVirtuality.toggleManualAlignment();
    },
    handleClickResetRealign: function handleClickResetRealign() {
        if (!this.state.resetRealignHelpShown) {
            this.setState({ resetRealignHelpShown: true });

            this.props.viewState.notifications.push({
                title: 'Reset Alignment',
                message: 'Resetting to compass alignment. If the alignment doesn\x27t match the real world try waving' + ' your device in a figure 8 motion to recalibrate device. This can be done at any time.' + '<br /> <br />Avoid locations with magnetic fields or metal objects as these may disorient the devices compass.',
                confirmText: 'Got it'
            });
        }

        this.state.augmentedVirtuality.resetAlignment();
    },
    handleClickHover: function handleClickHover() {
        this.state.augmentedVirtuality.toggleHoverHeight();
    },
    render: function render() {
        var enabled = this.state.augmentedVirtuality.enabled;
        var toggleImage = _Icon2.default.GLYPHS.arOff;
        var toggleStyle = _augmented_virtuality_tool2.default.btn;
        if (enabled) {
            toggleImage = _Icon2.default.GLYPHS.arOn;
            toggleStyle = _augmented_virtuality_tool2.default.btnPrimary;
        }

        var realignment = this.state.augmentedVirtuality.manualAlignment;
        var realignmentStyle = _augmented_virtuality_tool2.default.btn;
        if (realignment) {
            realignmentStyle = _augmented_virtuality_tool2.default.btnBlink;
        }

        var hoverLevel = this.state.augmentedVirtuality.hoverLevel;
        var hoverImage = _Icon2.default.GLYPHS.arHover0;
        // Note: We use the image of the next level that we will be changing to, not the level the we are currently at.
        switch (hoverLevel) {
            case 0:
                hoverImage = _Icon2.default.GLYPHS.arHover0;
                break;
            case 1:
                hoverImage = _Icon2.default.GLYPHS.arHover1;
                break;
            case 2:
                hoverImage = _Icon2.default.GLYPHS.arHover2;
                break;
        }

        return this.props.terria.viewerMode !== _ViewerMode2.default.Leaflet ? _react2.default.createElement(
            'div',
            { className: _augmented_virtuality_tool2.default.augmentedVirtualityTool },
            _react2.default.createElement(
                'button',
                { type: 'button', className: toggleStyle,
                    title: 'augmented reality tool',
                    onClick: this.handleClickAVTool },
                _react2.default.createElement(_Icon2.default, { glyph: toggleImage })
            ),
            enabled ? [_react2.default.createElement(
                'button',
                { type: 'button', className: _augmented_virtuality_tool2.default.btn,
                    title: 'toggle hover height',
                    onClick: this.handleClickHover, key: '0'
                },
                _react2.default.createElement(_Icon2.default, { glyph: hoverImage })
            ), !this.state.augmentedVirtuality.manualAlignmentSet ? _react2.default.createElement(
                'button',
                { type: 'button', className: realignmentStyle,
                    title: 'toggle manual alignment',
                    onClick: this.handleClickRealign, key: '1'
                },
                _react2.default.createElement(_Icon2.default, { glyph: _Icon2.default.GLYPHS.arRealign })
            ) : null, this.state.augmentedVirtuality.manualAlignmentSet && !realignment ? _react2.default.createElement(
                'button',
                { type: 'button', className: _augmented_virtuality_tool2.default.btn,
                    title: 'reset compass alignment',
                    onClick: this.handleClickResetRealign, key: '2'
                },
                _react2.default.createElement(_Icon2.default, { glyph: _Icon2.default.GLYPHS.arResetAlignment })
            ) : null] : null
        ) : null;
    }
});

module.exports = AugmentedVirtualityTool;

/***/ })

};;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5UZXJyaWFNYXAuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGVycmlhanMvbGliL1JlYWN0Vmlld3MvTWFwL05hdmlnYXRpb24vYXVnbWVudGVkX3ZpcnR1YWxpdHlfdG9vbC5zY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90ZXJyaWFqcy9saWIvTW9kZWxzL0F1Z21lbnRlZFZpcnR1YWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzL2xpYi9SZWFjdFZpZXdzL01hcC9OYXZpZ2F0aW9uL0F1Z21lbnRlZFZpcnR1YWxpdHlUb29sLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxubW9kdWxlLmV4cG9ydHMgPSB7XCJidG5cIjpcInRqcy1hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sX19idG4gdGpzLV9idXR0b25zX19idG4gdGpzLV9idXR0b25zX19idG4gdGpzLW5hdl9fYnRuIHRqcy1fYnV0dG9uc19fYnRuXCIsXCJidG4tcHJpbWFyeVwiOlwidGpzLWF1Z21lbnRlZF92aXJ0dWFsaXR5X3Rvb2xfX2J0bi1wcmltYXJ5IHRqcy1fYnV0dG9uc19fYnRuIHRqcy1fYnV0dG9uc19fYnRuIHRqcy1uYXZfX2J0biB0anMtX2J1dHRvbnNfX2J0blwiLFwiYnRuUHJpbWFyeVwiOlwidGpzLWF1Z21lbnRlZF92aXJ0dWFsaXR5X3Rvb2xfX2J0bi1wcmltYXJ5IHRqcy1fYnV0dG9uc19fYnRuIHRqcy1fYnV0dG9uc19fYnRuIHRqcy1uYXZfX2J0biB0anMtX2J1dHRvbnNfX2J0blwiLFwiYnRuLWJsaW5rXCI6XCJ0anMtYXVnbWVudGVkX3ZpcnR1YWxpdHlfdG9vbF9fYnRuLWJsaW5rIHRqcy1fYnV0dG9uc19fYnRuIHRqcy1fYnV0dG9uc19fYnRuIHRqcy1uYXZfX2J0biB0anMtX2J1dHRvbnNfX2J0blwiLFwiYnRuQmxpbmtcIjpcInRqcy1hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sX19idG4tYmxpbmsgdGpzLV9idXR0b25zX19idG4gdGpzLV9idXR0b25zX19idG4gdGpzLW5hdl9fYnRuIHRqcy1fYnV0dG9uc19fYnRuXCIsXCJidG4tcHJpbWFyeS0taG92ZXJcIjpcInRqcy1hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sX19idG4tcHJpbWFyeS0taG92ZXJcIixcImJ0blByaW1hcnlIb3ZlclwiOlwidGpzLWF1Z21lbnRlZF92aXJ0dWFsaXR5X3Rvb2xfX2J0bi1wcmltYXJ5LS1ob3ZlclwiLFwiYmxpbmtlclwiOlwidGpzLWF1Z21lbnRlZF92aXJ0dWFsaXR5X3Rvb2xfX2JsaW5rZXJcIixcInRvb2xCdXR0b25cIjpcInRqcy1hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sX190b29sQnV0dG9uXCIsXCJhdWdtZW50ZWRWaXJ0dWFsaXR5VG9vbFwiOlwidGpzLWF1Z21lbnRlZF92aXJ0dWFsaXR5X3Rvb2xfX2F1Z21lbnRlZFZpcnR1YWxpdHlUb29sIHRqcy10b29sX2J1dHRvbl9fdG9vbEJ1dHRvblwifTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy9saWIvUmVhY3RWaWV3cy9NYXAvTmF2aWdhdGlvbi9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDIzMThcbi8vIG1vZHVsZSBjaHVua3MgPSAyIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2RlZmluZWQgPSByZXF1aXJlKCd0ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvZGVmaW5lZCcpO1xuXG52YXIgX2RlZmluZWQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmaW5lZCk7XG5cbnZhciBfZGVmYXVsdFZhbHVlID0gcmVxdWlyZSgndGVycmlhanMtY2VzaXVtL1NvdXJjZS9Db3JlL2RlZmF1bHRWYWx1ZScpO1xuXG52YXIgX2RlZmF1bHRWYWx1ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZhdWx0VmFsdWUpO1xuXG52YXIgX2tub2Nrb3V0ID0gcmVxdWlyZSgndGVycmlhanMtY2VzaXVtL1NvdXJjZS9UaGlyZFBhcnR5L2tub2Nrb3V0Jyk7XG5cbnZhciBfa25vY2tvdXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfa25vY2tvdXQpO1xuXG52YXIgX01hdGggPSByZXF1aXJlKCd0ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvTWF0aC5qcycpO1xuXG52YXIgX01hdGgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTWF0aCk7XG5cbnZhciBfTWF0cml4ID0gcmVxdWlyZSgndGVycmlhanMtY2VzaXVtL1NvdXJjZS9Db3JlL01hdHJpeDMuanMnKTtcblxudmFyIF9NYXRyaXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTWF0cml4KTtcblxudmFyIF9DYXJ0ZXNpYW4gPSByZXF1aXJlKCd0ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvQ2FydGVzaWFuMy5qcycpO1xuXG52YXIgX0NhcnRlc2lhbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9DYXJ0ZXNpYW4pO1xuXG52YXIgX0VsbGlwc29pZFRlcnJhaW5Qcm92aWRlciA9IHJlcXVpcmUoJ3RlcnJpYWpzLWNlc2l1bS9Tb3VyY2UvQ29yZS9FbGxpcHNvaWRUZXJyYWluUHJvdmlkZXInKTtcblxudmFyIF9FbGxpcHNvaWRUZXJyYWluUHJvdmlkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRWxsaXBzb2lkVGVycmFpblByb3ZpZGVyKTtcblxudmFyIF9zYW1wbGVUZXJyYWluTW9zdERldGFpbGVkID0gcmVxdWlyZSgndGVycmlhanMtY2VzaXVtL1NvdXJjZS9Db3JlL3NhbXBsZVRlcnJhaW5Nb3N0RGV0YWlsZWQnKTtcblxudmFyIF9zYW1wbGVUZXJyYWluTW9zdERldGFpbGVkMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NhbXBsZVRlcnJhaW5Nb3N0RGV0YWlsZWQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcclxuICogTWFuYWdlcyBzdGF0ZSBmb3IgQXVnbWVudGVkIFZpcnR1YWxpdHkgbW9kZS5cclxuICpcclxuICogVGhpcyBtb2RlIHVzZXMgdGhlIGRldmljZXMgb3JpZW50YXRpb24gc2Vuc29ycyB0byBjaGFuZ2UgdGhlIHZpZXdlcnMgdmlld3BvcnQgdG8gbWF0Y2ggdGhlIGNoYW5nZSBpbiBvcmllbnRhdGlvbi5cclxuICpcclxuICogVGVybSBBdWdtZW50ZWQgVmlydHVhbGl0eTpcclxuICogXCJUaGUgdXNlIG9mIHJlYWwtd29ybGQgc2Vuc29yIGluZm9ybWF0aW9uIChlLmcuLCBneXJvc2NvcGVzKSB0byBjb250cm9sIGEgdmlydHVhbCBlbnZpcm9ubWVudCBpcyBhbiBhZGRpdGlvbmFsIGZvcm1cclxuICogb2YgYXVnbWVudGVkIHZpcnR1YWxpdHksIGluIHdoaWNoIGV4dGVybmFsIGlucHV0cyBwcm92aWRlIGNvbnRleHQgZm9yIHRoZSB2aXJ0dWFsIHZpZXcuXCJcclxuICoge0BsaW5rIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01peGVkX3JlYWxpdHl9XHJcbiAqXHJcbiAqIEBhbGlhcyBBdWdtZW50ZWRWaXJ0dWFsaXR5XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cbnZhciBBdWdtZW50ZWRWaXJ0dWFsaXR5ID0gZnVuY3Rpb24gQXVnbWVudGVkVmlydHVhbGl0eSh0ZXJyaWEpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLl90ZXJyaWEgPSB0ZXJyaWE7XG5cbiAgICAvLyBOb3RlOiBXZSBjcmVhdGUgYSBwZXJzaXN0YW50IG9iamVjdCBhbmQgZGVmaW5lIGEgdHJhbnNpZW50IHByb3BlcnR5LCBzaW5jZSBrbm9ja291dCBuZWVkcyBhIHBlcnNpc3RhbnQgdmFyaWFibGVcbiAgICAvLyAgICAgICB0byB0cmFjaywgYnV0IGZvciBzdGF0ZSB3ZSB3YW50IGEgJ21heWJlJyBpbnRlcnZhbElkLlxuICAgIHRoaXMuX2V2ZW50TG9vcFN0YXRlID0ge307XG5cbiAgICB0aGlzLl9tYW51YWxBbGlnbm1lbnQgPSBmYWxzZTtcblxuICAgIHRoaXMuX21heGltdW1VcGRhdGVzUGVyU2Vjb25kID0gQXVnbWVudGVkVmlydHVhbGl0eS5ERUZBVUxUX01BWElNVU1fVVBEQVRFU19QRVJfU0VDT05EO1xuXG4gICAgdGhpcy5fb3JpZW50YXRpb25VcGRhdGVkID0gZmFsc2U7XG4gICAgdGhpcy5fYWxwaGEgPSAwO1xuICAgIHRoaXMuX2JldGEgPSAwO1xuICAgIHRoaXMuX2dhbW1hID0gMDtcbiAgICB0aGlzLl9yZWFsaWduQWxwaGEgPSAwO1xuICAgIHRoaXMuX3JlYWxpZ25IZWFkaW5nID0gMDtcblxuICAgIC8vIFNldCB0aGUgZGVmYXVsdCBoZWlnaHQgdG8gYmUgdGhlIGxhc3QgaGVpZ2h0IHNvIHRoYXQgd2hlbiB3ZSBmaXJzdCB0b2dnbGUgKGFuZCBpbmNyZW1lbnQpIHdlIGN5Y2xlIGFuZCBnbyB0byB0aGUgZmlyc3QgaGVpZ2h0LlxuICAgIHRoaXMuX2hvdmVyTGV2ZWwgPSBBdWdtZW50ZWRWaXJ0dWFsaXR5LlBSRVNFVF9IRUlHSFRTLmxlbmd0aCAtIDE7XG5cbiAgICAvLyBBbHdheXMgcnVuIHRoZSBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQsIHRoaXMgd2F5IGFzIHNvb24gYXMgd2UgZW5hYmxlIHdlIGtub3cgd2hlcmUgd2UgYXJlIGFuZCBzZXQgdGhlXG4gICAgLy8gb3JpZW50YXRpb24gcmF0aGVyIHRoZW4gaGF2aW5nIHRvIHdhaXQgZm9yIHRoZSBuZXh0IHVwZGF0ZS5cbiAgICAvLyBUaGUgZm9sbG93aW5nIGlzIGRpc2FibGVkIGJlY2F1c2UgY2hyb21lIGRvZXMgbm90IGN1cnJlbnRseSBzdXBwb3J0IGRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUgY29ycmVjdGx5OlxuICAgIC8vIGlmICgnb25kZXZpY2VvcmllbnRhdGlvbmFic29sdXRlJyBpbiB3aW5kb3cpXG4gICAgLy8ge1xuICAgIC8vICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7dGhhdC5fb3JpZW50YXRpb25VcGRhdGUoZXZlbnQpO30gKTtcbiAgICAvLyB9XG4gICAgLy8gZWxzZVxuICAgIGlmICgnb25kZXZpY2VvcmllbnRhdGlvbicgaW4gd2luZG93KSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdGhhdC5fc3RvcmVPcmllbnRhdGlvbihldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE1ha2UgdGhlIHZhcmlhYmxlcyB1c2VkIGJ5IHRoZSBvYmplY3QgcHJvcGVydGllcyBrbm9ja291dCBvYnNlcnZhYmxlIHNvIHRoYXQgY2hhbmdlcyBpbiB0aGUgc3RhdGUgbm90aWZ5IHRoZSBVSVxuICAgIC8vIGFuZCBjYXVzZSBhIFVJIHVwZGF0ZS4gTm90ZTogVGhlc2UgYXJlIGFsbCBvZiB0aGUgdmFyaWFibGVzIHVzZWQganVzdCBieSB0aGUgZ2V0dGVycyAobm90IHRoZSBzZXR0ZXJzKSwgc2luY2VcbiAgICAvLyB0aGVzZSB1bnFpcXVlbHkgZGVmaW5lIHdoYXQgdGhlIGN1cnJlbnQgc3RhdGUgaXMgYW5kIGFyZSB0aGUgb25seSB0aGluZ3MgdGhhdCBjYW4gZWZmZWN0L2NhdXNlIHRoZSBzdGF0ZSB0byBjaGFuZ2VcbiAgICAvLyAobm90ZTogX2V2ZW50TG9vcFN0YXRlIGlzIGhpZGRlbiBiZWhpbmQgLl9ldmVudExvb3BSdW5uaW5nKCkgKS5cbiAgICBfa25vY2tvdXQyLmRlZmF1bHQudHJhY2sodGhpcywgWydfZXZlbnRMb29wU3RhdGUnLCAnX21hbnVhbEFsaWdubWVudCcsICdfbWF4aW11bVVwZGF0ZXNQZXJTZWNvbmQnLCAnX3JlYWxpZ25BbHBoYScsICdfcmVhbGlnbkhlYWRpbmcnLCAnX2hvdmVyTGV2ZWwnXSk7XG5cbiAgICAvLyBOb3RlOiBUaGUgZm9sbG93aW5nIHByb3BlcnRpZXMgYXJlIGRlZmluZWQgYXMga25vY2tvdXQgcHJvcGVydGllcyBzbyB0aGF0IHRoZXkgY2FuIGJlIHVzZWQgdG8gdHJpZ2dlciB1cGRhdGVzIG9uIHRoZSBVSS5cbiAgICAvKipcclxuICAgICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIEF1Z21lbnRlZCBWaXJ0dWFsaXR5IG1vZGUgaXMgY3VycmVudGx5IGVuYWJsZWQgKHRydWUpIG9yIG5vdCAoZmFsc2UpLlxyXG4gICAgICpcclxuICAgICAqIE5vdGU6IElmIHtAbGluayBBdWdtZW50ZWRWaXJ0dWFsaXR5I21hbnVhbEFsaWdubWVudH0gaXMgZW5hYmxlZCBhbmQgdGhlIHN0YXRlIGlzIGNoYW5nZWQgaXQgd2lsbCBiZSBkaXNhYmxlZC5cclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgQXVnbWVudGVkVmlydHVhbGl0eS5wcm90b3R5cGVcclxuICAgICAqIEBtZW1iZXIge0Jvb2xlYW59IGVuYWJsZWRcclxuICAgICAqL1xuICAgIF9rbm9ja291dDIuZGVmYXVsdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZW5hYmxlZCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRMb29wUnVubmluZygpIHx8IHRoaXMuX21hbnVhbEFsaWdubWVudDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQoZW5hYmxlKSB7XG4gICAgICAgICAgICBpZiAoZW5hYmxlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZW5hYmxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0QWxpZ25tZW50KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbmFibGUgIT09IHRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIGFyZSBjaGFuZ2luZyB0aGUgZW5hYmxlZCBzdGF0ZSB0aGVuIGRpc2FibGUgbWFudWFsIGFsaWdubWVudC5cbiAgICAgICAgICAgICAgICAvLyBXZSBvbmx5IGRvIHRoaXMgaWYgd2UgYXJlIGNoYW5naW5nIHRoZSBlbmFibGVkIHN0YXRlIHNvIHRoYXQgdGhlIGNsaWVudCBjYW4gcmVwZWF0ZWRseSBjYWxsIHRoZVxuICAgICAgICAgICAgICAgIC8vIHNldHRpbmcgd2l0aG91dCBoYXZpbmcgYW55IGVmZmVjdCBpZiB0aGV5IGFyZW4ndCBjaGFuZ2luZyB0aGUgZW5hYmxlZCBzdGF0ZSwgYnV0IHNvIHRoYXQgZXZlcnkgdGltZVxuICAgICAgICAgICAgICAgIC8vIHRoYXQgdGhlIHN0YXRlIGlzIGNoYW5nZWQgdGhhdCB0aGUgbWFudWFsIGFsaWdubWVudCBpcyB0dXJuZWQgYmFjayBvZmYgaW5pdGFsbHkuXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFudWFsQWxpZ25tZW50ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9zdGFydEV2ZW50TG9vcChlbmFibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcclxuICAgICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIG1hbnVhbCByZWFsaWdubWVudCBtb2RlIGlzIGN1cnJlbnRseSBlbmFibGVkICh0cnVlKSBvciBub3QgKGZhbHNlKS5cclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgQXVnbWVudGVkVmlydHVhbGl0eS5wcm90b3R5cGVcclxuICAgICAqIEBtZW1iZXIge0Jvb2xlYW59IG1hbnVhbEFsaWdubWVudFxyXG4gICAgICovXG4gICAgX2tub2Nrb3V0Mi5kZWZhdWx0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtYW51YWxBbGlnbm1lbnQnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldE1hbnVhbEFsaWdubWVudCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldChzdGFydEVuZCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0TWFudWFsQWxpZ25tZW50KHN0YXJ0RW5kKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHdoZXRoZXIgYSBtYW51YWwgcmVhbGlnbm1lbnQgaGFzIGJlZW4gc3BlY2lmaWVkICh0cnVlKSBvciBub3QgKGZhbHNlKS5cclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgQXVnbWVudGVkVmlydHVhbGl0eS5wcm90b3R5cGVcclxuICAgICAqIEBtZW1iZXIge0Jvb2xlYW59IG1hbnVhbEFsaWdubWVudFNldFxyXG4gICAgICovXG4gICAgX2tub2Nrb3V0Mi5kZWZhdWx0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtYW51YWxBbGlnbm1lbnRTZXQnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWxpZ25BbHBoYSAhPT0gMC4wIHx8IHRoaXMuX3JlYWxpZ25IZWFkaW5nICE9PSAwLjA7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgaG92ZXIgbGV2ZWwuXHJcbiAgICAgKlxyXG4gICAgICogVXNlIDxjb2RlPkF1Z21lbnRlZFZpcnR1YWxpdHkuUFJFU0VUX0hFSUdIVFMubGVuZ3RoPC9jb2RlPiB0byBmaW5kIHRoZSB0b3RhbCBhdmFsaWFibGUgbGV2ZWxzLlxyXG4gICAgICpcclxuICAgICAqIEBtZW1iZXJPZiBBdWdtZW50ZWRWaXJ0dWFsaXR5LnByb3RvdHlwZVxyXG4gICAgICogQG1lbWJlciB7aW50fSBob3ZlckxldmVsXHJcbiAgICAgKi9cbiAgICBfa25vY2tvdXQyLmRlZmF1bHQuZGVmaW5lUHJvcGVydHkodGhpcywgJ2hvdmVyTGV2ZWwnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hvdmVyTGV2ZWw7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSB0aGUgbWF4aW11bSBudW1iZXIgb2YgdGltZXMgdGhhdCB0aGUgY2FtZXJhIG9yaWVudGF0aW9uIHdpbGwgYmUgdXBkYXRlZCBwZXIgc2Vjb25kLiBUaGlzIGlzXHJcbiAgICAgKiB0aGUgbnVtYmVyIG9mIGNhbWVyYSBvcmllbnRhdGlvbiB1cGRhdGVzIHBlciBzZWNvbmRzIGlzIGNhcHBlZCB0byAoZXhwbGljaXRseSB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZVxyXG4gICAgICogb3JpZW50YXRpb24gaXMgdXBkYXRlZCBwZXIgc2Vjb25kIG1pZ2h0IGJlIGxlc3MgYnV0IGl0IHdvbid0IGJlIG1vcmUgdGhlbiB0aGlzIG51bWJlcikuIFdlIHdhbnQgdGhlIG51bWJlciBvZlxyXG4gICAgICogdGltZXMgdGhhdCB0aGUgb3JpZW50YXRpb24gaXMgdXBkYXRlZCBjYXBwZWQgc28gdGhhdCB3ZSBkb24ndCBjb25zdW1lIHRvIG11Y2ggYmF0dGVyeSBsaWZlIHVwZGF0aW5nIHRvXHJcbiAgICAgKiBmcmVxdWVudGx5LCBidXQgcmVzcG9uc2l2ZW5lc3MgaXMgc3RpbGwgYWNjZXB0YWJsZS5cclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgQXVnbWVudGVkVmlydHVhbGl0eS5wcm90b3R5cGVcclxuICAgICAqIEBtZW1iZXIge0Zsb2F0fSBtYXhpbXVtVXBkYXRlc1BlclNlY29uZFxyXG4gICAgICovXG4gICAgX2tub2Nrb3V0Mi5kZWZhdWx0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtYXhpbXVtVXBkYXRlc1BlclNlY29uZCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4aW11bVVwZGF0ZXNQZXJTZWNvbmQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gc2V0KG1heGltdW1VcGRhdGVzUGVyU2Vjb25kKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXhpbXVtVXBkYXRlc1BlclNlY29uZCA9IG1heGltdW1VcGRhdGVzUGVyU2Vjb25kO1xuXG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgY3VycmVudGx5IGVuYWJsZWQgcmVzZXQgdG8gdXBkYXRlIHRoZSB0aW1pbmcgaW50ZXJ2YWwgdXNlZC5cbiAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudExvb3BSdW5uaW5nKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGFydEV2ZW50TG9vcChmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnRFdmVudExvb3AodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xufTtcblxuLyoqXHJcbiAqIEdldHMgdGhlIHRoZSBtYXhpbXVtIG51bWJlciBvZiB0aW1lcyB0aGF0IHRoZSBjYW1lcmEgb3JpZW50YXRpb24gd2lsbCBiZSB1cGRhdGVkIHBlciBzZWNvbmQgYnkgZGVmYXVsdC4gVGhpcyBpcyB0aGVcclxuICogbnVtYmVyIG9mIGNhbWVyYSBvcmllbnRhdGlvbiB1cGRhdGVzIHBlciBzZWNvbmRzIGlzIGNhcHBlZCB0byBieSBkZWZhdWx0IChleHBsaWNpdGx5IHRoZSBudW1iZXIgb2YgdGltZXMgdGhlXHJcbiAqIG9yaWVudGF0aW9uIGlzIHVwZGF0ZWQgcGVyIHNlY29uZCBtaWdodCBiZSBsZXNzIGJ1dCBpdCB3b24ndCBiZSBtb3JlIHRoZW4gdGhpcyBudW1iZXIpLiBXZSB3YW50IHRoZSBudW1iZXIgb2YgdGltZXNcclxuICogdGhhdCB0aGUgb3JpZW50YXRpb24gaXMgdXBkYXRlZCBjYXBwZWQgc28gdGhhdCB3ZSBkb24ndCBjb25zdW1lIHRvIG11Y2ggYmF0dGVyeSBsaWZlIHVwZGF0aW5nIHRvIGZyZXF1ZW50bHksIGJ1dFxyXG4gKiByZXNwb25zaXZlbmVzcyBpcyBzdGlsbCBhY2NlcHRhYmxlLlxyXG4gKi9cbkF1Z21lbnRlZFZpcnR1YWxpdHkuREVGQVVMVF9NQVhJTVVNX1VQREFURVNfUEVSX1NFQ09ORCA9IDEwLjA7XG5cbi8qKlxyXG4gKiBUaGUgbWluaW11bSBoZWlnaHQgdGhhdCB0aGUgdmlld2VyIGlzIGFsbG93ZWQgdG8gaG92ZXIgYXQuXHJcbiAqL1xuQXVnbWVudGVkVmlydHVhbGl0eS5NSU5JTVVNX0hPVkVSX0hFSUdIVCA9IDIwLjA7XG5cbi8qIFRoZXNlIGFyZSB0aGUgaGVpZ2h0cyB0aGF0IHdlIGNhbiB0b2dnbGUgdGhyb3VnaCAoaW4gbWV0ZXJzIC0gYWJvdmUgdGhlIHN1cmZhY2UgaGVpZ2h0KS5cclxuICovXG5BdWdtZW50ZWRWaXJ0dWFsaXR5LlBSRVNFVF9IRUlHSFRTID0gWzEwMDAsIDI1MCwgMjBdO1xuXG4vKipcclxuICogVG9nZ2xlcyB3aGV0aGVyIHRoZSBBdWdtZW50ZWRWaXJ1dHVhbGl0eSBtb2RlIGlzIGVuYWJsZWQgb3IgZGlzYWJsZWQuXHJcbiAqL1xuQXVnbWVudGVkVmlydHVhbGl0eS5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSAhdGhpcy5lbmFibGVkO1xufTtcblxuLyoqXHJcbiAqIFRvZ2dsZXMgd2hldGhlciBtYW51YWwgYWxpZ25lbWVudCBpcyBlbmFibGVkIG9yIGRpc2FibGVkLlxyXG4gKi9cbkF1Z21lbnRlZFZpcnR1YWxpdHkucHJvdG90eXBlLnRvZ2dsZU1hbnVhbEFsaWdubWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1hbnVhbEFsaWdubWVudCA9ICF0aGlzLm1hbnVhbEFsaWdubWVudDtcbn07XG5cbi8qKlxyXG4gKiBSZXNldHMgdGhlIGFsaWdubWVudCBzbyB0aGF0IHRoZSBhbGlnbmVtZW50IG1hdGNoZXMgdGhlIGRldmljZXMgYWJzb2x1dGUgYWxpZ25tZW50LlxyXG4gKi9cbkF1Z21lbnRlZFZpcnR1YWxpdHkucHJvdG90eXBlLnJlc2V0QWxpZ25tZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX29yaWVudGF0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgdGhpcy5fcmVhbGlnbkFscGhhID0gMDtcbiAgICB0aGlzLl9yZWFsaWduSGVhZGluZyA9IDA7XG59O1xuXG4vKipcclxuICogVG9nZ2xlcyB0aGUgdmlld2VyIGJldHdlZW4gYSByYW5nZSBvZiBwcmVkZWZpbmVkIGhlaWdodHMsIHNldHRpbmcgdGhlIGNhbWVyYXMgb3JpZW50YXRpb24gc28gdGhhdCBpdCBtYXRjaGVzIHRoZVxyXG4gKiBjb3JyZWN0IG9yaWVudGF0aW9uLlxyXG4gKi9cbkF1Z21lbnRlZFZpcnR1YWxpdHkucHJvdG90eXBlLnRvZ2dsZUhvdmVySGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2hvdmVyTGV2ZWwgPSAodGhpcy5faG92ZXJMZXZlbCArIDEpICUgQXVnbWVudGVkVmlydHVhbGl0eS5QUkVTRVRfSEVJR0hUUy5sZW5ndGg7XG5cbiAgICB0aGlzLmhvdmVyKEF1Z21lbnRlZFZpcnR1YWxpdHkuUFJFU0VUX0hFSUdIVFNbdGhpcy5faG92ZXJMZXZlbF0pO1xufTtcblxuLyoqXHJcbiAqIE1vdmVzIHRoZSB2aWV3ZXIgdG8gYSBzcGVjaWZpZWQgaGVpZ2h0LCBzZXR0aW5nIHRoZSBvcmllbnRhdGlvbiBzbyB0aGF0IGl0IG1hdGNoZXMgdGhlIGNvcnJlY3QgQXVnbWVudGVkIFZpcnR1YWxpdHlcclxuICogb3JpZW50YXRpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB7RmxvYXR9IGhlaWdodCBUaGUgaGVpZ2h0IGluIE1ldGVycyBhYm92ZSB0aGUgZ2xvYmUgc3VyZmFjZS4gTm90ZTogSWYgaGVpZ2h0IGlzIGJlbG93XHJcbiAqICAgICAgICAgICAgICAgICAgICAgICB7QGxpbmsgQXVnbWVudGVkVmlydHVhbGl0eS5NSU5JTVVNX0hPVkVSX0hFSUdIVH0gdGhlIGhlaWdodCB3aWxsIGJlIHNldCB0b1xyXG4gKiAgICAgICAgICAgICAgICAgICAgICAge0BsaW5rIEF1Z21lbnRlZFZpcnR1YWxpdHkuTUlOSU1VTV9IT1ZFUl9IRUlHSFR9IHRvIGF2b2lkIHZpc3VhbCBhcnRpZmFjdHMgd2hlbiB0aGUgdmlld2VyXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICBiZWNvbWVzIHRvIGNsb3NlIHRvIHRoZSBzdXJmYWNlLlxyXG4gKiBAcGFyYW0ge0NhcnRvZ3JhcGhpY30gW3Bvc2l0aW9uXSBUaGUgbG9jYXRpb24gdG8gaG92ZXIgb3Zlci4gSWYgbm90IHNwZWNpZmllZCB0aGUgY3VycmVudCBjYW1lcmEgbG9jYXRpb24gd2lsbCBiZSB1c2VkLlxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtmbHlUbz10cnVlXSBXaGV0aGVyIHRvIGZseSB0byB0aGUgbG9jYXRpb24gKHRydWUpIG9yIHdoZXRoZXIgdG8ganVtcCB0byB0aGUgbG9jYXRpb24gKGZhbHNlKS5cclxuICovXG5BdWdtZW50ZWRWaXJ0dWFsaXR5LnByb3RvdHlwZS5ob3ZlciA9IGZ1bmN0aW9uIChoZWlnaHQsIHBvc2l0aW9uLCBmbHlUbykge1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIC8vIEdldCBhY2Nlc3MgdG8gdGhlIGNhbWVyYS4uLmlmIGl0IGlzIG5vdCBhdmFsaWFibGUgd2UgY2FuJ3Qgc2V0IHRoZSBuZXcgaGVpZ2h0IHNvIGp1c3QgcmV0dXJuIG5vdy5cbiAgICBpZiAoISgwLCBfZGVmaW5lZDIuZGVmYXVsdCkodGhpcy5fdGVycmlhLmNlc2l1bSkgfHwgISgwLCBfZGVmaW5lZDIuZGVmYXVsdCkodGhpcy5fdGVycmlhLmNlc2l1bS52aWV3ZXIpIHx8ICEoMCwgX2RlZmluZWQyLmRlZmF1bHQpKHRoaXMuX3RlcnJpYS5jZXNpdW0udmlld2VyLmNhbWVyYSkpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBjYW1lcmEgPSB0aGlzLl90ZXJyaWEuY2VzaXVtLnZpZXdlci5jYW1lcmE7XG5cbiAgICBpZiAoISgwLCBfZGVmaW5lZDIuZGVmYXVsdCkocG9zaXRpb24pKSB7XG4gICAgICAgIHBvc2l0aW9uID0gY2FtZXJhLnBvc2l0aW9uQ2FydG9ncmFwaGljLmNsb25lKCk7XG4gICAgfVxuXG4gICAgZmx5VG8gPSAoMCwgX2RlZmF1bHRWYWx1ZTIuZGVmYXVsdCkoZmx5VG8sIHRydWUpO1xuXG4gICAgLy8gQ2xhbXAgdGhlIG1pbmltdW0gaG92ZXIgaGVpZ2h0IChoZWlnaHRzIGJlbG93IHRoaXMgdmFsdWUgY291bGQgbGVhZCB0byBwb29yIHZpc3VhbCBhcnRpZmFjdHMpLlxuICAgIGlmIChoZWlnaHQgPCBBdWdtZW50ZWRWaXJ0dWFsaXR5Lk1JTklNVU1fSE9WRVJfSEVJR0hUKSB7XG4gICAgICAgIGhlaWdodCA9IEF1Z21lbnRlZFZpcnR1YWxpdHkuTUlOSU1VTV9IT1ZFUl9IRUlHSFQ7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgdGhlIHZpZXdlciBoZWlnaHQuXG4gICAgZnVuY3Rpb24gZmx5VG9IZWlnaHQoc3VyZmFjZUhlaWdodCkge1xuICAgICAgICBpZiAoKDAsIF9kZWZpbmVkMi5kZWZhdWx0KShzdXJmYWNlSGVpZ2h0KSkge1xuICAgICAgICAgICAgaGVpZ2h0ICs9IHN1cmZhY2VIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSBfQ2FydGVzaWFuMi5kZWZhdWx0LmZyb21SYWRpYW5zKHBvc2l0aW9uLmxvbmdpdHVkZSwgcG9zaXRpb24ubGF0aXR1ZGUsIGhlaWdodCk7XG4gICAgICAgIHZhciBwb3NlID0gdGhhdC5fZ2V0Q3VycmVudE9yaWVudGF0aW9uKCk7XG4gICAgICAgIHBvc2UuZGVzdGluYXRpb24gPSBuZXdQb3NpdGlvbjtcblxuICAgICAgICBpZiAoZmx5VG8pIHtcbiAgICAgICAgICAgIGNhbWVyYS5mbHlUbyhwb3NlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbWVyYS5zZXRWaWV3KHBvc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTmVlZGVkIG9uIG1vYmlsZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgcmVuZGVyIGlzIG1hcmtlZCBhcyBkaXJ0eSBzbyB0aGF0IG9uY2UgQVYgbW9kZSBoYXMgYmVlbiBkaXNhYmxlZCBmb3IgYVxuICAgICAgICAvLyB3aGlsZSBhbmQgdGhlbiBpcyByZWVuYWJsZWQgdGhlIC5zZXRWaWV3KCkgZnVuY3Rpb24gc3RpbGwgaGFzIGVmZmVjdCAob3RoZXJ3aXNlIGRpc3BpdGUgdGhlIGNhbGwgdGhlIC5zZXRWaWV3KClcbiAgICAgICAgLy8gdGhlIHZpZXcgb3JpZW50YXRpb24gZG9lcyBub3QgdmlzdWFsbHkgdXBkYXRlIHVudGlsIHRoZSB1c2VyIG1hbnVhbHkgbW92ZXMgdGhlIGNhbWVyYSBwb3NpdGlvbikuXG4gICAgICAgIHRoYXQuX3RlcnJpYS5jdXJyZW50Vmlld2VyLm5vdGlmeVJlcGFpbnRSZXF1aXJlZCgpO1xuICAgIH1cblxuICAgIC8vIEdldCB0aGUgZ3JvdW5kIHN1cmZhY2UgaGVpZ2h0IGF0IHRoaXMgbG9jYXRpb24gYW5kIG9mZnNldCB0aGUgaGVpZ2h0IGJ5IGl0LlxuICAgIGlmICghKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtKSB8fCAhKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtLnNjZW5lKSB8fCAhKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtLnNjZW5lLnRlcnJhaW5Qcm92aWRlcikgfHwgdGhpcy5fdGVycmlhLmNlc2l1bS5zY2VuZS50ZXJyYWluUHJvdmlkZXIgaW5zdGFuY2VvZiBfRWxsaXBzb2lkVGVycmFpblByb3ZpZGVyMi5kZWZhdWx0KSB7XG4gICAgICAgIC8vIElmIHdlIGNhbid0IGdldCBhY2Nlc3MgdG8gdGhlIHRlcnJhaW4gcHJvdmlkZXIgb3Igd2UgY2FuIGdldCBhY2Nlc3MgdG8gdGhlIHRlcnJhaW4gcHJvdmlkZXIgYW5kIHRoZSBwcm92aWRlciBpcyBqdXN0IHRoZSBFbGxpcHNvaWQgdGhlbiB1c2UgdGhlIGhlaWdodCBvZiAwLlxuICAgICAgICBmbHlUb0hlaWdodCgwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGVycmFpblByb3ZpZGVyID0gdGhpcy5fdGVycmlhLmNlc2l1bS5zY2VuZS50ZXJyYWluUHJvdmlkZXI7XG4gICAgICAgICgwLCBfc2FtcGxlVGVycmFpbk1vc3REZXRhaWxlZDIuZGVmYXVsdCkodGVycmFpblByb3ZpZGVyLCBbcG9zaXRpb25dKS50aGVuKGZ1bmN0aW9uICh1cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICAgIGZseVRvSGVpZ2h0KHVwZGF0ZWRQb3NpdGlvblswXS5oZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG4vKipcclxuICogTW92ZXMgdGhlIHZpZXdlciB0byBhIHNwZWNpZmllZCBsb2NhdGlvbiB3aGlsZSBtYWludGFpbmluZyB0aGUgY3VycmVudCBoZWlnaHQgYW5kIHRoZSBjb3JyZWN0IEF1Z21lbnRlZCBWaXJ0dWFsaXR5XHJcbiAqIG9yaWVudGF0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0NhcnRvZ3JhcGhpY30gcG9zaXRpb24gVGhlIGxvY2F0aW9uIHRvIGhvdmVyIG1vdmUgdG8uXHJcbiAqIEBwYXJhbSB7RmxvYXR9IFttYXhpbXVtSGVpZ2h0XSBUaGUgbWF4aW11bSBoZWlnaHQgKGluIG1ldGVycykgdG8gY2FwIHRoZSBjdXJyZW50IGNhbWVyYSBoZWlnaHQgdG8gKGlmIHRoaXMgdmFsdWUgaXNcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNpZmllZCBhbmQgdGhlIHZpZXdlciBpcyBhYm92ZSB0aGlzIGhlaWdodCB0aGUgY2FtZXJhIHdpbGwgYmUgcmVzdHJpY3RlZCB0byB0aGlzIGhlaWdodCkuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ZseVRvXSBXaGV0aGVyIHRvIGZseSB0byB0aGUgbG9jYXRpb24gKHRydWUpIG9yIHdoZXRoZXIgdG8ganVtcCB0byB0aGUgbG9jYXRpb24gKGZhbHNlKS5cclxuICpcclxuICogV2hlbiB0aGUgbWFudWFsIGFsaWdubWVudCBpcyBlbmFibGVkIHRoaXMgZnVuY3Rpb24gaGFzIG5vIGVmZmVjdC5cclxuICovXG5BdWdtZW50ZWRWaXJ0dWFsaXR5LnByb3RvdHlwZS5tb3ZlVG8gPSBmdW5jdGlvbiAocG9zaXRpb24sIG1heGltdW1IZWlnaHQsIGZseVRvKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgLy8gSWYgd2UgYXJlIGluIG1hbnVhbCBhbGlnbm1lbnQgbW9kZSB3ZSBkb24ndCBhbGxvdyB0aGUgdmlld2VyIHRvIG1vdmUgKHNpbmNlIHRoaXMgd291bGQgY3JlYXRlIGEgamFyaW5nIFVYIGZvciBtb3N0IHVzZSBjYXNlcykuXG4gICAgaWYgKHRoaXMuX21hbnVhbEFsaWdubWVudCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gR2V0IGFjY2VzcyB0byB0aGUgY2FtZXJhLi4uaWYgaXQgaXMgbm90IGF2YWxpYWJsZSB3ZSBjYW4ndCBnZXQgdGhlIGN1cnJlbnQgaGVpZ2h0IChvciBzZXQgdGhlIG5ldyBsb2NhdGlvbikgc28ganVzdCByZXR1cm4gbm93LlxuICAgIGlmICghKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtKSB8fCAhKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtLnZpZXdlcikgfHwgISgwLCBfZGVmaW5lZDIuZGVmYXVsdCkodGhpcy5fdGVycmlhLmNlc2l1bS52aWV3ZXIuY2FtZXJhKSkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGNhbWVyYSA9IHRoaXMuX3RlcnJpYS5jZXNpdW0udmlld2VyLmNhbWVyYTtcblxuICAgIHZhciBjYW1lcmFQb3NpdGlvbiA9IGNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYy5jbG9uZSgpO1xuICAgIHZhciB2aWV3ZXJIZWlnaHQgPSBjYW1lcmFQb3NpdGlvbi5oZWlnaHQ7XG5cbiAgICAvLyBSZXNldCB0aGUgdmlld2VyIGhlaWdodC5cbiAgICBmdW5jdGlvbiBtb3ZlVG9Mb2NhdGlvbihzdXJmYWNlSGVpZ2h0KSB7XG4gICAgICAgIGlmICghKDAsIF9kZWZpbmVkMi5kZWZhdWx0KShzdXJmYWNlSGVpZ2h0KSkge1xuICAgICAgICAgICAgc3VyZmFjZUhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaG92ZXJIZWlnaHQgPSB2aWV3ZXJIZWlnaHQgLSBzdXJmYWNlSGVpZ2h0O1xuICAgICAgICBpZiAoKDAsIF9kZWZpbmVkMi5kZWZhdWx0KShtYXhpbXVtSGVpZ2h0KSAmJiBob3ZlckhlaWdodCA+IG1heGltdW1IZWlnaHQpIHtcblxuICAgICAgICAgICAgaG92ZXJIZWlnaHQgPSBtYXhpbXVtSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhhdC5ob3Zlcihob3ZlckhlaWdodCwgcG9zaXRpb24sIGZseVRvKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIGdyb3VuZCBzdXJmYWNlIGhlaWdodCBhdCB0aGlzIGxvY2F0aW9uIGFuZCBvZmZzZXQgdGhlIGhlaWdodCBieSBpdC5cbiAgICBpZiAoISgwLCBfZGVmaW5lZDIuZGVmYXVsdCkodGhpcy5fdGVycmlhLmNlc2l1bSkgfHwgISgwLCBfZGVmaW5lZDIuZGVmYXVsdCkodGhpcy5fdGVycmlhLmNlc2l1bS5zY2VuZSkgfHwgISgwLCBfZGVmaW5lZDIuZGVmYXVsdCkodGhpcy5fdGVycmlhLmNlc2l1bS5zY2VuZS50ZXJyYWluUHJvdmlkZXIpIHx8IHRoaXMuX3RlcnJpYS5jZXNpdW0uc2NlbmUudGVycmFpblByb3ZpZGVyIGluc3RhbmNlb2YgX0VsbGlwc29pZFRlcnJhaW5Qcm92aWRlcjIuZGVmYXVsdCkge1xuICAgICAgICAvLyBJZiB3ZSBjYW4ndCBnZXQgYWNjZXNzIHRvIHRoZSB0ZXJyYWluIHByb3ZpZGVyIG9yIHdlIGNhbiBnZXQgYWNjZXNzIHRvIHRoZSB0ZXJyYWluIHByb3ZpZGVyIGFuZCB0aGUgcHJvdmlkZXIgaXMganVzdCB0aGUgRWxsaXBzb2lkIHRoZW4gdXNlIHRoZSBoZWlnaHQgb2YgMC5cbiAgICAgICAgbW92ZVRvTG9jYXRpb24odW5kZWZpbmVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGVycmFpblByb3ZpZGVyID0gdGhpcy5fdGVycmlhLmNlc2l1bS5zY2VuZS50ZXJyYWluUHJvdmlkZXI7XG4gICAgICAgICgwLCBfc2FtcGxlVGVycmFpbk1vc3REZXRhaWxlZDIuZGVmYXVsdCkodGVycmFpblByb3ZpZGVyLCBbY2FtZXJhUG9zaXRpb25dKS50aGVuKGZ1bmN0aW9uICh1cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICAgIG1vdmVUb0xvY2F0aW9uKHVwZGF0ZWRQb3NpdGlvblswXS5oZWlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG4vKipcclxuICogV2hldGhlciB0aGUgdXNlciBpcyBjdXJyZW50bHkgc2V0dGluZyBhIG1hbnVhbCBhbGlnbm1lbnQuXHJcbiAqXHJcbiAqIFNlZSBhbHNvIHtAbGluayBBdWdtZW50ZWRWaXJ0dWFsaXR5I19zZXRNYW51YWxBbGlnbm1lbnR9LlxyXG4gKlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBzZXR0aW5nIGEgbWFudWFsIGFsaWdubWVudCAodHJ1ZSkgb3Igbm90IChmYWxzZSkuXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xuQXVnbWVudGVkVmlydHVhbGl0eS5wcm90b3R5cGUuX2dldE1hbnVhbEFsaWdubWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmFibGVkICYmIHRoaXMuX21hbnVhbEFsaWdubWVudDtcbn07XG5cbi8qKlxyXG4gKiBTdGFydHMgLyBzdG9wcyBtYW51YWwgYWxpZ25tZW50LlxyXG4gKlxyXG4gKiBXaGVuIG1hbnVhbCByZWFsaWdubWVudCBpcyBlbmFibGVkIGl0IGFsbG93cyB0aGUgdXNlciB0byBzcGVjaWZ5IGEgbmV3IG9yaWdpbiBmb3IgdGhlIGFsaWdubWVudCBiZXR3ZWVuIHRoZSBkZXZpY2VzXHJcbiAqIHBoeXNpY2FsIGFuZCB2aXJ0dWFsIGFsaWdubWVudC4gV2hlbiBtYW51YWwgYWxpZ25tZW50IGlzIGVuYWJsZWQgdGhlIG9yaWVudGF0aW9uIGlzIGxvY2tlZCwgdG8gYWxsb3cgdGhlIHVzZXIgdG9cclxuICogcmVhbGlnbiBhIHZpc3VhbCBsYW5kbWFyayB3aXRoIGEgcGh5c2ljYWwgbGFuZG1hcmsuXHJcbiAqXHJcbiAqIE5vdGU6IE1hbnVhbCBhbGlnbm1lbnQgaXMgb25seSBkb25lIGZvciB0aGUgaGVhZGluZyBheGlzLCB0aGlzIGlzIGJlY2F1c2UgaW4gcHJhY3RpY2Ugd2UgaGF2ZSBmb3VuZCB0aGF0IHRoZSBoZWFkaW5nXHJcbiAqIGF4aXMgaXMgb2Z0ZW4gb3V0IGFzIG1vYmlsZSBkZXZpY2VzIHNlZW0gdG8gaGF2ZSBkaWZmaWN1bHR5IG9idGFpbmluZyB0aGUgY29tcGFzcyBkaXJlY3Rpb24sIGJ1dCBzZWVtIHRvIHBlcmZvcm1cclxuICogcmVsYXRpdmVseSB3ZWxsIGluIHRoZSBvdGhlciBheGVzLlxyXG4gKlxyXG4gKiBOb3RlOiBSZWFsaWdubWVudCBpcyBvbmx5IHBvc3NpYmxlIHdoZW4gQXVnbWVudGVkVmlydHVhbGl0eSBpcyBlbmFibGVkLiBJZiBBdWdtZW50ZWRWaXJ0dWFsaXR5IGlzIGRpc2FibGVkIHdoaWxlXHJcbiAqICAgICAgIG1hbnVhbCBhbGlnbm1lbnQgaXMgaW4gcHJvZ3Jlc3MgaXQgd2lsbCBiZSBjYW5jZWxsZWQuXHJcbiAqXHJcbiAqIFNlZSBhbHNvIHtAbGluayBBdWdtZW50ZWRWaXJ0dWFsaXR5I19nZXRNYW51YWxBbGlnbm1lbnR9LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHN0YXJ0RW5kIFdoZXRoZXIgdGhlIHVzZXIgaXMgc3RhcnRpbmcgKHRydWUpIG9yIGVuZGluZyAoZmFsc2UpIHRoZSByZWFsaWdubWVudC5cclxuICogQHByaXZhdGVcclxuICovXG5BdWdtZW50ZWRWaXJ0dWFsaXR5LnByb3RvdHlwZS5fc2V0TWFudWFsQWxpZ25tZW50ID0gZnVuY3Rpb24gKHN0YXJ0RW5kKSB7XG4gICAgLy8gT25seSBhbGxvdyBtYW51YWwgYWxpZ25tZW50IGNoYW5nZXMgd2hlbiB0aGUgbW9kdWxlIGlzIGVuYWJsZWQuXG4gICAgaWYgKHRoaXMuZW5hYmxlZCAhPT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2FuaXRpc2UgdGhlIGlucHV0IHZhbHVlIHRvIGEgYm9vbGVhbi5cbiAgICBpZiAoc3RhcnRFbmQgIT09IHRydWUpIHtcbiAgICAgICAgc3RhcnRFbmQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRFbmQgPT09IGZhbHNlICYmICgwLCBfZGVmaW5lZDIuZGVmYXVsdCkodGhpcy5fdGVycmlhLmNlc2l1bSkgJiYgKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtLnZpZXdlcikgJiYgKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtLnZpZXdlci5jYW1lcmEpKSB7XG5cbiAgICAgICAgdGhpcy5fcmVhbGlnbkFscGhhID0gdGhpcy5fYWxwaGE7XG4gICAgICAgIHRoaXMuX3JlYWxpZ25IZWFkaW5nID0gX01hdGgyLmRlZmF1bHQudG9EZWdyZWVzKHRoaXMuX3RlcnJpYS5jZXNpdW0udmlld2VyLmNhbWVyYS5oZWFkaW5nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbWFudWFsQWxpZ25tZW50ICE9PSBzdGFydEVuZCkge1xuICAgICAgICB0aGlzLl9tYW51YWxBbGlnbm1lbnQgPSBzdGFydEVuZDtcbiAgICAgICAgdGhpcy5fc3RhcnRFdmVudExvb3AoIXRoaXMuX21hbnVhbEFsaWdubWVudCk7XG4gICAgfVxufTtcblxuLyoqXHJcbiAqIFdoZXRoZXIgdGhlIGV2ZW50IGxvb3AgaXMgY3VycmVudGx5IHJ1bm5pbmcuXHJcbiAqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGVuYWJsZSBXaGV0aGVyIHRvIHN0YXJ0IHRoZSBldmVudCBsb29wIGlzIGN1cnJlbnRseSBydW5uaW5nICh0cnVlKSBvciBub3QgKGZhbHNlKS5cclxuICogQHByaXZhdGVcclxuICovXG5BdWdtZW50ZWRWaXJ0dWFsaXR5LnByb3RvdHlwZS5fZXZlbnRMb29wUnVubmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl9ldmVudExvb3BTdGF0ZS5pbnRlcnZhbElkKTtcbn07XG5cbi8qKlxyXG4gKiBTdGFydCBvciBzdG9wIHRoZSBBdWdtZW50ZWQgVmlydXR1YWxpdHkgbW9kZSBldmVudCBsb29wLiBXaGVuIGVuYWJsZWQgdGhlIG9yaWVudGF0aW9uIHdpbGwgZWZmZWN0IHRoZSBjYW1lcmFzXHJcbiAqIHZpZXcgYW5kIHdoZW4gZGlzYWJsZWQgdGhlIGRldmljZSBvcmllbnRhdGlvbiB3aWxsIG5vdCBlZmZlY3QgdGhlIGNhbWVyYXMgdmlldy5cclxuICpcclxuICogQHBhcmFtIHtCb29sZWFufSBlbmFibGUgV2hldGhlciB0byBzdGFydCB0aGUgZXZlbnQgbG9vcCAodHJ1ZSkgb3Igc3RvcCB0aGUgZXZlbnQgbG9vcCAoZmFsc2UpLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cbkF1Z21lbnRlZFZpcnR1YWxpdHkucHJvdG90eXBlLl9zdGFydEV2ZW50TG9vcCA9IGZ1bmN0aW9uIChlbmFibGUpIHtcbiAgICAvLyBBcmUgd2UgYWN0dWFsbHkgY2hhbmdpbmcgdGhlIHN0YXRlP1xuICAgIGlmICh0aGlzLl9ldmVudExvb3BSdW5uaW5nKCkgIT09IGVuYWJsZSkge1xuICAgICAgICBpZiAoZW5hYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuX29yaWVudGF0aW9uVXBkYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcnZhbE1zID0gMTAwMCAvIHRoaXMuX21heGltdW1VcGRhdGVzUGVyU2Vjb25kO1xuICAgICAgICAgICAgdmFyIGlkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoYXQuX3VwZGF0ZU9yaWVudGF0aW9uKCk7XG4gICAgICAgICAgICB9LCBpbnRlcnZhbE1zKTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TG9vcFN0YXRlID0geyBpbnRlcnZhbElkOiBpZCB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9ldmVudExvb3BTdGF0ZS5pbnRlcnZhbElkKTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TG9vcFN0YXRlID0ge307XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcclxuICogRGV2aWNlIG9yaWVudGF0aW9uIHVwZGF0ZSBldmVudCBjYWxsYmFjayBmdW5jdGlvbi4gU3RvcmVzIHRoZSB1cGRhdGVkIG9yaWVudGF0aW9uIGludG8gdGhlIG9iamVjdCBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IENvbnRhaW5zIHRoZSB1cGRhdGVkIGRldmljZSBvcmllbnRhdGlvbiAoaW4gLmFscGhhLCAuYmV0YSwgLmdhbW1hKS5cclxuICogQHByaXZhdGVcclxuICovXG5BdWdtZW50ZWRWaXJ0dWFsaXR5LnByb3RvdHlwZS5fc3RvcmVPcmllbnRhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHRoaXMuX2FscGhhID0gZXZlbnQuYWxwaGE7XG4gICAgdGhpcy5fYmV0YSA9IGV2ZW50LmJldGE7XG4gICAgdGhpcy5fZ2FtbWEgPSBldmVudC5nYW1tYTtcbiAgICB0aGlzLl9vcmllbnRhdGlvblVwZGF0ZWQgPSB0cnVlO1xufTtcblxuLyoqXHJcbiAqIFRoaXMgZnVuY3Rpb24gdXBkYXRlcyB0aGUgY2FtZXJhcyBvcmllbnRhdGlvbiB1c2luZyB0aGUgbGFzdCBvcmllbnRhdGlvbiByZWNvcmRlZCBhbmQgdGhlIGN1cnJlbnQgc2NyZWVuIG9yaWVudGF0aW9uLlxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cbkF1Z21lbnRlZFZpcnR1YWxpdHkucHJvdG90eXBlLl91cGRhdGVPcmllbnRhdGlvbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIENoZWNrIGlmIHRoZSBzY3JlZW4gb3JpZW50YXRpb24gaGFzIGNoYW5nZWQgYW5kIG1hcmsgdGhlIG9yaWVudGF0aW9uIHVwZGF0ZWQgaWYgaXQgaGFzLlxuICAgIHZhciBzY3JlZW5PcmllbnRhdGlvbiA9IHRoaXMuX2dldEN1cnJlbnRTY3JlZW5PcmllbnRhdGlvbigpO1xuICAgIGlmIChzY3JlZW5PcmllbnRhdGlvbiAhPT0gdGhpcy5fbGFzdFNjcmVlbk9yaWVudGF0aW9uKSB7XG4gICAgICAgIHRoaXMuX29yaWVudGF0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuX2xhc3RTY3JlZW5PcmllbnRhdGlvbiA9IHNjcmVlbk9yaWVudGF0aW9uO1xuXG4gICAgLy8gT3B0b21pc2UgYnkgb25seSB1cGRhdGluZyB0aGUgY2FtZXJhIHZpZXcgaWYgc29tZSBwYXJ0IG9mIHRoZSBvcmllbnRhdGlvbiBjYWxjdWxhdGlvbiBoYXMgY2hhbmdlZC5cbiAgICBpZiAoIXRoaXMuX29yaWVudGF0aW9uVXBkYXRlZCkge1xuICAgICAgICAvLyBUaGUgb3JpZW50YXRpb24gaGFzIG5vdCBiZWVuIHVwZGF0ZWQgc28gZG9uJ3Qgd2FzdGUgdGltZSBjaGFuZ2luZyB0aGUgb3JpZW50YXRpb24uXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fb3JpZW50YXRpb25VcGRhdGVkID0gZmFsc2U7XG5cbiAgICAvLyBHZXQgYWNjZXNzIHRvIHRoZSBjYW1lcmEuLi5pZiBpdCBpcyBub3QgYXZhbGlhYmxlIHdlIGNhbid0IHNldCB0aGUgb3JpZW50YXRpb24gc28ganVzdCByZXR1cm4gbm93LlxuICAgIGlmICghKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtKSB8fCAhKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLl90ZXJyaWEuY2VzaXVtLnZpZXdlcikgfHwgISgwLCBfZGVmaW5lZDIuZGVmYXVsdCkodGhpcy5fdGVycmlhLmNlc2l1bS52aWV3ZXIuY2FtZXJhKSkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGNhbWVyYSA9IHRoaXMuX3RlcnJpYS5jZXNpdW0udmlld2VyLmNhbWVyYTtcblxuICAgIGNhbWVyYS5zZXRWaWV3KHRoaXMuX2dldEN1cnJlbnRPcmllbnRhdGlvbihzY3JlZW5PcmllbnRhdGlvbikpO1xuXG4gICAgLy8gTmVlZGVkIG9uIG1vYmlsZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgcmVuZGVyIGlzIG1hcmtlZCBhcyBkaXJ0eSBzbyB0aGF0IG9uY2UgQVYgbW9kZSBoYXMgYmVlbiBkaXNhYmxlZCBmb3IgYVxuICAgIC8vIHdoaWxlIGFuZCB0aGVuIGlzIHJlZW5hYmxlZCB0aGUgLnNldFZpZXcoKSBmdW5jdGlvbiBzdGlsbCBoYXMgZWZmZWN0IChvdGhlcndpc2UgZGlzcGl0ZSB0aGUgY2FsbCB0aGUgLnNldFZpZXcoKVxuICAgIC8vIHRoZSB2aWV3IG9yaWVudGF0aW9uIGRvZXMgbm90IHZpc3VhbGx5IHVwZGF0ZSB1bnRpbCB0aGUgdXNlciBtYW51YWx5IG1vdmVzIHRoZSBjYW1lcmEgcG9zaXRpb24pLlxuICAgIHRoaXMuX3RlcnJpYS5jdXJyZW50Vmlld2VyLm5vdGlmeVJlcGFpbnRSZXF1aXJlZCgpO1xufTtcblxuLyoqXHJcbiAqIEdldHMgdGhlIGN1cnJlbnQgb3JpZW50YXRpb24gc3RvcmVkIGluIHRoZSBvYmplY3Qgc3RhdGUgYW5kIHJldHVybnMgdGhlIHJvbGwsIHBpdGNoIGFuZCBoZWFkaW5nIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHNldCB0aGUgY2FtZXJhcyBvcmllbnRhdGlvbi5cclxuICpcclxuICogQHBhcmFtIHtGbG9hdH0gc2NyZWVuT3JpZW50YXRpb24gVGhlIHNjcmVlbiBvcmllbnRhdGlvbiBpbiBkZWdyZWVzLiBOb3RlOiBUaGlzIGZpZWxkIGlzIG9wdGlvbmFsLCBpZiBzdXBwbGllZCB0aGlzIHZhbHVlIHdpbGwgYmUgdXNlZCBmb3IgdGhlIHNjcmVlbiBvcmllbnRhdGlvbiwgb3RoZXJ3aXNlIHRoZSBzY3JlZW4gb3JpZW50YXRpb24gd2lsbCBiZSBvYnRhaW5lZCBkdXJpbmcgdGhlIGV4ZWN1dGlvbiBvZiB0aGlzIGZ1bmN0aW9uLlxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IEEgb2JqZWN0IHdpdGggdGhlIHJvbGwsIHBpdGNoIGFuZCBoZWFkaW5nIHN0b3JlZCBpbnRvIHRoZSBvcmllbnRhdGlvbi5cclxuICogQHByaXZhdGVcclxuICovXG5BdWdtZW50ZWRWaXJ0dWFsaXR5LnByb3RvdHlwZS5fZ2V0Q3VycmVudE9yaWVudGF0aW9uID0gZnVuY3Rpb24gKHNjcmVlbk9yaWVudGF0aW9uKSB7XG4gICAgdmFyIGFscGhhID0gdGhpcy5fYWxwaGE7XG4gICAgdmFyIGJldGEgPSB0aGlzLl9iZXRhO1xuICAgIHZhciBnYW1tYSA9IHRoaXMuX2dhbW1hO1xuXG4gICAgdmFyIHJlYWxpZ25BbHBoYSA9IHRoaXMuX3JlYWxpZ25BbHBoYTtcbiAgICB2YXIgcmVhbGlnbkhlYWRpbmcgPSB0aGlzLl9yZWFsaWduSGVhZGluZztcblxuICAgIGlmICghKDAsIF9kZWZpbmVkMi5kZWZhdWx0KShzY3JlZW5PcmllbnRhdGlvbikpIHtcbiAgICAgICAgc2NyZWVuT3JpZW50YXRpb24gPSB0aGlzLl9nZXRDdXJyZW50U2NyZWVuT3JpZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY29tcHV0ZVRlcnJpYU9yaWVudGF0aW9uKGFscGhhLCBiZXRhLCBnYW1tYSwgc2NyZWVuT3JpZW50YXRpb24sIHJlYWxpZ25BbHBoYSwgcmVhbGlnbkhlYWRpbmcpO1xufTtcblxuLyoqXHJcbiAqIFR1cm5zIHRoZSBvcmllbnRhdGlvbiBpbiB0aGUgZGV2aWNlIGZyYW1lIG9mIHJlZmVyZW5jZSBpbnRvIGFuIG9yaWVudGF0aW9uIHN1aXRhYmxlIGZvciBzcGVjaWZ5aW5nIHRoZSBUZXJyaWEgY2FtZXJhIG9yaWVudGF0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0Zsb2F0fSBhbHBoYSBUaGUgYWxwaGEgdmFsdWUgb2YgdGhlIGRldmljZSBvcmllbnRhdGlvbiBpbiBkZWdyZWVzICh0aGlzIGlzIHRoZSBhbHBoYSB2YWx1ZSBpbiB0aGUgZGV2aWNlJ3MgZnJhbWUgb2YgcmVmZXJlbmNlKS5cclxuICogQHBhcmFtIHtGbG9hdH0gYmV0YSAgVGhlIGJldGEgIHZhbHVlIG9mIHRoZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gZGVncmVlcyAodGhpcyBpcyB0aGUgYmV0YSAgdmFsdWUgaW4gdGhlIGRldmljZSdzIGZyYW1lIG9mIHJlZmVyZW5jZSkuXHJcbiAqIEBwYXJhbSB7RmxvYXR9IGdhbW1hIFRoZSBnYW1tYSB2YWx1ZSBvZiB0aGUgZGV2aWNlIG9yaWVudGF0aW9uIGluIGRlZ3JlZXMgKHRoaXMgaXMgdGhlIGdhbW1hIHZhbHVlIGluIHRoZSBkZXZpY2UncyBmcmFtZSBvZiByZWZlcmVuY2UpLlxyXG4gKiBAcGFyYW0ge0Zsb2F0fSBzY3JlZW5PcmllbnRhdGlvbiBUaGUgc2NyZWVuIG9yaWVudGF0aW9uIGluIGRlZ3JlZXMuXHJcbiAqIEBwYXJhbSB7RmxvYXR9IHJlYWxpZ25BbHBoYSAgIFRoZSB2YWx1ZSBvZiB0aGUgYWxwaGEgICB2YWx1ZSB0aGUgbGFzdCB0aW1lIHJlYWxpZ25tZW50IHdhcyBjb21wbGV0ZWQgKHN1cHBseSB6ZXJvIGlmIHJlYWxpZ25tZW50IGlzIG5vdCBzdXBwb3J0ZWQpLlxyXG4gKiBAcGFyYW0ge0Zsb2F0fSByZWFsaWduSGVhZGluZyBUaGUgdmFsdWUgb2YgdGhlIGhlYWRpbmcgdmFsdWUgdGhlIGxhc3QgdGltZSByZWFsaWdubWVudCB3YXMgY29tcGxldGVkIChzdXBwbHkgemVybyBpZiByZWFsaWdubWVudCBpcyBub3Qgc3VwcG9ydGVkKS5cclxuICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCB0aGUgcm9sbCwgcGl0Y2ggYW5kIGhlYWRpbmcgc3RvcmVkIGludG8gdGhlIG9yaWVudGF0aW9uLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cbkF1Z21lbnRlZFZpcnR1YWxpdHkucHJvdG90eXBlLl9jb21wdXRlVGVycmlhT3JpZW50YXRpb24gPSBmdW5jdGlvbiAoYWxwaGEsIGJldGEsIGdhbW1hLCBzY3JlZW5PcmllbnRhdGlvbiwgcmVhbGlnbkFscGhhLCByZWFsaWduSGVhZGluZykge1xuICAgIC8vIE5vdGU6IFRoZSBhbGdvcml0aG1pYyBmb3JtdWxhdGlvbiBpbiB0aGlzIGZ1bmN0aW9uIGlzIGZvciBzaW1wbGljaXR5IG9mIG1hdGhlbWF0aWNhbCBleHByZXNzaW9uLCByZWFkYWJpbGl0eSxcbiAgICAvLyAgICAgICBtYWludGFpbmFiaWxpdHkgYW5kIG1vZGlmaWNhdGlvbiAoaS5lLiBpdCBpcyBlYXN5IHRvIHVuZGVyc3RhbmQgaG93IHRvIHVwZGF0ZSBvciBpbnNlcnQgbmV3IG9mZnNldHMgb3IgZmVhdHVyZXMpLlxuICAgIC8vICAgICAgIFRoaXMgaXMgbm90IHRoZSBzaW1wbGVzdCBmb3JtIHdoaWNoIGNsZWFybHkgZmxvd3MgZnJvbSB0aGUgY3VycmVudCBmb3JtdWxlYXRpb24gYW5kIGNsZWFybHkgc2ltcGxpZnkgdGhlXG4gICAgLy8gICAgICAgbG9naWMgYW5kIG9wZXJhdGlvbnMgYnV0IHdvdWxkIGluY3JlYXNlIHRoZSBjb3N0IG9mIGZ1dHVyZSBtb2RpZmljYXRpb25zIGFuZCByZWR1Y2UgdGhlIHJlYWRhYmlsaXR5IG9mIHRoZVxuICAgIC8vICAgICAgIGV4cHJlc3Npb24uIEl0IGlzIG5vdCBhbnRpY2lwYXRlZCB0aGF0IHRoZSBjdXJyZW50IHZlcmJvc2UgaW1wbGVtZW50YXRpb24gd291bGQgaGF2ZSBhIHNpZ25pZmljYW50IGltcGFjdFxuICAgIC8vICAgICAgIG9uIHBlcmZvcm1hbmNlIG9yIGFjY3VyYWN5LCBidXQgb2J2aW91c2x5IHRoZXJlIHdpbGwgYmUgc29tZSBpbXBhY3Qgb24gYm90aCBhbmQgaXQgY2FuIGJlIHNpbXBsaWZpZWQgaW5cbiAgICAvLyAgICAgICBmdXR1cmUgaWYgbmVlZGVkLlxuXG4gICAgdmFyIHJvdGF0aW9uID0gX01hdHJpeDIuZGVmYXVsdC5jbG9uZShfTWF0cml4Mi5kZWZhdWx0LklERU5USVRZLCByb3RhdGlvbik7XG4gICAgdmFyIHJvdGF0aW9uSW5jcmVtZW50ID0gdm9pZCAwO1xuXG4gICAgLy8gUm9sbCAtIENvdW50ZXJhY3QgdGhlIGNoYW5nZSBpbiB0aGUgKG9yaWVudGF0aW9uKSBmcmFtZSBvZiByZWZlcmVuY2Ugd2hlbiB0aGUgc2NyZWVuIGlzIHJvdGF0ZWQgYW5kIHRoZVxuICAgIC8vICAgICAgICByb3RhdGlvbiBsb2NrIGlzIG5vdCBvbiAodGhlIGJyb3dzZXIgcmVvcmllbnRzIHRoZSBmcmFtZSBvZiByZWZlcmVuY2UgdG8gYWxpZ24gd2l0aCB0aGUgbmV3IHNjcmVlblxuICAgIC8vICAgICAgICBvcmllbnRhdGlvbiAtIHdoZXJlIGFzIHdlIHdhbnQgaXQgb2YgdGhlIGRldmljZSByZWxhdGl2ZSB0byB0aGUgd29ybGQpLlxuICAgIHJvdGF0aW9uSW5jcmVtZW50ID0gX01hdHJpeDIuZGVmYXVsdC5mcm9tUm90YXRpb25aKF9NYXRoMi5kZWZhdWx0LnRvUmFkaWFucyhzY3JlZW5PcmllbnRhdGlvbikpO1xuICAgIF9NYXRyaXgyLmRlZmF1bHQubXVsdGlwbHkocm90YXRpb24sIHJvdGF0aW9uSW5jcmVtZW50LCByb3RhdGlvbik7XG5cbiAgICAvLyBQaXRjaCAtIEFsaWduIHRoZSBkZXZpY2Ugb3JpZW50YXRpb24gZnJhbWUgd2l0aCB0aGUgY2Vhc2l1bSBvcmllbnRhdGlvbiBmcmFtZS5cbiAgICByb3RhdGlvbkluY3JlbWVudCA9IF9NYXRyaXgyLmRlZmF1bHQuZnJvbVJvdGF0aW9uWChfTWF0aDIuZGVmYXVsdC50b1JhZGlhbnMoOTApKTtcbiAgICBfTWF0cml4Mi5kZWZhdWx0Lm11bHRpcGx5KHJvdGF0aW9uLCByb3RhdGlvbkluY3JlbWVudCwgcm90YXRpb24pO1xuXG4gICAgLy8gUm9sbCAtIEFwcGx5IHRoZSBkZWl2Y2Ugcm9sbC5cbiAgICByb3RhdGlvbkluY3JlbWVudCA9IF9NYXRyaXgyLmRlZmF1bHQuZnJvbVJvdGF0aW9uWihfTWF0aDIuZGVmYXVsdC50b1JhZGlhbnMoZ2FtbWEpKTtcbiAgICBfTWF0cml4Mi5kZWZhdWx0Lm11bHRpcGx5KHJvdGF0aW9uLCByb3RhdGlvbkluY3JlbWVudCwgcm90YXRpb24pO1xuXG4gICAgLy8gUGl0Y2ggLSBBcHBseSB0aGUgZGVpdmNlIHBpdGNoLlxuICAgIHJvdGF0aW9uSW5jcmVtZW50ID0gX01hdHJpeDIuZGVmYXVsdC5mcm9tUm90YXRpb25YKF9NYXRoMi5kZWZhdWx0LnRvUmFkaWFucygtYmV0YSkpO1xuICAgIF9NYXRyaXgyLmRlZmF1bHQubXVsdGlwbHkocm90YXRpb24sIHJvdGF0aW9uSW5jcmVtZW50LCByb3RhdGlvbik7XG5cbiAgICAvLyBIZWFkaW5nIC0gQXBwbHkgdGhlIGluY3JlbWVudGFsIGRlaXZjZSBoZWFkaW5nIChmcm9tIHdoZW4gc3RhcnQgd2FzIGxhc3QgdHJpZ2dlcmVkKS5cbiAgICByb3RhdGlvbkluY3JlbWVudCA9IF9NYXRyaXgyLmRlZmF1bHQuZnJvbVJvdGF0aW9uWShfTWF0aDIuZGVmYXVsdC50b1JhZGlhbnMoLShhbHBoYSAtIHJlYWxpZ25BbHBoYSkpKTtcbiAgICBfTWF0cml4Mi5kZWZhdWx0Lm11bHRpcGx5KHJvdGF0aW9uLCByb3RhdGlvbkluY3JlbWVudCwgcm90YXRpb24pO1xuXG4gICAgLy8gSGVhZGluZyAtIFVzZSB0aGUgb2Zmc2V0IHdoZW4gdGhlIG9yaWVudGF0aW9uIHdhcyBsYXN0IHN0YXJ0ZWQuXG4gICAgLy8gICAgICAgICAgIE5vdGU6IFRoaXMgaXMgbG9naWNhbGx5IGRpZmZlcmVudCBmcm9tIHRoZSBhbHBoYSB2YWx1ZSBhbmQgY2FuIG9ubHkgYmUgYXBwbGllZCBoZXJlIGluIHRoZSBzYW1lIHdheVxuICAgIC8vICAgICAgICAgICAgICAgICBzaW5jZSBDZXNpdW0gY2FtZXJhIGlzIFJQSCAoSGVhZGluZyBsYXN0IC0gbW9zdCBsb2NhbCkuIFNlZSBDZXNpdW0gY2FtZXJhIHJvdGF0aW9uIGRlY29tcG9zaXRpb25cbiAgICAvLyAgICAgICAgICAgICAgICAgZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIENlc2l1bSBjYW1lcmEgZm9ybXVsZWF0aW9uLlxuICAgIHJvdGF0aW9uSW5jcmVtZW50ID0gX01hdHJpeDIuZGVmYXVsdC5mcm9tUm90YXRpb25ZKF9NYXRoMi5kZWZhdWx0LnRvUmFkaWFucyhyZWFsaWduSGVhZGluZykpO1xuICAgIF9NYXRyaXgyLmRlZmF1bHQubXVsdGlwbHkocm90YXRpb24sIHJvdGF0aW9uSW5jcmVtZW50LCByb3RhdGlvbik7XG5cbiAgICAvLyBEZWNvbXBvc2Ugcm90YXRpb24gbWF0cml4IGludG8gcm9sbCwgcGl0Y2ggYW5kIGhlYWRpbmcgdG8gc3VwcGx5IHRvIENlc2l1bSBjYW1lcmEuXG4gICAgLy9cbiAgICAvLyBVc2Ugbm90YXRpb246XG4gICAgLy8gICAgIFIgPSBSb2xsLCBQID0gUGl0Y2gsIEggPSBIZWFkaW5nXG4gICAgLy8gICAgIFNIID0gU2luKEhlYWRpbmcpLCBDSCA9IENvcyhIZWFkaW5nKVxuICAgIC8vXG4gICAgLy8gQ2Vhc2l1bSBjYW1lcmEgcm90YXRpb24gPSBSUEg6XG4gICAgLy8gICAgIFsgQ1IsIC1TUiwgICAwXVsgIDEsICAgMCwgICAwXVsgQ0gsICAgMCwgIFNIXSAgIFtDUkNILVNSU1BTSCwgLVNSQ1AsIENSU0gtU1JTUENIXVxuICAgIC8vICAgICBbIFNSLCAgQ1IsICAgMF1bICAwLCAgQ1AsICBTUF1bICAwLCAgIDEsICAgMF0gPSBbU1JDSC1DUlNQU0gsICBDUkNQLCBTUlNIK0NSU1BDSF1cbiAgICAvLyAgICAgWyAgMCwgICAwLCAgIDFdWyAgMCwgLVNQLCAgQ1BdWy1TSCwgICAwLCAgQ0hdICAgWyAgIC1DUFNIICAgLCAgIC1TUCwgICAgQ1BDSCAgICBdXG4gICAgLy8gICAgIE5vdGU6IFRoZSBzaWduIGRpZmZlcmVuY2Ugb2YgdGhlIFNpbiB0ZXJtcyBpbiBwaXRjaCBpcyBkaWZmZXJlbnQgdG8gdGhlIHN0YW5kYXJkIHJpZ2h0IGhhbmRlZCByb3RhdGlvbiBzaW5jZVxuICAgIC8vICAgICAgICAgICBDZXNpdW0gcm90YXRlcyBwaXRjaCBpbiB0aGUgbGVmdCBoYW5kZWQgZGlyZWN0aW9uLiBCb3RoIGhlYWRpbmcgYW5kIHJvbGwgYXJlIHJpZ2h0IGhhbmRlZCByb3RhdGlvbnMuXG4gICAgLy9cbiAgICAvLyBVc2UgdGhlIGZvbGxvd2luZyBub3RhdGlvbiB0byByZWZlciB0byBlbGVtZW50cyBpbiB0aGUgQ2VzaXVtIGNhbWVyYSByb3RhdGlvbiBtYXRyaXg6XG4gICAgLy8gICAgIFtSMDAsIFIxMCwgUjIwXVxuICAgIC8vICAgICBbUjAxLCBSMTEsIFIyMV1cbiAgICAvLyAgICAgW1IwMiwgUjEyLCBSMjJdXG4gICAgLy9cbiAgICAvLyBBbHNvIG5vdGU6IFRhbihYKSA9IFNpbihYKSAvIENvcyhYKVxuICAgIC8vXG4gICAgLy8gRGVjb21wb3NlIG1hdHJpeDpcbiAgICAvLyAgICBIID0gQVRhbihUYW4oSCkpID0gQVRhbihTaW4oSCkvQ29zKEgpKSA9IEFUYW4gKFNIIC8gQ0gpID0gQVRhbihDUFNIL0NQQ0gpID0gQVRhbiAoLVIwMiAvIFIyMilcbiAgICAvLyAgICBSID0gQVRhbihUYW4oUikpID0gQVRhbihTaW4oUikvQ29zKFIpKSA9IEFUYW4gKFNSIC8gQ1IpID0gQVRhbihTUkNQL0NSQ1ApID0gQVRhbiAoLVIxMCAvIFIxMSlcbiAgICAvLyAgICBQID0gQVRhbihUYW4oUCkpID0gQVRhbihTaW4oUCkvQ29zKFApKSA9IEFUYW4gKFNQIC8gQ1ApXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTUCA9IC1SMTJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5lZWQgdG8gZmluZCBDUDpcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDUCA9IFNxcnQoQ1BeMilcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IFNxcnQoQ1BeMiooQ0heMitTSF4yKSkgICAgICAgICAgICAgIFNpbmNlOiAoQ29zQF4yICsgU2luQF4yKSA9IDFcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IFNxcnQoKENQXjIpKihDSF4yKSArIChDUF4yKSooU0heMikpIEV4cGFuZFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gU3FydCgoQ1BDSCleMiArIChDUFNIKV4yKSAgICAgICAgICAgU2luY2U6IE5eMipNXjIgPSAoTk0pXjJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IFNxcnQoUjIyXjIgKyAoLVIwMileMikgICAgICAgICAgICAgIFN1YnN0aXR1dGVcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IFNxcnQoUjIyXjIgKyBSMDJeMikgICAgICAgICAgICAgICAgIFNpbmNlOiAoLU4pXjIgPSBOXjJcbiAgICAvLyAgU28gUCA9IEFUYW4gKC1SMTIgLyBTcXJ0KFIyMl4yICsgUjAyXjIpKVxuXG5cbiAgICAvLyBTaW1wbGlmeSBub3RhdGlvbiBmb3IgcmVhZGFiaWxpdHk6XG4gICAgdmFyIHIxMCA9IHJvdGF0aW9uW19NYXRyaXgyLmRlZmF1bHQuQ09MVU1OMVJPVzBdO1xuICAgIHZhciByMTEgPSByb3RhdGlvbltfTWF0cml4Mi5kZWZhdWx0LkNPTFVNTjFST1cxXTtcbiAgICB2YXIgcjAyID0gcm90YXRpb25bX01hdHJpeDIuZGVmYXVsdC5DT0xVTU4wUk9XMl07XG4gICAgdmFyIHIxMiA9IHJvdGF0aW9uW19NYXRyaXgyLmRlZmF1bHQuQ09MVU1OMVJPVzJdO1xuICAgIHZhciByMjIgPSByb3RhdGlvbltfTWF0cml4Mi5kZWZhdWx0LkNPTFVNTjJST1cyXTtcblxuICAgIHZhciBoZWFkaW5nID0gX01hdGgyLmRlZmF1bHQudG9EZWdyZWVzKE1hdGguYXRhbjIoLXIwMiwgcjIyKSk7XG4gICAgdmFyIHJvbGwgPSBfTWF0aDIuZGVmYXVsdC50b0RlZ3JlZXMoTWF0aC5hdGFuMigtcjEwLCByMTEpKTtcbiAgICB2YXIgcGl0Y2ggPSBfTWF0aDIuZGVmYXVsdC50b0RlZ3JlZXMoTWF0aC5hdGFuMigtcjEyLCBNYXRoLnNxcnQocjAyICogcjAyICsgcjIyICogcjIyKSkpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIHRoZSByb2xsLCBwaXRjaCBhbmQgaGVhZGluZyB3ZSBqdXN0IGNvbXB1dGVkLlxuICAgIHJldHVybiB7XG4gICAgICAgIG9yaWVudGF0aW9uOiB7XG4gICAgICAgICAgICByb2xsOiBfTWF0aDIuZGVmYXVsdC50b1JhZGlhbnMocm9sbCksXG4gICAgICAgICAgICBwaXRjaDogX01hdGgyLmRlZmF1bHQudG9SYWRpYW5zKHBpdGNoKSxcbiAgICAgICAgICAgIGhlYWRpbmc6IF9NYXRoMi5kZWZhdWx0LnRvUmFkaWFucyhoZWFkaW5nKVxuICAgICAgICB9XG4gICAgfTtcbn07XG5cbi8qKlxyXG4gKiBHZXRzIHRoZSBjdXJyZW50IHNjcmVlbiBvcmllbnRhdGlvbi5cclxuICpcclxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgY3VycmVudCBzY3JlZW4gb3JpZW50YXRpb24gaW4gZGVncmVlcy5cclxuICogQHByaXZhdGVcclxuICovXG5BdWdtZW50ZWRWaXJ0dWFsaXR5LnByb3RvdHlwZS5fZ2V0Q3VycmVudFNjcmVlbk9yaWVudGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgoMCwgX2RlZmluZWQyLmRlZmF1bHQpKHNjcmVlbi5vcmllbnRhdGlvbikgJiYgKDAsIF9kZWZpbmVkMi5kZWZhdWx0KShzY3JlZW4ub3JpZW50YXRpb24uYW5nbGUpKSB7XG4gICAgICAgIHJldHVybiBzY3JlZW4ub3JpZW50YXRpb24uYW5nbGU7XG4gICAgfVxuXG4gICAgaWYgKCgwLCBfZGVmaW5lZDIuZGVmYXVsdCkod2luZG93Lm9yaWVudGF0aW9uKSkge1xuICAgICAgICByZXR1cm4gd2luZG93Lm9yaWVudGF0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdWdtZW50ZWRWaXJ0dWFsaXR5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzL2xpYi9Nb2RlbHMvQXVnbWVudGVkVmlydHVhbGl0eS5qc1xuLy8gbW9kdWxlIGlkID0gMjMxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDIiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9jcmVhdGVSZWFjdENsYXNzID0gcmVxdWlyZSgnY3JlYXRlLXJlYWN0LWNsYXNzJyk7XG5cbnZhciBfY3JlYXRlUmVhY3RDbGFzczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVSZWFjdENsYXNzKTtcblxudmFyIF9wcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzJyk7XG5cbnZhciBfcHJvcFR5cGVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb3BUeXBlcyk7XG5cbnZhciBfT2JzZXJ2ZU1vZGVsTWl4aW4gPSByZXF1aXJlKCcuLi8uLi9PYnNlcnZlTW9kZWxNaXhpbicpO1xuXG52YXIgX09ic2VydmVNb2RlbE1peGluMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX09ic2VydmVNb2RlbE1peGluKTtcblxudmFyIF9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sID0gcmVxdWlyZSgnLi9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sLnNjc3MnKTtcblxudmFyIF9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2F1Z21lbnRlZF92aXJ0dWFsaXR5X3Rvb2wpO1xuXG52YXIgX0ljb24gPSByZXF1aXJlKCcuLi8uLi9JY29uJyk7XG5cbnZhciBfSWNvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9JY29uKTtcblxudmFyIF9WaWV3ZXJNb2RlID0gcmVxdWlyZSgnLi4vLi4vLi4vTW9kZWxzL1ZpZXdlck1vZGUnKTtcblxudmFyIF9WaWV3ZXJNb2RlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1ZpZXdlck1vZGUpO1xuXG52YXIgX2RlZmluZWQgPSByZXF1aXJlKCd0ZXJyaWFqcy1jZXNpdW0vU291cmNlL0NvcmUvZGVmaW5lZCcpO1xuXG52YXIgX2RlZmluZWQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmaW5lZCk7XG5cbnZhciBfQXVnbWVudGVkVmlydHVhbGl0eSA9IHJlcXVpcmUoJy4uLy4uLy4uL01vZGVscy9BdWdtZW50ZWRWaXJ0dWFsaXR5Jyk7XG5cbnZhciBfQXVnbWVudGVkVmlydHVhbGl0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BdWdtZW50ZWRWaXJ0dWFsaXR5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEF1Z21lbnRlZFZpcnR1YWxpdHlUb29sID0gKDAsIF9jcmVhdGVSZWFjdENsYXNzMi5kZWZhdWx0KSh7XG4gICAgZGlzcGxheU5hbWU6ICdBdWdtZW50ZWRWaXJ0dWFsaXR5VG9vbCcsXG4gICAgbWl4aW5zOiBbX09ic2VydmVNb2RlbE1peGluMi5kZWZhdWx0XSxcblxuICAgIHByb3BUeXBlczoge1xuICAgICAgICB0ZXJyaWE6IF9wcm9wVHlwZXMyLmRlZmF1bHQub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICAgIHZpZXdTdGF0ZTogX3Byb3BUeXBlczIuZGVmYXVsdC5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgICAgZXhwZXJpbWVudGFsV2FybmluZzogX3Byb3BUeXBlczIuZGVmYXVsdC5ib29sXG4gICAgfSxcblxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXVnbWVudGVkVmlydHVhbGl0eTogbmV3IF9BdWdtZW50ZWRWaXJ0dWFsaXR5Mi5kZWZhdWx0KHRoaXMucHJvcHMudGVycmlhKSxcbiAgICAgICAgICAgIGV4cGVyaW1lbnRhbFdhcm5pbmdTaG93bjogZmFsc2UsXG4gICAgICAgICAgICByZWFsaWduSGVscFNob3duOiBmYWxzZSxcbiAgICAgICAgICAgIHJlc2V0UmVhbGlnbkhlbHBTaG93bjogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGhhbmRsZUNsaWNrQVZUb29sOiBmdW5jdGlvbiBoYW5kbGVDbGlja0FWVG9vbCgpIHtcbiAgICAgICAgLy8gTWFrZSB0aGUgQXVnbWVudGVkVmlydHVhbGl0eSBtb2R1bGUgYXZhbGlhYmxlIGVsc2V3aGVyZS5cbiAgICAgICAgdGhpcy5wcm9wcy50ZXJyaWEuYXVnbWVudGVkVmlydHVhbGl0eSA9IHRoaXMuc3RhdGUuYXVnbWVudGVkVmlydHVhbGl0eTtcblxuICAgICAgICBpZiAoKDAsIF9kZWZpbmVkMi5kZWZhdWx0KSh0aGlzLnByb3BzLmV4cGVyaW1lbnRhbFdhcm5pbmcpICYmIHRoaXMucHJvcHMuZXhwZXJpbWVudGFsV2FybmluZyAhPT0gZmFsc2UgJiYgIXRoaXMuc3RhdGUuZXhwZXJpbWVudGFsV2FybmluZ1Nob3duKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBleHBlcmltZW50YWxXYXJuaW5nU2hvd246IHRydWUgfSk7XG5cbiAgICAgICAgICAgIHRoaXMucHJvcHMudmlld1N0YXRlLm5vdGlmaWNhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdFeHBlcmltZW50YWwgRmVhdHVyZTogQXVnbWVudGVkIFJlYWxpdHknLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdBdWdtZW50ZWQgUmVhbGl0eSBtb2RlIGlzIGN1cnJlbnRseSBpbiBiZXRhLiAnICsgJ1RoaXMgbW9kZSBpcyBvbmx5IGRlc2lnbmVkIGZvciB1c2Ugb24gdGhlIGxhdGVzdCBoaWdoIGVuZCBtb2JpbGUgZGV2aWNlcy4gJyArICc8YnIgLz48YnIgLz5XQVJOSU5HOiBUaGlzIG1vZGUgY2FuIGNvbnN1bWUgYSBsb3Qgb2YgZGF0YSwgcGxlYXNlIGJlIG1pbmRmdWwgb2YgZGF0YSB1c2FnZSBjaGFyZ2VzIGZyb20geW91ciBuZXR3b3JrIHByb3ZpZGVyLiAnICsgJzxiciAvPjxiciAvPlRoZSBhY2N1cmFjeSBvZiB0aGlzIG1vZGUgZGVwZW5kcyBvbiB0aGUgYWNjdXJhY3kgb2YgeW91ciBtb2JpbGUgZGV2aWNlcyBpbnRlcm5hbCBjb21wYXNzLicsXG4gICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICdHb3QgaXQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhdGUuYXVnbWVudGVkVmlydHVhbGl0eS50b2dnbGVFbmFibGVkKCk7XG4gICAgfSxcbiAgICBoYW5kbGVDbGlja1JlYWxpZ246IGZ1bmN0aW9uIGhhbmRsZUNsaWNrUmVhbGlnbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnJlYWxpZ25IZWxwU2hvd24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWFsaWduSGVscFNob3duOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnByb3BzLnZpZXdTdGF0ZS5ub3RpZmljYXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnTWFudWFsIEFsaWdubWVudCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ0FsaWduIHlvdXIgbW9iaWxlIGRldmljZSBzbyB0aGF0IGl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIG1hcHMgY3VycmVudCBhbGlnbm1lbnQsIHRoZW4gY2xpY2sgdGhlIGJsaW5raW5nIGNvbXBhc3MuJyArICcgSWYgbm8gbGFuZG1hcmtzIHRvIGFsaWduIHdpdGggYXJlIGN1cnJlbnRseSB2aXNpYmxlIG9uIHRoZSBtYXAsIHlvdSBjYW4gbW92ZSB0aGUgbWFwIHVzaW5nJyArICcgZHJhZyBhbmQgcGluY2ggYWN0aW9ucyB1bnRpbCBhIHJlY29nbmlzYWJsZSBsYW5kbWFyayBpcyB2aXNpYmxlIGJlZm9yZSBhbGlnbmluZyB0aGUgZGV2aWNlIHdpdGggdGhlIG1hcC4nICsgJzxiciAvPjxkaXY+PGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCIuL2J1aWxkL1RlcnJpYUpTL2ltYWdlcy9hci1yZWFsaWduLWd1aWRlLmdpZlwiIC8+PC9kaXY+JyArICc8YnIgLz5UaXA6IFRoZSBzdW4gb3IgbW9vbiBhcmUgb2Z0ZW4gZ29vZCBsYW5kbWFya3MgdG8gYWxpZ24gd2l0aCBpZiB5b3UgYXJlIGluIGEgbG9jYXRpb24geW91IGFyZW5cXHgyN3QgZmFtaWxpYXIgd2l0aCAoYmUgY2FyZWZ1bCBub3QgdG8gbG9vayBhdCB0aGUgc3VuIC0gaXQgY2FuIGh1cnQgeW91ciBleWVzKS4nLFxuICAgICAgICAgICAgICAgIGNvbmZpcm1UZXh0OiAnR290IGl0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXRlLmF1Z21lbnRlZFZpcnR1YWxpdHkudG9nZ2xlTWFudWFsQWxpZ25tZW50KCk7XG4gICAgfSxcbiAgICBoYW5kbGVDbGlja1Jlc2V0UmVhbGlnbjogZnVuY3Rpb24gaGFuZGxlQ2xpY2tSZXNldFJlYWxpZ24oKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5yZXNldFJlYWxpZ25IZWxwU2hvd24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZXNldFJlYWxpZ25IZWxwU2hvd246IHRydWUgfSk7XG5cbiAgICAgICAgICAgIHRoaXMucHJvcHMudmlld1N0YXRlLm5vdGlmaWNhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZXNldCBBbGlnbm1lbnQnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdSZXNldHRpbmcgdG8gY29tcGFzcyBhbGlnbm1lbnQuIElmIHRoZSBhbGlnbm1lbnQgZG9lc25cXHgyN3QgbWF0Y2ggdGhlIHJlYWwgd29ybGQgdHJ5IHdhdmluZycgKyAnIHlvdXIgZGV2aWNlIGluIGEgZmlndXJlIDggbW90aW9uIHRvIHJlY2FsaWJyYXRlIGRldmljZS4gVGhpcyBjYW4gYmUgZG9uZSBhdCBhbnkgdGltZS4nICsgJzxiciAvPiA8YnIgLz5Bdm9pZCBsb2NhdGlvbnMgd2l0aCBtYWduZXRpYyBmaWVsZHMgb3IgbWV0YWwgb2JqZWN0cyBhcyB0aGVzZSBtYXkgZGlzb3JpZW50IHRoZSBkZXZpY2VzIGNvbXBhc3MuJyxcbiAgICAgICAgICAgICAgICBjb25maXJtVGV4dDogJ0dvdCBpdCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5hdWdtZW50ZWRWaXJ0dWFsaXR5LnJlc2V0QWxpZ25tZW50KCk7XG4gICAgfSxcbiAgICBoYW5kbGVDbGlja0hvdmVyOiBmdW5jdGlvbiBoYW5kbGVDbGlja0hvdmVyKCkge1xuICAgICAgICB0aGlzLnN0YXRlLmF1Z21lbnRlZFZpcnR1YWxpdHkudG9nZ2xlSG92ZXJIZWlnaHQoKTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICB2YXIgZW5hYmxlZCA9IHRoaXMuc3RhdGUuYXVnbWVudGVkVmlydHVhbGl0eS5lbmFibGVkO1xuICAgICAgICB2YXIgdG9nZ2xlSW1hZ2UgPSBfSWNvbjIuZGVmYXVsdC5HTFlQSFMuYXJPZmY7XG4gICAgICAgIHZhciB0b2dnbGVTdHlsZSA9IF9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sMi5kZWZhdWx0LmJ0bjtcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRvZ2dsZUltYWdlID0gX0ljb24yLmRlZmF1bHQuR0xZUEhTLmFyT247XG4gICAgICAgICAgICB0b2dnbGVTdHlsZSA9IF9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sMi5kZWZhdWx0LmJ0blByaW1hcnk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVhbGlnbm1lbnQgPSB0aGlzLnN0YXRlLmF1Z21lbnRlZFZpcnR1YWxpdHkubWFudWFsQWxpZ25tZW50O1xuICAgICAgICB2YXIgcmVhbGlnbm1lbnRTdHlsZSA9IF9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sMi5kZWZhdWx0LmJ0bjtcbiAgICAgICAgaWYgKHJlYWxpZ25tZW50KSB7XG4gICAgICAgICAgICByZWFsaWdubWVudFN0eWxlID0gX2F1Z21lbnRlZF92aXJ0dWFsaXR5X3Rvb2wyLmRlZmF1bHQuYnRuQmxpbms7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaG92ZXJMZXZlbCA9IHRoaXMuc3RhdGUuYXVnbWVudGVkVmlydHVhbGl0eS5ob3ZlckxldmVsO1xuICAgICAgICB2YXIgaG92ZXJJbWFnZSA9IF9JY29uMi5kZWZhdWx0LkdMWVBIUy5hckhvdmVyMDtcbiAgICAgICAgLy8gTm90ZTogV2UgdXNlIHRoZSBpbWFnZSBvZiB0aGUgbmV4dCBsZXZlbCB0aGF0IHdlIHdpbGwgYmUgY2hhbmdpbmcgdG8sIG5vdCB0aGUgbGV2ZWwgdGhlIHdlIGFyZSBjdXJyZW50bHkgYXQuXG4gICAgICAgIHN3aXRjaCAoaG92ZXJMZXZlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGhvdmVySW1hZ2UgPSBfSWNvbjIuZGVmYXVsdC5HTFlQSFMuYXJIb3ZlcjA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgaG92ZXJJbWFnZSA9IF9JY29uMi5kZWZhdWx0LkdMWVBIUy5hckhvdmVyMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBob3ZlckltYWdlID0gX0ljb24yLmRlZmF1bHQuR0xZUEhTLmFySG92ZXIyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudGVycmlhLnZpZXdlck1vZGUgIT09IF9WaWV3ZXJNb2RlMi5kZWZhdWx0LkxlYWZsZXQgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6IF9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sMi5kZWZhdWx0LmF1Z21lbnRlZFZpcnR1YWxpdHlUb29sIH0sXG4gICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6IHRvZ2dsZVN0eWxlLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ2F1Z21lbnRlZCByZWFsaXR5IHRvb2wnLFxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrQVZUb29sIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0ljb24yLmRlZmF1bHQsIHsgZ2x5cGg6IHRvZ2dsZUltYWdlIH0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgZW5hYmxlZCA/IFtfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6IF9hdWdtZW50ZWRfdmlydHVhbGl0eV90b29sMi5kZWZhdWx0LmJ0bixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICd0b2dnbGUgaG92ZXIgaGVpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogdGhpcy5oYW5kbGVDbGlja0hvdmVyLCBrZXk6ICcwJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0ljb24yLmRlZmF1bHQsIHsgZ2x5cGg6IGhvdmVySW1hZ2UgfSlcbiAgICAgICAgICAgICksICF0aGlzLnN0YXRlLmF1Z21lbnRlZFZpcnR1YWxpdHkubWFudWFsQWxpZ25tZW50U2V0ID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiByZWFsaWdubWVudFN0eWxlLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ3RvZ2dsZSBtYW51YWwgYWxpZ25tZW50JyxcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogdGhpcy5oYW5kbGVDbGlja1JlYWxpZ24sIGtleTogJzEnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfSWNvbjIuZGVmYXVsdCwgeyBnbHlwaDogX0ljb24yLmRlZmF1bHQuR0xZUEhTLmFyUmVhbGlnbiB9KVxuICAgICAgICAgICAgKSA6IG51bGwsIHRoaXMuc3RhdGUuYXVnbWVudGVkVmlydHVhbGl0eS5tYW51YWxBbGlnbm1lbnRTZXQgJiYgIXJlYWxpZ25tZW50ID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiBfYXVnbWVudGVkX3ZpcnR1YWxpdHlfdG9vbDIuZGVmYXVsdC5idG4sXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAncmVzZXQgY29tcGFzcyBhbGlnbm1lbnQnLFxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrUmVzZXRSZWFsaWduLCBrZXk6ICcyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0ljb24yLmRlZmF1bHQsIHsgZ2x5cGg6IF9JY29uMi5kZWZhdWx0LkdMWVBIUy5hclJlc2V0QWxpZ25tZW50IH0pXG4gICAgICAgICAgICApIDogbnVsbF0gOiBudWxsXG4gICAgICAgICkgOiBudWxsO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1Z21lbnRlZFZpcnR1YWxpdHlUb29sO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzL2xpYi9SZWFjdFZpZXdzL01hcC9OYXZpZ2F0aW9uL0F1Z21lbnRlZFZpcnR1YWxpdHlUb29sLmpzeFxuLy8gbW9kdWxlIGlkID0gODE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTs7Ozs7Ozs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQy9vQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=