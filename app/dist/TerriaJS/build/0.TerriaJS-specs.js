webpackJsonp([0],{

/***/ 2229:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(12),
        __webpack_require__(459),
        __webpack_require__(93),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined,
        defineProperties,
        DeveloperError,
        Event,
        EventHelper,
        TimeIntervalCollection,
        Property) {
    'use strict';

    function subscribeAll(property, eventHelper, definitionChanged, intervals) {
        function callback() {
            definitionChanged.raiseEvent(property);
        }
        var items = [];
        eventHelper.removeAll();
        var length = intervals.length;
        for (var i = 0; i < length; i++) {
            var interval = intervals.get(i);
            if (defined(interval.data) && items.indexOf(interval.data) === -1) {
                eventHelper.add(interval.data.definitionChanged, callback);
            }
        }
    }

    /**
     * A {@link Property} which is defined by a {@link TimeIntervalCollection}, where the
     * data property of each {@link TimeInterval} is another Property instance which is
     * evaluated at the provided time.
     *
     * @alias CompositeProperty
     * @constructor
     *
     *
     * @example
     * var constantProperty = ...;
     * var sampledProperty = ...;
     *
     * //Create a composite property from two previously defined properties
     * //where the property is valid on August 1st, 2012 and uses a constant
     * //property for the first half of the day and a sampled property for the
     * //remaining half.
     * var composite = new Cesium.CompositeProperty();
     * composite.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
     *     iso8601 : '2012-08-01T00:00:00.00Z/2012-08-01T12:00:00.00Z',
     *     data : constantProperty
     * }));
     * composite.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
     *     iso8601 : '2012-08-01T12:00:00.00Z/2012-08-02T00:00:00.00Z',
     *     isStartIncluded : false,
     *     isStopIncluded : false,
     *     data : sampledProperty
     * }));
     *
     * @see CompositeMaterialProperty
     * @see CompositePositionProperty
     */
    function CompositeProperty() {
        this._eventHelper = new EventHelper();
        this._definitionChanged = new Event();
        this._intervals = new TimeIntervalCollection();
        this._intervals.changedEvent.addEventListener(CompositeProperty.prototype._intervalsChanged, this);
    }

    defineProperties(CompositeProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof CompositeProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return this._intervals.isEmpty;
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is changed whenever setValue is called with data different
         * than the current value.
         * @memberof CompositeProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets the interval collection.
         * @memberof CompositeProperty.prototype
         *
         * @type {TimeIntervalCollection}
         */
        intervals : {
            get : function() {
                return this._intervals;
            }
        }
    });

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    CompositeProperty.prototype.getValue = function(time, result) {
        

        var innerProperty = this._intervals.findDataForIntervalContainingDate(time);
        if (defined(innerProperty)) {
            return innerProperty.getValue(time, result);
        }
        return undefined;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    CompositeProperty.prototype.equals = function(other) {
        return this === other || //
               (other instanceof CompositeProperty && //
                this._intervals.equals(other._intervals, Property.equals));
    };

    /**
     * @private
     */
    CompositeProperty.prototype._intervalsChanged = function() {
        subscribeAll(this, this._eventHelper, this._definitionChanged, this._intervals);
        this._definitionChanged.raiseEvent(this);
    };

    return CompositeProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2230:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(12),
        __webpack_require__(237),
        __webpack_require__(2229),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Event,
        ReferenceFrame,
        CompositeProperty,
        Property) {
    'use strict';

    /**
     * A {@link CompositeProperty} which is also a {@link PositionProperty}.
     *
     * @alias CompositePositionProperty
     * @constructor
     *
     * @param {ReferenceFrame} [referenceFrame=ReferenceFrame.FIXED] The reference frame in which the position is defined.
     */
    function CompositePositionProperty(referenceFrame) {
        this._referenceFrame = defaultValue(referenceFrame, ReferenceFrame.FIXED);
        this._definitionChanged = new Event();
        this._composite = new CompositeProperty();
        this._composite.definitionChanged.addEventListener(CompositePositionProperty.prototype._raiseDefinitionChanged, this);
    }

    defineProperties(CompositePositionProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof CompositePositionProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return this._composite.isConstant;
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is changed whenever setValue is called with data different
         * than the current value.
         * @memberof CompositePositionProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets the interval collection.
         * @memberof CompositePositionProperty.prototype
         *
         * @type {TimeIntervalCollection}
         */
        intervals : {
            get : function() {
                return this._composite.intervals;
            }
        },
        /**
         * Gets or sets the reference frame which this position presents itself as.
         * Each PositionProperty making up this object has it's own reference frame,
         * so this property merely exposes a "preferred" reference frame for clients
         * to use.
         * @memberof CompositePositionProperty.prototype
         *
         * @type {ReferenceFrame}
         */
        referenceFrame : {
            get : function() {
                return this._referenceFrame;
            },
            set : function(value) {
                this._referenceFrame = value;
            }
        }
    });

    /**
     * Gets the value of the property at the provided time in the fixed frame.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    CompositePositionProperty.prototype.getValue = function(time, result) {
        return this.getValueInReferenceFrame(time, ReferenceFrame.FIXED, result);
    };

    /**
     * Gets the value of the property at the provided time and in the provided reference frame.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {ReferenceFrame} referenceFrame The desired referenceFrame of the result.
     * @param {Cartesian3} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Cartesian3} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    CompositePositionProperty.prototype.getValueInReferenceFrame = function(time, referenceFrame, result) {
        

        var innerProperty = this._composite._intervals.findDataForIntervalContainingDate(time);
        if (defined(innerProperty)) {
            return innerProperty.getValueInReferenceFrame(time, referenceFrame, result);
        }
        return undefined;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    CompositePositionProperty.prototype.equals = function(other) {
        return this === other || //
               (other instanceof CompositePositionProperty && //
                this._referenceFrame === other._referenceFrame && //
                this._composite.equals(other._composite, Property.equals));
    };

    /**
     * @private
     */
    CompositePositionProperty.prototype._raiseDefinitionChanged = function() {
        this._definitionChanged.raiseEvent(this);
    };

    return CompositePositionProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2231:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(12),
        __webpack_require__(459),
        __webpack_require__(237),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Event,
        EventHelper,
        ReferenceFrame,
        Property) {
    'use strict';

    /**
     * A {@link PositionProperty} whose value is an array whose items are the computed value
     * of other PositionProperty instances.
     *
     * @alias PositionPropertyArray
     * @constructor
     *
     * @param {Property[]} [value] An array of Property instances.
     * @param {ReferenceFrame} [referenceFrame=ReferenceFrame.FIXED] The reference frame in which the position is defined.
     */
    function PositionPropertyArray(value, referenceFrame) {
        this._value = undefined;
        this._definitionChanged = new Event();
        this._eventHelper = new EventHelper();
        this._referenceFrame = defaultValue(referenceFrame, ReferenceFrame.FIXED);
        this.setValue(value);
    }

    defineProperties(PositionPropertyArray.prototype, {
        /**
         * Gets a value indicating if this property is constant.  This property
         * is considered constant if all property items in the array are constant.
         * @memberof PositionPropertyArray.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                var value = this._value;
                if (!defined(value)) {
                    return true;
                }

                var length = value.length;
                for (var i = 0; i < length; i++) {
                    if (!Property.isConstant(value[i])) {
                        return false;
                    }
                }
                return true;
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is changed whenever setValue is called with data different
         * than the current value or one of the properties in the array also changes.
         * @memberof PositionPropertyArray.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets the reference frame in which the position is defined.
         * @memberof PositionPropertyArray.prototype
         * @type {ReferenceFrame}
         * @default ReferenceFrame.FIXED;
         */
        referenceFrame : {
            get : function() {
                return this._referenceFrame;
            }
        }
    });

    /**
     * Gets the value of the property.
     *
     * @param {JulianDate} [time] The time for which to retrieve the value.  This parameter is unused since the value does not change with respect to time.
     * @param {Cartesian3[]} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Cartesian3[]} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    PositionPropertyArray.prototype.getValue = function(time, result) {
        return this.getValueInReferenceFrame(time, ReferenceFrame.FIXED, result);
    };

    /**
     * Gets the value of the property at the provided time and in the provided reference frame.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {ReferenceFrame} referenceFrame The desired referenceFrame of the result.
     * @param {Cartesian3} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Cartesian3} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    PositionPropertyArray.prototype.getValueInReferenceFrame = function(time, referenceFrame, result) {
        

        var value = this._value;
        if (!defined(value)) {
            return undefined;
        }

        var length = value.length;
        if (!defined(result)) {
            result = new Array(length);
        }
        var i = 0;
        var x = 0;
        while (i < length) {
            var property = value[i];
            var itemValue = property.getValueInReferenceFrame(time, referenceFrame, result[i]);
            if (defined(itemValue)) {
                result[x] = itemValue;
                x++;
            }
            i++;
        }
        result.length = x;
        return result;
    };

    /**
     * Sets the value of the property.
     *
     * @param {Property[]} value An array of Property instances.
     */
    PositionPropertyArray.prototype.setValue = function(value) {
        var eventHelper = this._eventHelper;
        eventHelper.removeAll();

        if (defined(value)) {
            this._value = value.slice();
            var length = value.length;
            for (var i = 0; i < length; i++) {
                var property = value[i];
                if (defined(property)) {
                    eventHelper.add(property.definitionChanged, PositionPropertyArray.prototype._raiseDefinitionChanged, this);
                }
            }
        } else {
            this._value = undefined;
        }
        this._definitionChanged.raiseEvent(this);
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    PositionPropertyArray.prototype.equals = function(other) {
        return this === other || //
               (other instanceof PositionPropertyArray && //
                this._referenceFrame === other._referenceFrame && //
                Property.arrayEquals(this._value, other._value));
    };

    PositionPropertyArray.prototype._raiseDefinitionChanged = function() {
        this._definitionChanged.raiseEvent(this);
    };

    return PositionPropertyArray;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2232:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(12),
        __webpack_require__(32),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined,
        defineProperties,
        DeveloperError,
        Event,
        RuntimeError,
        Property) {
    'use strict';

    function resolveEntity(that) {
        var entityIsResolved = true;
        if (that._resolveEntity) {
            var targetEntity = that._targetCollection.getById(that._targetId);

            if (defined(targetEntity)) {
                targetEntity.definitionChanged.addEventListener(ReferenceProperty.prototype._onTargetEntityDefinitionChanged, that);
                that._targetEntity = targetEntity;
                that._resolveEntity = false;
            } else {
                //The property has become detached.  It has a valid value but is not currently resolved to an entity in the collection
                targetEntity = that._targetEntity;
                entityIsResolved = false;
            }

            if (!defined(targetEntity)) {
                throw new RuntimeError('target entity "' + that._targetId + '" could not be resolved.');
            }
        }
        return entityIsResolved;
    }

    function resolve(that) {
        var targetProperty = that._targetProperty;

        if (that._resolveProperty) {
            var entityIsResolved = resolveEntity(that);

            var names = that._targetPropertyNames;
            targetProperty = that._targetEntity;
            var length = names.length;
            for (var i = 0; i < length && defined(targetProperty); i++) {
                targetProperty = targetProperty[names[i]];
            }

            if (defined(targetProperty)) {
                that._targetProperty = targetProperty;
                that._resolveProperty = !entityIsResolved;
            } else if (!defined(that._targetProperty)) {
                throw new RuntimeError('targetProperty "' + that._targetId + '.' + names.join('.') + '" could not be resolved.');
            }
        }

        return targetProperty;
    }

    /**
     * A {@link Property} which transparently links to another property on a provided object.
     *
     * @alias ReferenceProperty
     * @constructor
     *
     * @param {EntityCollection} targetCollection The entity collection which will be used to resolve the reference.
     * @param {String} targetId The id of the entity which is being referenced.
     * @param {String[]} targetPropertyNames The names of the property on the target entity which we will use.
     *
     * @example
     * var collection = new Cesium.EntityCollection();
     *
     * //Create a new entity and assign a billboard scale.
     * var object1 = new Cesium.Entity({id:'object1'});
     * object1.billboard = new Cesium.BillboardGraphics();
     * object1.billboard.scale = new Cesium.ConstantProperty(2.0);
     * collection.add(object1);
     *
     * //Create a second entity and reference the scale from the first one.
     * var object2 = new Cesium.Entity({id:'object2'});
     * object2.model = new Cesium.ModelGraphics();
     * object2.model.scale = new Cesium.ReferenceProperty(collection, 'object1', ['billboard', 'scale']);
     * collection.add(object2);
     *
     * //Create a third object, but use the fromString helper function.
     * var object3 = new Cesium.Entity({id:'object3'});
     * object3.billboard = new Cesium.BillboardGraphics();
     * object3.billboard.scale = Cesium.ReferenceProperty.fromString(collection, 'object1#billboard.scale');
     * collection.add(object3);
     *
     * //You can refer to an entity with a # or . in id and property names by escaping them.
     * var object4 = new Cesium.Entity({id:'#object.4'});
     * object4.billboard = new Cesium.BillboardGraphics();
     * object4.billboard.scale = new Cesium.ConstantProperty(2.0);
     * collection.add(object4);
     *
     * var object5 = new Cesium.Entity({id:'object5'});
     * object5.billboard = new Cesium.BillboardGraphics();
     * object5.billboard.scale = Cesium.ReferenceProperty.fromString(collection, '\\#object\\.4#billboard.scale');
     * collection.add(object5);
     */
    function ReferenceProperty(targetCollection, targetId, targetPropertyNames) {
        

        this._targetCollection = targetCollection;
        this._targetId = targetId;
        this._targetPropertyNames = targetPropertyNames;
        this._targetProperty = undefined;
        this._targetEntity = undefined;
        this._definitionChanged = new Event();
        this._resolveEntity = true;
        this._resolveProperty = true;

        targetCollection.collectionChanged.addEventListener(ReferenceProperty.prototype._onCollectionChanged, this);
    }

    defineProperties(ReferenceProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.
         * @memberof ReferenceProperty.prototype
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return Property.isConstant(resolve(this));
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is changed whenever the referenced property's definition is changed.
         * @memberof ReferenceProperty.prototype
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets the reference frame that the position is defined in.
         * This property is only valid if the referenced property is a {@link PositionProperty}.
         * @memberof ReferenceProperty.prototype
         * @type {ReferenceFrame}
         * @readonly
         */
        referenceFrame : {
            get : function() {
                return resolve(this).referenceFrame;
            }
        },
        /**
         * Gets the id of the entity being referenced.
         * @memberof ReferenceProperty.prototype
         * @type {String}
         * @readonly
         */
        targetId : {
            get : function() {
                return this._targetId;
            }
        },
        /**
         * Gets the collection containing the entity being referenced.
         * @memberof ReferenceProperty.prototype
         * @type {EntityCollection}
         * @readonly
         */
        targetCollection : {
            get : function() {
                return this._targetCollection;
            }
        },
        /**
         * Gets the array of property names used to retrieve the referenced property.
         * @memberof ReferenceProperty.prototype
         * @type {String[]}
         * @readonly
         */
        targetPropertyNames : {
            get : function() {
                return this._targetPropertyNames;
            }
        },
        /**
         * Gets the resolved instance of the underlying referenced property.
         * @memberof ReferenceProperty.prototype
         * @type {Property}
         * @readonly
         */
        resolvedProperty : {
            get : function() {
                return resolve(this);
            }
        }
    });

    /**
     * Creates a new instance given the entity collection that will
     * be used to resolve it and a string indicating the target entity id and property.
     * The format of the string is "objectId#foo.bar", where # separates the id from
     * property path and . separates sub-properties.  If the reference identifier or
     * or any sub-properties contains a # . or \ they must be escaped.
     *
     * @param {EntityCollection} targetCollection
     * @param {String} referenceString
     * @returns {ReferenceProperty} A new instance of ReferenceProperty.
     *
     * @exception {DeveloperError} invalid referenceString.
     */
    ReferenceProperty.fromString = function(targetCollection, referenceString) {
        

        var identifier;
        var values = [];

        var inIdentifier = true;
        var isEscaped = false;
        var token = '';
        for (var i = 0; i < referenceString.length; ++i) {
            var c = referenceString.charAt(i);

            if (isEscaped) {
                token += c;
                isEscaped = false;
            } else if (c === '\\') {
                isEscaped = true;
            } else if (inIdentifier && c === '#') {
                identifier = token;
                inIdentifier = false;
                token = '';
            } else if (!inIdentifier && c === '.') {
                values.push(token);
                token = '';
            } else {
                token += c;
            }
        }
        values.push(token);

        return new ReferenceProperty(targetCollection, identifier, values);
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    ReferenceProperty.prototype.getValue = function(time, result) {
        return resolve(this).getValue(time, result);
    };

    /**
     * Gets the value of the property at the provided time and in the provided reference frame.
     * This method is only valid if the property being referenced is a {@link PositionProperty}.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {ReferenceFrame} referenceFrame The desired referenceFrame of the result.
     * @param {Cartesian3} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Cartesian3} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    ReferenceProperty.prototype.getValueInReferenceFrame = function(time, referenceFrame, result) {
        return resolve(this).getValueInReferenceFrame(time, referenceFrame, result);
    };

    /**
     * Gets the {@link Material} type at the provided time.
     * This method is only valid if the property being referenced is a {@link MaterialProperty}.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    ReferenceProperty.prototype.getType = function(time) {
        return resolve(this).getType(time);
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    ReferenceProperty.prototype.equals = function(other) {
        if (this === other) {
            return true;
        }

        var names = this._targetPropertyNames;
        var otherNames = other._targetPropertyNames;

        if (this._targetCollection !== other._targetCollection || //
            this._targetId !== other._targetId || //
            names.length !== otherNames.length) {
            return false;
        }

        var length = this._targetPropertyNames.length;
        for (var i = 0; i < length; i++) {
            if (names[i] !== otherNames[i]) {
                return false;
            }
        }

        return true;
    };

    ReferenceProperty.prototype._onTargetEntityDefinitionChanged = function(targetEntity, name, value, oldValue) {
        if (this._targetPropertyNames[0] === name) {
            this._resolveProperty = true;
            this._definitionChanged.raiseEvent(this);
        }
    };

    ReferenceProperty.prototype._onCollectionChanged = function(collection, added, removed) {
        var targetEntity = this._targetEntity;
        if (defined(targetEntity)) {
            if (removed.indexOf(targetEntity) !== -1) {
                targetEntity.definitionChanged.removeEventListener(ReferenceProperty.prototype._onTargetEntityDefinitionChanged, this);
                this._resolveEntity = true;
                this._resolveProperty = true;
            } else if (this._resolveEntity) {
                //If targetEntity is defined but resolveEntity is true, then the entity is detached
                //and any change to the collection needs to incur an attempt to resolve in order to re-attach.
                //without this if block, a reference that becomes re-attached will not signal definitionChanged
                resolve(this);
                if (!this._resolveEntity) {
                    this._definitionChanged.raiseEvent(this);
                }
            }
        }
    };

    return ReferenceProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2233:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(6)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        freezeObject) {
    'use strict';

    /**
     * Defined the orientation of stripes in {@link StripeMaterialProperty}.
     *
     * @exports StripeOrientation
     */
    var StripeOrientation = {
        /**
         * Horizontal orientation.
         * @type {Number}
         */
        HORIZONTAL : 0,

        /**
         * Vertical orientation.
         * @type {Number}
         */
        VERTICAL : 1
    };

    return freezeObject(StripeOrientation);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2234:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(5),
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(12),
        __webpack_require__(24),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        Cartesian3,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Event,
        JulianDate,
        Property) {
    'use strict';

    /**
     * A {@link Property} which evaluates to a {@link Cartesian3} vector
     * based on the velocity of the provided {@link PositionProperty}.
     *
     * @alias VelocityVectorProperty
     * @constructor
     *
     * @param {Property} [position] The position property used to compute the velocity.
     * @param {Boolean} [normalize=true] Whether to normalize the computed velocity vector.
     *
     * @example
     * //Create an entity with a billboard rotated to match its velocity.
     * var position = new Cesium.SampledProperty();
     * position.addSamples(...);
     * var entity = viewer.entities.add({
     *   position : position,
     *   billboard : {
     *     image : 'image.png',
     *     alignedAxis : new Cesium.VelocityVectorProperty(position, true) // alignedAxis must be a unit vector
     *   }
     * }));
     */
    function VelocityVectorProperty(position, normalize) {
        this._position = undefined;
        this._subscription = undefined;
        this._definitionChanged = new Event();
        this._normalize = defaultValue(normalize, true);

        this.position = position;
    }

    defineProperties(VelocityVectorProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.
         * @memberof VelocityVectorProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return Property.isConstant(this._position);
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * @memberof VelocityVectorProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets or sets the position property used to compute the velocity vector.
         * @memberof VelocityVectorProperty.prototype
         *
         * @type {Property}
         */
        position : {
            get : function() {
                return this._position;
            },
            set : function(value) {
                var oldValue = this._position;
                if (oldValue !== value) {
                    if (defined(oldValue)) {
                        this._subscription();
                    }

                    this._position = value;

                    if (defined(value)) {
                        this._subscription = value._definitionChanged.addEventListener(function() {
                            this._definitionChanged.raiseEvent(this);
                        }, this);
                    }

                    this._definitionChanged.raiseEvent(this);
                }
            }
        },
        /**
         * Gets or sets whether the vector produced by this property
         * will be normalized or not.
         * @memberof VelocityVectorProperty.prototype
         *
         * @type {Boolean}
         */
        normalize : {
            get : function() {
                return this._normalize;
            },
            set : function(value) {
                if (this._normalize === value) {
                    return;
                }

                this._normalize = value;
                this._definitionChanged.raiseEvent(this);
            }
        }
    });

    var position1Scratch = new Cartesian3();
    var position2Scratch = new Cartesian3();
    var timeScratch = new JulianDate();
    var step = 1.0 / 60.0;

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} [time] The time for which to retrieve the value.
     * @param {Cartesian3} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Cartesian3} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    VelocityVectorProperty.prototype.getValue = function(time, result) {
        return this._getValue(time, result);
    };

    /**
     * @private
     */
    VelocityVectorProperty.prototype._getValue = function(time, velocityResult, positionResult) {
        

        if (!defined(velocityResult)) {
            velocityResult = new Cartesian3();
        }

        var property = this._position;
        if (Property.isConstant(property)) {
            return this._normalize ? undefined : Cartesian3.clone(Cartesian3.ZERO, velocityResult);
        }

        var position1 = property.getValue(time, position1Scratch);
        var position2 = property.getValue(JulianDate.addSeconds(time, step, timeScratch), position2Scratch);

        //If we don't have a position for now, return undefined.
        if (!defined(position1)) {
            return undefined;
        }

        //If we don't have a position for now + step, see if we have a position for now - step.
        if (!defined(position2)) {
            position2 = position1;
            position1 = property.getValue(JulianDate.addSeconds(time, -step, timeScratch), position2Scratch);

            if (!defined(position1)) {
                return undefined;
            }
        }

        if (Cartesian3.equals(position1, position2)) {
            return this._normalize ? undefined : Cartesian3.clone(Cartesian3.ZERO, velocityResult);
        }

        if (defined(positionResult)) {
            position1.clone(positionResult);
        }

        var velocity = Cartesian3.subtract(position2, position1, velocityResult);
        if (this._normalize) {
            return Cartesian3.normalize(velocity, velocityResult);
        }

        return Cartesian3.divideByScalar(velocity, step, velocityResult);
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    VelocityVectorProperty.prototype.equals = function(other) {
        return this === other ||//
               (other instanceof VelocityVectorProperty &&
                Property.equals(this._position, other._position));
    };

    return VelocityVectorProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2235:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(6)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        freezeObject) {
    'use strict';

    /**
     * Style options for corners.
     *
     * @demo The {@link https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Corridor.html&label=Geometries|Corridor Demo}
     * demonstrates the three corner types, as used by {@link CorridorGraphics}.
     *
     * @exports CornerType
     */
    var CornerType = {
        /**
         * <img src="Images/CornerTypeRounded.png" style="vertical-align: middle;" width="186" height="189" />
         *
         * Corner has a smooth edge.
         * @type {Number}
         * @constant
         */
        ROUNDED : 0,

        /**
         * <img src="Images/CornerTypeMitered.png" style="vertical-align: middle;" width="186" height="189" />
         *
         * Corner point is the intersection of adjacent edges.
         * @type {Number}
         * @constant
         */
        MITERED : 1,

        /**
         * <img src="Images/CornerTypeBeveled.png" style="vertical-align: middle;" width="186" height="189" />
         *
         * Corner is clipped.
         * @type {Number}
         * @constant
         */
        BEVELED : 2
    };

    return freezeObject(CornerType);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2236:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(2),
        __webpack_require__(4)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defaultValue,
        defined,
        DeveloperError,
        CesiumMath) {
    'use strict';

    var factorial = CesiumMath.factorial;

    function calculateCoefficientTerm(x, zIndices, xTable, derivOrder, termOrder, reservedIndices) {
        var result = 0;
        var reserved;
        var i;
        var j;

        if (derivOrder > 0) {
            for (i = 0; i < termOrder; i++) {
                reserved = false;
                for (j = 0; j < reservedIndices.length && !reserved; j++) {
                    if (i === reservedIndices[j]) {
                        reserved = true;
                    }
                }

                if (!reserved) {
                    reservedIndices.push(i);
                    result += calculateCoefficientTerm(x, zIndices, xTable, derivOrder - 1, termOrder, reservedIndices);
                    reservedIndices.splice(reservedIndices.length - 1, 1);
                }
            }

            return result;
        }

        result = 1;
        for (i = 0; i < termOrder; i++) {
            reserved = false;
            for (j = 0; j < reservedIndices.length && !reserved; j++) {
                if (i === reservedIndices[j]) {
                    reserved = true;
                }
            }

            if (!reserved) {
                result *= x - xTable[zIndices[i]];
            }
        }

        return result;
    }

    /**
     * An {@link InterpolationAlgorithm} for performing Hermite interpolation.
     *
     * @exports HermitePolynomialApproximation
     */
    var HermitePolynomialApproximation = {
        type : 'Hermite'
    };

    /**
     * Given the desired degree, returns the number of data points required for interpolation.
     *
     * @param {Number} degree The desired degree of interpolation.
     * @param {Number} [inputOrder=0]  The order of the inputs (0 means just the data, 1 means the data and its derivative, etc).
     * @returns {Number} The number of required data points needed for the desired degree of interpolation.
     * @exception {DeveloperError} degree must be 0 or greater.
     * @exception {DeveloperError} inputOrder must be 0 or greater.
     */
    HermitePolynomialApproximation.getRequiredDataPoints = function(degree, inputOrder) {
        inputOrder = defaultValue(inputOrder, 0);

        

        return Math.max(Math.floor((degree + 1) / (inputOrder + 1)), 2);
    };

    /**
     * Interpolates values using Hermite Polynomial Approximation.
     *
     * @param {Number} x The independent variable for which the dependent variables will be interpolated.
     * @param {Number[]} xTable The array of independent variables to use to interpolate.  The values
     * in this array must be in increasing order and the same value must not occur twice in the array.
     * @param {Number[]} yTable The array of dependent variables to use to interpolate.  For a set of three
     * dependent values (p,q,w) at time 1 and time 2 this should be as follows: {p1, q1, w1, p2, q2, w2}.
     * @param {Number} yStride The number of dependent variable values in yTable corresponding to
     * each independent variable value in xTable.
     * @param {Number[]} [result] An existing array into which to store the result.
     * @returns {Number[]} The array of interpolated values, or the result parameter if one was provided.
     */
    HermitePolynomialApproximation.interpolateOrderZero = function(x, xTable, yTable, yStride, result) {
        if (!defined(result)) {
            result = new Array(yStride);
        }

        var i;
        var j;
        var d;
        var s;
        var len;
        var index;
        var length = xTable.length;
        var coefficients = new Array(yStride);

        for (i = 0; i < yStride; i++) {
            result[i] = 0;

            var l = new Array(length);
            coefficients[i] = l;
            for (j = 0; j < length; j++) {
                l[j] = [];
            }
        }

        var zIndicesLength = length, zIndices = new Array(zIndicesLength);

        for (i = 0; i < zIndicesLength; i++) {
            zIndices[i] = i;
        }

        var highestNonZeroCoef = length - 1;
        for (s = 0; s < yStride; s++) {
            for (j = 0; j < zIndicesLength; j++) {
                index = zIndices[j] * yStride + s;
                coefficients[s][0].push(yTable[index]);
            }

            for (i = 1; i < zIndicesLength; i++) {
                var nonZeroCoefficients = false;
                for (j = 0; j < zIndicesLength - i; j++) {
                    var zj = xTable[zIndices[j]];
                    var zn = xTable[zIndices[j + i]];

                    var numerator;
                    if (zn - zj <= 0) {
                        index = zIndices[j] * yStride + yStride * i + s;
                        numerator = yTable[index];
                        coefficients[s][i].push(numerator / factorial(i));
                    } else {
                        numerator = (coefficients[s][i - 1][j + 1] - coefficients[s][i - 1][j]);
                        coefficients[s][i].push(numerator / (zn - zj));
                    }
                    nonZeroCoefficients = nonZeroCoefficients || (numerator !== 0);
                }

                if (!nonZeroCoefficients) {
                    highestNonZeroCoef = i - 1;
                }
            }
        }

        for (d = 0, len = 0; d <= len; d++) {
            for (i = d; i <= highestNonZeroCoef; i++) {
                var tempTerm = calculateCoefficientTerm(x, zIndices, xTable, d, i, []);
                for (s = 0; s < yStride; s++) {
                    var coeff = coefficients[s][i][0];
                    result[s + d * yStride] += coeff * tempTerm;
                }
            }
        }

        return result;
    };

    var arrayScratch = [];

    /**
     * Interpolates values using Hermite Polynomial Approximation.
     *
     * @param {Number} x The independent variable for which the dependent variables will be interpolated.
     * @param {Number[]} xTable The array of independent variables to use to interpolate.  The values
     * in this array must be in increasing order and the same value must not occur twice in the array.
     * @param {Number[]} yTable The array of dependent variables to use to interpolate.  For a set of three
     * dependent values (p,q,w) at time 1 and time 2 this should be as follows: {p1, q1, w1, p2, q2, w2}.
     * @param {Number} yStride The number of dependent variable values in yTable corresponding to
     * each independent variable value in xTable.
     * @param {Number} inputOrder The number of derivatives supplied for input.
     * @param {Number} outputOrder The number of derivatives desired for output.
     * @param {Number[]} [result] An existing array into which to store the result.
     *
     * @returns {Number[]} The array of interpolated values, or the result parameter if one was provided.
     */
    HermitePolynomialApproximation.interpolate = function(x, xTable, yTable, yStride, inputOrder, outputOrder, result) {
        var resultLength = yStride * (outputOrder + 1);
        if (!defined(result)) {
            result = new Array(resultLength);
        }
        for (var r = 0; r < resultLength; r++) {
            result[r] = 0;
        }

        var length = xTable.length;
        // The zIndices array holds copies of the addresses of the xTable values
        // in the range we're looking at. Even though this just holds information already
        // available in xTable this is a much more convenient format.
        var zIndices = new Array(length * (inputOrder + 1));
        var i;
        for (i = 0; i < length; i++) {
            for (var j = 0; j < (inputOrder + 1); j++) {
                zIndices[i * (inputOrder + 1) + j] = i;
            }
        }

        var zIndiceslength = zIndices.length;
        var coefficients = arrayScratch;
        var highestNonZeroCoef = fillCoefficientList(coefficients, zIndices, xTable, yTable, yStride, inputOrder);
        var reservedIndices = [];

        var tmp = zIndiceslength * (zIndiceslength + 1) / 2;
        var loopStop = Math.min(highestNonZeroCoef, outputOrder);
        for (var d = 0; d <= loopStop; d++) {
            for (i = d; i <= highestNonZeroCoef; i++) {
                reservedIndices.length = 0;
                var tempTerm = calculateCoefficientTerm(x, zIndices, xTable, d, i, reservedIndices);
                var dimTwo = Math.floor(i * (1 - i) / 2) + (zIndiceslength * i);

                for (var s = 0; s < yStride; s++) {
                    var dimOne = Math.floor(s * tmp);
                    var coef = coefficients[dimOne + dimTwo];
                    result[s + d * yStride] += coef * tempTerm;
                }
            }
        }

        return result;
    };

    function fillCoefficientList(coefficients, zIndices, xTable, yTable, yStride, inputOrder) {
        var j;
        var index;
        var highestNonZero = -1;
        var zIndiceslength = zIndices.length;
        var tmp = zIndiceslength * (zIndiceslength + 1) / 2;

        for (var s = 0; s < yStride; s++) {
            var dimOne = Math.floor(s * tmp);

            for (j = 0; j < zIndiceslength; j++) {
                index = zIndices[j] * yStride * (inputOrder + 1) + s;
                coefficients[dimOne + j] = yTable[index];
            }

            for (var i = 1; i < zIndiceslength; i++) {
                var coefIndex = 0;
                var dimTwo = Math.floor(i * (1 - i) / 2) + (zIndiceslength * i);
                var nonZeroCoefficients = false;

                for (j = 0; j < zIndiceslength - i; j++) {
                    var zj = xTable[zIndices[j]];
                    var zn = xTable[zIndices[j + i]];

                    var numerator;
                    var coefficient;
                    if (zn - zj <= 0) {
                        index = zIndices[j] * yStride * (inputOrder + 1) + yStride * i + s;
                        numerator = yTable[index];
                        coefficient = (numerator / CesiumMath.factorial(i));
                        coefficients[dimOne + dimTwo + coefIndex] = coefficient;
                        coefIndex++;
                    } else {
                        var dimTwoMinusOne = Math.floor((i - 1) * (2 - i) / 2) + (zIndiceslength * (i - 1));
                        numerator = coefficients[dimOne + dimTwoMinusOne + j + 1] - coefficients[dimOne + dimTwoMinusOne + j];
                        coefficient = (numerator / (zn - zj));
                        coefficients[dimOne + dimTwo + coefIndex] = coefficient;
                        coefIndex++;
                    }
                    nonZeroCoefficients = nonZeroCoefficients || (numerator !== 0.0);
                }

                if (nonZeroCoefficients) {
                    highestNonZero = Math.max(highestNonZero, i);
                }
            }
        }

        return highestNonZero;
    }

    return HermitePolynomialApproximation;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2237:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined) {
    'use strict';

    /**
     * An {@link InterpolationAlgorithm} for performing Lagrange interpolation.
     *
     * @exports LagrangePolynomialApproximation
     */
    var LagrangePolynomialApproximation = {
        type : 'Lagrange'
    };

    /**
     * Given the desired degree, returns the number of data points required for interpolation.
     *
     * @param {Number} degree The desired degree of interpolation.
     * @returns {Number} The number of required data points needed for the desired degree of interpolation.
     */
    LagrangePolynomialApproximation.getRequiredDataPoints = function(degree) {
        return Math.max(degree + 1.0, 2);
    };

    /**
     * Interpolates values using Lagrange Polynomial Approximation.
     *
     * @param {Number} x The independent variable for which the dependent variables will be interpolated.
     * @param {Number[]} xTable The array of independent variables to use to interpolate.  The values
     * in this array must be in increasing order and the same value must not occur twice in the array.
     * @param {Number[]} yTable The array of dependent variables to use to interpolate.  For a set of three
     * dependent values (p,q,w) at time 1 and time 2 this should be as follows: {p1, q1, w1, p2, q2, w2}.
     * @param {Number} yStride The number of dependent variable values in yTable corresponding to
     * each independent variable value in xTable.
     * @param {Number[]} [result] An existing array into which to store the result.
     * @returns {Number[]} The array of interpolated values, or the result parameter if one was provided.
     */
    LagrangePolynomialApproximation.interpolateOrderZero = function(x, xTable, yTable, yStride, result) {
        if (!defined(result)) {
            result = new Array(yStride);
        }

        var i;
        var j;
        var length = xTable.length;

        for (i = 0; i < yStride; i++) {
            result[i] = 0;
        }

        for (i = 0; i < length; i++) {
            var coefficient = 1;

            for (j = 0; j < length; j++) {
                if (j !== i) {
                    var diffX = xTable[i] - xTable[j];
                    coefficient *= (x - xTable[j]) / diffX;
                }
            }

            for (j = 0; j < yStride; j++) {
                result[j] += coefficient * yTable[i * yStride + j];
            }
        }

        return result;
    };

    return LagrangePolynomialApproximation;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2238:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(8),
        __webpack_require__(1),
        __webpack_require__(0)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        Check,
        defaultValue,
        defined) {
    'use strict';

    /**
     * A set of curvilinear 3-dimensional coordinates.
     *
     * @alias Spherical
     * @constructor
     *
     * @param {Number} [clock=0.0] The angular coordinate lying in the xy-plane measured from the positive x-axis and toward the positive y-axis.
     * @param {Number} [cone=0.0] The angular coordinate measured from the positive z-axis and toward the negative z-axis.
     * @param {Number} [magnitude=1.0] The linear coordinate measured from the origin.
     */
    function Spherical(clock, cone, magnitude) {
        this.clock = defaultValue(clock, 0.0);
        this.cone = defaultValue(cone, 0.0);
        this.magnitude = defaultValue(magnitude, 1.0);
    }

    /**
     * Converts the provided Cartesian3 into Spherical coordinates.
     *
     * @param {Cartesian3} cartesian3 The Cartesian3 to be converted to Spherical.
     * @param {Spherical} [result] The object in which the result will be stored, if undefined a new instance will be created.
     * @returns {Spherical} The modified result parameter, or a new instance if one was not provided.
     */
    Spherical.fromCartesian3 = function(cartesian3, result) {
        

        var x = cartesian3.x;
        var y = cartesian3.y;
        var z = cartesian3.z;
        var radialSquared = x * x + y * y;

        if (!defined(result)) {
            result = new Spherical();
        }

        result.clock = Math.atan2(y, x);
        result.cone = Math.atan2(Math.sqrt(radialSquared), z);
        result.magnitude = Math.sqrt(radialSquared + z * z);
        return result;
    };

    /**
     * Creates a duplicate of a Spherical.
     *
     * @param {Spherical} spherical The spherical to clone.
     * @param {Spherical} [result] The object to store the result into, if undefined a new instance will be created.
     * @returns {Spherical} The modified result parameter or a new instance if result was undefined. (Returns undefined if spherical is undefined)
     */
    Spherical.clone = function(spherical, result) {
        if (!defined(spherical)) {
            return undefined;
        }

        if (!defined(result)) {
            return new Spherical(spherical.clock, spherical.cone, spherical.magnitude);
        }

        result.clock = spherical.clock;
        result.cone = spherical.cone;
        result.magnitude = spherical.magnitude;
        return result;
    };

    /**
     * Computes the normalized version of the provided spherical.
     *
     * @param {Spherical} spherical The spherical to be normalized.
     * @param {Spherical} [result] The object to store the result into, if undefined a new instance will be created.
     * @returns {Spherical} The modified result parameter or a new instance if result was undefined.
     */
    Spherical.normalize = function(spherical, result) {
      

        if (!defined(result)) {
            return new Spherical(spherical.clock, spherical.cone, 1.0);
        }

        result.clock = spherical.clock;
        result.cone = spherical.cone;
        result.magnitude = 1.0;
        return result;
    };

    /**
     * Returns true if the first spherical is equal to the second spherical, false otherwise.
     *
     * @param {Spherical} left The first Spherical to be compared.
     * @param {Spherical} right The second Spherical to be compared.
     * @returns {Boolean} true if the first spherical is equal to the second spherical, false otherwise.
     */
    Spherical.equals = function(left, right) {
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (left.clock === right.clock) &&
                (left.cone === right.cone) &&
                (left.magnitude === right.magnitude));
    };

    /**
     * Returns true if the first spherical is within the provided epsilon of the second spherical, false otherwise.
     *
     * @param {Spherical} left The first Spherical to be compared.
     * @param {Spherical} right The second Spherical to be compared.
     * @param {Number} [epsilon=0.0] The epsilon to compare against.
     * @returns {Boolean} true if the first spherical is within the provided epsilon of the second spherical, false otherwise.
     */
    Spherical.equalsEpsilon = function(left, right, epsilon) {
        epsilon = defaultValue(epsilon, 0.0);
        return (left === right) ||
               ((defined(left)) &&
                (defined(right)) &&
                (Math.abs(left.clock - right.clock) <= epsilon) &&
                (Math.abs(left.cone - right.cone) <= epsilon) &&
                (Math.abs(left.magnitude - right.magnitude) <= epsilon));
    };

    /**
     * Returns true if this spherical is equal to the provided spherical, false otherwise.
     *
     * @param {Spherical} other The Spherical to be compared.
     * @returns {Boolean} true if this spherical is equal to the provided spherical, false otherwise.
     */
    Spherical.prototype.equals = function(other) {
        return Spherical.equals(this, other);
    };

    /**
     * Creates a duplicate of this Spherical.
     *
     * @param {Spherical} [result] The object to store the result into, if undefined a new instance will be created.
     * @returns {Spherical} The modified result parameter or a new instance if result was undefined.
     */
    Spherical.prototype.clone = function(result) {
        return Spherical.clone(this, result);
    };

    /**
    * Returns true if this spherical is within the provided epsilon of the provided spherical, false otherwise.
    *
    * @param {Spherical} other The Spherical to be compared.
    * @param {Number} epsilon The epsilon to compare against.
    * @returns {Boolean} true if this spherical is within the provided epsilon of the provided spherical, false otherwise.
    */
    Spherical.prototype.equalsEpsilon = function(other, epsilon) {
        return Spherical.equalsEpsilon(this, other, epsilon);
    };

    /**
    * Returns a string representing this instance in the format (clock, cone, magnitude).
    *
    * @returns {String} A string representing this instance.
    */
    Spherical.prototype.toString = function() {
        return '(' + this.clock + ', ' + this.cone + ', ' + this.magnitude + ')';
    };

    return Spherical;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2239:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(6),
        __webpack_require__(4)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        freezeObject,
        CesiumMath) {
    'use strict';

    /**
     * Defines different modes for blending between a target color and a primitive's source color.
     *
     * HIGHLIGHT multiplies the source color by the target color
     * REPLACE replaces the source color with the target color
     * MIX blends the source color and target color together
     *
     * @exports ColorBlendMode
     *
     * @see Model.colorBlendMode
     */
    var ColorBlendMode = {
        HIGHLIGHT : 0,
        REPLACE : 1,
        MIX : 2
    };

    /**
     * @private
     */
    ColorBlendMode.getColorBlend = function(colorBlendMode, colorBlendAmount) {
        if (colorBlendMode === ColorBlendMode.HIGHLIGHT) {
            return 0.0;
        } else if (colorBlendMode === ColorBlendMode.REPLACE) {
            return 1.0;
        } else if (colorBlendMode === ColorBlendMode.MIX) {
            // The value 0.0 is reserved for highlight, so clamp to just above 0.0.
            return CesiumMath.clamp(colorBlendAmount, CesiumMath.EPSILON4, 1.0);
        }
    };

    return freezeObject(ColorBlendMode);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2240:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(12),
        __webpack_require__(2229),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined,
        defineProperties,
        DeveloperError,
        Event,
        CompositeProperty,
        Property) {
    'use strict';

    /**
     * A {@link CompositeProperty} which is also a {@link MaterialProperty}.
     *
     * @alias CompositeMaterialProperty
     * @constructor
     */
    function CompositeMaterialProperty() {
        this._definitionChanged = new Event();
        this._composite = new CompositeProperty();
        this._composite.definitionChanged.addEventListener(CompositeMaterialProperty.prototype._raiseDefinitionChanged, this);
    }

    defineProperties(CompositeMaterialProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof CompositeMaterialProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return this._composite.isConstant;
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is changed whenever setValue is called with data different
         * than the current value.
         * @memberof CompositeMaterialProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets the interval collection.
         * @memberof CompositeMaterialProperty.prototype
         *
         * @type {TimeIntervalCollection}
         */
        intervals : {
            get : function() {
                return this._composite._intervals;
            }
        }
    });

    /**
     * Gets the {@link Material} type at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    CompositeMaterialProperty.prototype.getType = function(time) {
        

        var innerProperty = this._composite._intervals.findDataForIntervalContainingDate(time);
        if (defined(innerProperty)) {
            return innerProperty.getType(time);
        }
        return undefined;
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    CompositeMaterialProperty.prototype.getValue = function(time, result) {
        

        var innerProperty = this._composite._intervals.findDataForIntervalContainingDate(time);
        if (defined(innerProperty)) {
            return innerProperty.getValue(time, result);
        }
        return undefined;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    CompositeMaterialProperty.prototype.equals = function(other) {
        return this === other || //
               (other instanceof CompositeMaterialProperty && //
                this._composite.equals(other._composite, Property.equals));
    };

    /**
     * @private
     */
    CompositeMaterialProperty.prototype._raiseDefinitionChanged = function() {
        this._definitionChanged.raiseEvent(this);
    };

    return CompositeMaterialProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2241:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(15),
        __webpack_require__(21),
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(12),
        __webpack_require__(39),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        Cartesian2,
        Color,
        defaultValue,
        defined,
        defineProperties,
        Event,
        createPropertyDescriptor,
        Property) {
    'use strict';

    var defaultColor = Color.WHITE;
    var defaultCellAlpha = 0.1;
    var defaultLineCount = new Cartesian2(8, 8);
    var defaultLineOffset = new Cartesian2(0, 0);
    var defaultLineThickness = new Cartesian2(1, 1);

    /**
     * A {@link MaterialProperty} that maps to grid {@link Material} uniforms.
     * @alias GridMaterialProperty
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.color=Color.WHITE] A Property specifying the grid {@link Color}.
     * @param {Property} [options.cellAlpha=0.1] A numeric Property specifying cell alpha values.
     * @param {Property} [options.lineCount=new Cartesian2(8, 8)] A {@link Cartesian2} Property specifying the number of grid lines along each axis.
     * @param {Property} [options.lineThickness=new Cartesian2(1.0, 1.0)] A {@link Cartesian2} Property specifying the thickness of grid lines along each axis.
     * @param {Property} [options.lineOffset=new Cartesian2(0.0, 0.0)] A {@link Cartesian2} Property specifying starting offset of grid lines along each axis.
     *
     * @constructor
     */
    function GridMaterialProperty(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this._cellAlpha = undefined;
        this._cellAlphaSubscription = undefined;
        this._lineCount = undefined;
        this._lineCountSubscription = undefined;
        this._lineThickness = undefined;
        this._lineThicknessSubscription = undefined;
        this._lineOffset = undefined;
        this._lineOffsetSubscription = undefined;

        this.color = options.color;
        this.cellAlpha = options.cellAlpha;
        this.lineCount = options.lineCount;
        this.lineThickness = options.lineThickness;
        this.lineOffset = options.lineOffset;
    }

    defineProperties(GridMaterialProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof GridMaterialProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return Property.isConstant(this._color) &&
                       Property.isConstant(this._cellAlpha) &&
                       Property.isConstant(this._lineCount) &&
                       Property.isConstant(this._lineThickness) &&
                       Property.isConstant(this._lineOffset);
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is considered to have changed if a call to getValue would return
         * a different result for the same time.
         * @memberof GridMaterialProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets or sets the Property specifying the grid {@link Color}.
         * @memberof GridMaterialProperty.prototype
         * @type {Property}
         * @default Color.WHITE
         */
        color : createPropertyDescriptor('color'),
        /**
         * Gets or sets the numeric Property specifying cell alpha values.
         * @memberof GridMaterialProperty.prototype
         * @type {Property}
         * @default 0.1
         */
        cellAlpha : createPropertyDescriptor('cellAlpha'),
        /**
         * Gets or sets the {@link Cartesian2} Property specifying the number of grid lines along each axis.
         * @memberof GridMaterialProperty.prototype
         * @type {Property}
         * @default new Cartesian2(8.0, 8.0)
         */
        lineCount : createPropertyDescriptor('lineCount'),
        /**
         * Gets or sets the {@link Cartesian2} Property specifying the thickness of grid lines along each axis.
         * @memberof GridMaterialProperty.prototype
         * @type {Property}
         * @default new Cartesian2(1.0, 1.0)
         */
        lineThickness : createPropertyDescriptor('lineThickness'),
        /**
         * Gets or sets the {@link Cartesian2} Property specifying the starting offset of grid lines along each axis.
         * @memberof GridMaterialProperty.prototype
         * @type {Property}
         * @default new Cartesian2(0.0, 0.0)
         */
        lineOffset : createPropertyDescriptor('lineOffset')
    });

    /**
     * Gets the {@link Material} type at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    GridMaterialProperty.prototype.getType = function(time) {
        return 'Grid';
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    GridMaterialProperty.prototype.getValue = function(time, result) {
        if (!defined(result)) {
            result = {};
        }
        result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
        result.cellAlpha = Property.getValueOrDefault(this._cellAlpha, time, defaultCellAlpha);
        result.lineCount = Property.getValueOrClonedDefault(this._lineCount, time, defaultLineCount, result.lineCount);
        result.lineThickness = Property.getValueOrClonedDefault(this._lineThickness, time, defaultLineThickness, result.lineThickness);
        result.lineOffset = Property.getValueOrClonedDefault(this._lineOffset, time, defaultLineOffset, result.lineOffset);
        return result;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    GridMaterialProperty.prototype.equals = function(other) {
        return this === other || //
        (other instanceof GridMaterialProperty && //
        Property.equals(this._color, other._color) && //
        Property.equals(this._cellAlpha, other._cellAlpha) && //
        Property.equals(this._lineCount, other._lineCount) && //
        Property.equals(this._lineThickness, other._lineThickness) && //
        Property.equals(this._lineOffset, other._lineOffset));
    };

    return GridMaterialProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2242:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(21),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(12),
        __webpack_require__(39),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        Color,
        defined,
        defineProperties,
        Event,
        createPropertyDescriptor,
        Property) {
    'use strict';

    /**
     * A {@link MaterialProperty} that maps to PolylineArrow {@link Material} uniforms.
     *
     * @param {Property} [color=Color.WHITE] The {@link Color} Property to be used.
     *
     * @alias PolylineArrowMaterialProperty
     * @constructor
     */
    function PolylineArrowMaterialProperty(color) {
        this._definitionChanged = new Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
    }

    defineProperties(PolylineArrowMaterialProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof PolylineArrowMaterialProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return Property.isConstant(this._color);
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is considered to have changed if a call to getValue would return
         * a different result for the same time.
         * @memberof PolylineArrowMaterialProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets or sets the {@link Color} {@link Property}.
         * @memberof PolylineArrowMaterialProperty.prototype
         * @type {Property}
         * @default Color.WHITE
         */
        color : createPropertyDescriptor('color')
    });

    /**
     * Gets the {@link Material} type at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    PolylineArrowMaterialProperty.prototype.getType = function(time) {
        return 'PolylineArrow';
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    PolylineArrowMaterialProperty.prototype.getValue = function(time, result) {
        if (!defined(result)) {
            result = {};
        }
        result.color = Property.getValueOrClonedDefault(this._color, time, Color.WHITE, result.color);
        return result;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    PolylineArrowMaterialProperty.prototype.equals = function(other) {
        return this === other || //
               (other instanceof PolylineArrowMaterialProperty && //
                Property.equals(this._color, other._color));
    };

    return PolylineArrowMaterialProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2243:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(21),
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(12),
        __webpack_require__(39),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        Color,
        defaultValue,
        defined,
        defineProperties,
        Event,
        createPropertyDescriptor,
        Property) {
    'use strict';

    var defaultColor = Color.WHITE;
    var defaultGapColor = Color.TRANSPARENT;
    var defaultDashLength = 16.0;
    var defaultDashPattern = 255.0;

    /**
     * A {@link MaterialProperty} that maps to polyline dash {@link Material} uniforms.
     * @alias PolylineDashMaterialProperty
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.color=Color.WHITE] A Property specifying the {@link Color} of the line.
     * @param {Property} [options.gapColor=Color.TRANSPARENT] A Property specifying the {@link Color} of the gaps in the line.
     * @param {Property} [options.dashLength=16.0] A numeric Property specifying the length of the dash pattern in pixel.s
     * @param {Property} [options.dashPattern=255.0] A numeric Property specifying a 16 bit pattern for the dash
     */
    function PolylineDashMaterialProperty(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this._gapColor = undefined;
        this._gapColorSubscription = undefined;
        this._dashLength = undefined;
        this._dashLengthSubscription = undefined;
        this._dashPattern = undefined;
        this._dashPatternSubscription = undefined;

        this.color = options.color;
        this.gapColor = options.gapColor;
        this.dashLength = options.dashLength;
        this.dashPattern = options.dashPattern;
    }

    defineProperties(PolylineDashMaterialProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return (Property.isConstant(this._color) &&
                        Property.isConstant(this._gapColor) &&
                        Property.isConstant(this._dashLength) &&
                        Property.isConstant(this._dashPattern));
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is considered to have changed if a call to getValue would return
         * a different result for the same time.
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets or sets the Property specifying the {@link Color} of the line.
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Property}
         */
        color : createPropertyDescriptor('color'),
        /**
         * Gets or sets the Property specifying the {@link Color} of the gaps in the line.
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Property}
         */
        gapColor : createPropertyDescriptor('gapColor'),
        /**
         * Gets or sets the numeric Property specifying the length of a dash cycle
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Property}
         */
        dashLength : createPropertyDescriptor('dashLength'),
        /**
         * Gets or sets the numeric Property specifying a dash pattern
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Property}
         */
        dashPattern : createPropertyDescriptor('dashPattern')
    });

    /**
     * Gets the {@link Material} type at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    PolylineDashMaterialProperty.prototype.getType = function(time) {
        return 'PolylineDash';
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    PolylineDashMaterialProperty.prototype.getValue = function(time, result) {
        if (!defined(result)) {
            result = {};
        }
        result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
        result.gapColor = Property.getValueOrClonedDefault(this._gapColor, time, defaultGapColor, result.gapColor);
        result.dashLength = Property.getValueOrDefault(this._dashLength, time, defaultDashLength, result.dashLength);
        result.dashPattern = Property.getValueOrDefault(this._dashPattern, time, defaultDashPattern, result.dashPattern);
        return result;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    PolylineDashMaterialProperty.prototype.equals = function(other) {
        return this === other || //
               (other instanceof PolylineDashMaterialProperty &&
                Property.equals(this._color, other._color) &&
                Property.equals(this._gapColor, other._gapColor) &&
                Property.equals(this._dashLength, other._dashLength) &&
                Property.equals(this._dashPattern, other._dashPattern)
                );
    };

    return PolylineDashMaterialProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2244:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(21),
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(12),
        __webpack_require__(39),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        Color,
        defaultValue,
        defined,
        defineProperties,
        Event,
        createPropertyDescriptor,
        Property) {
    'use strict';

    var defaultColor = Color.WHITE;
    var defaultOutlineColor = Color.BLACK;
    var defaultOutlineWidth = 1.0;

    /**
     * A {@link MaterialProperty} that maps to polyline outline {@link Material} uniforms.
     * @alias PolylineOutlineMaterialProperty
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.color=Color.WHITE] A Property specifying the {@link Color} of the line.
     * @param {Property} [options.outlineColor=Color.BLACK] A Property specifying the {@link Color} of the outline.
     * @param {Property} [options.outlineWidth=1.0] A numeric Property specifying the width of the outline, in pixels.
     */
    function PolylineOutlineMaterialProperty(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this._outlineColor = undefined;
        this._outlineColorSubscription = undefined;
        this._outlineWidth = undefined;
        this._outlineWidthSubscription = undefined;

        this.color = options.color;
        this.outlineColor = options.outlineColor;
        this.outlineWidth = options.outlineWidth;
    }

    defineProperties(PolylineOutlineMaterialProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof PolylineOutlineMaterialProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return Property.isConstant(this._color) && Property.isConstant(this._outlineColor) && Property.isConstant(this._outlineWidth);
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is considered to have changed if a call to getValue would return
         * a different result for the same time.
         * @memberof PolylineOutlineMaterialProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets or sets the Property specifying the {@link Color} of the line.
         * @memberof PolylineOutlineMaterialProperty.prototype
         * @type {Property}
         * @default Color.WHITE
         */
        color : createPropertyDescriptor('color'),
        /**
         * Gets or sets the Property specifying the {@link Color} of the outline.
         * @memberof PolylineOutlineMaterialProperty.prototype
         * @type {Property}
         * @default Color.BLACK
         */
        outlineColor : createPropertyDescriptor('outlineColor'),
        /**
         * Gets or sets the numeric Property specifying the width of the outline.
         * @memberof PolylineOutlineMaterialProperty.prototype
         * @type {Property}
         * @default 1.0
         */
        outlineWidth : createPropertyDescriptor('outlineWidth')
    });

    /**
     * Gets the {@link Material} type at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    PolylineOutlineMaterialProperty.prototype.getType = function(time) {
        return 'PolylineOutline';
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    PolylineOutlineMaterialProperty.prototype.getValue = function(time, result) {
        if (!defined(result)) {
            result = {};
        }
        result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
        result.outlineColor = Property.getValueOrClonedDefault(this._outlineColor, time, defaultOutlineColor, result.outlineColor);
        result.outlineWidth = Property.getValueOrDefault(this._outlineWidth, time, defaultOutlineWidth);
        return result;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    PolylineOutlineMaterialProperty.prototype.equals = function(other) {
        return this === other || //
               (other instanceof PolylineOutlineMaterialProperty && //
                Property.equals(this._color, other._color) && //
                Property.equals(this._outlineColor, other._outlineColor) && //
                Property.equals(this._outlineWidth, other._outlineWidth));
    };

    return PolylineOutlineMaterialProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2245:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(12),
        __webpack_require__(459),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined,
        defineProperties,
        DeveloperError,
        Event,
        EventHelper,
        Property) {
    'use strict';

    /**
     * A {@link Property} whose value is an array whose items are the computed value
     * of other property instances.
     *
     * @alias PropertyArray
     * @constructor
     *
     * @param {Property[]} [value] An array of Property instances.
     */
    function PropertyArray(value) {
        this._value = undefined;
        this._definitionChanged = new Event();
        this._eventHelper = new EventHelper();
        this.setValue(value);
    }

    defineProperties(PropertyArray.prototype, {
        /**
         * Gets a value indicating if this property is constant.  This property
         * is considered constant if all property items in the array are constant.
         * @memberof PropertyArray.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                var value = this._value;
                if (!defined(value)) {
                    return true;
                }
                var length = value.length;
                for (var i = 0; i < length; i++) {
                    if (!Property.isConstant(value[i])) {
                        return false;
                    }
                }
                return true;
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is changed whenever setValue is called with data different
         * than the current value or one of the properties in the array also changes.
         * @memberof PropertyArray.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        }
    });

    /**
     * Gets the value of the property.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object[]} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object[]} The modified result parameter, which is an array of values produced by evaluating each of the contained properties at the given time or a new instance if the result parameter was not supplied.
     */
    PropertyArray.prototype.getValue = function(time, result) {
        

        var value = this._value;
        if (!defined(value)) {
            return undefined;
        }

        var length = value.length;
        if (!defined(result)) {
            result = new Array(length);
        }
        var i = 0;
        var x = 0;
        while (i < length) {
            var property = this._value[i];
            var itemValue = property.getValue(time, result[i]);
            if (defined(itemValue)) {
                result[x] = itemValue;
                x++;
            }
            i++;
        }
        result.length = x;
        return result;
    };

    /**
     * Sets the value of the property.
     *
     * @param {Property[]} value An array of Property instances.
     */
    PropertyArray.prototype.setValue = function(value) {
        var eventHelper = this._eventHelper;
        eventHelper.removeAll();

        if (defined(value)) {
            this._value = value.slice();
            var length = value.length;
            for (var i = 0; i < length; i++) {
                var property = value[i];
                if (defined(property)) {
                    eventHelper.add(property.definitionChanged, PropertyArray.prototype._raiseDefinitionChanged, this);
                }
            }
        } else {
            this._value = undefined;
        }
        this._definitionChanged.raiseEvent(this);
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    PropertyArray.prototype.equals = function(other) {
        return this === other || //
               (other instanceof PropertyArray && //
                Property.arrayEquals(this._value, other._value));
    };

    PropertyArray.prototype._raiseDefinitionChanged = function() {
        this._definitionChanged.raiseEvent(this);
    };

    return PropertyArray;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2246:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(2),
        __webpack_require__(4)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defaultValue,
        defined,
        DeveloperError,
        CesiumMath) {
    'use strict';

    /**
     * Represents a {@link Packable} number that always interpolates values
     * towards the shortest angle of rotation. This object is never used directly
     * but is instead passed to the constructor of {@link SampledProperty}
     * in order to represent a two-dimensional angle of rotation.
     *
     * @exports Rotation
     *
     *
     * @example
     * var time1 = Cesium.JulianDate.fromIso8601('2010-05-07T00:00:00');
     * var time2 = Cesium.JulianDate.fromIso8601('2010-05-07T00:01:00');
     * var time3 = Cesium.JulianDate.fromIso8601('2010-05-07T00:02:00');
     *
     * var property = new Cesium.SampledProperty(Cesium.Rotation);
     * property.addSample(time1, 0);
     * property.addSample(time3, Cesium.Math.toRadians(350));
     *
     * //Getting the value at time2 will equal 355 degrees instead
     * //of 175 degrees (which is what you get if you construct
     * //a SampledProperty(Number) instead.  Note, the actual
     * //return value is in radians, not degrees.
     * property.getValue(time2);
     *
     * @see PackableForInterpolation
     */
    var Rotation = {
        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        packedLength : 1,

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {Rotation} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        pack : function(value, array, startingIndex) {
            

            startingIndex = defaultValue(startingIndex, 0);
            array[startingIndex] = value;

            return array;
        },

        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {Rotation} [result] The object into which to store the result.
         * @returns {Rotation} The modified result parameter or a new Rotation instance if one was not provided.
         */
        unpack : function(array, startingIndex, result) {
            

            startingIndex = defaultValue(startingIndex, 0);
            return array[startingIndex];
        },

        /**
         * Converts a packed array into a form suitable for interpolation.
         *
         * @param {Number[]} packedArray The packed array.
         * @param {Number} [startingIndex=0] The index of the first element to be converted.
         * @param {Number} [lastIndex=packedArray.length] The index of the last element to be converted.
         * @param {Number[]} result The object into which to store the result.
         */
        convertPackedArrayForInterpolation : function(packedArray, startingIndex, lastIndex, result) {
            

            startingIndex = defaultValue(startingIndex, 0);
            lastIndex = defaultValue(lastIndex, packedArray.length);

            var previousValue;
            for (var i = 0, len = lastIndex - startingIndex + 1; i < len; i++) {
                var value = packedArray[startingIndex + i];
                if (i === 0 || Math.abs(previousValue - value) < Math.PI) {
                    result[i] = value;
                } else {
                    result[i] = value - CesiumMath.TWO_PI;
                }
                previousValue = value;
            }
        },

        /**
         * Retrieves an instance from a packed array converted with {@link Rotation.convertPackedArrayForInterpolation}.
         *
         * @param {Number[]} array The array previously packed for interpolation.
         * @param {Number[]} sourceArray The original packed array.
         * @param {Number} [firstIndex=0] The firstIndex used to convert the array.
         * @param {Number} [lastIndex=packedArray.length] The lastIndex used to convert the array.
         * @param {Rotation} [result] The object into which to store the result.
         * @returns {Rotation} The modified result parameter or a new Rotation instance if one was not provided.
         */
        unpackInterpolationResult : function(array, sourceArray, firstIndex, lastIndex, result) {
            

            result = array[0];
            if (result < 0) {
                return result + CesiumMath.TWO_PI;
            }
            return result;
        }
    };

    return Rotation;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2247:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(21),
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(12),
        __webpack_require__(39),
        __webpack_require__(118),
        __webpack_require__(2233)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        Color,
        defaultValue,
        defined,
        defineProperties,
        Event,
        createPropertyDescriptor,
        Property,
        StripeOrientation) {
    'use strict';

    var defaultOrientation = StripeOrientation.HORIZONTAL;
    var defaultEvenColor = Color.WHITE;
    var defaultOddColor = Color.BLACK;
    var defaultOffset = 0;
    var defaultRepeat = 1;

    /**
     * A {@link MaterialProperty} that maps to stripe {@link Material} uniforms.
     * @alias StripeMaterialProperty
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.evenColor=Color.WHITE] A Property specifying the first {@link Color}.
     * @param {Property} [options.oddColor=Color.BLACK] A Property specifying the second {@link Color}.
     * @param {Property} [options.repeat=1] A numeric Property specifying how many times the stripes repeat.
     * @param {Property} [options.offset=0] A numeric Property specifying how far into the pattern to start the material.
     * @param {Property} [options.orientation=StripeOrientation.HORIZONTAL] A Property specifying the {@link StripeOrientation}.
     */
    function StripeMaterialProperty(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Event();

        this._orientation = undefined;
        this._orientationSubscription = undefined;

        this._evenColor = undefined;
        this._evenColorSubscription = undefined;

        this._oddColor = undefined;
        this._oddColorSubscription = undefined;

        this._offset = undefined;
        this._offsetSubscription = undefined;

        this._repeat = undefined;
        this._repeatSubscription = undefined;

        this.orientation = options.orientation;
        this.evenColor = options.evenColor;
        this.oddColor = options.oddColor;
        this.offset = options.offset;
        this.repeat = options.repeat;
    }

    defineProperties(StripeMaterialProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof StripeMaterialProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return Property.isConstant(this._orientation) && //
                       Property.isConstant(this._evenColor) && //
                       Property.isConstant(this._oddColor) && //
                       Property.isConstant(this._offset) && //
                       Property.isConstant(this._repeat);
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is considered to have changed if a call to getValue would return
         * a different result for the same time.
         * @memberof StripeMaterialProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets or sets the Property specifying the {@link StripeOrientation}/
         * @memberof StripeMaterialProperty.prototype
         * @type {Property}
         * @default StripeOrientation.HORIZONTAL
         */
        orientation : createPropertyDescriptor('orientation'),
        /**
         * Gets or sets the Property specifying the first {@link Color}.
         * @memberof StripeMaterialProperty.prototype
         * @type {Property}
         * @default Color.WHITE
         */
        evenColor : createPropertyDescriptor('evenColor'),
        /**
         * Gets or sets the Property specifying the second {@link Color}.
         * @memberof StripeMaterialProperty.prototype
         * @type {Property}
         * @default Color.BLACK
         */
        oddColor : createPropertyDescriptor('oddColor'),
        /**
         * Gets or sets the numeric Property specifying the point into the pattern
         * to begin drawing; with 0.0 being the beginning of the even color, 1.0 the beginning
         * of the odd color, 2.0 being the even color again, and any multiple or fractional values
         * being in between.
         * @memberof StripeMaterialProperty.prototype
         * @type {Property}
         * @default 0.0
         */
        offset : createPropertyDescriptor('offset'),
        /**
         * Gets or sets the numeric Property specifying how many times the stripes repeat.
         * @memberof StripeMaterialProperty.prototype
         * @type {Property}
         * @default 1.0
         */
        repeat : createPropertyDescriptor('repeat')
    });

    /**
     * Gets the {@link Material} type at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    StripeMaterialProperty.prototype.getType = function(time) {
        return 'Stripe';
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    StripeMaterialProperty.prototype.getValue = function(time, result) {
        if (!defined(result)) {
            result = {};
        }
        result.horizontal = Property.getValueOrDefault(this._orientation, time, defaultOrientation) === StripeOrientation.HORIZONTAL;
        result.evenColor = Property.getValueOrClonedDefault(this._evenColor, time, defaultEvenColor, result.evenColor);
        result.oddColor = Property.getValueOrClonedDefault(this._oddColor, time, defaultOddColor, result.oddColor);
        result.offset = Property.getValueOrDefault(this._offset, time, defaultOffset);
        result.repeat = Property.getValueOrDefault(this._repeat, time, defaultRepeat);
        return result;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    StripeMaterialProperty.prototype.equals = function(other) {
        return this === other || //
               (other instanceof StripeMaterialProperty && //
                       Property.equals(this._orientation, other._orientation) && //
                       Property.equals(this._evenColor, other._evenColor) && //
                       Property.equals(this._oddColor, other._oddColor) && //
                       Property.equals(this._offset, other._offset) && //
                       Property.equals(this._repeat, other._repeat));
    };

    return StripeMaterialProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2248:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(5),
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(19),
        __webpack_require__(12),
        __webpack_require__(35),
        __webpack_require__(61),
        __webpack_require__(62),
        __webpack_require__(118),
        __webpack_require__(2234)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        Cartesian3,
        defaultValue,
        defined,
        defineProperties,
        Ellipsoid,
        Event,
        Matrix3,
        Quaternion,
        Transforms,
        Property,
        VelocityVectorProperty) {
    'use strict';

    /**
     * A {@link Property} which evaluates to a {@link Quaternion} rotation
     * based on the velocity of the provided {@link PositionProperty}.
     *
     * @alias VelocityOrientationProperty
     * @constructor
     *
     * @param {Property} [position] The position property used to compute the orientation.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid used to determine which way is up.
     *
     * @example
     * //Create an entity with position and orientation.
     * var position = new Cesium.SampledProperty();
     * position.addSamples(...);
     * var entity = viewer.entities.add({
     *   position : position,
     *   orientation : new Cesium.VelocityOrientationProperty(position)
     * }));
     */
    function VelocityOrientationProperty(position, ellipsoid) {
        this._velocityVectorProperty = new VelocityVectorProperty(position, true);
        this._subscription = undefined;
        this._ellipsoid = undefined;
        this._definitionChanged = new Event();

        this.ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);

        var that = this;
        this._velocityVectorProperty.definitionChanged.addEventListener(function() {
            that._definitionChanged.raiseEvent(that);
        });
    }

    defineProperties(VelocityOrientationProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.
         * @memberof VelocityOrientationProperty.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return Property.isConstant(this._velocityVectorProperty);
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * @memberof VelocityOrientationProperty.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets or sets the position property used to compute orientation.
         * @memberof VelocityOrientationProperty.prototype
         *
         * @type {Property}
         */
        position : {
            get : function() {
                return this._velocityVectorProperty.position;
            },
            set : function(value) {
                this._velocityVectorProperty.position = value;
            }
        },
        /**
         * Gets or sets the ellipsoid used to determine which way is up.
         * @memberof VelocityOrientationProperty.prototype
         *
         * @type {Property}
         */
        ellipsoid : {
            get : function() {
                return this._ellipsoid;
            },
            set : function(value) {
                var oldValue = this._ellipsoid;
                if (oldValue !== value) {
                    this._ellipsoid = value;
                    this._definitionChanged.raiseEvent(this);
                }
            }
        }
    });

    var positionScratch = new Cartesian3();
    var velocityScratch = new Cartesian3();
    var rotationScratch = new Matrix3();

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} [time] The time for which to retrieve the value.
     * @param {Quaternion} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Quaternion} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    VelocityOrientationProperty.prototype.getValue = function(time, result) {
        var velocity = this._velocityVectorProperty._getValue(time, velocityScratch, positionScratch);

        if (!defined(velocity)) {
            return undefined;
        }

        Transforms.rotationMatrixFromPositionVelocity(positionScratch, velocity, this._ellipsoid, rotationScratch);
        return Quaternion.fromRotationMatrix(rotationScratch, result);
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    VelocityOrientationProperty.prototype.equals = function(other) {
        return this === other ||//
               (other instanceof VelocityOrientationProperty &&
                Property.equals(this._velocityVectorProperty, other._velocityVectorProperty) &&
                (this._ellipsoid === other._ellipsoid ||
                 this._ellipsoid.equals(other._ellipsoid)));
    };

    return VelocityOrientationProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2249:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
  if (true) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return (root['Autolinker'] = factory());
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Autolinker'] = factory();
  }
}(this, function () {

/*!
 * Autolinker.js
 * 0.17.1
 *
 * Copyright(c) 2015 Gregory Jacobs <greg@greg-jacobs.com>
 * MIT Licensed. http-colon-slashslash www.opensource.org/licenses/mit-license.php
 *
 * https-colon-slashslash github.com/gregjacobs/Autolinker.js
 */
/**
 * @class Autolinker
 * @extends Object
 *
 * Utility class used to process a given string of text, and wrap the matches in
 * the appropriate anchor (&lt;a&gt;) tags to turn them into links.
 *
 * Any of the configuration options may be provided in an Object (map) provided
 * to the Autolinker constructor, which will configure how the {@link #link link()}
 * method will process the links.
 *
 * For example:
 *
 *     var autolinker = new Autolinker( {
 *         newWindow : false,
 *         truncate  : 30
 *     } );
 *
 *     var html = autolinker.link( "Joe went to www.yahoo.com" );
 *     // produces: 'Joe went to <a href="http-colon-slashslash www.yahoo.com">yahoo.com</a>'
 *
 *
 * The {@link #static-link static link()} method may also be used to inline options into a single call, which may
 * be more convenient for one-off uses. For example:
 *
 *     var html = Autolinker.link( "Joe went to www.yahoo.com", {
 *         newWindow : false,
 *         truncate  : 30
 *     } );
 *     // produces: 'Joe went to <a href="http-colon-slashslash www.yahoo.com">yahoo.com</a>'
 *
 *
 * ## Custom Replacements of Links
 *
 * If the configuration options do not provide enough flexibility, a {@link #replaceFn}
 * may be provided to fully customize the output of Autolinker. This function is
 * called once for each URL/Email/Phone#/Twitter Handle/Hashtag match that is
 * encountered.
 *
 * For example:
 *
 *     var input = "...";  // string with URLs, Email Addresses, Phone #s, Twitter Handles, and Hashtags
 *
 *     var linkedText = Autolinker.link( input, {
 *         replaceFn : function( autolinker, match ) {
 *             console.log( "href = ", match.getAnchorHref() );
 *             console.log( "text = ", match.getAnchorText() );
 *
 *             switch( match.getType() ) {
 *                 case 'url' :
 *                     console.log( "url: ", match.getUrl() );
 *
 *                     if( match.getUrl().indexOf( 'mysite.com' ) === -1 ) {
 *                         var tag = autolinker.getTagBuilder().build( match );  // returns an `Autolinker.HtmlTag` instance, which provides mutator methods for easy changes
 *                         tag.setAttr( 'rel', 'nofollow' );
 *                         tag.addClass( 'external-link' );
 *
 *                         return tag;
 *
 *                     } else {
 *                         return true;  // let Autolinker perform its normal anchor tag replacement
 *                     }
 *
 *                 case 'email' :
 *                     var email = match.getEmail();
 *                     console.log( "email: ", email );
 *
 *                     if( email === "my@own.address" ) {
 *                         return false;  // don't auto-link this particular email address; leave as-is
 *                     } else {
 *                         return;  // no return value will have Autolinker perform its normal anchor tag replacement (same as returning `true`)
 *                     }
 *
 *                 case 'phone' :
 *                     var phoneNumber = match.getPhoneNumber();
 *                     console.log( phoneNumber );
 *
 *                     return '<a href="http-colon-slashslash newplace.to.link.phone.numbers.to/">' + phoneNumber + '</a>';
 *
 *                 case 'twitter' :
 *                     var twitterHandle = match.getTwitterHandle();
 *                     console.log( twitterHandle );
 *
 *                     return '<a href="http-colon-slashslash newplace.to.link.twitter.handles.to/">' + twitterHandle + '</a>';
 *
 *                 case 'hashtag' :
 *                     var hashtag = match.getHashtag();
 *                     console.log( hashtag );
 *
 *                     return '<a href="http-colon-slashslash newplace.to.link.hashtag.handles.to/">' + hashtag + '</a>';
 *             }
 *         }
 *     } );
 *
 *
 * The function may return the following values:
 *
 * - `true` (Boolean): Allow Autolinker to replace the match as it normally would.
 * - `false` (Boolean): Do not replace the current match at all - leave as-is.
 * - Any String: If a string is returned from the function, the string will be used directly as the replacement HTML for
 *   the match.
 * - An {@link Autolinker.HtmlTag} instance, which can be used to build/modify an HTML tag before writing out its HTML text.
 *
 * @constructor
 * @param {Object} [config] The configuration options for the Autolinker instance, specified in an Object (map).
 */
var Autolinker = function( cfg ) {
	Autolinker.Util.assign( this, cfg );  // assign the properties of `cfg` onto the Autolinker instance. Prototype properties will be used for missing configs.

	// Validate the value of the `hashtag` cfg.
	var hashtag = this.hashtag;
	if( hashtag !== false && hashtag !== 'twitter' && hashtag !== 'facebook' ) {
		throw new Error( "invalid `hashtag` cfg - see docs" );
	}
};

Autolinker.prototype = {
	constructor : Autolinker,  // fix constructor property

	/**
	 * @cfg {Boolean} urls
	 *
	 * `true` if miscellaneous URLs should be automatically linked, `false` if they should not be.
	 */
	urls : true,

	/**
	 * @cfg {Boolean} email
	 *
	 * `true` if email addresses should be automatically linked, `false` if they should not be.
	 */
	email : true,

	/**
	 * @cfg {Boolean} twitter
	 *
	 * `true` if Twitter handles ("@example") should be automatically linked, `false` if they should not be.
	 */
	twitter : true,

	/**
	 * @cfg {Boolean} phone
	 *
	 * `true` if Phone numbers ("(555)555-5555") should be automatically linked, `false` if they should not be.
	 */
	phone: true,

	/**
	 * @cfg {Boolean/String} hashtag
	 *
	 * A string for the service name to have hashtags (ex: "#myHashtag")
	 * auto-linked to. The currently-supported values are:
	 *
	 * - 'twitter'
	 * - 'facebook'
	 *
	 * Pass `false` to skip auto-linking of hashtags.
	 */
	hashtag : false,

	/**
	 * @cfg {Boolean} newWindow
	 *
	 * `true` if the links should open in a new window, `false` otherwise.
	 */
	newWindow : true,

	/**
	 * @cfg {Boolean} stripPrefix
	 *
	 * `true` if 'http-colon-slashslash ' or 'https-colon-slashslash ' and/or the 'www.' should be stripped
	 * from the beginning of URL links' text, `false` otherwise.
	 */
	stripPrefix : true,

	/**
	 * @cfg {Number} truncate
	 *
	 * A number for how many characters long matched text should be truncated to inside the text of
	 * a link. If the matched text is over this number of characters, it will be truncated to this length by
	 * adding a two period ellipsis ('..') to the end of the string.
	 *
	 * For example: A url like 'http-colon-slashslash www.yahoo.com/some/long/path/to/a/file' truncated to 25 characters might look
	 * something like this: 'yahoo.com/some/long/pat..'
	 */
	truncate : undefined,

	/**
	 * @cfg {String} className
	 *
	 * A CSS class name to add to the generated links. This class will be added to all links, as well as this class
	 * plus match suffixes for styling url/email/phone/twitter/hashtag links differently.
	 *
	 * For example, if this config is provided as "myLink", then:
	 *
	 * - URL links will have the CSS classes: "myLink myLink-url"
	 * - Email links will have the CSS classes: "myLink myLink-email", and
	 * - Twitter links will have the CSS classes: "myLink myLink-twitter"
	 * - Phone links will have the CSS classes: "myLink myLink-phone"
	 * - Hashtag links will have the CSS classes: "myLink myLink-hashtag"
	 */
	className : "",

	/**
	 * @cfg {Function} replaceFn
	 *
	 * A function to individually process each match found in the input string.
	 *
	 * See the class's description for usage.
	 *
	 * This function is called with the following parameters:
	 *
	 * @cfg {Autolinker} replaceFn.autolinker The Autolinker instance, which may be used to retrieve child objects from (such
	 *   as the instance's {@link #getTagBuilder tag builder}).
	 * @cfg {Autolinker.match.Match} replaceFn.match The Match instance which can be used to retrieve information about the
	 *   match that the `replaceFn` is currently processing. See {@link Autolinker.match.Match} subclasses for details.
	 */


	/**
	 * @private
	 * @property {Autolinker.htmlParser.HtmlParser} htmlParser
	 *
	 * The HtmlParser instance used to skip over HTML tags, while finding text nodes to process. This is lazily instantiated
	 * in the {@link #getHtmlParser} method.
	 */
	htmlParser : undefined,

	/**
	 * @private
	 * @property {Autolinker.matchParser.MatchParser} matchParser
	 *
	 * The MatchParser instance used to find matches in the text nodes of an input string passed to
	 * {@link #link}. This is lazily instantiated in the {@link #getMatchParser} method.
	 */
	matchParser : undefined,

	/**
	 * @private
	 * @property {Autolinker.AnchorTagBuilder} tagBuilder
	 *
	 * The AnchorTagBuilder instance used to build match replacement anchor tags. Note: this is lazily instantiated
	 * in the {@link #getTagBuilder} method.
	 */
	tagBuilder : undefined,

	/**
	 * Automatically links URLs, Email addresses, Phone numbers, Twitter
	 * handles, and Hashtags found in the given chunk of HTML. Does not link
	 * URLs found within HTML tags.
	 *
	 * For instance, if given the text: `You should go to http-colon-slashslash www.yahoo.com`,
	 * then the result will be `You should go to
	 * &lt;a href="http-colon-slashslash www.yahoo.com"&gt;http-colon-slashslash www.yahoo.com&lt;/a&gt;`
	 *
	 * This method finds the text around any HTML elements in the input
	 * `textOrHtml`, which will be the text that is processed. Any original HTML
	 * elements will be left as-is, as well as the text that is already wrapped
	 * in anchor (&lt;a&gt;) tags.
	 *
	 * @param {String} textOrHtml The HTML or text to autolink matches within
	 *   (depending on if the {@link #urls}, {@link #email}, {@link #phone},
	 *   {@link #twitter}, and {@link #hashtag} options are enabled).
	 * @return {String} The HTML, with matches automatically linked.
	 */
	link : function( textOrHtml ) {
		var htmlParser = this.getHtmlParser(),
		    htmlNodes = htmlParser.parse( textOrHtml ),
		    anchorTagStackCount = 0,  // used to only process text around anchor tags, and any inner text/html they may have
		    resultHtml = [];

		for( var i = 0, len = htmlNodes.length; i < len; i++ ) {
			var node = htmlNodes[ i ],
			    nodeType = node.getType(),
			    nodeText = node.getText();

			if( nodeType === 'element' ) {
				// Process HTML nodes in the input `textOrHtml`
				if( node.getTagName() === 'a' ) {
					if( !node.isClosing() ) {  // it's the start <a> tag
						anchorTagStackCount++;
					} else {   // it's the end </a> tag
						anchorTagStackCount = Math.max( anchorTagStackCount - 1, 0 );  // attempt to handle extraneous </a> tags by making sure the stack count never goes below 0
					}
				}
				resultHtml.push( nodeText );  // now add the text of the tag itself verbatim

			} else if( nodeType === 'entity' || nodeType === 'comment' ) {
				resultHtml.push( nodeText );  // append HTML entity nodes (such as '&nbsp;') or HTML comments (such as '<!-- Comment -->') verbatim

			} else {
				// Process text nodes in the input `textOrHtml`
				if( anchorTagStackCount === 0 ) {
					// If we're not within an <a> tag, process the text node to linkify
					var linkifiedStr = this.linkifyStr( nodeText );
					resultHtml.push( linkifiedStr );

				} else {
					// `text` is within an <a> tag, simply append the text - we do not want to autolink anything
					// already within an <a>...</a> tag
					resultHtml.push( nodeText );
				}
			}
		}

		return resultHtml.join( "" );
	},

	/**
	 * Process the text that lies in between HTML tags, performing the anchor
	 * tag replacements for the matches, and returns the string with the
	 * replacements made.
	 *
	 * This method does the actual wrapping of matches with anchor tags.
	 *
	 * @private
	 * @param {String} str The string of text to auto-link.
	 * @return {String} The text with anchor tags auto-filled.
	 */
	linkifyStr : function( str ) {
		return this.getMatchParser().replace( str, this.createMatchReturnVal, this );
	},


	/**
	 * Creates the return string value for a given match in the input string,
	 * for the {@link #linkifyStr} method.
	 *
	 * This method handles the {@link #replaceFn}, if one was provided.
	 *
	 * @private
	 * @param {Autolinker.match.Match} match The Match object that represents the match.
	 * @return {String} The string that the `match` should be replaced with. This is usually the anchor tag string, but
	 *   may be the `matchStr` itself if the match is not to be replaced.
	 */
	createMatchReturnVal : function( match ) {
		// Handle a custom `replaceFn` being provided
		var replaceFnResult;
		if( this.replaceFn ) {
			replaceFnResult = this.replaceFn.call( this, this, match );  // Autolinker instance is the context, and the first arg
		}

		if( typeof replaceFnResult === 'string' ) {
			return replaceFnResult;  // `replaceFn` returned a string, use that

		} else if( replaceFnResult === false ) {
			return match.getMatchedText();  // no replacement for the match

		} else if( replaceFnResult instanceof Autolinker.HtmlTag ) {
			return replaceFnResult.toAnchorString();

		} else {  // replaceFnResult === true, or no/unknown return value from function
			// Perform Autolinker's default anchor tag generation
			var tagBuilder = this.getTagBuilder(),
			    anchorTag = tagBuilder.build( match );  // returns an Autolinker.HtmlTag instance

			return anchorTag.toAnchorString();
		}
	},


	/**
	 * Lazily instantiates and returns the {@link #htmlParser} instance for this Autolinker instance.
	 *
	 * @protected
	 * @return {Autolinker.htmlParser.HtmlParser}
	 */
	getHtmlParser : function() {
		var htmlParser = this.htmlParser;

		if( !htmlParser ) {
			htmlParser = this.htmlParser = new Autolinker.htmlParser.HtmlParser();
		}

		return htmlParser;
	},


	/**
	 * Lazily instantiates and returns the {@link #matchParser} instance for this Autolinker instance.
	 *
	 * @protected
	 * @return {Autolinker.matchParser.MatchParser}
	 */
	getMatchParser : function() {
		var matchParser = this.matchParser;

		if( !matchParser ) {
			matchParser = this.matchParser = new Autolinker.matchParser.MatchParser( {
				urls        : this.urls,
				email       : this.email,
				twitter     : this.twitter,
				phone       : this.phone,
				hashtag     : this.hashtag,
				stripPrefix : this.stripPrefix
			} );
		}

		return matchParser;
	},


	/**
	 * Returns the {@link #tagBuilder} instance for this Autolinker instance, lazily instantiating it
	 * if it does not yet exist.
	 *
	 * This method may be used in a {@link #replaceFn} to generate the {@link Autolinker.HtmlTag HtmlTag} instance that
	 * Autolinker would normally generate, and then allow for modifications before returning it. For example:
	 *
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
	 *             tag.setAttr( 'rel', 'nofollow' );
	 *
	 *             return tag;
	 *         }
	 *     } );
	 *
	 *     // generated html:
	 *     //   Test <a href="http-colon-slashslash google.com" target="_blank" rel="nofollow">google.com</a>
	 *
	 * @return {Autolinker.AnchorTagBuilder}
	 */
	getTagBuilder : function() {
		var tagBuilder = this.tagBuilder;

		if( !tagBuilder ) {
			tagBuilder = this.tagBuilder = new Autolinker.AnchorTagBuilder( {
				newWindow   : this.newWindow,
				truncate    : this.truncate,
				className   : this.className
			} );
		}

		return tagBuilder;
	}

};


/**
 * Automatically links URLs, Email addresses, Phone Numbers, Twitter handles,
 * and Hashtags found in the given chunk of HTML. Does not link URLs found
 * within HTML tags.
 *
 * For instance, if given the text: `You should go to http-colon-slashslash www.yahoo.com`,
 * then the result will be `You should go to &lt;a href="http-colon-slashslash www.yahoo.com"&gt;http-colon-slashslash www.yahoo.com&lt;/a&gt;`
 *
 * Example:
 *
 *     var linkedText = Autolinker.link( "Go to google.com", { newWindow: false } );
 *     // Produces: "Go to <a href="http-colon-slashslash google.com">google.com</a>"
 *
 * @static
 * @param {String} textOrHtml The HTML or text to find matches within (depending
 *   on if the {@link #urls}, {@link #email}, {@link #phone}, {@link #twitter},
 *   and {@link #hashtag} options are enabled).
 * @param {Object} [options] Any of the configuration options for the Autolinker
 *   class, specified in an Object (map). See the class description for an
 *   example call.
 * @return {String} The HTML text, with matches automatically linked.
 */
Autolinker.link = function( textOrHtml, options ) {
	var autolinker = new Autolinker( options );
	return autolinker.link( textOrHtml );
};


// Autolinker Namespaces
Autolinker.match = {};
Autolinker.htmlParser = {};
Autolinker.matchParser = {};

/*global Autolinker */
/*jshint eqnull:true, boss:true */
/**
 * @class Autolinker.Util
 * @singleton
 *
 * A few utility methods for Autolinker.
 */
Autolinker.Util = {

	/**
	 * @property {Function} abstractMethod
	 *
	 * A function object which represents an abstract method.
	 */
	abstractMethod : function() { throw "abstract"; },


	/**
	 * @private
	 * @property {RegExp} trimRegex
	 *
	 * The regular expression used to trim the leading and trailing whitespace
	 * from a string.
	 */
	trimRegex : /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,


	/**
	 * Assigns (shallow copies) the properties of `src` onto `dest`.
	 *
	 * @param {Object} dest The destination object.
	 * @param {Object} src The source object.
	 * @return {Object} The destination object (`dest`)
	 */
	assign : function( dest, src ) {
		for( var prop in src ) {
			if( src.hasOwnProperty( prop ) ) {
				dest[ prop ] = src[ prop ];
			}
		}

		return dest;
	},


	/**
	 * Extends `superclass` to create a new subclass, adding the `protoProps` to the new subclass's prototype.
	 *
	 * @param {Function} superclass The constructor function for the superclass.
	 * @param {Object} protoProps The methods/properties to add to the subclass's prototype. This may contain the
	 *   special property `constructor`, which will be used as the new subclass's constructor function.
	 * @return {Function} The new subclass function.
	 */
	extend : function( superclass, protoProps ) {
		var superclassProto = superclass.prototype;

		var F = function() {};
		F.prototype = superclassProto;

		var subclass;
		if( protoProps.hasOwnProperty( 'constructor' ) ) {
			subclass = protoProps.constructor;
		} else {
			subclass = function() { superclassProto.constructor.apply( this, arguments ); };
		}

		var subclassProto = subclass.prototype = new F();  // set up prototype chain
		subclassProto.constructor = subclass;  // fix constructor property
		subclassProto.superclass = superclassProto;

		delete protoProps.constructor;  // don't re-assign constructor property to the prototype, since a new function may have been created (`subclass`), which is now already there
		Autolinker.Util.assign( subclassProto, protoProps );

		return subclass;
	},


	/**
	 * Truncates the `str` at `len - ellipsisChars.length`, and adds the `ellipsisChars` to the
	 * end of the string (by default, two periods: '..'). If the `str` length does not exceed
	 * `len`, the string will be returned unchanged.
	 *
	 * @param {String} str The string to truncate and add an ellipsis to.
	 * @param {Number} truncateLen The length to truncate the string at.
	 * @param {String} [ellipsisChars=..] The ellipsis character(s) to add to the end of `str`
	 *   when truncated. Defaults to '..'
	 */
	ellipsis : function( str, truncateLen, ellipsisChars ) {
		if( str.length > truncateLen ) {
			ellipsisChars = ( ellipsisChars == null ) ? '..' : ellipsisChars;
			str = str.substring( 0, truncateLen - ellipsisChars.length ) + ellipsisChars;
		}
		return str;
	},


	/**
	 * Supports `Array.prototype.indexOf()` functionality for old IE (IE8 and below).
	 *
	 * @param {Array} arr The array to find an element of.
	 * @param {*} element The element to find in the array, and return the index of.
	 * @return {Number} The index of the `element`, or -1 if it was not found.
	 */
	indexOf : function( arr, element ) {
		if( Array.prototype.indexOf ) {
			return arr.indexOf( element );

		} else {
			for( var i = 0, len = arr.length; i < len; i++ ) {
				if( arr[ i ] === element ) return i;
			}
			return -1;
		}
	},



	/**
	 * Performs the functionality of what modern browsers do when `String.prototype.split()` is called
	 * with a regular expression that contains capturing parenthesis.
	 *
	 * For example:
	 *
	 *     // Modern browsers:
	 *     "a,b,c".split( /(,)/ );  // --> [ 'a', ',', 'b', ',', 'c' ]
	 *
	 *     // Old IE (including IE8):
	 *     "a,b,c".split( /(,)/ );  // --> [ 'a', 'b', 'c' ]
	 *
	 * This method emulates the functionality of modern browsers for the old IE case.
	 *
	 * @param {String} str The string to split.
	 * @param {RegExp} splitRegex The regular expression to split the input `str` on. The splitting
	 *   character(s) will be spliced into the array, as in the "modern browsers" example in the
	 *   description of this method.
	 *   Note #1: the supplied regular expression **must** have the 'g' flag specified.
	 *   Note #2: for simplicity's sake, the regular expression does not need
	 *   to contain capturing parenthesis - it will be assumed that any match has them.
	 * @return {String[]} The split array of strings, with the splitting character(s) included.
	 */
	splitAndCapture : function( str, splitRegex ) {
		if( !splitRegex.global ) throw new Error( "`splitRegex` must have the 'g' flag set" );

		var result = [],
		    lastIdx = 0,
		    match;

		while( match = splitRegex.exec( str ) ) {
			result.push( str.substring( lastIdx, match.index ) );
			result.push( match[ 0 ] );  // push the splitting char(s)

			lastIdx = match.index + match[ 0 ].length;
		}
		result.push( str.substring( lastIdx ) );

		return result;
	},


	/**
	 * Trims the leading and trailing whitespace from a string.
	 *
	 * @param {String} str The string to trim.
	 * @return {String}
	 */
	trim : function( str ) {
		return str.replace( this.trimRegex, '' );
	}

};
/*global Autolinker */
/*jshint boss:true */
/**
 * @class Autolinker.HtmlTag
 * @extends Object
 *
 * Represents an HTML tag, which can be used to easily build/modify HTML tags programmatically.
 *
 * Autolinker uses this abstraction to create HTML tags, and then write them out as strings. You may also use
 * this class in your code, especially within a {@link Autolinker#replaceFn replaceFn}.
 *
 * ## Examples
 *
 * Example instantiation:
 *
 *     var tag = new Autolinker.HtmlTag( {
 *         tagName : 'a',
 *         attrs   : { 'href': 'http-colon-slashslash google.com', 'class': 'external-link' },
 *         innerHtml : 'Google'
 *     } );
 *
 *     tag.toAnchorString();  // <a href="http-colon-slashslash google.com" class="external-link">Google</a>
 *
 *     // Individual accessor methods
 *     tag.getTagName();                 // 'a'
 *     tag.getAttr( 'href' );            // 'http-colon-slashslash google.com'
 *     tag.hasClass( 'external-link' );  // true
 *
 *
 * Using mutator methods (which may be used in combination with instantiation config properties):
 *
 *     var tag = new Autolinker.HtmlTag();
 *     tag.setTagName( 'a' );
 *     tag.setAttr( 'href', 'http-colon-slashslash google.com' );
 *     tag.addClass( 'external-link' );
 *     tag.setInnerHtml( 'Google' );
 *
 *     tag.getTagName();                 // 'a'
 *     tag.getAttr( 'href' );            // 'http-colon-slashslash google.com'
 *     tag.hasClass( 'external-link' );  // true
 *
 *     tag.toAnchorString();  // <a href="http-colon-slashslash google.com" class="external-link">Google</a>
 *
 *
 * ## Example use within a {@link Autolinker#replaceFn replaceFn}
 *
 *     var html = Autolinker.link( "Test google.com", {
 *         replaceFn : function( autolinker, match ) {
 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance, configured with the Match's href and anchor text
 *             tag.setAttr( 'rel', 'nofollow' );
 *
 *             return tag;
 *         }
 *     } );
 *
 *     // generated html:
 *     //   Test <a href="http-colon-slashslash google.com" target="_blank" rel="nofollow">google.com</a>
 *
 *
 * ## Example use with a new tag for the replacement
 *
 *     var html = Autolinker.link( "Test google.com", {
 *         replaceFn : function( autolinker, match ) {
 *             var tag = new Autolinker.HtmlTag( {
 *                 tagName : 'button',
 *                 attrs   : { 'title': 'Load URL: ' + match.getAnchorHref() },
 *                 innerHtml : 'Load URL: ' + match.getAnchorText()
 *             } );
 *
 *             return tag;
 *         }
 *     } );
 *
 *     // generated html:
 *     //   Test <button title="Load URL: http-colon-slashslash google.com">Load URL: google.com</button>
 */
Autolinker.HtmlTag = Autolinker.Util.extend( Object, {

	/**
	 * @cfg {String} tagName
	 *
	 * The tag name. Ex: 'a', 'button', etc.
	 *
	 * Not required at instantiation time, but should be set using {@link #setTagName} before {@link #toAnchorString}
	 * is executed.
	 */

	/**
	 * @cfg {Object.<String, String>} attrs
	 *
	 * An key/value Object (map) of attributes to create the tag with. The keys are the attribute names, and the
	 * values are the attribute values.
	 */

	/**
	 * @cfg {String} innerHtml
	 *
	 * The inner HTML for the tag.
	 *
	 * Note the camel case name on `innerHtml`. Acronyms are camelCased in this utility (such as not to run into the acronym
	 * naming inconsistency that the DOM developers created with `XMLHttpRequest`). You may alternatively use {@link #innerHTML}
	 * if you prefer, but this one is recommended.
	 */

	/**
	 * @cfg {String} innerHTML
	 *
	 * Alias of {@link #innerHtml}, accepted for consistency with the browser DOM api, but prefer the camelCased version
	 * for acronym names.
	 */


	/**
	 * @protected
	 * @property {RegExp} whitespaceRegex
	 *
	 * Regular expression used to match whitespace in a string of CSS classes.
	 */
	whitespaceRegex : /\s+/,


	/**
	 * @constructor
	 * @param {Object} [cfg] The configuration properties for this class, in an Object (map)
	 */
	constructor : function( cfg ) {
		Autolinker.Util.assign( this, cfg );

		this.innerHtml = this.innerHtml || this.innerHTML;  // accept either the camelCased form or the fully capitalized acronym
	},


	/**
	 * Sets the tag name that will be used to generate the tag with.
	 *
	 * @param {String} tagName
	 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
	 */
	setTagName : function( tagName ) {
		this.tagName = tagName;
		return this;
	},


	/**
	 * Retrieves the tag name.
	 *
	 * @return {String}
	 */
	getTagName : function() {
		return this.tagName || "";
	},


	/**
	 * Sets an attribute on the HtmlTag.
	 *
	 * @param {String} attrName The attribute name to set.
	 * @param {String} attrValue The attribute value to set.
	 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
	 */
	setAttr : function( attrName, attrValue ) {
		var tagAttrs = this.getAttrs();
		tagAttrs[ attrName ] = attrValue;

		return this;
	},


	/**
	 * Retrieves an attribute from the HtmlTag. If the attribute does not exist, returns `undefined`.
	 *
	 * @param {String} name The attribute name to retrieve.
	 * @return {String} The attribute's value, or `undefined` if it does not exist on the HtmlTag.
	 */
	getAttr : function( attrName ) {
		return this.getAttrs()[ attrName ];
	},


	/**
	 * Sets one or more attributes on the HtmlTag.
	 *
	 * @param {Object.<String, String>} attrs A key/value Object (map) of the attributes to set.
	 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
	 */
	setAttrs : function( attrs ) {
		var tagAttrs = this.getAttrs();
		Autolinker.Util.assign( tagAttrs, attrs );

		return this;
	},


	/**
	 * Retrieves the attributes Object (map) for the HtmlTag.
	 *
	 * @return {Object.<String, String>} A key/value object of the attributes for the HtmlTag.
	 */
	getAttrs : function() {
		return this.attrs || ( this.attrs = {} );
	},


	/**
	 * Sets the provided `cssClass`, overwriting any current CSS classes on the HtmlTag.
	 *
	 * @param {String} cssClass One or more space-separated CSS classes to set (overwrite).
	 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
	 */
	setClass : function( cssClass ) {
		return this.setAttr( 'class', cssClass );
	},


	/**
	 * Convenience method to add one or more CSS classes to the HtmlTag. Will not add duplicate CSS classes.
	 *
	 * @param {String} cssClass One or more space-separated CSS classes to add.
	 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
	 */
	addClass : function( cssClass ) {
		var classAttr = this.getClass(),
		    whitespaceRegex = this.whitespaceRegex,
		    indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
		    classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
		    newClasses = cssClass.split( whitespaceRegex ),
		    newClass;

		while( newClass = newClasses.shift() ) {
			if( indexOf( classes, newClass ) === -1 ) {
				classes.push( newClass );
			}
		}

		this.getAttrs()[ 'class' ] = classes.join( " " );
		return this;
	},


	/**
	 * Convenience method to remove one or more CSS classes from the HtmlTag.
	 *
	 * @param {String} cssClass One or more space-separated CSS classes to remove.
	 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
	 */
	removeClass : function( cssClass ) {
		var classAttr = this.getClass(),
		    whitespaceRegex = this.whitespaceRegex,
		    indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
		    classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
		    removeClasses = cssClass.split( whitespaceRegex ),
		    removeClass;

		while( classes.length && ( removeClass = removeClasses.shift() ) ) {
			var idx = indexOf( classes, removeClass );
			if( idx !== -1 ) {
				classes.splice( idx, 1 );
			}
		}

		this.getAttrs()[ 'class' ] = classes.join( " " );
		return this;
	},


	/**
	 * Convenience method to retrieve the CSS class(es) for the HtmlTag, which will each be separated by spaces when
	 * there are multiple.
	 *
	 * @return {String}
	 */
	getClass : function() {
		return this.getAttrs()[ 'class' ] || "";
	},


	/**
	 * Convenience method to check if the tag has a CSS class or not.
	 *
	 * @param {String} cssClass The CSS class to check for.
	 * @return {Boolean} `true` if the HtmlTag has the CSS class, `false` otherwise.
	 */
	hasClass : function( cssClass ) {
		return ( ' ' + this.getClass() + ' ' ).indexOf( ' ' + cssClass + ' ' ) !== -1;
	},


	/**
	 * Sets the inner HTML for the tag.
	 *
	 * @param {String} html The inner HTML to set.
	 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
	 */
	setInnerHtml : function( html ) {
		this.innerHtml = html;

		return this;
	},


	/**
	 * Retrieves the inner HTML for the tag.
	 *
	 * @return {String}
	 */
	getInnerHtml : function() {
		return this.innerHtml || "";
	},


	/**
	 * Override of superclass method used to generate the HTML string for the tag.
	 *
	 * @return {String}
	 */
	toAnchorString : function() {
		var tagName = this.getTagName(),
		    attrsStr = this.buildAttrsStr();

		attrsStr = ( attrsStr ) ? ' ' + attrsStr : '';  // prepend a space if there are actually attributes

		return [ '<', tagName, attrsStr, '>', this.getInnerHtml(), '</', tagName, '>' ].join( "" );
	},


	/**
	 * Support method for {@link #toAnchorString}, returns the string space-separated key="value" pairs, used to populate
	 * the stringified HtmlTag.
	 *
	 * @protected
	 * @return {String} Example return: `attr1="value1" attr2="value2"`
	 */
	buildAttrsStr : function() {
		if( !this.attrs ) return "";  // no `attrs` Object (map) has been set, return empty string

		var attrs = this.getAttrs(),
		    attrsArr = [];

		for( var prop in attrs ) {
			if( attrs.hasOwnProperty( prop ) ) {
				attrsArr.push( prop + '="' + attrs[ prop ] + '"' );
			}
		}
		return attrsArr.join( " " );
	}

} );

/*global Autolinker */
/*jshint sub:true */
/**
 * @protected
 * @class Autolinker.AnchorTagBuilder
 * @extends Object
 *
 * Builds anchor (&lt;a&gt;) tags for the Autolinker utility when a match is found.
 *
 * Normally this class is instantiated, configured, and used internally by an {@link Autolinker} instance, but may
 * actually be retrieved in a {@link Autolinker#replaceFn replaceFn} to create {@link Autolinker.HtmlTag HtmlTag} instances
 * which may be modified before returning from the {@link Autolinker#replaceFn replaceFn}. For example:
 *
 *     var html = Autolinker.link( "Test google.com", {
 *         replaceFn : function( autolinker, match ) {
 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
 *             tag.setAttr( 'rel', 'nofollow' );
 *
 *             return tag;
 *         }
 *     } );
 *
 *     // generated html:
 *     //   Test <a href="http-colon-slashslash google.com" target="_blank" rel="nofollow">google.com</a>
 */
Autolinker.AnchorTagBuilder = Autolinker.Util.extend( Object, {

	/**
	 * @cfg {Boolean} newWindow
	 * @inheritdoc Autolinker#newWindow
	 */

	/**
	 * @cfg {Number} truncate
	 * @inheritdoc Autolinker#truncate
	 */

	/**
	 * @cfg {String} className
	 * @inheritdoc Autolinker#className
	 */


	/**
	 * @constructor
	 * @param {Object} [cfg] The configuration options for the AnchorTagBuilder instance, specified in an Object (map).
	 */
	constructor : function( cfg ) {
		Autolinker.Util.assign( this, cfg );
	},


	/**
	 * Generates the actual anchor (&lt;a&gt;) tag to use in place of the
	 * matched text, via its `match` object.
	 *
	 * @param {Autolinker.match.Match} match The Match instance to generate an
	 *   anchor tag from.
	 * @return {Autolinker.HtmlTag} The HtmlTag instance for the anchor tag.
	 */
	build : function( match ) {
		var tag = new Autolinker.HtmlTag( {
			tagName   : 'a',
			attrs     : this.createAttrs( match.getType(), match.getAnchorHref() ),
			innerHtml : this.processAnchorText( match.getAnchorText() )
		} );

		return tag;
	},


	/**
	 * Creates the Object (map) of the HTML attributes for the anchor (&lt;a&gt;)
	 *   tag being generated.
	 *
	 * @protected
	 * @param {"url"/"email"/"phone"/"twitter"/"hashtag"} matchType The type of
	 *   match that an anchor tag is being generated for.
	 * @param {String} href The href for the anchor tag.
	 * @return {Object} A key/value Object (map) of the anchor tag's attributes.
	 */
	createAttrs : function( matchType, anchorHref ) {
		var attrs = {
			'href' : anchorHref  // we'll always have the `href` attribute
		};

		var cssClass = this.createCssClass( matchType );
		if( cssClass ) {
			attrs[ 'class' ] = cssClass;
		}
		if( this.newWindow ) {
			attrs[ 'target' ] = "_blank";
		}

		return attrs;
	},


	/**
	 * Creates the CSS class that will be used for a given anchor tag, based on
	 * the `matchType` and the {@link #className} config.
	 *
	 * @private
	 * @param {"url"/"email"/"phone"/"twitter"/"hashtag"} matchType The type of
	 *   match that an anchor tag is being generated for.
	 * @return {String} The CSS class string for the link. Example return:
	 *   "myLink myLink-url". If no {@link #className} was configured, returns
	 *   an empty string.
	 */
	createCssClass : function( matchType ) {
		var className = this.className;

		if( !className )
			return "";
		else
			return className + " " + className + "-" + matchType;  // ex: "myLink myLink-url", "myLink myLink-email", "myLink myLink-phone", "myLink myLink-twitter", or "myLink myLink-hashtag"
	},


	/**
	 * Processes the `anchorText` by truncating the text according to the
	 * {@link #truncate} config.
	 *
	 * @private
	 * @param {String} anchorText The anchor tag's text (i.e. what will be
	 *   displayed).
	 * @return {String} The processed `anchorText`.
	 */
	processAnchorText : function( anchorText ) {
		anchorText = this.doTruncate( anchorText );

		return anchorText;
	},


	/**
	 * Performs the truncation of the `anchorText`, if the `anchorText` is
	 * longer than the {@link #truncate} option. Truncates the text to 2
	 * characters fewer than the {@link #truncate} option, and adds ".." to the
	 * end.
	 *
	 * @private
	 * @param {String} text The anchor tag's text (i.e. what will be displayed).
	 * @return {String} The truncated anchor text.
	 */
	doTruncate : function( anchorText ) {
		return Autolinker.Util.ellipsis( anchorText, this.truncate || Number.POSITIVE_INFINITY );
	}

} );
/*global Autolinker */
/**
 * @private
 * @class Autolinker.htmlParser.HtmlParser
 * @extends Object
 *
 * An HTML parser implementation which simply walks an HTML string and returns an array of
 * {@link Autolinker.htmlParser.HtmlNode HtmlNodes} that represent the basic HTML structure of the input string.
 *
 * Autolinker uses this to only link URLs/emails/Twitter handles within text nodes, effectively ignoring / "walking
 * around" HTML tags.
 */
Autolinker.htmlParser.HtmlParser = Autolinker.Util.extend( Object, {

	/**
	 * @private
	 * @property {RegExp} htmlRegex
	 *
	 * The regular expression used to pull out HTML tags from a string. Handles namespaced HTML tags and
	 * attribute names, as specified by http-colon-slashslash www.w3.org/TR/html-markup/syntax.html.
	 *
	 * Capturing groups:
	 *
	 * 1. The "!DOCTYPE" tag name, if a tag is a &lt;!DOCTYPE&gt; tag.
	 * 2. If it is an end tag, this group will have the '/'.
	 * 3. If it is a comment tag, this group will hold the comment text (i.e.
	 *    the text inside the `&lt;!--` and `--&gt;`.
	 * 4. The tag name for all tags (other than the &lt;!DOCTYPE&gt; tag)
	 */
	htmlRegex : (function() {
		var commentTagRegex = /!--([\s\S]+?)--/,
		    tagNameRegex = /[0-9a-zA-Z][0-9a-zA-Z:]*/,
		    attrNameRegex = /[^\s\0"'>\/=\x01-\x1F\x7F]+/,   // the unicode range accounts for excluding control chars, and the delete char
		    attrValueRegex = /(?:"[^"]*?"|'[^']*?'|[^'"=<>`\s]+)/, // double quoted, single quoted, or unquoted attribute values
		    nameEqualsValueRegex = attrNameRegex.source + '(?:\\s*=\\s*' + attrValueRegex.source + ')?';  // optional '=[value]'

		return new RegExp( [
			// for <!DOCTYPE> tag. Ex: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">)
			'(?:',
				'<(!DOCTYPE)',  // *** Capturing Group 1 - If it's a doctype tag

					// Zero or more attributes following the tag name
					'(?:',
						'\\s+',  // one or more whitespace chars before an attribute

						// Either:
						// A. attr="value", or
						// B. "value" alone (To cover example doctype tag: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">)
						'(?:', nameEqualsValueRegex, '|', attrValueRegex.source + ')',
					')*',
				'>',
			')',

			'|',

			// All other HTML tags (i.e. tags that are not <!DOCTYPE>)
			'(?:',
				'<(/)?',  // Beginning of a tag or comment. Either '<' for a start tag, or '</' for an end tag.
				          // *** Capturing Group 2: The slash or an empty string. Slash ('/') for end tag, empty string for start or self-closing tag.

					'(?:',
						commentTagRegex.source,  // *** Capturing Group 3 - A Comment Tag's Text

						'|',

						'(?:',

							// *** Capturing Group 4 - The tag name
							'(' + tagNameRegex.source + ')',

							// Zero or more attributes following the tag name
							'(?:',
								'\\s+',                // one or more whitespace chars before an attribute
								nameEqualsValueRegex,  // attr="value" (with optional ="value" part)
							')*',

							'\\s*/?',  // any trailing spaces and optional '/' before the closing '>'

						')',
					')',
				'>',
			')'
		].join( "" ), 'gi' );
	} )(),

	/**
	 * @private
	 * @property {RegExp} htmlCharacterEntitiesRegex
	 *
	 * The regular expression that matches common HTML character entities.
	 *
	 * Ignoring &amp; as it could be part of a query string -- handling it separately.
	 */
	htmlCharacterEntitiesRegex: /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi,


	/**
	 * Parses an HTML string and returns a simple array of {@link Autolinker.htmlParser.HtmlNode HtmlNodes}
	 * to represent the HTML structure of the input string.
	 *
	 * @param {String} html The HTML to parse.
	 * @return {Autolinker.htmlParser.HtmlNode[]}
	 */
	parse : function( html ) {
		var htmlRegex = this.htmlRegex,
		    currentResult,
		    lastIndex = 0,
		    textAndEntityNodes,
		    nodes = [];  // will be the result of the method

		while( ( currentResult = htmlRegex.exec( html ) ) !== null ) {
			var tagText = currentResult[ 0 ],
			    commentText = currentResult[ 3 ], // if we've matched a comment
			    tagName = currentResult[ 1 ] || currentResult[ 4 ],  // The <!DOCTYPE> tag (ex: "!DOCTYPE"), or another tag (ex: "a" or "img")
			    isClosingTag = !!currentResult[ 2 ],
			    inBetweenTagsText = html.substring( lastIndex, currentResult.index );

			// Push TextNodes and EntityNodes for any text found between tags
			if( inBetweenTagsText ) {
				textAndEntityNodes = this.parseTextAndEntityNodes( inBetweenTagsText );
				nodes.push.apply( nodes, textAndEntityNodes );
			}

			// Push the CommentNode or ElementNode
			if( commentText ) {
				nodes.push( this.createCommentNode( tagText, commentText ) );
			} else {
				nodes.push( this.createElementNode( tagText, tagName, isClosingTag ) );
			}

			lastIndex = currentResult.index + tagText.length;
		}

		// Process any remaining text after the last HTML element. Will process all of the text if there were no HTML elements.
		if( lastIndex < html.length ) {
			var text = html.substring( lastIndex );

			// Push TextNodes and EntityNodes for any text found between tags
			if( text ) {
				textAndEntityNodes = this.parseTextAndEntityNodes( text );
				nodes.push.apply( nodes, textAndEntityNodes );
			}
		}

		return nodes;
	},


	/**
	 * Parses text and HTML entity nodes from a given string. The input string
	 * should not have any HTML tags (elements) within it.
	 *
	 * @private
	 * @param {String} text The text to parse.
	 * @return {Autolinker.htmlParser.HtmlNode[]} An array of HtmlNodes to
	 *   represent the {@link Autolinker.htmlParser.TextNode TextNodes} and
	 *   {@link Autolinker.htmlParser.EntityNode EntityNodes} found.
	 */
	parseTextAndEntityNodes : function( text ) {
		var nodes = [],
		    textAndEntityTokens = Autolinker.Util.splitAndCapture( text, this.htmlCharacterEntitiesRegex );  // split at HTML entities, but include the HTML entities in the results array

		// Every even numbered token is a TextNode, and every odd numbered token is an EntityNode
		// For example: an input `text` of "Test &quot;this&quot; today" would turn into the
		//   `textAndEntityTokens`: [ 'Test ', '&quot;', 'this', '&quot;', ' today' ]
		for( var i = 0, len = textAndEntityTokens.length; i < len; i += 2 ) {
			var textToken = textAndEntityTokens[ i ],
			    entityToken = textAndEntityTokens[ i + 1 ];

			if( textToken ) nodes.push( this.createTextNode( textToken ) );
			if( entityToken ) nodes.push( this.createEntityNode( entityToken ) );
		}
		return nodes;
	},


	/**
	 * Factory method to create an {@link Autolinker.htmlParser.CommentNode CommentNode}.
	 *
	 * @private
	 * @param {String} tagText The full text of the tag (comment) that was
	 *   matched, including its &lt;!-- and --&gt;.
	 * @param {String} comment The full text of the comment that was matched.
	 */
	createCommentNode : function( tagText, commentText ) {
		return new Autolinker.htmlParser.CommentNode( {
			text: tagText,
			comment: Autolinker.Util.trim( commentText )
		} );
	},


	/**
	 * Factory method to create an {@link Autolinker.htmlParser.ElementNode ElementNode}.
	 *
	 * @private
	 * @param {String} tagText The full text of the tag (element) that was
	 *   matched, including its attributes.
	 * @param {String} tagName The name of the tag. Ex: An &lt;img&gt; tag would
	 *   be passed to this method as "img".
	 * @param {Boolean} isClosingTag `true` if it's a closing tag, false
	 *   otherwise.
	 * @return {Autolinker.htmlParser.ElementNode}
	 */
	createElementNode : function( tagText, tagName, isClosingTag ) {
		return new Autolinker.htmlParser.ElementNode( {
			text    : tagText,
			tagName : tagName.toLowerCase(),
			closing : isClosingTag
		} );
	},


	/**
	 * Factory method to create a {@link Autolinker.htmlParser.EntityNode EntityNode}.
	 *
	 * @private
	 * @param {String} text The text that was matched for the HTML entity (such
	 *   as '&amp;nbsp;').
	 * @return {Autolinker.htmlParser.EntityNode}
	 */
	createEntityNode : function( text ) {
		return new Autolinker.htmlParser.EntityNode( { text: text } );
	},


	/**
	 * Factory method to create a {@link Autolinker.htmlParser.TextNode TextNode}.
	 *
	 * @private
	 * @param {String} text The text that was matched.
	 * @return {Autolinker.htmlParser.TextNode}
	 */
	createTextNode : function( text ) {
		return new Autolinker.htmlParser.TextNode( { text: text } );
	}

} );
/*global Autolinker */
/**
 * @abstract
 * @class Autolinker.htmlParser.HtmlNode
 * 
 * Represents an HTML node found in an input string. An HTML node is one of the following:
 * 
 * 1. An {@link Autolinker.htmlParser.ElementNode ElementNode}, which represents HTML tags.
 * 2. A {@link Autolinker.htmlParser.TextNode TextNode}, which represents text outside or within HTML tags.
 * 3. A {@link Autolinker.htmlParser.EntityNode EntityNode}, which represents one of the known HTML
 *    entities that Autolinker looks for. This includes common ones such as &amp;quot; and &amp;nbsp;
 */
Autolinker.htmlParser.HtmlNode = Autolinker.Util.extend( Object, {
	
	/**
	 * @cfg {String} text (required)
	 * 
	 * The original text that was matched for the HtmlNode. 
	 * 
	 * - In the case of an {@link Autolinker.htmlParser.ElementNode ElementNode}, this will be the tag's
	 *   text.
	 * - In the case of a {@link Autolinker.htmlParser.TextNode TextNode}, this will be the text itself.
	 * - In the case of a {@link Autolinker.htmlParser.EntityNode EntityNode}, this will be the text of
	 *   the HTML entity.
	 */
	text : "",
	
	
	/**
	 * @constructor
	 * @param {Object} cfg The configuration properties for the Match instance, specified in an Object (map).
	 */
	constructor : function( cfg ) {
		Autolinker.Util.assign( this, cfg );
	},

	
	/**
	 * Returns a string name for the type of node that this class represents.
	 * 
	 * @abstract
	 * @return {String}
	 */
	getType : Autolinker.Util.abstractMethod,
	
	
	/**
	 * Retrieves the {@link #text} for the HtmlNode.
	 * 
	 * @return {String}
	 */
	getText : function() {
		return this.text;
	}

} );
/*global Autolinker */
/**
 * @class Autolinker.htmlParser.CommentNode
 * @extends Autolinker.htmlParser.HtmlNode
 *
 * Represents an HTML comment node that has been parsed by the
 * {@link Autolinker.htmlParser.HtmlParser}.
 *
 * See this class's superclass ({@link Autolinker.htmlParser.HtmlNode}) for more
 * details.
 */
Autolinker.htmlParser.CommentNode = Autolinker.Util.extend( Autolinker.htmlParser.HtmlNode, {

	/**
	 * @cfg {String} comment (required)
	 *
	 * The text inside the comment tag. This text is stripped of any leading or
	 * trailing whitespace.
	 */
	comment : '',


	/**
	 * Returns a string name for the type of node that this class represents.
	 *
	 * @return {String}
	 */
	getType : function() {
		return 'comment';
	},


	/**
	 * Returns the comment inside the comment tag.
	 *
	 * @return {String}
	 */
	getComment : function() {
		return this.comment;
	}

} );
/*global Autolinker */
/**
 * @class Autolinker.htmlParser.ElementNode
 * @extends Autolinker.htmlParser.HtmlNode
 * 
 * Represents an HTML element node that has been parsed by the {@link Autolinker.htmlParser.HtmlParser}.
 * 
 * See this class's superclass ({@link Autolinker.htmlParser.HtmlNode}) for more details.
 */
Autolinker.htmlParser.ElementNode = Autolinker.Util.extend( Autolinker.htmlParser.HtmlNode, {
	
	/**
	 * @cfg {String} tagName (required)
	 * 
	 * The name of the tag that was matched.
	 */
	tagName : '',
	
	/**
	 * @cfg {Boolean} closing (required)
	 * 
	 * `true` if the element (tag) is a closing tag, `false` if its an opening tag.
	 */
	closing : false,

	
	/**
	 * Returns a string name for the type of node that this class represents.
	 * 
	 * @return {String}
	 */
	getType : function() {
		return 'element';
	},
	

	/**
	 * Returns the HTML element's (tag's) name. Ex: for an &lt;img&gt; tag, returns "img".
	 * 
	 * @return {String}
	 */
	getTagName : function() {
		return this.tagName;
	},
	
	
	/**
	 * Determines if the HTML element (tag) is a closing tag. Ex: &lt;div&gt; returns
	 * `false`, while &lt;/div&gt; returns `true`.
	 * 
	 * @return {Boolean}
	 */
	isClosing : function() {
		return this.closing;
	}
	
} );
/*global Autolinker */
/**
 * @class Autolinker.htmlParser.EntityNode
 * @extends Autolinker.htmlParser.HtmlNode
 * 
 * Represents a known HTML entity node that has been parsed by the {@link Autolinker.htmlParser.HtmlParser}.
 * Ex: '&amp;nbsp;', or '&amp#160;' (which will be retrievable from the {@link #getText} method.
 * 
 * Note that this class will only be returned from the HtmlParser for the set of checked HTML entity nodes 
 * defined by the {@link Autolinker.htmlParser.HtmlParser#htmlCharacterEntitiesRegex}.
 * 
 * See this class's superclass ({@link Autolinker.htmlParser.HtmlNode}) for more details.
 */
Autolinker.htmlParser.EntityNode = Autolinker.Util.extend( Autolinker.htmlParser.HtmlNode, {
	
	/**
	 * Returns a string name for the type of node that this class represents.
	 * 
	 * @return {String}
	 */
	getType : function() {
		return 'entity';
	}
	
} );
/*global Autolinker */
/**
 * @class Autolinker.htmlParser.TextNode
 * @extends Autolinker.htmlParser.HtmlNode
 * 
 * Represents a text node that has been parsed by the {@link Autolinker.htmlParser.HtmlParser}.
 * 
 * See this class's superclass ({@link Autolinker.htmlParser.HtmlNode}) for more details.
 */
Autolinker.htmlParser.TextNode = Autolinker.Util.extend( Autolinker.htmlParser.HtmlNode, {
	
	/**
	 * Returns a string name for the type of node that this class represents.
	 * 
	 * @return {String}
	 */
	getType : function() {
		return 'text';
	}
	
} );
/*global Autolinker */
/**
 * @private
 * @class Autolinker.matchParser.MatchParser
 * @extends Object
 *
 * Used by Autolinker to parse potential matches, given an input string of text.
 *
 * The MatchParser is fed a non-HTML string in order to search for matches.
 * Autolinker first uses the {@link Autolinker.htmlParser.HtmlParser} to "walk
 * around" HTML tags, and then the text around the HTML tags is passed into the
 * MatchParser in order to find the actual matches.
 */
Autolinker.matchParser.MatchParser = Autolinker.Util.extend( Object, {

	/**
	 * @cfg {Boolean} urls
	 * @inheritdoc Autolinker#urls
	 */
	urls : true,

	/**
	 * @cfg {Boolean} email
	 * @inheritdoc Autolinker#email
	 */
	email : true,

	/**
	 * @cfg {Boolean} twitter
	 * @inheritdoc Autolinker#twitter
	 */
	twitter : true,

	/**
	 * @cfg {Boolean} phone
	 * @inheritdoc Autolinker#phone
	 */
	phone: true,

	/**
	 * @cfg {Boolean/String} hashtag
	 * @inheritdoc Autolinker#hashtag
	 */
	hashtag : false,

	/**
	 * @cfg {Boolean} stripPrefix
	 * @inheritdoc Autolinker#stripPrefix
	 */
	stripPrefix : true,


	/**
	 * @private
	 * @property {RegExp} matcherRegex
	 *
	 * The regular expression that matches URLs, email addresses, phone #s,
	 * Twitter handles, and Hashtags.
	 *
	 * This regular expression has the following capturing groups:
	 *
	 * 1.  Group that is used to determine if there is a Twitter handle match
	 *     (i.e. \@someTwitterUser). Simply check for its existence to determine
	 *     if there is a Twitter handle match. The next couple of capturing
	 *     groups give information about the Twitter handle match.
	 * 2.  The whitespace character before the \@sign in a Twitter handle. This
	 *     is needed because there are no lookbehinds in JS regular expressions,
	 *     and can be used to reconstruct the original string in a replace().
	 * 3.  The Twitter handle itself in a Twitter match. If the match is
	 *     '@someTwitterUser', the handle is 'someTwitterUser'.
	 * 4.  Group that matches an email address. Used to determine if the match
	 *     is an email address, as well as holding the full address. Ex:
	 *     'me@my.com'
	 * 5.  Group that matches a URL in the input text. Ex: 'http-colon-slashslash google.com',
	 *     'www.google.com', or just 'google.com'. This also includes a path,
	 *     url parameters, or hash anchors. Ex: google.com/path/to/file?q1=1&q2=2#myAnchor
	 * 6.  Group that matches a protocol URL (i.e. 'http-colon-slashslash google.com'). This is
	 *     used to match protocol URLs with just a single word, like 'http-colon-slashslash localhost',
	 *     where we won't double check that the domain name has at least one '.'
	 *     in it.
	 * 7.  A protocol-relative ('//') match for the case of a 'www.' prefixed
	 *     URL. Will be an empty string if it is not a protocol-relative match.
	 *     We need to know the character before the '//' in order to determine
	 *     if it is a valid match or the // was in a string we don't want to
	 *     auto-link.
	 * 8.  A protocol-relative ('//') match for the case of a known TLD prefixed
	 *     URL. Will be an empty string if it is not a protocol-relative match.
	 *     See #6 for more info.
	 * 9.  Group that is used to determine if there is a phone number match. The
	 *     next 3 groups give segments of the phone number.
	 * 10. Group that is used to determine if there is a Hashtag match
	 *     (i.e. \#someHashtag). Simply check for its existence to determine if
	 *     there is a Hashtag match. The next couple of capturing groups give
	 *     information about the Hashtag match.
	 * 11. The whitespace character before the #sign in a Hashtag handle. This
	 *     is needed because there are no look-behinds in JS regular
	 *     expressions, and can be used to reconstruct the original string in a
	 *     replace().
	 * 12. The Hashtag itself in a Hashtag match. If the match is
	 *     '#someHashtag', the hashtag is 'someHashtag'.
	 */
	matcherRegex : (function() {
		var twitterRegex = /(^|[^\w])@(\w{1,15})/,              // For matching a twitter handle. Ex: @gregory_jacobs

		    hashtagRegex = /(^|[^\w])#(\w{1,15})/,              // For matching a Hashtag. Ex: #games

		    emailRegex = /(?:[\-;:&=\+\$,\w\.]+@)/,             // something@ for email addresses (a.k.a. local-part)
		    phoneRegex = /(?:\+?\d{1,3}[-\s.])?\(?\d{3}\)?[-\s.]?\d{3}[-\s.]\d{4}/,  // ex: (123) 456-7890, 123 456 7890, 123-456-7890, etc.
		    protocolRegex = /(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/,  // match protocol, allow in format "http://" or "mailto:". However, do not match the first part of something like 'link:http://www.google.com' (i.e. don't match "link:"). Also, make sure we don't interpret 'google.com:8000' as if 'google.com' was a protocol here (i.e. ignore a trailing port number in this regex)
		    wwwRegex = /(?:www\.)/,                             // starting with 'www.'
		    domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,  // anything looking at all like a domain, non-unicode domains, not ending in a period
		    tldRegex = /\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/,   // match our known top level domains (TLDs)

		    // Allow optional path, query string, and hash anchor, not ending in the following characters: "?!:,.;"
		    // http://blog.codinghorror.com/the-problem-with-urls/
		    urlSuffixRegex = /[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]?!:,.;]*[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]]/;

		return new RegExp( [
			'(',  // *** Capturing group $1, which can be used to check for a twitter handle match. Use group $3 for the actual twitter handle though. $2 may be used to reconstruct the original string in a replace()
				// *** Capturing group $2, which matches the whitespace character before the '@' sign (needed because of no lookbehinds), and
				// *** Capturing group $3, which matches the actual twitter handle
				twitterRegex.source,
			')',

			'|',

			'(',  // *** Capturing group $4, which is used to determine an email match
				emailRegex.source,
				domainNameRegex.source,
				tldRegex.source,
			')',

			'|',

			'(',  // *** Capturing group $5, which is used to match a URL
				'(?:', // parens to cover match for protocol (optional), and domain
					'(',  // *** Capturing group $6, for a protocol-prefixed url (ex: http://google.com)
						protocolRegex.source,
						domainNameRegex.source,
					')',

					'|',

					'(?:',  // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
						'(.?//)?',  // *** Capturing group $7 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
						wwwRegex.source,
						domainNameRegex.source,
					')',

					'|',

					'(?:',  // non-capturing paren for known a TLD url (ex: google.com)
						'(.?//)?',  // *** Capturing group $8 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
						domainNameRegex.source,
						tldRegex.source,
					')',
				')',

				'(?:' + urlSuffixRegex.source + ')?',  // match for path, query string, and/or hash anchor - optional
			')',

			'|',

			// this setup does not scale well for open extension :( Need to rethink design of autolinker...
			// ***  Capturing group $9, which matches a (USA for now) phone number
			'(',
				phoneRegex.source,
			')',

			'|',

			'(',  // *** Capturing group $10, which can be used to check for a Hashtag match. Use group $12 for the actual Hashtag though. $11 may be used to reconstruct the original string in a replace()
				// *** Capturing group $11, which matches the whitespace character before the '#' sign (needed because of no lookbehinds), and
				// *** Capturing group $12, which matches the actual Hashtag
				hashtagRegex.source,
			')'
		].join( "" ), 'gi' );
	} )(),

	/**
	 * @private
	 * @property {RegExp} charBeforeProtocolRelMatchRegex
	 *
	 * The regular expression used to retrieve the character before a
	 * protocol-relative URL match.
	 *
	 * This is used in conjunction with the {@link #matcherRegex}, which needs
	 * to grab the character before a protocol-relative '//' due to the lack of
	 * a negative look-behind in JavaScript regular expressions. The character
	 * before the match is stripped from the URL.
	 */
	charBeforeProtocolRelMatchRegex : /^(.)?\/\//,

	/**
	 * @private
	 * @property {Autolinker.MatchValidator} matchValidator
	 *
	 * The MatchValidator object, used to filter out any false positives from
	 * the {@link #matcherRegex}. See {@link Autolinker.MatchValidator} for details.
	 */


	/**
	 * @constructor
	 * @param {Object} [cfg] The configuration options for the AnchorTagBuilder
	 * instance, specified in an Object (map).
	 */
	constructor : function( cfg ) {
		Autolinker.Util.assign( this, cfg );

		this.matchValidator = new Autolinker.MatchValidator();
	},


	/**
	 * Parses the input `text` to search for matches, and calls the `replaceFn`
	 * to allow replacements of the matches. Returns the `text` with matches
	 * replaced.
	 *
	 * @param {String} text The text to search and repace matches in.
	 * @param {Function} replaceFn The iterator function to handle the
	 *   replacements. The function takes a single argument, a {@link Autolinker.match.Match}
	 *   object, and should return the text that should make the replacement.
	 * @param {Object} [contextObj=window] The context object ("scope") to run
	 *   the `replaceFn` in.
	 * @return {String}
	 */
	replace : function( text, replaceFn, contextObj ) {
		var me = this;  // for closure

		return text.replace( this.matcherRegex, function( matchStr, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ) {
			var matchDescObj = me.processCandidateMatch( matchStr, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 );  // "match description" object

			// Return out with no changes for match types that are disabled (url,
			// email, phone, etc.), or for matches that are invalid (false
			// positives from the matcherRegex, which can't use look-behinds
			// since they are unavailable in JS).
			if( !matchDescObj ) {
				return matchStr;

			} else {
				// Generate replacement text for the match from the `replaceFn`
				var replaceStr = replaceFn.call( contextObj, matchDescObj.match );
				return matchDescObj.prefixStr + replaceStr + matchDescObj.suffixStr;
			}
		} );
	},


	/**
	 * Processes a candidate match from the {@link #matcherRegex}.
	 *
	 * Not all matches found by the regex are actual URL/Email/Phone/Twitter/Hashtag
	 * matches, as determined by the {@link #matchValidator}. In this case, the
	 * method returns `null`. Otherwise, a valid Object with `prefixStr`,
	 * `match`, and `suffixStr` is returned.
	 *
	 * @private
	 * @param {String} matchStr The full match that was found by the
	 *   {@link #matcherRegex}.
	 * @param {String} twitterMatch The matched text of a Twitter handle, if the
	 *   match is a Twitter match.
	 * @param {String} twitterHandlePrefixWhitespaceChar The whitespace char
	 *   before the @ sign in a Twitter handle match. This is needed because of
	 *   no lookbehinds in JS regexes, and is need to re-include the character
	 *   for the anchor tag replacement.
	 * @param {String} twitterHandle The actual Twitter user (i.e the word after
	 *   the @ sign in a Twitter match).
	 * @param {String} emailAddressMatch The matched email address for an email
	 *   address match.
	 * @param {String} urlMatch The matched URL string for a URL match.
	 * @param {String} protocolUrlMatch The match URL string for a protocol
	 *   match. Ex: 'http-colon-slashslash yahoo.com'. This is used to match something like
	 *   'http-colon-slashslash localhost', where we won't double check that the domain name
	 *   has at least one '.' in it.
	 * @param {String} wwwProtocolRelativeMatch The '//' for a protocol-relative
	 *   match from a 'www' url, with the character that comes before the '//'.
	 * @param {String} tldProtocolRelativeMatch The '//' for a protocol-relative
	 *   match from a TLD (top level domain) match, with the character that
	 *   comes before the '//'.
	 * @param {String} phoneMatch The matched text of a phone number
	 * @param {String} hashtagMatch The matched text of a Twitter
	 *   Hashtag, if the match is a Hashtag match.
	 * @param {String} hashtagPrefixWhitespaceChar The whitespace char
	 *   before the # sign in a Hashtag match. This is needed because of no
	 *   lookbehinds in JS regexes, and is need to re-include the character for
	 *   the anchor tag replacement.
	 * @param {String} hashtag The actual Hashtag (i.e the word
	 *   after the # sign in a Hashtag match).
	 *
	 * @return {Object} A "match description object". This will be `null` if the
	 *   match was invalid, or if a match type is disabled. Otherwise, this will
	 *   be an Object (map) with the following properties:
	 * @return {String} return.prefixStr The char(s) that should be prepended to
	 *   the replacement string. These are char(s) that were needed to be
	 *   included from the regex match that were ignored by processing code, and
	 *   should be re-inserted into the replacement stream.
	 * @return {String} return.suffixStr The char(s) that should be appended to
	 *   the replacement string. These are char(s) that were needed to be
	 *   included from the regex match that were ignored by processing code, and
	 *   should be re-inserted into the replacement stream.
	 * @return {Autolinker.match.Match} return.match The Match object that
	 *   represents the match that was found.
	 */
	processCandidateMatch : function(
		matchStr, twitterMatch, twitterHandlePrefixWhitespaceChar, twitterHandle,
		emailAddressMatch, urlMatch, protocolUrlMatch, wwwProtocolRelativeMatch,
		tldProtocolRelativeMatch, phoneMatch, hashtagMatch,
		hashtagPrefixWhitespaceChar, hashtag
	) {
		// Note: The `matchStr` variable wil be fixed up to remove characters that are no longer needed (which will
		// be added to `prefixStr` and `suffixStr`).

		var protocolRelativeMatch = wwwProtocolRelativeMatch || tldProtocolRelativeMatch,
		    match,  // Will be an Autolinker.match.Match object

		    prefixStr = "",  // A string to use to prefix the anchor tag that is created. This is needed for the Twitter and Hashtag matches.
		    suffixStr = "";  // A string to suffix the anchor tag that is created. This is used if there is a trailing parenthesis that should not be auto-linked.

		// Return out with `null` for match types that are disabled (url, email,
		// twitter, hashtag), or for matches that are invalid (false positives
		// from the matcherRegex, which can't use look-behinds since they are
		// unavailable in JS).
		if(
			( urlMatch && !this.urls ) ||
			( emailAddressMatch && !this.email ) ||
			( phoneMatch && !this.phone ) ||
			( twitterMatch && !this.twitter ) ||
			( hashtagMatch && !this.hashtag ) ||
			!this.matchValidator.isValidMatch( urlMatch, protocolUrlMatch, protocolRelativeMatch )
		) {
			return null;
		}

		// Handle a closing parenthesis at the end of the match, and exclude it
		// if there is not a matching open parenthesis
		// in the match itself.
		if( this.matchHasUnbalancedClosingParen( matchStr ) ) {
			matchStr = matchStr.substr( 0, matchStr.length - 1 );  // remove the trailing ")"
			suffixStr = ")";  // this will be added after the generated <a> tag
		}

		if( emailAddressMatch ) {
			match = new Autolinker.match.Email( { matchedText: matchStr, email: emailAddressMatch } );

		} else if( twitterMatch ) {
			// fix up the `matchStr` if there was a preceding whitespace char,
			// which was needed to determine the match itself (since there are
			// no look-behinds in JS regexes)
			if( twitterHandlePrefixWhitespaceChar ) {
				prefixStr = twitterHandlePrefixWhitespaceChar;
				matchStr = matchStr.slice( 1 );  // remove the prefixed whitespace char from the match
			}
			match = new Autolinker.match.Twitter( { matchedText: matchStr, twitterHandle: twitterHandle } );

		} else if( phoneMatch ) {
			// remove non-numeric values from phone number string
			var cleanNumber = matchStr.replace( /\D/g, '' );
 			match = new Autolinker.match.Phone( { matchedText: matchStr, number: cleanNumber } );

		} else if( hashtagMatch ) {
			// fix up the `matchStr` if there was a preceding whitespace char,
			// which was needed to determine the match itself (since there are
			// no look-behinds in JS regexes)
			if( hashtagPrefixWhitespaceChar ) {
				prefixStr = hashtagPrefixWhitespaceChar;
				matchStr = matchStr.slice( 1 );  // remove the prefixed whitespace char from the match
			}
			match = new Autolinker.match.Hashtag( { matchedText: matchStr, serviceName: this.hashtag, hashtag: hashtag } );

		} else {  // url match
			// If it's a protocol-relative '//' match, remove the character
			// before the '//' (which the matcherRegex needed to match due to
			// the lack of a negative look-behind in JavaScript regular
			// expressions)
			if( protocolRelativeMatch ) {
				var charBeforeMatch = protocolRelativeMatch.match( this.charBeforeProtocolRelMatchRegex )[ 1 ] || "";

				if( charBeforeMatch ) {  // fix up the `matchStr` if there was a preceding char before a protocol-relative match, which was needed to determine the match itself (since there are no look-behinds in JS regexes)
					prefixStr = charBeforeMatch;
					matchStr = matchStr.slice( 1 );  // remove the prefixed char from the match
				}
			}

			match = new Autolinker.match.Url( {
				matchedText : matchStr,
				url : matchStr,
				protocolUrlMatch : !!protocolUrlMatch,
				protocolRelativeMatch : !!protocolRelativeMatch,
				stripPrefix : this.stripPrefix
			} );
		}

		return {
			prefixStr : prefixStr,
			suffixStr : suffixStr,
			match     : match
		};
	},


	/**
	 * Determines if a match found has an unmatched closing parenthesis. If so,
	 * this parenthesis will be removed from the match itself, and appended
	 * after the generated anchor tag in {@link #processCandidateMatch}.
	 *
	 * A match may have an extra closing parenthesis at the end of the match
	 * because the regular expression must include parenthesis for URLs such as
	 * "wikipedia.com/something_(disambiguation)", which should be auto-linked.
	 *
	 * However, an extra parenthesis *will* be included when the URL itself is
	 * wrapped in parenthesis, such as in the case of "(wikipedia.com/something_(disambiguation))".
	 * In this case, the last closing parenthesis should *not* be part of the
	 * URL itself, and this method will return `true`.
	 *
	 * @private
	 * @param {String} matchStr The full match string from the {@link #matcherRegex}.
	 * @return {Boolean} `true` if there is an unbalanced closing parenthesis at
	 *   the end of the `matchStr`, `false` otherwise.
	 */
	matchHasUnbalancedClosingParen : function( matchStr ) {
		var lastChar = matchStr.charAt( matchStr.length - 1 );

		if( lastChar === ')' ) {
			var openParensMatch = matchStr.match( /\(/g ),
			    closeParensMatch = matchStr.match( /\)/g ),
			    numOpenParens = ( openParensMatch && openParensMatch.length ) || 0,
			    numCloseParens = ( closeParensMatch && closeParensMatch.length ) || 0;

			if( numOpenParens < numCloseParens ) {
				return true;
			}
		}

		return false;
	}

} );
/*global Autolinker */
/*jshint scripturl:true */
/**
 * @private
 * @class Autolinker.MatchValidator
 * @extends Object
 *
 * Used by Autolinker to filter out false positives from the
 * {@link Autolinker.matchParser.MatchParser#matcherRegex}.
 *
 * Due to the limitations of regular expressions (including the missing feature
 * of look-behinds in JS regular expressions), we cannot always determine the
 * validity of a given match. This class applies a bit of additional logic to
 * filter out any false positives that have been matched by the
 * {@link Autolinker.matchParser.MatchParser#matcherRegex}.
 */
Autolinker.MatchValidator = Autolinker.Util.extend( Object, {

	/**
	 * @private
	 * @property {RegExp} invalidProtocolRelMatchRegex
	 *
	 * The regular expression used to check a potential protocol-relative URL
	 * match, coming from the {@link Autolinker.matchParser.MatchParser#matcherRegex}.
	 * A protocol-relative URL is, for example, "//yahoo.com"
	 *
	 * This regular expression checks to see if there is a word character before
	 * the '//' match in order to determine if we should actually autolink a
	 * protocol-relative URL. This is needed because there is no negative
	 * look-behind in JavaScript regular expressions.
	 *
	 * For instance, we want to autolink something like "Go to: //google.com",
	 * but we don't want to autolink something like "abc//google.com"
	 */
	invalidProtocolRelMatchRegex : /^[\w]\/\//,

	/**
	 * Regex to test for a full protocol, with the two trailing slashes. Ex: 'http-colon-slashslash '
	 *
	 * @private
	 * @property {RegExp} hasFullProtocolRegex
	 */
	hasFullProtocolRegex : /^[A-Za-z][-.+A-Za-z0-9]+:\/\//,

	/**
	 * Regex to find the URI scheme, such as 'mailto:'.
	 *
	 * This is used to filter out 'javascript:' and 'vbscript:' schemes.
	 *
	 * @private
	 * @property {RegExp} uriSchemeRegex
	 */
	uriSchemeRegex : /^[A-Za-z][-.+A-Za-z0-9]+:/,

	/**
	 * Regex to determine if at least one word char exists after the protocol (i.e. after the ':')
	 *
	 * @private
	 * @property {RegExp} hasWordCharAfterProtocolRegex
	 */
	hasWordCharAfterProtocolRegex : /:[^\s]*?[A-Za-z]/,


	/**
	 * Determines if a given match found by the {@link Autolinker.matchParser.MatchParser}
	 * is valid. Will return `false` for:
	 *
	 * 1) URL matches which do not have at least have one period ('.') in the
	 *    domain name (effectively skipping over matches like "abc:def").
	 *    However, URL matches with a protocol will be allowed (ex: 'http-colon-slashslash localhost')
	 * 2) URL matches which do not have at least one word character in the
	 *    domain name (effectively skipping over matches like "git:1.0").
	 * 3) A protocol-relative url match (a URL beginning with '//') whose
	 *    previous character is a word character (effectively skipping over
	 *    strings like "abc//google.com")
	 *
	 * Otherwise, returns `true`.
	 *
	 * @param {String} urlMatch The matched URL, if there was one. Will be an
	 *   empty string if the match is not a URL match.
	 * @param {String} protocolUrlMatch The match URL string for a protocol
	 *   match. Ex: 'http-colon-slashslash yahoo.com'. This is used to match something like
	 *   'http-colon-slashslash localhost', where we won't double check that the domain name
	 *   has at least one '.' in it.
	 * @param {String} protocolRelativeMatch The protocol-relative string for a
	 *   URL match (i.e. '//'), possibly with a preceding character (ex, a
	 *   space, such as: ' //', or a letter, such as: 'a//'). The match is
	 *   invalid if there is a word character preceding the '//'.
	 * @return {Boolean} `true` if the match given is valid and should be
	 *   processed, or `false` if the match is invalid and/or should just not be
	 *   processed.
	 */
	isValidMatch : function( urlMatch, protocolUrlMatch, protocolRelativeMatch ) {
		if(
			( protocolUrlMatch && !this.isValidUriScheme( protocolUrlMatch ) ) ||
			this.urlMatchDoesNotHaveProtocolOrDot( urlMatch, protocolUrlMatch ) ||       // At least one period ('.') must exist in the URL match for us to consider it an actual URL, *unless* it was a full protocol match (like 'http://localhost')
			this.urlMatchDoesNotHaveAtLeastOneWordChar( urlMatch, protocolUrlMatch ) ||  // At least one letter character must exist in the domain name after a protocol match. Ex: skip over something like "git:1.0"
			this.isInvalidProtocolRelativeMatch( protocolRelativeMatch )                 // A protocol-relative match which has a word character in front of it (so we can skip something like "abc//google.com")
		) {
			return false;
		}

		return true;
	},


	/**
	 * Determines if the URI scheme is a valid scheme to be autolinked. Returns
	 * `false` if the scheme is 'javascript:' or 'vbscript:'
	 *
	 * @private
	 * @param {String} uriSchemeMatch The match URL string for a full URI scheme
	 *   match. Ex: 'http-colon-slashslash yahoo.com' or 'mailto:a@a.com'.
	 * @return {Boolean} `true` if the scheme is a valid one, `false` otherwise.
	 */
	isValidUriScheme : function( uriSchemeMatch ) {
		var uriScheme = uriSchemeMatch.match( this.uriSchemeRegex )[ 0 ].toLowerCase();

		return ( uriScheme !== 'javascript:' && uriScheme !== 'vbscript:' );
	},


	/**
	 * Determines if a URL match does not have either:
	 *
	 * a) a full protocol (i.e. 'http-colon-slashslash '), or
	 * b) at least one dot ('.') in the domain name (for a non-full-protocol
	 *    match).
	 *
	 * Either situation is considered an invalid URL (ex: 'git:d' does not have
	 * either the '://' part, or at least one dot in the domain name. If the
	 * match was 'git:abc.com', we would consider this valid.)
	 *
	 * @private
	 * @param {String} urlMatch The matched URL, if there was one. Will be an
	 *   empty string if the match is not a URL match.
	 * @param {String} protocolUrlMatch The match URL string for a protocol
	 *   match. Ex: 'http-colon-slashslash yahoo.com'. This is used to match something like
	 *   'http-colon-slashslash localhost', where we won't double check that the domain name
	 *   has at least one '.' in it.
	 * @return {Boolean} `true` if the URL match does not have a full protocol,
	 *   or at least one dot ('.') in a non-full-protocol match.
	 */
	urlMatchDoesNotHaveProtocolOrDot : function( urlMatch, protocolUrlMatch ) {
		return ( !!urlMatch && ( !protocolUrlMatch || !this.hasFullProtocolRegex.test( protocolUrlMatch ) ) && urlMatch.indexOf( '.' ) === -1 );
	},


	/**
	 * Determines if a URL match does not have at least one word character after
	 * the protocol (i.e. in the domain name).
	 *
	 * At least one letter character must exist in the domain name after a
	 * protocol match. Ex: skip over something like "git:1.0"
	 *
	 * @private
	 * @param {String} urlMatch The matched URL, if there was one. Will be an
	 *   empty string if the match is not a URL match.
	 * @param {String} protocolUrlMatch The match URL string for a protocol
	 *   match. Ex: 'http-colon-slashslash yahoo.com'. This is used to know whether or not we
	 *   have a protocol in the URL string, in order to check for a word
	 *   character after the protocol separator (':').
	 * @return {Boolean} `true` if the URL match does not have at least one word
	 *   character in it after the protocol, `false` otherwise.
	 */
	urlMatchDoesNotHaveAtLeastOneWordChar : function( urlMatch, protocolUrlMatch ) {
		if( urlMatch && protocolUrlMatch ) {
			return !this.hasWordCharAfterProtocolRegex.test( urlMatch );
		} else {
			return false;
		}
	},


	/**
	 * Determines if a protocol-relative match is an invalid one. This method
	 * returns `true` if there is a `protocolRelativeMatch`, and that match
	 * contains a word character before the '//' (i.e. it must contain
	 * whitespace or nothing before the '//' in order to be considered valid).
	 *
	 * @private
	 * @param {String} protocolRelativeMatch The protocol-relative string for a
	 *   URL match (i.e. '//'), possibly with a preceding character (ex, a
	 *   space, such as: ' //', or a letter, such as: 'a//'). The match is
	 *   invalid if there is a word character preceding the '//'.
	 * @return {Boolean} `true` if it is an invalid protocol-relative match,
	 *   `false` otherwise.
	 */
	isInvalidProtocolRelativeMatch : function( protocolRelativeMatch ) {
		return ( !!protocolRelativeMatch && this.invalidProtocolRelMatchRegex.test( protocolRelativeMatch ) );
	}

} );
/*global Autolinker */
/**
 * @abstract
 * @class Autolinker.match.Match
 * 
 * Represents a match found in an input string which should be Autolinked. A Match object is what is provided in a 
 * {@link Autolinker#replaceFn replaceFn}, and may be used to query for details about the match.
 * 
 * For example:
 * 
 *     var input = "...";  // string with URLs, Email Addresses, and Twitter Handles
 *     
 *     var linkedText = Autolinker.link( input, {
 *         replaceFn : function( autolinker, match ) {
 *             console.log( "href = ", match.getAnchorHref() );
 *             console.log( "text = ", match.getAnchorText() );
 *         
 *             switch( match.getType() ) {
 *                 case 'url' : 
 *                     console.log( "url: ", match.getUrl() );
 *                     
 *                 case 'email' :
 *                     console.log( "email: ", match.getEmail() );
 *                     
 *                 case 'twitter' :
 *                     console.log( "twitter: ", match.getTwitterHandle() );
 *             }
 *         }
 *     } );
 *     
 * See the {@link Autolinker} class for more details on using the {@link Autolinker#replaceFn replaceFn}.
 */
Autolinker.match.Match = Autolinker.Util.extend( Object, {
	
	/**
	 * @cfg {String} matchedText (required)
	 * 
	 * The original text that was matched.
	 */
	
	
	/**
	 * @constructor
	 * @param {Object} cfg The configuration properties for the Match instance, specified in an Object (map).
	 */
	constructor : function( cfg ) {
		Autolinker.Util.assign( this, cfg );
	},

	
	/**
	 * Returns a string name for the type of match that this class represents.
	 * 
	 * @abstract
	 * @return {String}
	 */
	getType : Autolinker.Util.abstractMethod,
	
	
	/**
	 * Returns the original text that was matched.
	 * 
	 * @return {String}
	 */
	getMatchedText : function() {
		return this.matchedText;
	},
	

	/**
	 * Returns the anchor href that should be generated for the match.
	 * 
	 * @abstract
	 * @return {String}
	 */
	getAnchorHref : Autolinker.Util.abstractMethod,
	
	
	/**
	 * Returns the anchor text that should be generated for the match.
	 * 
	 * @abstract
	 * @return {String}
	 */
	getAnchorText : Autolinker.Util.abstractMethod

} );
/*global Autolinker */
/**
 * @class Autolinker.match.Email
 * @extends Autolinker.match.Match
 * 
 * Represents a Email match found in an input string which should be Autolinked.
 * 
 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
 */
Autolinker.match.Email = Autolinker.Util.extend( Autolinker.match.Match, {
	
	/**
	 * @cfg {String} email (required)
	 * 
	 * The email address that was matched.
	 */
	

	/**
	 * Returns a string name for the type of match that this class represents.
	 * 
	 * @return {String}
	 */
	getType : function() {
		return 'email';
	},
	
	
	/**
	 * Returns the email address that was matched.
	 * 
	 * @return {String}
	 */
	getEmail : function() {
		return this.email;
	},
	

	/**
	 * Returns the anchor href that should be generated for the match.
	 * 
	 * @return {String}
	 */
	getAnchorHref : function() {
		return 'mailto:' + this.email;
	},
	
	
	/**
	 * Returns the anchor text that should be generated for the match.
	 * 
	 * @return {String}
	 */
	getAnchorText : function() {
		return this.email;
	}
	
} );
/*global Autolinker */
/**
 * @class Autolinker.match.Hashtag
 * @extends Autolinker.match.Match
 *
 * Represents a Hashtag match found in an input string which should be
 * Autolinked.
 *
 * See this class's superclass ({@link Autolinker.match.Match}) for more
 * details.
 */
Autolinker.match.Hashtag = Autolinker.Util.extend( Autolinker.match.Match, {

	/**
	 * @cfg {String} serviceName (required)
	 *
	 * The service to point hashtag matches to. See {@link Autolinker#hashtag}
	 * for available values.
	 */

	/**
	 * @cfg {String} hashtag (required)
	 *
	 * The Hashtag that was matched, without the '#'.
	 */


	/**
	 * Returns the type of match that this class represents.
	 *
	 * @return {String}
	 */
	getType : function() {
		return 'hashtag';
	},


	/**
	 * Returns the matched hashtag.
	 *
	 * @return {String}
	 */
	getHashtag : function() {
		return this.hashtag;
	},


	/**
	 * Returns the anchor href that should be generated for the match.
	 *
	 * @return {String}
	 */
	getAnchorHref : function() {
		var serviceName = this.serviceName,
		    hashtag = this.hashtag;

		switch( serviceName ) {
			case 'twitter' :
				return 'https://twitter.com/hashtag/' + hashtag;
			case 'facebook' :
				return 'https://www.facebook.com/hashtag/' + hashtag;

			default :  // Shouldn't happen because Autolinker's constructor should block any invalid values, but just in case.
				throw new Error( 'Unknown service name to point hashtag to: ', serviceName );
		}
	},


	/**
	 * Returns the anchor text that should be generated for the match.
	 *
	 * @return {String}
	 */
	getAnchorText : function() {
		return '#' + this.hashtag;
	}

} );
/*global Autolinker */
/**
 * @class Autolinker.match.Phone
 * @extends Autolinker.match.Match
 *
 * Represents a Phone number match found in an input string which should be
 * Autolinked.
 *
 * See this class's superclass ({@link Autolinker.match.Match}) for more
 * details.
 */
Autolinker.match.Phone = Autolinker.Util.extend( Autolinker.match.Match, {

	/**
	 * @cfg {String} number (required)
	 *
	 * The phone number that was matched.
	 */


	/**
	 * Returns a string name for the type of match that this class represents.
	 *
	 * @return {String}
	 */
	getType : function() {
		return 'phone';
	},


	/**
	 * Returns the phone number that was matched.
	 *
	 * @return {String}
	 */
	getNumber: function() {
		return this.number;
	},


	/**
	 * Returns the anchor href that should be generated for the match.
	 *
	 * @return {String}
	 */
	getAnchorHref : function() {
		return 'tel:' + this.number;
	},


	/**
	 * Returns the anchor text that should be generated for the match.
	 *
	 * @return {String}
	 */
	getAnchorText : function() {
		return this.matchedText;
	}

} );

/*global Autolinker */
/**
 * @class Autolinker.match.Twitter
 * @extends Autolinker.match.Match
 * 
 * Represents a Twitter match found in an input string which should be Autolinked.
 * 
 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
 */
Autolinker.match.Twitter = Autolinker.Util.extend( Autolinker.match.Match, {
	
	/**
	 * @cfg {String} twitterHandle (required)
	 * 
	 * The Twitter handle that was matched.
	 */
	

	/**
	 * Returns the type of match that this class represents.
	 * 
	 * @return {String}
	 */
	getType : function() {
		return 'twitter';
	},
	
	
	/**
	 * Returns a string name for the type of match that this class represents.
	 * 
	 * @return {String}
	 */
	getTwitterHandle : function() {
		return this.twitterHandle;
	},
	

	/**
	 * Returns the anchor href that should be generated for the match.
	 * 
	 * @return {String}
	 */
	getAnchorHref : function() {
		return 'https://twitter.com/' + this.twitterHandle;
	},
	
	
	/**
	 * Returns the anchor text that should be generated for the match.
	 * 
	 * @return {String}
	 */
	getAnchorText : function() {
		return '@' + this.twitterHandle;
	}
	
} );
/*global Autolinker */
/**
 * @class Autolinker.match.Url
 * @extends Autolinker.match.Match
 * 
 * Represents a Url match found in an input string which should be Autolinked.
 * 
 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
 */
Autolinker.match.Url = Autolinker.Util.extend( Autolinker.match.Match, {
	
	/**
	 * @cfg {String} url (required)
	 * 
	 * The url that was matched.
	 */
	
	/**
	 * @cfg {Boolean} protocolUrlMatch (required)
	 * 
	 * `true` if the URL is a match which already has a protocol (i.e. 'http-colon-slashslash '), `false` if the match was from a 'www' or
	 * known TLD match.
	 */
	
	/**
	 * @cfg {Boolean} protocolRelativeMatch (required)
	 * 
	 * `true` if the URL is a protocol-relative match. A protocol-relative match is a URL that starts with '//',
	 * and will be either http-colon-slashslash  or https-colon-slashslash  based on the protocol that the site is loaded under.
	 */
	
	/**
	 * @cfg {Boolean} stripPrefix (required)
	 * @inheritdoc Autolinker#stripPrefix
	 */
	

	/**
	 * @private
	 * @property {RegExp} urlPrefixRegex
	 * 
	 * A regular expression used to remove the 'http-colon-slashslash ' or 'https-colon-slashslash ' and/or the 'www.' from URLs.
	 */
	urlPrefixRegex: /^(https?:\/\/)?(www\.)?/i,
	
	/**
	 * @private
	 * @property {RegExp} protocolRelativeRegex
	 * 
	 * The regular expression used to remove the protocol-relative '//' from the {@link #url} string, for purposes
	 * of {@link #getAnchorText}. A protocol-relative URL is, for example, "//yahoo.com"
	 */
	protocolRelativeRegex : /^\/\//,
	
	/**
	 * @private
	 * @property {Boolean} protocolPrepended
	 * 
	 * Will be set to `true` if the 'http-colon-slashslash ' protocol has been prepended to the {@link #url} (because the
	 * {@link #url} did not have a protocol)
	 */
	protocolPrepended : false,
	

	/**
	 * Returns a string name for the type of match that this class represents.
	 * 
	 * @return {String}
	 */
	getType : function() {
		return 'url';
	},
	
	
	/**
	 * Returns the url that was matched, assuming the protocol to be 'http-colon-slashslash ' if the original
	 * match was missing a protocol.
	 * 
	 * @return {String}
	 */
	getUrl : function() {
		var url = this.url;
		
		// if the url string doesn't begin with a protocol, assume 'http://'
		if( !this.protocolRelativeMatch && !this.protocolUrlMatch && !this.protocolPrepended ) {
			url = this.url = 'http://' + url;
			
			this.protocolPrepended = true;
		}
		
		return url;
	},
	

	/**
	 * Returns the anchor href that should be generated for the match.
	 * 
	 * @return {String}
	 */
	getAnchorHref : function() {
		var url = this.getUrl();
		
		return url.replace( /&amp;/g, '&' );  // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html 
	},
	
	
	/**
	 * Returns the anchor text that should be generated for the match.
	 * 
	 * @return {String}
	 */
	getAnchorText : function() {
		var anchorText = this.getUrl();
		
		if( this.protocolRelativeMatch ) {
			// Strip off any protocol-relative '//' from the anchor text
			anchorText = this.stripProtocolRelativePrefix( anchorText );
		}
		if( this.stripPrefix ) {
			anchorText = this.stripUrlPrefix( anchorText );
		}
		anchorText = this.removeTrailingSlash( anchorText );  // remove trailing slash, if there is one
		
		return anchorText;
	},
	
	
	// ---------------------------------------
	
	// Utility Functionality
	
	/**
	 * Strips the URL prefix (such as "http-colon-slashslash " or "https-colon-slashslash ") from the given text.
	 * 
	 * @private
	 * @param {String} text The text of the anchor that is being generated, for which to strip off the
	 *   url prefix (such as stripping off "http-colon-slashslash ")
	 * @return {String} The `anchorText`, with the prefix stripped.
	 */
	stripUrlPrefix : function( text ) {
		return text.replace( this.urlPrefixRegex, '' );
	},
	
	
	/**
	 * Strips any protocol-relative '//' from the anchor text.
	 * 
	 * @private
	 * @param {String} text The text of the anchor that is being generated, for which to strip off the
	 *   protocol-relative prefix (such as stripping off "//")
	 * @return {String} The `anchorText`, with the protocol-relative prefix stripped.
	 */
	stripProtocolRelativePrefix : function( text ) {
		return text.replace( this.protocolRelativeRegex, '' );
	},
	
	
	/**
	 * Removes any trailing slash from the given `anchorText`, in preparation for the text to be displayed.
	 * 
	 * @private
	 * @param {String} anchorText The text of the anchor that is being generated, for which to remove any trailing
	 *   slash ('/') that may exist.
	 * @return {String} The `anchorText`, with the trailing slash removed.
	 */
	removeTrailingSlash : function( anchorText ) {
		if( anchorText.charAt( anchorText.length - 1 ) === '/' ) {
			anchorText = anchorText.slice( 0, -1 );
		}
		return anchorText;
	}
	
} );
return Autolinker;

}));


/***/ }),

/***/ 2250:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    'use strict';
    /**
     * Representation of <Camera> from KML
     * @alias KmlCamera
     * @constructor
     *
     * @param {Cartesian3} position camera position
     * @param {HeadingPitchRoll} headingPitchRoll camera orientation
     */
    function KmlCamera(position, headingPitchRoll) {
        this.position = position;
        this.headingPitchRoll = headingPitchRoll;
    }

    return KmlCamera;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2251:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    'use strict';
    /**
     * @alias KmlLookAt
     * @constructor
     *
     * @param {Cartesian3} position camera position
     * @param {HeadingPitchRange} headingPitchRange camera orientation
     */
    function KmlLookAt(position, headingPitchRange) {
        this.position = position;
        this.headingPitchRange = headingPitchRange;
    }

    return KmlLookAt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2252:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0),
        __webpack_require__(12)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined,
        Event) {
    'use strict';
    /**
     * @alias KmlTour
     * @constructor
     *
     * @param {String} name name parsed from KML
     * @param {String} id id parsed from KML
     * @param {Array} playlist array with KMLTourFlyTos, KMLTourWaits and KMLTourSoundCues
     */
    function KmlTour(name, id) {
        /**
         * Id of kml gx:Tour entry
         * @type String
         */
        this.id = id;
        /**
         * Tour name
         * @type String
         */
        this.name = name;
        /**
         * Index of current entry from playlist
         * @type Number
         */
        this.playlistIndex = 0;
        /**
         * Array of playlist entries
         * @type Array
         */
        this.playlist = [];
        /**
         * Event will be called when tour starts to play,
         * before any playlist entry starts to play.
         * @type Event
         */
        this.tourStart = new Event();
        /**
         * Event will be called when all playlist entries are
         * played, or tour playback being canceled.
         *
         * If tour playback was terminated, event callback will
         * be called with terminated=true parameter.
         * @type Event
         */
        this.tourEnd = new Event();
        /**
         * Event will be called when entry from playlist starts to play.
         *
         * Event callback will be called with curent entry as first parameter.
         * @type Event
         */
        this.entryStart = new Event();
        /**
         * Event will be called when entry from playlist ends to play.
         *
         * Event callback will be called with following parameters:
         * 1. entry - entry
         * 2. terminated - true if playback was terminated by calling {@link KmlTour#stop}
         * @type Event
         */
        this.entryEnd = new Event();

        this._activeEntries = [];
    }

    /**
     * Add entry to this tour playlist.
     *
     * @param {KmlTourFlyTo|KmlTourWait} entry an entry to add to the playlist.
     */
    KmlTour.prototype.addPlaylistEntry = function(entry) {
        this.playlist.push(entry);
    };

    /**
     * Play this tour.
     *
     * @param {Viewer} viewer viewer widget.
     * @param {Object} [cameraOptions] these options will be merged with {@link Camera#flyTo}
     * options for FlyTo playlist entries.
     */
    KmlTour.prototype.play = function(viewer, cameraOptions) {
        this.tourStart.raiseEvent();

        var tour = this;
        playEntry.call(this, viewer, cameraOptions, function(terminated) {
            tour.playlistIndex = 0;
            // Stop nonblocking entries
            if (!terminated) {
                cancelAllEntries(tour._activeEntries);
            }
            tour.tourEnd.raiseEvent(terminated);
        });
    };

    /**
     * Stop curently playing tour.
     */
    KmlTour.prototype.stop = function() {
        cancelAllEntries(this._activeEntries);
    };

    /**
     * Stop all activeEntries.
     * @param {Array} activeEntries
     */
    function cancelAllEntries(activeEntries) {
        for(var entry = activeEntries.pop(); entry !== undefined; entry = activeEntries.pop()) {
            entry.stop();
        }
    }

    /**
     * Play playlist entry.
     * This function is called recursevly with playNext
     * and iterates over all entries from playlist.
     *
     * @param {ViewerWidget} viewer Cesium viewer.
     * @param {Object} cameraOptions see {@link Camera#flyTo}.
     * @param {Function} allDone a function will be called when all entries from playlist
     * being played or user call {@link KmlTour#stop}.
     */
    function playEntry(viewer, cameraOptions, allDone) {
        var entry = this.playlist[this.playlistIndex];
        if (entry) {
            var _playNext = playNext.bind(this, viewer, cameraOptions, allDone);
            this._activeEntries.push(entry);
            this.entryStart.raiseEvent(entry);
            if (entry.blocking) {
                entry.play(_playNext, viewer.scene.camera, cameraOptions);
            }
            else {
                var tour = this;
                entry.play(function() {
                    tour.entryEnd.raiseEvent(entry);
                    var indx = tour._activeEntries.indexOf(entry);
                    if (indx >= 0) {
                        tour._activeEntries.splice(indx, 1);
                    }
                });
                _playNext(viewer, cameraOptions, allDone);
            }
        }
        else if(defined(allDone)) {
            allDone(false);
        }
    }

    /**
     * Increment playlistIndex and call playEntry
     * if terminated isn't true.
     *
     * @param {ViewerWidget} viewer passed for recursion.
     * @param {Object} cameraOptions passed for recursion.
     * @param {Function} allDone passed for recursion.
     * @param {Boolean} terminated true if active entry was terminated,
     * and the whole tour should be terminated.
     */
    function playNext(viewer, cameraOptions, allDone, terminated) {
        var entry = this.playlist[this.playlistIndex];
        this.entryEnd.raiseEvent(entry, terminated);

        if (terminated) {
            allDone(terminated);
        }
        else {
            var indx = this._activeEntries.indexOf(entry);
            if (indx >= 0) {
                this._activeEntries.splice(indx, 1);
            }
            this.playlistIndex++;
            playEntry.call(this, viewer, cameraOptions, allDone);
        }
    }

    return KmlTour;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2253:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(27),
        __webpack_require__(47),
        __webpack_require__(0),
        __webpack_require__(176)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        BoundingSphere,
        combine,
        defined,
        EasingFunction) {
    'use strict';
    /**
     * @alias KmlTourFlyTo
     * @constructor
     *
     * @param {Number} duration entry duration
     * @param {String} flyToMode KML fly to mode: bounce, smooth, etc
     * @param {KmlCamera|KmlLookAt} view KmlCamera or KmlLookAt
     */
    function KmlTourFlyTo(duration, flyToMode, view) {
        this.type = 'KmlTourFlyTo';
        this.blocking = true;
        this.activeCamera = null;
        this.activeCallback = null;

        this.duration = duration;
        this.view = view;
        this.flyToMode = flyToMode;
    }

    /**
     * Play this playlist entry
     *
     * @param {KmlTourFlyTo~DoneCallback} done function which will be called when playback ends
     * @param {Camera} camera Cesium camera
     * @param {Object} [cameraOptions] which will be merged with camera flyTo options. See {@link Camera#flyTo}
     */
    KmlTourFlyTo.prototype.play = function(done, camera, cameraOptions) {
        this.activeCamera = camera;
        if (defined(done) && done !== null) {
            var self = this;
            this.activeCallback = function(terminated) {
                delete self.activeCallback;
                delete self.activeCamera;
                done(defined(terminated) ? false : terminated);
            };
        }

        var options = this.getCameraOptions(cameraOptions);
        if (this.view.headingPitchRoll) {
            camera.flyTo(options);
        }
        else if (this.view.headingPitchRange) {
            var target = new BoundingSphere(this.view.position);
            camera.flyToBoundingSphere(target, options);
        }
    };

    /**
     * Stop execution of curent entry. Cancel camera flyTo
     */
    KmlTourFlyTo.prototype.stop = function() {
        if (defined(this.activeCamera)) {
            this.activeCamera.cancelFlight();
        }
        if (defined(this.activeCallback)) {
            this.activeCallback(true);
        }
    };

    /**
     * Returns options for {@link Camera#flyTo} or {@link Camera#flyToBoundingSphere}
     * depends on this.view type.
     *
     * @param {Object} cameraOptions options to merge with generated. See {@link Camera#flyTo}
     * @returns {Object} {@link Camera#flyTo} or {@link Camera#flyToBoundingSphere} options
     */
    KmlTourFlyTo.prototype.getCameraOptions = function(cameraOptions) {
        var options = {
            duration: this.duration
        };

        if (defined(this.activeCallback)) {
            options.complete = this.activeCallback;
        }

        if (this.flyToMode === 'smooth' ) {
            options.easingFunction = EasingFunction.LINEAR_NONE;
        }

        if (this.view.headingPitchRoll) {
            options.destination = this.view.position;
            options.orientation = this.view.headingPitchRoll;
        }
        else if (this.view.headingPitchRange) {
            options.offset = this.view.headingPitchRange;
        }

        if (defined(cameraOptions)) {
            options = combine(options, cameraOptions);
        }
        return options;
    };

    /**
     * A function that will be executed when the flight completes.
     * @callback KmlTourFlyTo~DoneCallback
     *
     * @param {Boolean} terminated true if {@link KmlTourFlyTo#stop} was
     * called before entry done playback.
     */

    return KmlTourFlyTo;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2254:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined) {
    'use strict';
    /**
     * @alias KmlTourWait
     * @constructor
     *
     * @param {Number} duration entry duration
     */
    function KmlTourWait(duration) {
        this.type = 'KmlTourWait';
        this.blocking = true;
        this.duration = duration;

        this.timeout = null;
    }

    /**
     * Play this playlist entry
     *
     * @param {KmlTourWait~DoneCallback} done function which will be called when playback ends
     */
    KmlTourWait.prototype.play = function(done) {
        var self = this;
        this.activeCallback = done;
        this.timeout = setTimeout(function() {
            delete self.activeCallback;
            done(false);
        }, this.duration * 1000);
    };

    /**
     * Stop execution of curent entry, cancel curent timeout
     */
    KmlTourWait.prototype.stop = function() {
        clearTimeout(this.timeout);
        if (defined(this.activeCallback)) {
            this.activeCallback(true);
        }
    };

    /**
     * A function which will be called when playback ends.
     *
     * @callback KmlTourWait~DoneCallback
     * @param {Boolean} terminated true if {@link KmlTourWait#stop} was
     * called before entry done playback.
     */

    return KmlTourWait;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2255:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(19),
        __webpack_require__(12),
        __webpack_require__(237),
        __webpack_require__(118)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        defined,
        defineProperties,
        DeveloperError,
        Ellipsoid,
        Event,
        ReferenceFrame,
        Property) {
    'use strict';

    /**
     * This is a temporary class for scaling position properties to the WGS84 surface.
     * It will go away or be refactored to support data with arbitrary height references.
     * @private
     */
    function ScaledPositionProperty(value) {
        this._definitionChanged = new Event();
        this._value = undefined;
        this._removeSubscription = undefined;
        this.setValue(value);
    }

    defineProperties(ScaledPositionProperty.prototype, {
        isConstant : {
            get : function() {
                return Property.isConstant(this._value);
            }
        },
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        referenceFrame : {
            get : function() {
                return defined(this._value) ? this._value.referenceFrame : ReferenceFrame.FIXED;
            }
        }
    });

    ScaledPositionProperty.prototype.getValue = function(time, result) {
        return this.getValueInReferenceFrame(time, ReferenceFrame.FIXED, result);
    };

    ScaledPositionProperty.prototype.setValue = function(value) {
        if (this._value !== value) {
            this._value = value;

            if (defined(this._removeSubscription)) {
                this._removeSubscription();
                this._removeSubscription = undefined;
            }

            if (defined(value)) {
                this._removeSubscription = value.definitionChanged.addEventListener(this._raiseDefinitionChanged, this);
            }
            this._definitionChanged.raiseEvent(this);
        }
    };

    ScaledPositionProperty.prototype.getValueInReferenceFrame = function(time, referenceFrame, result) {
        

        if (!defined(this._value)) {
            return undefined;
        }

        result = this._value.getValueInReferenceFrame(time, referenceFrame, result);
        return defined(result) ? Ellipsoid.WGS84.scaleToGeodeticSurface(result, result) : undefined;
    };

    ScaledPositionProperty.prototype.equals = function(other) {
        return this === other || (other instanceof ScaledPositionProperty && this._value === other._value);
    };

    ScaledPositionProperty.prototype._raiseDefinitionChanged = function() {
        this._definitionChanged.raiseEvent(this);
    };

    return ScaledPositionProperty;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 811:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(46),
        __webpack_require__(15),
        __webpack_require__(5),
        __webpack_require__(17),
        __webpack_require__(175),
        __webpack_require__(323),
        __webpack_require__(21),
        __webpack_require__(2235),
        __webpack_require__(72),
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(325),
        __webpack_require__(19),
        __webpack_require__(12),
        __webpack_require__(808),
        __webpack_require__(794),
        __webpack_require__(2236),
        __webpack_require__(94),
        __webpack_require__(238),
        __webpack_require__(24),
        __webpack_require__(2237),
        __webpack_require__(809),
        __webpack_require__(4),
        __webpack_require__(320),
        __webpack_require__(61),
        __webpack_require__(13),
        __webpack_require__(237),
        __webpack_require__(25),
        __webpack_require__(32),
        __webpack_require__(2238),
        __webpack_require__(54),
        __webpack_require__(93),
        __webpack_require__(2239),
        __webpack_require__(174),
        __webpack_require__(199),
        __webpack_require__(461),
        __webpack_require__(242),
        __webpack_require__(152),
        __webpack_require__(110),
        __webpack_require__(7),
        __webpack_require__(462),
        __webpack_require__(798),
        __webpack_require__(328),
        __webpack_require__(2240),
        __webpack_require__(2230),
        __webpack_require__(2229),
        __webpack_require__(326),
        __webpack_require__(327),
        __webpack_require__(800),
        __webpack_require__(801),
        __webpack_require__(460),
        __webpack_require__(151),
        __webpack_require__(802),
        __webpack_require__(803),
        __webpack_require__(319),
        __webpack_require__(321),
        __webpack_require__(2241),
        __webpack_require__(799),
        __webpack_require__(790),
        __webpack_require__(804),
        __webpack_require__(805),
        __webpack_require__(791),
        __webpack_require__(466),
        __webpack_require__(463),
        __webpack_require__(2242),
        __webpack_require__(2243),
        __webpack_require__(812),
        __webpack_require__(322),
        __webpack_require__(2244),
        __webpack_require__(2231),
        __webpack_require__(2245),
        __webpack_require__(465),
        __webpack_require__(792),
        __webpack_require__(2232),
        __webpack_require__(2246),
        __webpack_require__(795),
        __webpack_require__(467),
        __webpack_require__(2247),
        __webpack_require__(2233),
        __webpack_require__(810),
        __webpack_require__(464),
        __webpack_require__(2248),
        __webpack_require__(2234),
        __webpack_require__(793)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        BoundingRectangle,
        Cartesian2,
        Cartesian3,
        Cartographic,
        ClockRange,
        ClockStep,
        Color,
        CornerType,
        createGuid,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        DistanceDisplayCondition,
        Ellipsoid,
        Event,
        ExtrapolationType,
        getFilenameFromUri,
        HermitePolynomialApproximation,
        isArray,
        Iso8601,
        JulianDate,
        LagrangePolynomialApproximation,
        LinearApproximation,
        CesiumMath,
        NearFarScalar,
        Quaternion,
        Rectangle,
        ReferenceFrame,
        Resource,
        RuntimeError,
        Spherical,
        TimeInterval,
        TimeIntervalCollection,
        ColorBlendMode,
        HeightReference,
        HorizontalOrigin,
        LabelStyle,
        ShadowMode,
        VerticalOrigin,
        Uri,
        when,
        BillboardGraphics,
        BoxGraphics,
        ColorMaterialProperty,
        CompositeMaterialProperty,
        CompositePositionProperty,
        CompositeProperty,
        ConstantPositionProperty,
        ConstantProperty,
        CorridorGraphics,
        CylinderGraphics,
        DataSource,
        DataSourceClock,
        EllipseGraphics,
        EllipsoidGraphics,
        EntityCluster,
        EntityCollection,
        GridMaterialProperty,
        ImageMaterialProperty,
        LabelGraphics,
        ModelGraphics,
        NodeTransformationProperty,
        PathGraphics,
        PointGraphics,
        PolygonGraphics,
        PolylineArrowMaterialProperty,
        PolylineDashMaterialProperty,
        PolylineGlowMaterialProperty,
        PolylineGraphics,
        PolylineOutlineMaterialProperty,
        PositionPropertyArray,
        PropertyArray,
        PropertyBag,
        RectangleGraphics,
        ReferenceProperty,
        Rotation,
        SampledPositionProperty,
        SampledProperty,
        StripeMaterialProperty,
        StripeOrientation,
        TimeIntervalCollectionPositionProperty,
        TimeIntervalCollectionProperty,
        VelocityOrientationProperty,
        VelocityVectorProperty,
        WallGraphics) {
    'use strict';

    // A marker type to distinguish CZML properties where we need to end up with a unit vector.
    // The data is still loaded into Cartesian3 objects but they are normalized.
    function UnitCartesian3() {}
    UnitCartesian3.packedLength = Cartesian3.packedLength;
    UnitCartesian3.unpack = Cartesian3.unpack;
    UnitCartesian3.pack = Cartesian3.pack;

    // As a side note, for the purposes of CZML, Quaternion always indicates a unit quaternion.

    var currentId;

    function createReferenceProperty(entityCollection, referenceString) {
        if (referenceString[0] === '#') {
            referenceString = currentId + referenceString;
        }
        return ReferenceProperty.fromString(entityCollection, referenceString);
    }

    function createSpecializedProperty(type, entityCollection, packetData) {
        if (defined(packetData.reference)) {
            return createReferenceProperty(entityCollection, packetData.reference);
        }

        if (defined(packetData.velocityReference)) {
            var referenceProperty = createReferenceProperty(entityCollection, packetData.velocityReference);
            switch (type) {
                case Cartesian3:
                case UnitCartesian3:
                    return new VelocityVectorProperty(referenceProperty, type === UnitCartesian3);
                case Quaternion:
                    return new VelocityOrientationProperty(referenceProperty);
            }
        }

        throw new RuntimeError(JSON.stringify(packetData) + ' is not valid CZML.');
    }

    var scratchCartesian = new Cartesian3();
    var scratchSpherical = new Spherical();
    var scratchCartographic = new Cartographic();
    var scratchTimeInterval = new TimeInterval();
    var scratchQuaternion = new Quaternion();

    function unwrapColorInterval(czmlInterval) {
        var rgbaf = czmlInterval.rgbaf;
        if (defined(rgbaf)) {
            return rgbaf;
        }

        var rgba = czmlInterval.rgba;
        if (!defined(rgba)) {
            return undefined;
        }

        var length = rgba.length;
        if (length === Color.packedLength) {
            return [Color.byteToFloat(rgba[0]), Color.byteToFloat(rgba[1]), Color.byteToFloat(rgba[2]), Color.byteToFloat(rgba[3])];
        }

        rgbaf = new Array(length);
        for (var i = 0; i < length; i += 5) {
            rgbaf[i] = rgba[i];
            rgbaf[i + 1] = Color.byteToFloat(rgba[i + 1]);
            rgbaf[i + 2] = Color.byteToFloat(rgba[i + 2]);
            rgbaf[i + 3] = Color.byteToFloat(rgba[i + 3]);
            rgbaf[i + 4] = Color.byteToFloat(rgba[i + 4]);
        }
        return rgbaf;
    }

    function unwrapUriInterval(czmlInterval, sourceUri) {
        var uri = defaultValue(czmlInterval.uri, czmlInterval);
        if (defined(sourceUri)) {
            return sourceUri.getDerivedResource({
                url: uri
            });
        }

        return Resource.createIfNeeded(uri);
    }

    function unwrapRectangleInterval(czmlInterval) {
        var wsen = czmlInterval.wsen;
        if (defined(wsen)) {
            return wsen;
        }

        var wsenDegrees = czmlInterval.wsenDegrees;
        if (!defined(wsenDegrees)) {
            return undefined;
        }

        var length = wsenDegrees.length;
        if (length === Rectangle.packedLength) {
            return [CesiumMath.toRadians(wsenDegrees[0]), CesiumMath.toRadians(wsenDegrees[1]), CesiumMath.toRadians(wsenDegrees[2]), CesiumMath.toRadians(wsenDegrees[3])];
        }

        wsen = new Array(length);
        for (var i = 0; i < length; i += 5) {
            wsen[i] = wsenDegrees[i];
            wsen[i + 1] = CesiumMath.toRadians(wsenDegrees[i + 1]);
            wsen[i + 2] = CesiumMath.toRadians(wsenDegrees[i + 2]);
            wsen[i + 3] = CesiumMath.toRadians(wsenDegrees[i + 3]);
            wsen[i + 4] = CesiumMath.toRadians(wsenDegrees[i + 4]);
        }
        return wsen;
    }

    function convertUnitSphericalToCartesian(unitSpherical) {
        var length = unitSpherical.length;
        scratchSpherical.magnitude = 1.0;
        if (length === 2) {
            scratchSpherical.clock = unitSpherical[0];
            scratchSpherical.cone = unitSpherical[1];
            Cartesian3.fromSpherical(scratchSpherical, scratchCartesian);
            return [scratchCartesian.x, scratchCartesian.y, scratchCartesian.z];
        }

        var result = new Array(length / 3 * 4);
        for (var i = 0, j = 0; i < length; i += 3, j += 4) {
            result[j] = unitSpherical[i];

            scratchSpherical.clock = unitSpherical[i + 1];
            scratchSpherical.cone = unitSpherical[i + 2];
            Cartesian3.fromSpherical(scratchSpherical, scratchCartesian);

            result[j + 1] = scratchCartesian.x;
            result[j + 2] = scratchCartesian.y;
            result[j + 3] = scratchCartesian.z;
        }
        return result;
    }

    function convertSphericalToCartesian(spherical) {
        var length = spherical.length;
        if (length === 3) {
            scratchSpherical.clock = spherical[0];
            scratchSpherical.cone = spherical[1];
            scratchSpherical.magnitude = spherical[2];
            Cartesian3.fromSpherical(scratchSpherical, scratchCartesian);
            return [scratchCartesian.x, scratchCartesian.y, scratchCartesian.z];
        }

        var result = new Array(length);
        for (var i = 0; i < length; i += 4) {
            result[i] = spherical[i];

            scratchSpherical.clock = spherical[i + 1];
            scratchSpherical.cone = spherical[i + 2];
            scratchSpherical.magnitude = spherical[i + 3];
            Cartesian3.fromSpherical(scratchSpherical, scratchCartesian);

            result[i + 1] = scratchCartesian.x;
            result[i + 2] = scratchCartesian.y;
            result[i + 3] = scratchCartesian.z;
        }
        return result;
    }

    function convertCartographicRadiansToCartesian(cartographicRadians) {
        var length = cartographicRadians.length;
        if (length === 3) {
            scratchCartographic.longitude = cartographicRadians[0];
            scratchCartographic.latitude = cartographicRadians[1];
            scratchCartographic.height = cartographicRadians[2];
            Ellipsoid.WGS84.cartographicToCartesian(scratchCartographic, scratchCartesian);
            return [scratchCartesian.x, scratchCartesian.y, scratchCartesian.z];
        }

        var result = new Array(length);
        for (var i = 0; i < length; i += 4) {
            result[i] = cartographicRadians[i];

            scratchCartographic.longitude = cartographicRadians[i + 1];
            scratchCartographic.latitude = cartographicRadians[i + 2];
            scratchCartographic.height = cartographicRadians[i + 3];
            Ellipsoid.WGS84.cartographicToCartesian(scratchCartographic, scratchCartesian);

            result[i + 1] = scratchCartesian.x;
            result[i + 2] = scratchCartesian.y;
            result[i + 3] = scratchCartesian.z;
        }
        return result;
    }

    function convertCartographicDegreesToCartesian(cartographicDegrees) {
        var length = cartographicDegrees.length;
        if (length === 3) {
            scratchCartographic.longitude = CesiumMath.toRadians(cartographicDegrees[0]);
            scratchCartographic.latitude = CesiumMath.toRadians(cartographicDegrees[1]);
            scratchCartographic.height = cartographicDegrees[2];
            Ellipsoid.WGS84.cartographicToCartesian(scratchCartographic, scratchCartesian);
            return [scratchCartesian.x, scratchCartesian.y, scratchCartesian.z];
        }

        var result = new Array(length);
        for (var i = 0; i < length; i += 4) {
            result[i] = cartographicDegrees[i];

            scratchCartographic.longitude = CesiumMath.toRadians(cartographicDegrees[i + 1]);
            scratchCartographic.latitude = CesiumMath.toRadians(cartographicDegrees[i + 2]);
            scratchCartographic.height = cartographicDegrees[i + 3];
            Ellipsoid.WGS84.cartographicToCartesian(scratchCartographic, scratchCartesian);

            result[i + 1] = scratchCartesian.x;
            result[i + 2] = scratchCartesian.y;
            result[i + 3] = scratchCartesian.z;
        }
        return result;
    }

    function unwrapCartesianInterval(czmlInterval) {
        var cartesian = czmlInterval.cartesian;
        if (defined(cartesian)) {
            return cartesian;
        }

        var cartesianVelocity = czmlInterval.cartesianVelocity;
        if (defined(cartesianVelocity)) {
            return cartesianVelocity;
        }

        var unitCartesian = czmlInterval.unitCartesian;
        if (defined(unitCartesian)) {
            return unitCartesian;
        }

        var unitSpherical = czmlInterval.unitSpherical;
        if (defined(unitSpherical)) {
            return convertUnitSphericalToCartesian(unitSpherical);
        }

        var spherical = czmlInterval.spherical;
        if (defined(spherical)) {
            return convertSphericalToCartesian(spherical);
        }

        var cartographicRadians = czmlInterval.cartographicRadians;
        if (defined(cartographicRadians)) {
            return convertCartographicRadiansToCartesian(cartographicRadians);
        }

        var cartographicDegrees = czmlInterval.cartographicDegrees;
        if (defined(cartographicDegrees)) {
            return convertCartographicDegreesToCartesian(cartographicDegrees);
        }

        throw new RuntimeError(JSON.stringify(czmlInterval) + ' is not a valid CZML interval.');
    }

    function normalizePackedCartesianArray(array, startingIndex) {
        Cartesian3.unpack(array, startingIndex, scratchCartesian);
        Cartesian3.normalize(scratchCartesian, scratchCartesian);
        Cartesian3.pack(scratchCartesian, array, startingIndex);
    }

    function unwrapUnitCartesianInterval(czmlInterval) {
        var cartesian = unwrapCartesianInterval(czmlInterval);
        if (cartesian.length === 3) {
            normalizePackedCartesianArray(cartesian, 0);
            return cartesian;
        }

        for (var i = 1; i < cartesian.length; i += 4) {
            normalizePackedCartesianArray(cartesian, i);
        }

        return cartesian;
    }

    function normalizePackedQuaternionArray(array, startingIndex) {
        Quaternion.unpack(array, startingIndex, scratchQuaternion);
        Quaternion.normalize(scratchQuaternion, scratchQuaternion);
        Quaternion.pack(scratchQuaternion, array, startingIndex);
    }

    function unwrapQuaternionInterval(czmlInterval) {
        var unitQuaternion = czmlInterval.unitQuaternion;
        if (defined(unitQuaternion)) {
            if (unitQuaternion.length === 4) {
                normalizePackedQuaternionArray(unitQuaternion, 0);
                return unitQuaternion;
            }

            for (var i = 1; i < unitQuaternion.length; i += 5) {
                normalizePackedQuaternionArray(unitQuaternion, i);
            }
        }
        return unitQuaternion;
    }

    function getPropertyType(czmlInterval) {
        // The associations in this function need to be kept in sync with the
        // associations in unwrapInterval.

        // Intentionally omitted due to conficts in CZML property names:
        // * Image (conflicts with Uri)
        // * Rotation (conflicts with Number)
        //
        // cartesianVelocity is also omitted due to incomplete support for
        // derivative information in CZML properties.
        // (Currently cartesianVelocity is hacked directly into the position processing code)
        if (typeof czmlInterval === 'boolean') {
            return Boolean;
        } else if (typeof czmlInterval === 'number') {
            return Number;
        } else if (typeof czmlInterval === 'string') {
            return String;
        } else if (czmlInterval.hasOwnProperty('array')) {
            return Array;
        } else if (czmlInterval.hasOwnProperty('boolean')) {
            return Boolean;
        } else if (czmlInterval.hasOwnProperty('boundingRectangle')) {
            return BoundingRectangle;
        } else if (czmlInterval.hasOwnProperty('cartesian2')) {
            return Cartesian2;
        } else if (czmlInterval.hasOwnProperty('cartesian') ||
                   czmlInterval.hasOwnProperty('spherical') ||
                   czmlInterval.hasOwnProperty('cartographicRadians') ||
                   czmlInterval.hasOwnProperty('cartographicDegrees')) {
            return Cartesian3;
        } else if (czmlInterval.hasOwnProperty('unitCartesian') ||
                   czmlInterval.hasOwnProperty('unitSpherical')) {
            return UnitCartesian3;
        } else if (czmlInterval.hasOwnProperty('rgba') ||
                   czmlInterval.hasOwnProperty('rgbaf')) {
            return Color;
        } else if (czmlInterval.hasOwnProperty('colorBlendMode')) {
            return ColorBlendMode;
        } else if (czmlInterval.hasOwnProperty('cornerType')) {
            return CornerType;
        } else if (czmlInterval.hasOwnProperty('heightReference')) {
            return HeightReference;
        } else if (czmlInterval.hasOwnProperty('horizontalOrigin')) {
            return HorizontalOrigin;
        } else if (czmlInterval.hasOwnProperty('date')) {
            return JulianDate;
        } else if (czmlInterval.hasOwnProperty('labelStyle')) {
            return LabelStyle;
        } else if (czmlInterval.hasOwnProperty('number')) {
            return Number;
        } else if (czmlInterval.hasOwnProperty('nearFarScalar')) {
            return NearFarScalar;
        } else if (czmlInterval.hasOwnProperty('distanceDisplayCondition')) {
            return DistanceDisplayCondition;
        } else if (czmlInterval.hasOwnProperty('object') ||
                   czmlInterval.hasOwnProperty('value')) {
            return Object;
        } else if (czmlInterval.hasOwnProperty('unitQuaternion')) {
            return Quaternion;
        } else if (czmlInterval.hasOwnProperty('shadowMode')) {
            return ShadowMode;
        } else if (czmlInterval.hasOwnProperty('string')) {
            return String;
        } else if (czmlInterval.hasOwnProperty('stripeOrientation')) {
            return StripeOrientation;
        } else if (czmlInterval.hasOwnProperty('wsen') ||
                   czmlInterval.hasOwnProperty('wsenDegrees')) {
            return Rectangle;
        } else if (czmlInterval.hasOwnProperty('uri')) {
            return Uri;
        } else if (czmlInterval.hasOwnProperty('verticalOrigin')) {
            return VerticalOrigin;
        }
        // fallback case
        return Object;
    }

    function unwrapInterval(type, czmlInterval, sourceUri) {
        // The associations in this function need to be kept in sync with the
        // associations in getPropertyType
        switch (type) {
            case Array:
                return czmlInterval.array;
            case Boolean:
                return defaultValue(czmlInterval['boolean'], czmlInterval);
            case BoundingRectangle:
                return czmlInterval.boundingRectangle;
            case Cartesian2:
                return czmlInterval.cartesian2;
            case Cartesian3:
                return unwrapCartesianInterval(czmlInterval);
            case UnitCartesian3:
                return unwrapUnitCartesianInterval(czmlInterval);
            case Color:
                return unwrapColorInterval(czmlInterval);
            case ColorBlendMode:
                return ColorBlendMode[defaultValue(czmlInterval.colorBlendMode, czmlInterval)];
            case CornerType:
                return CornerType[defaultValue(czmlInterval.cornerType, czmlInterval)];
            case HeightReference:
                return HeightReference[defaultValue(czmlInterval.heightReference, czmlInterval)];
            case HorizontalOrigin:
                return HorizontalOrigin[defaultValue(czmlInterval.horizontalOrigin, czmlInterval)];
            case Image:
                return unwrapUriInterval(czmlInterval, sourceUri);
            case JulianDate:
                return JulianDate.fromIso8601(defaultValue(czmlInterval.date, czmlInterval));
            case LabelStyle:
                return LabelStyle[defaultValue(czmlInterval.labelStyle, czmlInterval)];
            case Number:
                return defaultValue(czmlInterval.number, czmlInterval);
            case NearFarScalar:
                return czmlInterval.nearFarScalar;
            case DistanceDisplayCondition:
                return czmlInterval.distanceDisplayCondition;
            case Object:
                return defaultValue(defaultValue(czmlInterval.object, czmlInterval.value), czmlInterval);
            case Quaternion:
                return unwrapQuaternionInterval(czmlInterval);
            case Rectangle:
                return unwrapRectangleInterval(czmlInterval);
            case Rotation:
                return defaultValue(czmlInterval.number, czmlInterval);
            case ShadowMode:
                return ShadowMode[defaultValue(defaultValue(czmlInterval.shadowMode, czmlInterval.shadows), czmlInterval)];
            case String:
                return defaultValue(czmlInterval.string, czmlInterval);
            case StripeOrientation:
                return StripeOrientation[defaultValue(czmlInterval.stripeOrientation, czmlInterval)];
            case Uri:
                return unwrapUriInterval(czmlInterval, sourceUri);
            case VerticalOrigin:
                return VerticalOrigin[defaultValue(czmlInterval.verticalOrigin, czmlInterval)];
            default:
                throw new RuntimeError(type);
        }
    }

    var interpolators = {
        HERMITE : HermitePolynomialApproximation,
        LAGRANGE : LagrangePolynomialApproximation,
        LINEAR : LinearApproximation
    };

    function updateInterpolationSettings(packetData, property) {
        var interpolationAlgorithm = packetData.interpolationAlgorithm;
        if (defined(interpolationAlgorithm) || defined(packetData.interpolationDegree)) {
            property.setInterpolationOptions({
                interpolationAlgorithm : interpolators[interpolationAlgorithm],
                interpolationDegree : packetData.interpolationDegree
            });
        }

        var forwardExtrapolationType = packetData.forwardExtrapolationType;
        if (defined(forwardExtrapolationType)) {
            property.forwardExtrapolationType = ExtrapolationType[forwardExtrapolationType];
        }

        var forwardExtrapolationDuration = packetData.forwardExtrapolationDuration;
        if (defined(forwardExtrapolationDuration)) {
            property.forwardExtrapolationDuration = forwardExtrapolationDuration;
        }

        var backwardExtrapolationType = packetData.backwardExtrapolationType;
        if (defined(backwardExtrapolationType)) {
            property.backwardExtrapolationType = ExtrapolationType[backwardExtrapolationType];
        }

        var backwardExtrapolationDuration = packetData.backwardExtrapolationDuration;
        if (defined(backwardExtrapolationDuration)) {
            property.backwardExtrapolationDuration = backwardExtrapolationDuration;
        }
    }

    var iso8601Scratch = {
        iso8601 : undefined
    };

    function processProperty(type, object, propertyName, packetData, constrainedInterval, sourceUri, entityCollection) {
        var combinedInterval;
        var packetInterval = packetData.interval;
        if (defined(packetInterval)) {
            iso8601Scratch.iso8601 = packetInterval;
            combinedInterval = TimeInterval.fromIso8601(iso8601Scratch);
            if (defined(constrainedInterval)) {
                combinedInterval = TimeInterval.intersect(combinedInterval, constrainedInterval, scratchTimeInterval);
            }
        } else if (defined(constrainedInterval)) {
            combinedInterval = constrainedInterval;
        }

        var packedLength;
        var isSampled;
        var unwrappedInterval;
        var unwrappedIntervalLength;

        // CZML properties can be defined in many ways.  Most ways represent a structure for
        // encoding a single value (number, string, cartesian, etc.)  Regardless of the value type,
        // if it encodes a single value it will get loaded into a ConstantProperty eventually.
        // Alternatively, there are ways of defining a property that require specialized
        // client-side representation. Currently, these are ReferenceProperty,
        // and client-side velocity computation properties such as VelocityVectorProperty.
        var isValue = !defined(packetData.reference) && !defined(packetData.velocityReference);
        var hasInterval = defined(combinedInterval) && !combinedInterval.equals(Iso8601.MAXIMUM_INTERVAL);

        if (isValue) {
            unwrappedInterval = unwrapInterval(type, packetData, sourceUri);
            packedLength = defaultValue(type.packedLength, 1);
            unwrappedIntervalLength = defaultValue(unwrappedInterval.length, 1);
            isSampled = !defined(packetData.array) && (typeof unwrappedInterval !== 'string') && (unwrappedIntervalLength > packedLength) && (type !== Object);
        }

        //Rotation is a special case because it represents a native type (Number)
        //and therefore does not need to be unpacked when loaded as a constant value.
        var needsUnpacking = typeof type.unpack === 'function' && type !== Rotation;

        //Any time a constant value is assigned, it completely blows away anything else.
        if (!isSampled && !hasInterval) {
            if (isValue) {
                object[propertyName] = new ConstantProperty(needsUnpacking ? type.unpack(unwrappedInterval, 0) : unwrappedInterval);
            } else {
                object[propertyName] = createSpecializedProperty(type, entityCollection, packetData);
            }
            return;
        }

        var property = object[propertyName];

        var epoch;
        var packetEpoch = packetData.epoch;
        if (defined(packetEpoch)) {
            epoch = JulianDate.fromIso8601(packetEpoch);
        }

        //Without an interval, any sampled value is infinite, meaning it completely
        //replaces any non-sampled property that may exist.
        if (isSampled && !hasInterval) {
            if (!(property instanceof SampledProperty)) {
                property = new SampledProperty(type);
                object[propertyName] = property;
            }
            property.addSamplesPackedArray(unwrappedInterval, epoch);
            updateInterpolationSettings(packetData, property);
            return;
        }

        var interval;

        //A constant value with an interval is normally part of a TimeIntervalCollection,
        //However, if the current property is not a time-interval collection, we need
        //to turn it into a Composite, preserving the old data with the new interval.
        if (!isSampled && hasInterval) {
            //Create a new interval for the constant value.
            combinedInterval = combinedInterval.clone();
            if (isValue) {
                combinedInterval.data = needsUnpacking ? type.unpack(unwrappedInterval, 0) : unwrappedInterval;
            } else {
                combinedInterval.data = createSpecializedProperty(type, entityCollection, packetData);
            }

            //If no property exists, simply use a new interval collection
            if (!defined(property)) {
                if (isValue) {
                    property = new TimeIntervalCollectionProperty();
                } else {
                    property = new CompositeProperty();
                }
                object[propertyName] = property;
            }

            if (isValue && property instanceof TimeIntervalCollectionProperty) {
                //If we create a collection, or it already existed, use it.
                property.intervals.addInterval(combinedInterval);
            } else if (property instanceof CompositeProperty) {
                //If the collection was already a CompositeProperty, use it.
                if (isValue) {
                    combinedInterval.data = new ConstantProperty(combinedInterval.data);
                }
                property.intervals.addInterval(combinedInterval);
            } else {
                //Otherwise, create a CompositeProperty but preserve the existing data.

                //Put the old property in an infinite interval.
                interval = Iso8601.MAXIMUM_INTERVAL.clone();
                interval.data = property;

                //Create the composite.
                property = new CompositeProperty();
                object[propertyName] = property;

                //add the old property interval
                property.intervals.addInterval(interval);

                //Change the new data to a ConstantProperty and add it.
                if (isValue) {
                    combinedInterval.data = new ConstantProperty(combinedInterval.data);
                }
                property.intervals.addInterval(combinedInterval);
            }

            return;
        }

        //isSampled && hasInterval
        if (!defined(property)) {
            property = new CompositeProperty();
            object[propertyName] = property;
        }

        //create a CompositeProperty but preserve the existing data.
        if (!(property instanceof CompositeProperty)) {
            //Put the old property in an infinite interval.
            interval = Iso8601.MAXIMUM_INTERVAL.clone();
            interval.data = property;

            //Create the composite.
            property = new CompositeProperty();
            object[propertyName] = property;

            //add the old property interval
            property.intervals.addInterval(interval);
        }

        //Check if the interval already exists in the composite
        var intervals = property.intervals;
        interval = intervals.findInterval(combinedInterval);
        if (!defined(interval) || !(interval.data instanceof SampledProperty)) {
            //If not, create a SampledProperty for it.
            interval = combinedInterval.clone();
            interval.data = new SampledProperty(type);
            intervals.addInterval(interval);
        }
        interval.data.addSamplesPackedArray(unwrappedInterval, epoch);
        updateInterpolationSettings(packetData, interval.data);
    }

    function processPacketData(type, object, propertyName, packetData, interval, sourceUri, entityCollection) {
        if (!defined(packetData)) {
            return;
        }

        if (isArray(packetData)) {
            for (var i = 0, len = packetData.length; i < len; i++) {
                processProperty(type, object, propertyName, packetData[i], interval, sourceUri, entityCollection);
            }
        } else {
            processProperty(type, object, propertyName, packetData, interval, sourceUri, entityCollection);
        }
    }

    function processPositionProperty(object, propertyName, packetData, constrainedInterval, sourceUri, entityCollection) {
        var combinedInterval;
        var packetInterval = packetData.interval;
        if (defined(packetInterval)) {
            iso8601Scratch.iso8601 = packetInterval;
            combinedInterval = TimeInterval.fromIso8601(iso8601Scratch);
            if (defined(constrainedInterval)) {
                combinedInterval = TimeInterval.intersect(combinedInterval, constrainedInterval, scratchTimeInterval);
            }
        } else if (defined(constrainedInterval)) {
            combinedInterval = constrainedInterval;
        }

        var referenceFrame;
        var unwrappedInterval;
        var isSampled = false;
        var unwrappedIntervalLength;
        var numberOfDerivatives = defined(packetData.cartesianVelocity) ? 1 : 0;
        var packedLength = Cartesian3.packedLength * (numberOfDerivatives + 1);
        var isValue = !defined(packetData.reference);
        var hasInterval = defined(combinedInterval) && !combinedInterval.equals(Iso8601.MAXIMUM_INTERVAL);

        if (isValue) {
            if (defined(packetData.referenceFrame)) {
                referenceFrame = ReferenceFrame[packetData.referenceFrame];
            }
            referenceFrame = defaultValue(referenceFrame, ReferenceFrame.FIXED);
            unwrappedInterval = unwrapCartesianInterval(packetData);
            unwrappedIntervalLength = defaultValue(unwrappedInterval.length, 1);
            isSampled = unwrappedIntervalLength > packedLength;
        }

        //Any time a constant value is assigned, it completely blows away anything else.
        if (!isSampled && !hasInterval) {
            if (isValue) {
                object[propertyName] = new ConstantPositionProperty(Cartesian3.unpack(unwrappedInterval), referenceFrame);
            } else {
                object[propertyName] = createReferenceProperty(entityCollection, packetData.reference);
            }
            return;
        }

        var property = object[propertyName];

        var epoch;
        var packetEpoch = packetData.epoch;
        if (defined(packetEpoch)) {
            epoch = JulianDate.fromIso8601(packetEpoch);
        }

        //Without an interval, any sampled value is infinite, meaning it completely
        //replaces any non-sampled property that may exist.
        if (isSampled && !hasInterval) {
            if (!(property instanceof SampledPositionProperty) || (defined(referenceFrame) && property.referenceFrame !== referenceFrame)) {
                property = new SampledPositionProperty(referenceFrame, numberOfDerivatives);
                object[propertyName] = property;
            }
            property.addSamplesPackedArray(unwrappedInterval, epoch);
            updateInterpolationSettings(packetData, property);
            return;
        }

        var interval;

        //A constant value with an interval is normally part of a TimeIntervalCollection,
        //However, if the current property is not a time-interval collection, we need
        //to turn it into a Composite, preserving the old data with the new interval.
        if (!isSampled && hasInterval) {
            //Create a new interval for the constant value.
            combinedInterval = combinedInterval.clone();
            if (isValue) {
                combinedInterval.data = Cartesian3.unpack(unwrappedInterval);
            } else {
                combinedInterval.data = createReferenceProperty(entityCollection, packetData.reference);
            }

            //If no property exists, simply use a new interval collection
            if (!defined(property)) {
                if (isValue) {
                    property = new TimeIntervalCollectionPositionProperty(referenceFrame);
                } else {
                    property = new CompositePositionProperty(referenceFrame);
                }
                object[propertyName] = property;
            }

            if (isValue && property instanceof TimeIntervalCollectionPositionProperty && (defined(referenceFrame) && property.referenceFrame === referenceFrame)) {
                //If we create a collection, or it already existed, use it.
                property.intervals.addInterval(combinedInterval);
            } else if (property instanceof CompositePositionProperty) {
                //If the collection was already a CompositePositionProperty, use it.
                if (isValue) {
                    combinedInterval.data = new ConstantPositionProperty(combinedInterval.data, referenceFrame);
                }
                property.intervals.addInterval(combinedInterval);
            } else {
                //Otherwise, create a CompositePositionProperty but preserve the existing data.

                //Put the old property in an infinite interval.
                interval = Iso8601.MAXIMUM_INTERVAL.clone();
                interval.data = property;

                //Create the composite.
                property = new CompositePositionProperty(property.referenceFrame);
                object[propertyName] = property;

                //add the old property interval
                property.intervals.addInterval(interval);

                //Change the new data to a ConstantPositionProperty and add it.
                if (isValue) {
                    combinedInterval.data = new ConstantPositionProperty(combinedInterval.data, referenceFrame);
                }
                property.intervals.addInterval(combinedInterval);
            }

            return;
        }

        //isSampled && hasInterval
        if (!defined(property)) {
            property = new CompositePositionProperty(referenceFrame);
            object[propertyName] = property;
        } else if (!(property instanceof CompositePositionProperty)) {
            //create a CompositeProperty but preserve the existing data.
            //Put the old property in an infinite interval.
            interval = Iso8601.MAXIMUM_INTERVAL.clone();
            interval.data = property;

            //Create the composite.
            property = new CompositePositionProperty(property.referenceFrame);
            object[propertyName] = property;

            //add the old property interval
            property.intervals.addInterval(interval);
        }

        //Check if the interval already exists in the composite
        var intervals = property.intervals;
        interval = intervals.findInterval(combinedInterval);
        if (!defined(interval) || !(interval.data instanceof SampledPositionProperty) || (defined(referenceFrame) && interval.data.referenceFrame !== referenceFrame)) {
            //If not, create a SampledPositionProperty for it.
            interval = combinedInterval.clone();
            interval.data = new SampledPositionProperty(referenceFrame, numberOfDerivatives);
            intervals.addInterval(interval);
        }
        interval.data.addSamplesPackedArray(unwrappedInterval, epoch);
        updateInterpolationSettings(packetData, interval.data);
    }

    function processPositionPacketData(object, propertyName, packetData, interval, sourceUri, entityCollection) {
        if (!defined(packetData)) {
            return;
        }

        if (isArray(packetData)) {
            for (var i = 0, len = packetData.length; i < len; i++) {
                processPositionProperty(object, propertyName, packetData[i], interval, sourceUri, entityCollection);
            }
        } else {
            processPositionProperty(object, propertyName, packetData, interval, sourceUri, entityCollection);
        }
    }

    function processMaterialProperty(object, propertyName, packetData, constrainedInterval, sourceUri, entityCollection) {
        var combinedInterval;
        var packetInterval = packetData.interval;
        if (defined(packetInterval)) {
            iso8601Scratch.iso8601 = packetInterval;
            combinedInterval = TimeInterval.fromIso8601(iso8601Scratch);
            if (defined(constrainedInterval)) {
                combinedInterval = TimeInterval.intersect(combinedInterval, constrainedInterval, scratchTimeInterval);
            }
        } else if (defined(constrainedInterval)) {
            combinedInterval = constrainedInterval;
        }

        var property = object[propertyName];
        var existingMaterial;
        var existingInterval;

        if (defined(combinedInterval)) {
            if (!(property instanceof CompositeMaterialProperty)) {
                property = new CompositeMaterialProperty();
                object[propertyName] = property;
            }
            //See if we already have data at that interval.
            var thisIntervals = property.intervals;
            existingInterval = thisIntervals.findInterval({
                start : combinedInterval.start,
                stop : combinedInterval.stop
            });
            if (defined(existingInterval)) {
                //We have an interval, but we need to make sure the
                //new data is the same type of material as the old data.
                existingMaterial = existingInterval.data;
            } else {
                //If not, create it.
                existingInterval = combinedInterval.clone();
                thisIntervals.addInterval(existingInterval);
            }
        } else {
            existingMaterial = property;
        }

        var materialData;
        if (defined(packetData.solidColor)) {
            if (!(existingMaterial instanceof ColorMaterialProperty)) {
                existingMaterial = new ColorMaterialProperty();
            }
            materialData = packetData.solidColor;
            processPacketData(Color, existingMaterial, 'color', materialData.color, undefined, undefined, entityCollection);
        } else if (defined(packetData.grid)) {
            if (!(existingMaterial instanceof GridMaterialProperty)) {
                existingMaterial = new GridMaterialProperty();
            }
            materialData = packetData.grid;
            processPacketData(Color, existingMaterial, 'color', materialData.color, undefined, sourceUri, entityCollection);
            processPacketData(Number, existingMaterial, 'cellAlpha', materialData.cellAlpha, undefined, sourceUri, entityCollection);
            processPacketData(Cartesian2, existingMaterial, 'lineCount', materialData.lineCount, undefined, sourceUri, entityCollection);
            processPacketData(Cartesian2, existingMaterial, 'lineThickness', materialData.lineThickness, undefined, sourceUri, entityCollection);
            processPacketData(Cartesian2, existingMaterial, 'lineOffset', materialData.lineOffset, undefined, sourceUri, entityCollection);
        } else if (defined(packetData.image)) {
            if (!(existingMaterial instanceof ImageMaterialProperty)) {
                existingMaterial = new ImageMaterialProperty();
            }
            materialData = packetData.image;
            processPacketData(Image, existingMaterial, 'image', materialData.image, undefined, sourceUri, entityCollection);
            processPacketData(Cartesian2, existingMaterial, 'repeat', materialData.repeat, undefined, sourceUri, entityCollection);
            processPacketData(Color, existingMaterial, 'color', materialData.color, undefined, sourceUri, entityCollection);
            processPacketData(Boolean, existingMaterial, 'transparent', materialData.transparent, undefined, sourceUri, entityCollection);
        } else if (defined(packetData.stripe)) {
            if (!(existingMaterial instanceof StripeMaterialProperty)) {
                existingMaterial = new StripeMaterialProperty();
            }
            materialData = packetData.stripe;
            processPacketData(StripeOrientation, existingMaterial, 'orientation', materialData.orientation, undefined, sourceUri, entityCollection);
            processPacketData(Color, existingMaterial, 'evenColor', materialData.evenColor, undefined, sourceUri, entityCollection);
            processPacketData(Color, existingMaterial, 'oddColor', materialData.oddColor, undefined, sourceUri, entityCollection);
            processPacketData(Number, existingMaterial, 'offset', materialData.offset, undefined, sourceUri, entityCollection);
            processPacketData(Number, existingMaterial, 'repeat', materialData.repeat, undefined, sourceUri, entityCollection);
        } else if (defined(packetData.polylineOutline)) {
            if (!(existingMaterial instanceof PolylineOutlineMaterialProperty)) {
                existingMaterial = new PolylineOutlineMaterialProperty();
            }
            materialData = packetData.polylineOutline;
            processPacketData(Color, existingMaterial, 'color', materialData.color, undefined, sourceUri, entityCollection);
            processPacketData(Color, existingMaterial, 'outlineColor', materialData.outlineColor, undefined, sourceUri, entityCollection);
            processPacketData(Number, existingMaterial, 'outlineWidth', materialData.outlineWidth, undefined, sourceUri, entityCollection);
        } else if (defined(packetData.polylineGlow)) {
            if (!(existingMaterial instanceof PolylineGlowMaterialProperty)) {
                existingMaterial = new PolylineGlowMaterialProperty();
            }
            materialData = packetData.polylineGlow;
            processPacketData(Color, existingMaterial, 'color', materialData.color, undefined, sourceUri, entityCollection);
            processPacketData(Number, existingMaterial, 'glowPower', materialData.glowPower, undefined, sourceUri, entityCollection);
        } else if (defined(packetData.polylineArrow)) {
            if (!(existingMaterial instanceof PolylineArrowMaterialProperty)) {
                existingMaterial = new PolylineArrowMaterialProperty();
            }
            materialData = packetData.polylineArrow;
            processPacketData(Color, existingMaterial, 'color', materialData.color, undefined, undefined, entityCollection);
        } else if (defined(packetData.polylineDash)) {
            if (!(existingMaterial instanceof PolylineDashMaterialProperty)) {
                existingMaterial = new PolylineDashMaterialProperty();
            }
            materialData = packetData.polylineDash;
            processPacketData(Color, existingMaterial, 'color', materialData.color, undefined, undefined, entityCollection);
            processPacketData(Color, existingMaterial, 'gapColor', materialData.gapColor, undefined, undefined, entityCollection);
            processPacketData(Number, existingMaterial, 'dashLength', materialData.dashLength, undefined, sourceUri, entityCollection);
            processPacketData(Number, existingMaterial, 'dashPattern', materialData.dashPattern, undefined, sourceUri, entityCollection);
        }

        if (defined(existingInterval)) {
            existingInterval.data = existingMaterial;
        } else {
            object[propertyName] = existingMaterial;
        }
    }

    function processMaterialPacketData(object, propertyName, packetData, interval, sourceUri, entityCollection) {
        if (!defined(packetData)) {
            return;
        }

        if (isArray(packetData)) {
            for (var i = 0, len = packetData.length; i < len; i++) {
                processMaterialProperty(object, propertyName, packetData[i], interval, sourceUri, entityCollection);
            }
        } else {
            processMaterialProperty(object, propertyName, packetData, interval, sourceUri, entityCollection);
        }
    }

    function processName(entity, packet, entityCollection, sourceUri) {
        entity.name = defaultValue(packet.name, entity.name);
    }

    function processDescription(entity, packet, entityCollection, sourceUri) {
        var descriptionData = packet.description;
        if (defined(descriptionData)) {
            processPacketData(String, entity, 'description', descriptionData, undefined, sourceUri, entityCollection);
        }
    }

    function processPosition(entity, packet, entityCollection, sourceUri) {
        var positionData = packet.position;
        if (defined(positionData)) {
            processPositionPacketData(entity, 'position', positionData, undefined, sourceUri, entityCollection);
        }
    }

    function processViewFrom(entity, packet, entityCollection, sourceUri) {
        var viewFromData = packet.viewFrom;
        if (defined(viewFromData)) {
            processPacketData(Cartesian3, entity, 'viewFrom', viewFromData, undefined, sourceUri, entityCollection);
        }
    }

    function processOrientation(entity, packet, entityCollection, sourceUri) {
        var orientationData = packet.orientation;
        if (defined(orientationData)) {
            processPacketData(Quaternion, entity, 'orientation', orientationData, undefined, sourceUri, entityCollection);
        }
    }

    function processProperties(entity, packet, entityCollection, sourceUri) {
        var propertiesData = packet.properties;
        if (defined(propertiesData)) {
            if (!defined(entity.properties)) {
                entity.properties = new PropertyBag();
            }
            //We cannot simply call processPacketData(entity, 'properties', propertyData, undefined, sourceUri, entityCollection)
            //because each property of "properties" may vary separately.
            //The properties will be accessible as entity.properties.myprop.getValue(time).

            for (var key in propertiesData) {
                if (propertiesData.hasOwnProperty(key)) {
                    if (!entity.properties.hasProperty(key)) {
                        entity.properties.addProperty(key);
                    }

                    var propertyData = propertiesData[key];
                    if (isArray(propertyData)) {
                        for (var i = 0, len = propertyData.length; i < len; i++) {
                            processProperty(getPropertyType(propertyData[i]), entity.properties, key, propertyData[i], undefined, sourceUri, entityCollection);
                        }
                    } else {
                        processProperty(getPropertyType(propertyData), entity.properties, key, propertyData, undefined, sourceUri, entityCollection);
                    }
                }
            }
        }
    }

    function processArrayPacketData(object, propertyName, packetData, entityCollection) {
        var references = packetData.references;
        if (defined(references)) {
            var properties = references.map(function(reference) {
                return createReferenceProperty(entityCollection, reference);
            });

            var iso8601Interval = packetData.interval;
            if (defined(iso8601Interval)) {
                iso8601Interval = TimeInterval.fromIso8601(iso8601Interval);
                if (!(object[propertyName] instanceof CompositePositionProperty)) {
                    iso8601Interval.data = new PropertyArray(properties);
                    var property = new CompositeProperty();
                    property.intervals.addInterval(iso8601Interval);
                    object[propertyName] = property;
                }
            } else {
                object[propertyName] = new PropertyArray(properties);
            }
        } else {
            processPacketData(Array, object, propertyName, packetData, undefined, undefined, entityCollection);
        }
    }

    function processArray(object, propertyName, packetData, entityCollection) {
        if (!defined(packetData)) {
            return;
        }

        if (isArray(packetData)) {
            for (var i = 0, length = packetData.length; i < length; ++i) {
                processArrayPacketData(object, propertyName, packetData[i], entityCollection);
            }
        } else {
            processArrayPacketData(object, propertyName, packetData, entityCollection);
        }
    }

    function processPositionsPacketData(object, propertyName, positionsData, entityCollection) {
        if (defined(positionsData.references)) {
            var properties = positionsData.references.map(function(reference) {
                return createReferenceProperty(entityCollection, reference);
            });

            var iso8601Interval = positionsData.interval;
            if (defined(iso8601Interval)) {
                iso8601Interval = TimeInterval.fromIso8601(iso8601Interval);
                if (!(object[propertyName] instanceof CompositePositionProperty)) {
                    iso8601Interval.data = new PositionPropertyArray(properties);
                    var property = new CompositePositionProperty();
                    property.intervals.addInterval(iso8601Interval);
                    object[propertyName] = property;
                }
            } else {
                object[propertyName] = new PositionPropertyArray(properties);
            }
        } else {
            if (defined(positionsData.cartesian)) {
                positionsData.array = Cartesian3.unpackArray(positionsData.cartesian);
            } else if (defined(positionsData.cartographicRadians)) {
                positionsData.array = Cartesian3.fromRadiansArrayHeights(positionsData.cartographicRadians);
            } else if (defined(positionsData.cartographicDegrees)) {
                positionsData.array = Cartesian3.fromDegreesArrayHeights(positionsData.cartographicDegrees);
            }

            if (defined(positionsData.array)) {
                processPacketData(Array, object, propertyName, positionsData, undefined, undefined, entityCollection);
            }
        }
    }

    function processPositions(object, propertyName, positionsData, entityCollection) {
        if (!defined(positionsData)) {
            return;
        }

        if (isArray(positionsData)) {
            for (var i = 0, length = positionsData.length; i < length; i++) {
                processPositionsPacketData(object, propertyName, positionsData[i], entityCollection);
            }
        } else {
            processPositionsPacketData(object, propertyName, positionsData, entityCollection);
        }
    }

    function processAvailability(entity, packet, entityCollection, sourceUri) {
        var interval;
        var packetData = packet.availability;
        if (!defined(packetData)) {
            return;
        }

        var intervals;
        if (isArray(packetData)) {
            var length = packetData.length;
            for (var i = 0; i < length; i++) {
                if (!defined(intervals)) {
                    intervals = new TimeIntervalCollection();
                }
                iso8601Scratch.iso8601 = packetData[i];
                interval = TimeInterval.fromIso8601(iso8601Scratch);
                intervals.addInterval(interval);
            }
        } else {
            iso8601Scratch.iso8601 = packetData;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
            intervals = new TimeIntervalCollection();
            intervals.addInterval(interval);
        }
        entity.availability = intervals;
    }

    function processAlignedAxis(billboard, packetData, interval, sourceUri, entityCollection) {
        if (!defined(packetData)) {
            return;
        }

        processPacketData(UnitCartesian3, billboard, 'alignedAxis', packetData, interval, sourceUri, entityCollection);
    }

    function processBillboard(entity, packet, entityCollection, sourceUri) {
        var billboardData = packet.billboard;
        if (!defined(billboardData)) {
            return;
        }

        var interval;
        var intervalString = billboardData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var billboard = entity.billboard;
        if (!defined(billboard)) {
            entity.billboard = billboard = new BillboardGraphics();
        }

        processPacketData(Boolean, billboard, 'show', billboardData.show, interval, sourceUri, entityCollection);
        processPacketData(Image, billboard, 'image', billboardData.image, interval, sourceUri, entityCollection);
        processPacketData(Number, billboard, 'scale', billboardData.scale, interval, sourceUri, entityCollection);
        processPacketData(Cartesian2, billboard, 'pixelOffset', billboardData.pixelOffset, interval, sourceUri, entityCollection);
        processPacketData(Cartesian3, billboard, 'eyeOffset', billboardData.eyeOffset, interval, sourceUri, entityCollection);
        processPacketData(HorizontalOrigin, billboard, 'horizontalOrigin', billboardData.horizontalOrigin, interval, sourceUri, entityCollection);
        processPacketData(VerticalOrigin, billboard, 'verticalOrigin', billboardData.verticalOrigin, interval, sourceUri, entityCollection);
        processPacketData(HeightReference, billboard, 'heightReference', billboardData.heightReference, interval, sourceUri, entityCollection);
        processPacketData(Color, billboard, 'color', billboardData.color, interval, sourceUri, entityCollection);
        processPacketData(Rotation, billboard, 'rotation', billboardData.rotation, interval, sourceUri, entityCollection);
        processAlignedAxis(billboard, billboardData.alignedAxis, interval, sourceUri, entityCollection);
        processPacketData(Boolean, billboard, 'sizeInMeters', billboardData.sizeInMeters, interval, sourceUri, entityCollection);
        processPacketData(Number, billboard, 'width', billboardData.width, interval, sourceUri, entityCollection);
        processPacketData(Number, billboard, 'height', billboardData.height, interval, sourceUri, entityCollection);
        processPacketData(NearFarScalar, billboard, 'scaleByDistance', billboardData.scaleByDistance, interval, sourceUri, entityCollection);
        processPacketData(NearFarScalar, billboard, 'translucencyByDistance', billboardData.translucencyByDistance, interval, sourceUri, entityCollection);
        processPacketData(NearFarScalar, billboard, 'pixelOffsetScaleByDistance', billboardData.pixelOffsetScaleByDistance, interval, sourceUri, entityCollection);
        processPacketData(BoundingRectangle, billboard, 'imageSubRegion', billboardData.imageSubRegion, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, billboard, 'distanceDisplayCondition', billboardData.distanceDisplayCondition, interval, sourceUri, entityCollection);
        processPacketData(Number, billboard, 'disableDepthTestDistance', billboardData.disableDepthTestDistance, interval, sourceUri, entityCollection);
    }

    function processBox(entity, packet, entityCollection, sourceUri) {
        var boxData = packet.box;
        if (!defined(boxData)) {
            return;
        }

        var interval;
        var intervalString = boxData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var box = entity.box;
        if (!defined(box)) {
            entity.box = box = new BoxGraphics();
        }

        processPacketData(Boolean, box, 'show', boxData.show, interval, sourceUri, entityCollection);
        processPacketData(Cartesian3, box, 'dimensions', boxData.dimensions, interval, sourceUri, entityCollection);
        processPacketData(Boolean, box, 'fill', boxData.fill, interval, sourceUri, entityCollection);
        processMaterialPacketData(box, 'material', boxData.material, interval, sourceUri, entityCollection);
        processPacketData(Boolean, box, 'outline', boxData.outline, interval, sourceUri, entityCollection);
        processPacketData(Color, box, 'outlineColor', boxData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, box, 'outlineWidth', boxData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, box, 'shadows', boxData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, box, 'distanceDisplayCondition', boxData.distanceDisplayCondition, interval, sourceUri, entityCollection);
    }

    function processCorridor(entity, packet, entityCollection, sourceUri) {
        var corridorData = packet.corridor;
        if (!defined(corridorData)) {
            return;
        }

        var interval;
        var intervalString = corridorData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var corridor = entity.corridor;
        if (!defined(corridor)) {
            entity.corridor = corridor = new CorridorGraphics();
        }

        processPacketData(Boolean, corridor, 'show', corridorData.show, interval, sourceUri, entityCollection);
        processPositions(corridor, 'positions', corridorData.positions, entityCollection);
        processPacketData(Number, corridor, 'width', corridorData.width, interval, sourceUri, entityCollection);
        processPacketData(Number, corridor, 'height', corridorData.height, interval, sourceUri, entityCollection);
        processPacketData(Number, corridor, 'extrudedHeight', corridorData.extrudedHeight, interval, sourceUri, entityCollection);
        processPacketData(CornerType, corridor, 'cornerType', corridorData.cornerType, interval, sourceUri, entityCollection);
        processPacketData(Number, corridor, 'granularity', corridorData.granularity, interval, sourceUri, entityCollection);
        processPacketData(Boolean, corridor, 'fill', corridorData.fill, interval, sourceUri, entityCollection);
        processMaterialPacketData(corridor, 'material', corridorData.material, interval, sourceUri, entityCollection);
        processPacketData(Boolean, corridor, 'outline', corridorData.outline, interval, sourceUri, entityCollection);
        processPacketData(Color, corridor, 'outlineColor', corridorData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, corridor, 'outlineWidth', corridorData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, corridor, 'shadows', corridorData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, corridor, 'distanceDisplayCondition', corridorData.distanceDisplayCondition, interval, sourceUri, entityCollection);
        processPacketData(Number, corridor, 'zIndex', corridorData.zIndex, interval, sourceUri, entityCollection);
    }

    function processCylinder(entity, packet, entityCollection, sourceUri) {
        var cylinderData = packet.cylinder;
        if (!defined(cylinderData)) {
            return;
        }

        var interval;
        var intervalString = cylinderData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var cylinder = entity.cylinder;
        if (!defined(cylinder)) {
            entity.cylinder = cylinder = new CylinderGraphics();
        }

        processPacketData(Boolean, cylinder, 'show', cylinderData.show, interval, sourceUri, entityCollection);
        processPacketData(Number, cylinder, 'length', cylinderData.length, interval, sourceUri, entityCollection);
        processPacketData(Number, cylinder, 'topRadius', cylinderData.topRadius, interval, sourceUri, entityCollection);
        processPacketData(Number, cylinder, 'bottomRadius', cylinderData.bottomRadius, interval, sourceUri, entityCollection);
        processPacketData(Boolean, cylinder, 'fill', cylinderData.fill, interval, sourceUri, entityCollection);
        processMaterialPacketData(cylinder, 'material', cylinderData.material, interval, sourceUri, entityCollection);
        processPacketData(Boolean, cylinder, 'outline', cylinderData.outline, interval, sourceUri, entityCollection);
        processPacketData(Color, cylinder, 'outlineColor', cylinderData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, cylinder, 'outlineWidth', cylinderData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(Number, cylinder, 'numberOfVerticalLines', cylinderData.numberOfVerticalLines, interval, sourceUri, entityCollection);
        processPacketData(Number, cylinder, 'slices', cylinderData.slices, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, cylinder, 'shadows', cylinderData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, cylinder, 'distanceDisplayCondition', cylinderData.distanceDisplayCondition, interval, sourceUri, entityCollection);
    }

    function processDocument(packet, dataSource) {
        var version = packet.version;
        if (defined(version)) {
            if (typeof version === 'string') {
                var tokens = version.split('.');
                if (tokens.length === 2) {
                    if (tokens[0] !== '1') {
                        throw new RuntimeError('Cesium only supports CZML version 1.');
                    }
                    dataSource._version = version;
                }
            }
        }

        if (!defined(dataSource._version)) {
            throw new RuntimeError('CZML version information invalid.  It is expected to be a property on the document object in the <Major>.<Minor> version format.');
        }

        var documentPacket = dataSource._documentPacket;

        if (defined(packet.name)) {
            documentPacket.name = packet.name;
        }

        var clockPacket = packet.clock;
        if (defined(clockPacket)) {
            var clock = documentPacket.clock;
            if (!defined(clock)) {
                documentPacket.clock = {
                    interval : clockPacket.interval,
                    currentTime : clockPacket.currentTime,
                    range : clockPacket.range,
                    step : clockPacket.step,
                    multiplier : clockPacket.multiplier
                };
            } else {
                clock.interval = defaultValue(clockPacket.interval, clock.interval);
                clock.currentTime = defaultValue(clockPacket.currentTime, clock.currentTime);
                clock.range = defaultValue(clockPacket.range, clock.range);
                clock.step = defaultValue(clockPacket.step, clock.step);
                clock.multiplier = defaultValue(clockPacket.multiplier, clock.multiplier);
            }
        }
    }

    function processEllipse(entity, packet, entityCollection, sourceUri) {
        var ellipseData = packet.ellipse;
        if (!defined(ellipseData)) {
            return;
        }

        var interval;
        var intervalString = ellipseData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var ellipse = entity.ellipse;
        if (!defined(ellipse)) {
            entity.ellipse = ellipse = new EllipseGraphics();
        }

        processPacketData(Boolean, ellipse, 'show', ellipseData.show, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipse, 'semiMajorAxis', ellipseData.semiMajorAxis, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipse, 'semiMinorAxis', ellipseData.semiMinorAxis, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipse, 'height', ellipseData.height, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipse, 'extrudedHeight', ellipseData.extrudedHeight, interval, sourceUri, entityCollection);
        processPacketData(Rotation, ellipse, 'rotation', ellipseData.rotation, interval, sourceUri, entityCollection);
        processPacketData(Rotation, ellipse, 'stRotation', ellipseData.stRotation, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipse, 'granularity', ellipseData.granularity, interval, sourceUri, entityCollection);
        processPacketData(Boolean, ellipse, 'fill', ellipseData.fill, interval, sourceUri, entityCollection);
        processMaterialPacketData(ellipse, 'material', ellipseData.material, interval, sourceUri, entityCollection);
        processPacketData(Boolean, ellipse, 'outline', ellipseData.outline, interval, sourceUri, entityCollection);
        processPacketData(Color, ellipse, 'outlineColor', ellipseData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipse, 'outlineWidth', ellipseData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipse, 'numberOfVerticalLines', ellipseData.numberOfVerticalLines, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, ellipse, 'shadows', ellipseData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, ellipse, 'distanceDisplayCondition', ellipseData.distanceDisplayCondition, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipse, 'zIndex', ellipseData.zIndex, interval, sourceUri, entityCollection);
    }

    function processEllipsoid(entity, packet, entityCollection, sourceUri) {
        var ellipsoidData = packet.ellipsoid;
        if (!defined(ellipsoidData)) {
            return;
        }

        var interval;
        var intervalString = ellipsoidData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var ellipsoid = entity.ellipsoid;
        if (!defined(ellipsoid)) {
            entity.ellipsoid = ellipsoid = new EllipsoidGraphics();
        }

        processPacketData(Boolean, ellipsoid, 'show', ellipsoidData.show, interval, sourceUri, entityCollection);
        processPacketData(Cartesian3, ellipsoid, 'radii', ellipsoidData.radii, interval, sourceUri, entityCollection);
        processPacketData(Boolean, ellipsoid, 'fill', ellipsoidData.fill, interval, sourceUri, entityCollection);
        processMaterialPacketData(ellipsoid, 'material', ellipsoidData.material, interval, sourceUri, entityCollection);
        processPacketData(Boolean, ellipsoid, 'outline', ellipsoidData.outline, interval, sourceUri, entityCollection);
        processPacketData(Color, ellipsoid, 'outlineColor', ellipsoidData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipsoid, 'outlineWidth', ellipsoidData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipsoid, 'stackPartitions', ellipsoidData.stackPartitions, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipsoid, 'slicePartitions', ellipsoidData.slicePartitions, interval, sourceUri, entityCollection);
        processPacketData(Number, ellipsoid, 'subdivisions', ellipsoidData.subdivisions, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, ellipsoid, 'shadows', ellipsoidData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, ellipsoid, 'distanceDisplayCondition', ellipsoidData.distanceDisplayCondition, interval, sourceUri, entityCollection);
    }

    function processLabel(entity, packet, entityCollection, sourceUri) {
        var labelData = packet.label;
        if (!defined(labelData)) {
            return;
        }

        var interval;
        var intervalString = labelData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var label = entity.label;
        if (!defined(label)) {
            entity.label = label = new LabelGraphics();
        }

        processPacketData(Boolean, label, 'show', labelData.show, interval, sourceUri, entityCollection);
        processPacketData(String, label, 'text', labelData.text, interval, sourceUri, entityCollection);
        processPacketData(String, label, 'font', labelData.font, interval, sourceUri, entityCollection);
        processPacketData(LabelStyle, label, 'style', labelData.style, interval, sourceUri, entityCollection);
        processPacketData(Number, label, 'scale', labelData.scale, interval, sourceUri, entityCollection);
        processPacketData(Boolean, label, 'showBackground', labelData.showBackground, interval, sourceUri, entityCollection);
        processPacketData(Color, label, 'backgroundColor', labelData.backgroundColor, interval, sourceUri, entityCollection);
        processPacketData(Cartesian2, label, 'backgroundPadding', labelData.backgroundPadding, interval, sourceUri, entityCollection);
        processPacketData(Cartesian2, label, 'pixelOffset', labelData.pixelOffset, interval, sourceUri, entityCollection);
        processPacketData(Cartesian3, label, 'eyeOffset', labelData.eyeOffset, interval, sourceUri, entityCollection);
        processPacketData(HorizontalOrigin, label, 'horizontalOrigin', labelData.horizontalOrigin, interval, sourceUri, entityCollection);
        processPacketData(VerticalOrigin, label, 'verticalOrigin', labelData.verticalOrigin, interval, sourceUri, entityCollection);
        processPacketData(HeightReference, label, 'heightReference', labelData.heightReference, interval, sourceUri, entityCollection);
        processPacketData(Color, label, 'fillColor', labelData.fillColor, interval, sourceUri, entityCollection);
        processPacketData(Color, label, 'outlineColor', labelData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, label, 'outlineWidth', labelData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(NearFarScalar, label, 'translucencyByDistance', labelData.translucencyByDistance, interval, sourceUri, entityCollection);
        processPacketData(NearFarScalar, label, 'pixelOffsetScaleByDistance', labelData.pixelOffsetScaleByDistance, interval, sourceUri, entityCollection);
        processPacketData(NearFarScalar, label, 'scaleByDistance', labelData.scaleByDistance, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, label, 'distanceDisplayCondition', labelData.distanceDisplayCondition, interval, sourceUri, entityCollection);
        processPacketData(Number, label, 'disableDepthTestDistance', labelData.disableDepthTestDistance, interval, sourceUri, entityCollection);
    }

    function processModel(entity, packet, entityCollection, sourceUri) {
        var modelData = packet.model;
        if (!defined(modelData)) {
            return;
        }

        var interval;
        var intervalString = modelData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var model = entity.model;
        if (!defined(model)) {
            entity.model = model = new ModelGraphics();
        }

        processPacketData(Boolean, model, 'show', modelData.show, interval, sourceUri, entityCollection);
        processPacketData(Uri, model, 'uri', modelData.gltf, interval, sourceUri, entityCollection);
        processPacketData(Number, model, 'scale', modelData.scale, interval, sourceUri, entityCollection);
        processPacketData(Number, model, 'minimumPixelSize', modelData.minimumPixelSize, interval, sourceUri, entityCollection);
        processPacketData(Number, model, 'maximumScale', modelData.maximumScale, interval, sourceUri, entityCollection);
        processPacketData(Boolean, model, 'incrementallyLoadTextures', modelData.incrementallyLoadTextures, interval, sourceUri, entityCollection);
        processPacketData(Boolean, model, 'runAnimations', modelData.runAnimations, interval, sourceUri, entityCollection);
        processPacketData(Boolean, model, 'clampAnimations', modelData.clampAnimations, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, model, 'shadows', modelData.shadows, interval, sourceUri, entityCollection);
        processPacketData(HeightReference, model, 'heightReference', modelData.heightReference, interval, sourceUri, entityCollection);
        processPacketData(Color, model, 'silhouetteColor', modelData.silhouetteColor, interval, sourceUri, entityCollection);
        processPacketData(Number, model, 'silhouetteSize', modelData.silhouetteSize, interval, sourceUri, entityCollection);
        processPacketData(Color, model, 'color', modelData.color, interval, sourceUri, entityCollection);
        processPacketData(ColorBlendMode, model, 'colorBlendMode', modelData.colorBlendMode, interval, sourceUri, entityCollection);
        processPacketData(Number, model, 'colorBlendAmount', modelData.colorBlendAmount, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, model, 'distanceDisplayCondition', modelData.distanceDisplayCondition, interval, sourceUri, entityCollection);

        var nodeTransformationsData = modelData.nodeTransformations;
        if (defined(nodeTransformationsData)) {
            if (isArray(nodeTransformationsData)) {
                for (var i = 0, len = nodeTransformationsData.length; i < len; i++) {
                    processNodeTransformations(model, nodeTransformationsData[i], interval, sourceUri, entityCollection);
                }
            } else {
                processNodeTransformations(model, nodeTransformationsData, interval, sourceUri, entityCollection);
            }
        }
    }

    function processNodeTransformations(model, nodeTransformationsData, constrainedInterval, sourceUri, entityCollection) {
        var combinedInterval;
        var packetInterval = nodeTransformationsData.interval;
        if (defined(packetInterval)) {
            iso8601Scratch.iso8601 = packetInterval;
            combinedInterval = TimeInterval.fromIso8601(iso8601Scratch);
            if (defined(constrainedInterval)) {
                combinedInterval = TimeInterval.intersect(combinedInterval, constrainedInterval, scratchTimeInterval);
            }
        } else if (defined(constrainedInterval)) {
            combinedInterval = constrainedInterval;
        }

        var nodeTransformations = model.nodeTransformations;
        var nodeNames = Object.keys(nodeTransformationsData);
        for (var i = 0, len = nodeNames.length; i < len; ++i) {
            var nodeName = nodeNames[i];

            if (nodeName === 'interval') {
                continue;
            }

            var nodeTransformationData = nodeTransformationsData[nodeName];

            if (!defined(nodeTransformationData)) {
                continue;
            }

            if (!defined(nodeTransformations)) {
                model.nodeTransformations = nodeTransformations = new PropertyBag();
            }

            if (!nodeTransformations.hasProperty(nodeName)) {
                nodeTransformations.addProperty(nodeName);
            }

            var nodeTransformation = nodeTransformations[nodeName];
            if (!defined(nodeTransformation)) {
                nodeTransformations[nodeName] = nodeTransformation = new NodeTransformationProperty();
            }

            processPacketData(Cartesian3, nodeTransformation, 'translation', nodeTransformationData.translation, combinedInterval, sourceUri, entityCollection);
            processPacketData(Quaternion, nodeTransformation, 'rotation', nodeTransformationData.rotation, combinedInterval, sourceUri, entityCollection);
            processPacketData(Cartesian3, nodeTransformation, 'scale', nodeTransformationData.scale, combinedInterval, sourceUri, entityCollection);
        }
    }

    function processPath(entity, packet, entityCollection, sourceUri) {
        var pathData = packet.path;
        if (!defined(pathData)) {
            return;
        }

        var interval;
        var intervalString = pathData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var path = entity.path;
        if (!defined(path)) {
            entity.path = path = new PathGraphics();
        }

        processPacketData(Boolean, path, 'show', pathData.show, interval, sourceUri, entityCollection);
        processPacketData(Number, path, 'width', pathData.width, interval, sourceUri, entityCollection);
        processPacketData(Number, path, 'resolution', pathData.resolution, interval, sourceUri, entityCollection);
        processPacketData(Number, path, 'leadTime', pathData.leadTime, interval, sourceUri, entityCollection);
        processPacketData(Number, path, 'trailTime', pathData.trailTime, interval, sourceUri, entityCollection);
        processMaterialPacketData(path, 'material', pathData.material, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, path, 'distanceDisplayCondition', pathData.distanceDisplayCondition, interval, sourceUri, entityCollection);
    }

    function processPoint(entity, packet, entityCollection, sourceUri) {
        var pointData = packet.point;
        if (!defined(pointData)) {
            return;
        }

        var interval;
        var intervalString = pointData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var point = entity.point;
        if (!defined(point)) {
            entity.point = point = new PointGraphics();
        }

        processPacketData(Boolean, point, 'show', pointData.show, interval, sourceUri, entityCollection);
        processPacketData(Number, point, 'pixelSize', pointData.pixelSize, interval, sourceUri, entityCollection);
        processPacketData(HeightReference, point, 'heightReference', pointData.heightReference, interval, sourceUri, entityCollection);
        processPacketData(Color, point, 'color', pointData.color, interval, sourceUri, entityCollection);
        processPacketData(Color, point, 'outlineColor', pointData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, point, 'outlineWidth', pointData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(NearFarScalar, point, 'scaleByDistance', pointData.scaleByDistance, interval, sourceUri, entityCollection);
        processPacketData(NearFarScalar, point, 'translucencyByDistance', pointData.translucencyByDistance, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, point, 'distanceDisplayCondition', pointData.distanceDisplayCondition, interval, sourceUri, entityCollection);
        processPacketData(Number, point, 'disableDepthTestDistance', pointData.disableDepthTestDistance, interval, sourceUri, entityCollection);
    }

    function processPolygon(entity, packet, entityCollection, sourceUri) {
        var polygonData = packet.polygon;
        if (!defined(polygonData)) {
            return;
        }

        var interval;
        var intervalString = polygonData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var polygon = entity.polygon;
        if (!defined(polygon)) {
            entity.polygon = polygon = new PolygonGraphics();
        }

        processPacketData(Boolean, polygon, 'show', polygonData.show, interval, sourceUri, entityCollection);
        processPositions(polygon, 'hierarchy', polygonData.positions, entityCollection);
        processPacketData(Number, polygon, 'height', polygonData.height, interval, sourceUri, entityCollection);
        processPacketData(Number, polygon, 'extrudedHeight', polygonData.extrudedHeight, interval, sourceUri, entityCollection);
        processPacketData(Rotation, polygon, 'stRotation', polygonData.stRotation, interval, sourceUri, entityCollection);
        processPacketData(Number, polygon, 'granularity', polygonData.granularity, interval, sourceUri, entityCollection);
        processPacketData(Boolean, polygon, 'fill', polygonData.fill, interval, sourceUri, entityCollection);
        processMaterialPacketData(polygon, 'material', polygonData.material, interval, sourceUri, entityCollection);
        processPacketData(Boolean, polygon, 'outline', polygonData.outline, interval, sourceUri, entityCollection);
        processPacketData(Color, polygon, 'outlineColor', polygonData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, polygon, 'outlineWidth', polygonData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(Boolean, polygon, 'perPositionHeight', polygonData.perPositionHeight, interval, sourceUri, entityCollection);
        processPacketData(Boolean, polygon, 'closeTop', polygonData.closeTop, interval, sourceUri, entityCollection);
        processPacketData(Boolean, polygon, 'closeBottom', polygonData.closeBottom, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, polygon, 'shadows', polygonData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, polygon, 'distanceDisplayCondition', polygonData.distanceDisplayCondition, interval, sourceUri, entityCollection);
        processPacketData(Number, polygon, 'zIndex', polygonData.zIndex, interval, sourceUri, entityCollection);
    }

    function processPolyline(entity, packet, entityCollection, sourceUri) {
        var polylineData = packet.polyline;
        if (!defined(polylineData)) {
            return;
        }

        var interval;
        var intervalString = polylineData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var polyline = entity.polyline;
        if (!defined(polyline)) {
            entity.polyline = polyline = new PolylineGraphics();
        }

        processPacketData(Boolean, polyline, 'show', polylineData.show, interval, sourceUri, entityCollection);
        processPositions(polyline, 'positions', polylineData.positions, entityCollection);
        processPacketData(Number, polyline, 'width', polylineData.width, interval, sourceUri, entityCollection);
        processPacketData(Number, polyline, 'granularity', polylineData.granularity, interval, sourceUri, entityCollection);
        processMaterialPacketData(polyline, 'material', polylineData.material, interval, sourceUri, entityCollection);
        processMaterialPacketData(polyline, 'depthFailMaterial', polylineData.depthFailMaterial, interval, sourceUri, entityCollection);
        processPacketData(Boolean, polyline, 'followSurface', polylineData.followSurface, interval, sourceUri, entityCollection);
        processPacketData(Boolean, polyline, 'clampToGround', polylineData.clampToGround, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, polyline, 'shadows', polylineData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, polyline, 'distanceDisplayCondition', polylineData.distanceDisplayCondition, interval, sourceUri, entityCollection);
        processPacketData(Number, polyline, 'zIndex', polylineData.zIndex, interval, sourceUri, entityCollection);
    }

    function processRectangle(entity, packet, entityCollection, sourceUri) {
        var rectangleData = packet.rectangle;
        if (!defined(rectangleData)) {
            return;
        }

        var interval;
        var intervalString = rectangleData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var rectangle = entity.rectangle;
        if (!defined(rectangle)) {
            entity.rectangle = rectangle = new RectangleGraphics();
        }

        processPacketData(Boolean, rectangle, 'show', rectangleData.show, interval, sourceUri, entityCollection);
        processPacketData(Rectangle, rectangle, 'coordinates', rectangleData.coordinates, interval, sourceUri, entityCollection);
        processPacketData(Number, rectangle, 'height', rectangleData.height, interval, sourceUri, entityCollection);
        processPacketData(Number, rectangle, 'extrudedHeight', rectangleData.extrudedHeight, interval, sourceUri, entityCollection);
        processPacketData(Rotation, rectangle, 'rotation', rectangleData.rotation, interval, sourceUri, entityCollection);
        processPacketData(Rotation, rectangle, 'stRotation', rectangleData.stRotation, interval, sourceUri, entityCollection);
        processPacketData(Number, rectangle, 'granularity', rectangleData.granularity, interval, sourceUri, entityCollection);
        processPacketData(Boolean, rectangle, 'fill', rectangleData.fill, interval, sourceUri, entityCollection);
        processMaterialPacketData(rectangle, 'material', rectangleData.material, interval, sourceUri, entityCollection);
        processPacketData(Boolean, rectangle, 'outline', rectangleData.outline, interval, sourceUri, entityCollection);
        processPacketData(Color, rectangle, 'outlineColor', rectangleData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, rectangle, 'outlineWidth', rectangleData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, rectangle, 'shadows', rectangleData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, rectangle, 'distanceDisplayCondition', rectangleData.distanceDisplayCondition, interval, sourceUri, entityCollection);
        processPacketData(Number, rectangle, 'zIndex', rectangleData.zIndex, interval, sourceUri, entityCollection);
    }

    function processWall(entity, packet, entityCollection, sourceUri) {
        var wallData = packet.wall;
        if (!defined(wallData)) {
            return;
        }

        var interval;
        var intervalString = wallData.interval;
        if (defined(intervalString)) {
            iso8601Scratch.iso8601 = intervalString;
            interval = TimeInterval.fromIso8601(iso8601Scratch);
        }

        var wall = entity.wall;
        if (!defined(wall)) {
            entity.wall = wall = new WallGraphics();
        }

        processPacketData(Boolean, wall, 'show', wallData.show, interval, sourceUri, entityCollection);
        processPositions(wall, 'positions', wallData.positions, entityCollection);
        processArray(wall, 'minimumHeights', wallData.minimumHeights, entityCollection);
        processArray(wall, 'maximumHeights', wallData.maximumHeights, entityCollection);
        processPacketData(Number, wall, 'granularity', wallData.granularity, interval, sourceUri, entityCollection);
        processPacketData(Boolean, wall, 'fill', wallData.fill, interval, sourceUri, entityCollection);
        processMaterialPacketData(wall, 'material', wallData.material, interval, sourceUri, entityCollection);
        processPacketData(Boolean, wall, 'outline', wallData.outline, interval, sourceUri, entityCollection);
        processPacketData(Color, wall, 'outlineColor', wallData.outlineColor, interval, sourceUri, entityCollection);
        processPacketData(Number, wall, 'outlineWidth', wallData.outlineWidth, interval, sourceUri, entityCollection);
        processPacketData(ShadowMode, wall, 'shadows', wallData.shadows, interval, sourceUri, entityCollection);
        processPacketData(DistanceDisplayCondition, wall, 'distanceDisplayCondition', wallData.distanceDisplayCondition, interval, sourceUri, entityCollection);
    }

    function processCzmlPacket(packet, entityCollection, updaterFunctions, sourceUri, dataSource) {
        var objectId = packet.id;
        if (!defined(objectId)) {
            objectId = createGuid();
        }

        currentId = objectId;

        if (!defined(dataSource._version) && objectId !== 'document') {
            throw new RuntimeError('The first CZML packet is required to be the document object.');
        }

        if (packet['delete'] === true) {
            entityCollection.removeById(objectId);
        } else if (objectId === 'document') {
            processDocument(packet, dataSource);
        } else {
            var entity = entityCollection.getOrCreateEntity(objectId);

            var parentId = packet.parent;
            if (defined(parentId)) {
                entity.parent = entityCollection.getOrCreateEntity(parentId);
            }

            for (var i = updaterFunctions.length - 1; i > -1; i--) {
                updaterFunctions[i](entity, packet, entityCollection, sourceUri);
            }
        }

        currentId = undefined;
    }

    function updateClock(dataSource) {
        var clock;
        var clockPacket = dataSource._documentPacket.clock;
        if (!defined(clockPacket)) {
            if (!defined(dataSource._clock)) {
                var availability = dataSource._entityCollection.computeAvailability();
                if (!availability.start.equals(Iso8601.MINIMUM_VALUE)) {
                    var startTime = availability.start;
                    var stopTime = availability.stop;
                    var totalSeconds = JulianDate.secondsDifference(stopTime, startTime);
                    var multiplier = Math.round(totalSeconds / 120.0);

                    clock = new DataSourceClock();
                    clock.startTime = JulianDate.clone(startTime);
                    clock.stopTime = JulianDate.clone(stopTime);
                    clock.clockRange = ClockRange.LOOP_STOP;
                    clock.multiplier = multiplier;
                    clock.currentTime = JulianDate.clone(startTime);
                    clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
                    dataSource._clock = clock;
                    return true;
                }
            }
            return false;
        }

        if (defined(dataSource._clock)) {
            clock = dataSource._clock.clone();
        } else {
            clock = new DataSourceClock();
            clock.startTime = Iso8601.MINIMUM_VALUE.clone();
            clock.stopTime = Iso8601.MAXIMUM_VALUE.clone();
            clock.currentTime = Iso8601.MINIMUM_VALUE.clone();
            clock.clockRange = ClockRange.LOOP_STOP;
            clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
            clock.multiplier = 1.0;
        }
        if (defined(clockPacket.interval)) {
            iso8601Scratch.iso8601 = clockPacket.interval;
            var interval = TimeInterval.fromIso8601(iso8601Scratch);
            clock.startTime = interval.start;
            clock.stopTime = interval.stop;
        }
        if (defined(clockPacket.currentTime)) {
            clock.currentTime = JulianDate.fromIso8601(clockPacket.currentTime);
        }
        if (defined(clockPacket.range)) {
            clock.clockRange = defaultValue(ClockRange[clockPacket.range], ClockRange.LOOP_STOP);
        }
        if (defined(clockPacket.step)) {
            clock.clockStep = defaultValue(ClockStep[clockPacket.step], ClockStep.SYSTEM_CLOCK_MULTIPLIER);
        }
        if (defined(clockPacket.multiplier)) {
            clock.multiplier = clockPacket.multiplier;
        }

        if (!clock.equals(dataSource._clock)) {
            dataSource._clock = clock.clone(dataSource._clock);
            return true;
        }

        return false;
    }

    function load(dataSource, czml, options, clear) {
        

        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var promise = czml;
        var sourceUri = options.sourceUri;

        // If the czml is a URL
        if (typeof czml === 'string' || (czml instanceof Resource)) {
            czml = Resource.createIfNeeded(czml);
            promise = czml.fetchJson();
            sourceUri = defaultValue(sourceUri, czml.clone());
        }

        sourceUri = Resource.createIfNeeded(sourceUri);

        DataSource.setLoading(dataSource, true);

        return when(promise, function(czml) {
            return loadCzml(dataSource, czml, sourceUri, clear);
        }).otherwise(function(error) {
            DataSource.setLoading(dataSource, false);
            dataSource._error.raiseEvent(dataSource, error);
            console.log(error);
            return when.reject(error);
        });
    }

    function loadCzml(dataSource, czml, sourceUri, clear) {
        DataSource.setLoading(dataSource, true);
        var entityCollection = dataSource._entityCollection;

        if (clear) {
            dataSource._version = undefined;
            dataSource._documentPacket = new DocumentPacket();
            entityCollection.removeAll();
        }

        CzmlDataSource._processCzml(czml, entityCollection, sourceUri, undefined, dataSource);

        var raiseChangedEvent = updateClock(dataSource);

        var documentPacket = dataSource._documentPacket;
        if (defined(documentPacket.name) && dataSource._name !== documentPacket.name) {
            dataSource._name = documentPacket.name;
            raiseChangedEvent = true;
        } else if (!defined(dataSource._name) && defined(sourceUri)) {
            dataSource._name = getFilenameFromUri(sourceUri.getUrlComponent());
            raiseChangedEvent = true;
        }

        DataSource.setLoading(dataSource, false);
        if (raiseChangedEvent) {
            dataSource._changed.raiseEvent(dataSource);
        }

        return dataSource;
    }

    function DocumentPacket() {
        this.name = undefined;
        this.clock = undefined;
    }

    /**
     * A {@link DataSource} which processes {@link https://github.com/AnalyticalGraphicsInc/cesium/wiki/CZML-Guide|CZML}.
     * @alias CzmlDataSource
     * @constructor
     *
     * @param {String} [name] An optional name for the data source.  This value will be overwritten if a loaded document contains a name.
     *
     * @demo {@link https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=CZML.html|Cesium Sandcastle CZML Demo}
     */
    function CzmlDataSource(name) {
        this._name = name;
        this._changed = new Event();
        this._error = new Event();
        this._isLoading = false;
        this._loading = new Event();
        this._clock = undefined;
        this._documentPacket = new DocumentPacket();
        this._version = undefined;
        this._entityCollection = new EntityCollection(this);
        this._entityCluster = new EntityCluster();
    }

    /**
     * Creates a Promise to a new instance loaded with the provided CZML data.
     *
     * @param {Resource|String|Object} czml A url or CZML object to be processed.
     * @param {Object} [options] An object with the following properties:
     * @param {Resource|String} [options.sourceUri] Overrides the url to use for resolving relative links.
     * @returns {Promise.<CzmlDataSource>} A promise that resolves to the new instance once the data is processed.
     */
    CzmlDataSource.load = function(czml, options) {
        return new CzmlDataSource().load(czml, options);
    };

    defineProperties(CzmlDataSource.prototype, {
        /**
         * Gets a human-readable name for this instance.
         * @memberof CzmlDataSource.prototype
         * @type {String}
         */
        name : {
            get : function() {
                return this._name;
            }
        },
        /**
         * Gets the clock settings defined by the loaded CZML.  If no clock is explicitly
         * defined in the CZML, the combined availability of all objects is returned.  If
         * only static data exists, this value is undefined.
         * @memberof CzmlDataSource.prototype
         * @type {DataSourceClock}
         */
        clock : {
            get : function() {
                return this._clock;
            }
        },
        /**
         * Gets the collection of {@link Entity} instances.
         * @memberof CzmlDataSource.prototype
         * @type {EntityCollection}
         */
        entities : {
            get : function() {
                return this._entityCollection;
            }
        },
        /**
         * Gets a value indicating if the data source is currently loading data.
         * @memberof CzmlDataSource.prototype
         * @type {Boolean}
         */
        isLoading : {
            get : function() {
                return this._isLoading;
            }
        },
        /**
         * Gets an event that will be raised when the underlying data changes.
         * @memberof CzmlDataSource.prototype
         * @type {Event}
         */
        changedEvent : {
            get : function() {
                return this._changed;
            }
        },
        /**
         * Gets an event that will be raised if an error is encountered during processing.
         * @memberof CzmlDataSource.prototype
         * @type {Event}
         */
        errorEvent : {
            get : function() {
                return this._error;
            }
        },
        /**
         * Gets an event that will be raised when the data source either starts or stops loading.
         * @memberof CzmlDataSource.prototype
         * @type {Event}
         */
        loadingEvent : {
            get : function() {
                return this._loading;
            }
        },
        /**
         * Gets whether or not this data source should be displayed.
         * @memberof CzmlDataSource.prototype
         * @type {Boolean}
         */
        show : {
            get : function() {
                return this._entityCollection.show;
            },
            set : function(value) {
                this._entityCollection.show = value;
            }
        },

        /**
         * Gets or sets the clustering options for this data source. This object can be shared between multiple data sources.
         *
         * @memberof CzmlDataSource.prototype
         * @type {EntityCluster}
         */
        clustering : {
            get : function() {
                return this._entityCluster;
            },
            set : function(value) {
                
                this._entityCluster = value;
            }
        }
    });

    /**
     * Gets the array of CZML processing functions.
     * @memberof CzmlDataSource
     * @type Array
     */
    CzmlDataSource.updaters = [
        processBillboard, //
        processBox, //
        processCorridor, //
        processCylinder, //
        processEllipse, //
        processEllipsoid, //
        processLabel, //
        processModel, //
        processName, //
        processDescription, //
        processPath, //
        processPoint, //
        processPolygon, //
        processPolyline, //
        processProperties, //
        processRectangle, //
        processPosition, //
        processViewFrom, //
        processWall, //
        processOrientation, //
        processAvailability];

    /**
     * Processes the provided url or CZML object without clearing any existing data.
     *
     * @param {Resource|String|Object} czml A url or CZML object to be processed.
     * @param {Object} [options] An object with the following properties:
     * @param {String} [options.sourceUri] Overrides the url to use for resolving relative links.
     * @returns {Promise.<CzmlDataSource>} A promise that resolves to this instances once the data is processed.
     */
    CzmlDataSource.prototype.process = function(czml, options) {
        return load(this, czml, options, false);
    };

    /**
     * Loads the provided url or CZML object, replacing any existing data.
     *
     * @param {Resource|String|Object} czml A url or CZML object to be processed.
     * @param {Object} [options] An object with the following properties:
     * @param {String} [options.sourceUri] Overrides the url to use for resolving relative links.
     * @returns {Promise.<CzmlDataSource>} A promise that resolves to this instances once the data is processed.
     */
    CzmlDataSource.prototype.load = function(czml, options) {
        return load(this, czml, options, true);
    };

    /**
     * A helper function used by custom CZML updater functions
     * which creates or updates a {@link Property} from a CZML packet.
     * @function
     *
     * @param {Function} type The constructor function for the property being processed.
     * @param {Object} object The object on which the property will be added or updated.
     * @param {String} propertyName The name of the property on the object.
     * @param {Object} packetData The CZML packet being processed.
     * @param {TimeInterval} interval A constraining interval for which the data is valid.
     * @param {String} sourceUri The originating uri of the data being processed.
     * @param {EntityCollection} entityCollection The collection being processsed.
     */
    CzmlDataSource.processPacketData = processPacketData;

    /**
     * A helper function used by custom CZML updater functions
     * which creates or updates a {@link PositionProperty} from a CZML packet.
     * @function
     *
     * @param {Object} object The object on which the property will be added or updated.
     * @param {String} propertyName The name of the property on the object.
     * @param {Object} packetData The CZML packet being processed.
     * @param {TimeInterval} interval A constraining interval for which the data is valid.
     * @param {String} sourceUri The originating uri of the data being processed.
     * @param {EntityCollection} entityCollection The collection being processsed.
     */
    CzmlDataSource.processPositionPacketData = processPositionPacketData;

    /**
     * A helper function used by custom CZML updater functions
     * which creates or updates a {@link MaterialProperty} from a CZML packet.
     * @function
     *
     * @param {Object} object The object on which the property will be added or updated.
     * @param {String} propertyName The name of the property on the object.
     * @param {Object} packetData The CZML packet being processed.
     * @param {TimeInterval} interval A constraining interval for which the data is valid.
     * @param {String} sourceUri The originating uri of the data being processed.
     * @param {EntityCollection} entityCollection The collection being processsed.
     */
    CzmlDataSource.processMaterialPacketData = processMaterialPacketData;

    CzmlDataSource._processCzml = function(czml, entityCollection, sourceUri, updaterFunctions, dataSource) {
        updaterFunctions = defined(updaterFunctions) ? updaterFunctions : CzmlDataSource.updaters;

        if (isArray(czml)) {
            for (var i = 0, len = czml.length; i < len; i++) {
                processCzmlPacket(czml[i], entityCollection, updaterFunctions, sourceUri, dataSource);
            }
        } else {
            processCzmlPacket(czml, entityCollection, updaterFunctions, sourceUri, dataSource);
        }
    };

    return CzmlDataSource;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 813:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(240),
        __webpack_require__(46),
        __webpack_require__(15),
        __webpack_require__(5),
        __webpack_require__(17),
        __webpack_require__(175),
        __webpack_require__(323),
        __webpack_require__(21),
        __webpack_require__(72),
        __webpack_require__(1),
        __webpack_require__(0),
        __webpack_require__(3),
        __webpack_require__(2),
        __webpack_require__(19),
        __webpack_require__(12),
        __webpack_require__(797),
        __webpack_require__(794),
        __webpack_require__(329),
        __webpack_require__(241),
        __webpack_require__(238),
        __webpack_require__(24),
        __webpack_require__(4),
        __webpack_require__(320),
        __webpack_require__(239),
        __webpack_require__(796),
        __webpack_require__(807),
        __webpack_require__(243),
        __webpack_require__(324),
        __webpack_require__(13),
        __webpack_require__(25),
        __webpack_require__(32),
        __webpack_require__(54),
        __webpack_require__(93),
        __webpack_require__(174),
        __webpack_require__(199),
        __webpack_require__(461),
        __webpack_require__(30),
        __webpack_require__(2249),
        __webpack_require__(110),
        __webpack_require__(7),
        __webpack_require__(806),
        __webpack_require__(462),
        __webpack_require__(2230),
        __webpack_require__(460),
        __webpack_require__(151),
        __webpack_require__(88),
        __webpack_require__(319),
        __webpack_require__(321),
        __webpack_require__(2250),
        __webpack_require__(2251),
        __webpack_require__(2252),
        __webpack_require__(2253),
        __webpack_require__(2254),
        __webpack_require__(790),
        __webpack_require__(791),
        __webpack_require__(463),
        __webpack_require__(322),
        __webpack_require__(2231),
        __webpack_require__(792),
        __webpack_require__(2232),
        __webpack_require__(795),
        __webpack_require__(2255),
        __webpack_require__(464),
        __webpack_require__(793)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(
        AssociativeArray,
        BoundingRectangle,
        Cartesian2,
        Cartesian3,
        Cartographic,
        ClockRange,
        ClockStep,
        Color,
        createGuid,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Ellipsoid,
        Event,
        getExtensionFromUri,
        getFilenameFromUri,
        HeadingPitchRange,
        HeadingPitchRoll,
        Iso8601,
        JulianDate,
        CesiumMath,
        NearFarScalar,
        objectToQuery,
        oneTimeWarning,
        PinBuilder,
        PolygonHierarchy,
        queryToObject,
        Rectangle,
        Resource,
        RuntimeError,
        TimeInterval,
        TimeIntervalCollection,
        HeightReference,
        HorizontalOrigin,
        LabelStyle,
        SceneMode,
        Autolinker,
        Uri,
        when,
        zip,
        BillboardGraphics,
        CompositePositionProperty,
        DataSource,
        DataSourceClock,
        Entity,
        EntityCluster,
        EntityCollection,
        KmlCamera,
        KmlLookAt,
        KmlTour,
        KmlTourFlyTo,
        KmlTourWait,
        LabelGraphics,
        PathGraphics,
        PolygonGraphics,
        PolylineGraphics,
        PositionPropertyArray,
        RectangleGraphics,
        ReferenceProperty,
        SampledPositionProperty,
        ScaledPositionProperty,
        TimeIntervalCollectionProperty,
        WallGraphics) {
    'use strict';

    // IE 8 doesn't have a DOM parser and can't run Cesium anyway, so just bail.
    if (typeof DOMParser === 'undefined') {
        return {};
    }

    //This is by no means an exhaustive list of MIME types.
    //The purpose of this list is to be able to accurately identify content embedded
    //in KMZ files. Eventually, we can make this configurable by the end user so they can add
    //there own content types if they have KMZ files that require it.
    var MimeTypes = {
        avi : 'video/x-msvideo',
        bmp : 'image/bmp',
        bz2 : 'application/x-bzip2',
        chm : 'application/vnd.ms-htmlhelp',
        css : 'text/css',
        csv : 'text/csv',
        doc : 'application/msword',
        dvi : 'application/x-dvi',
        eps : 'application/postscript',
        flv : 'video/x-flv',
        gif : 'image/gif',
        gz : 'application/x-gzip',
        htm : 'text/html',
        html : 'text/html',
        ico : 'image/vnd.microsoft.icon',
        jnlp : 'application/x-java-jnlp-file',
        jpeg : 'image/jpeg',
        jpg : 'image/jpeg',
        m3u : 'audio/x-mpegurl',
        m4v : 'video/mp4',
        mathml : 'application/mathml+xml',
        mid : 'audio/midi',
        midi : 'audio/midi',
        mov : 'video/quicktime',
        mp3 : 'audio/mpeg',
        mp4 : 'video/mp4',
        mp4v : 'video/mp4',
        mpeg : 'video/mpeg',
        mpg : 'video/mpeg',
        odp : 'application/vnd.oasis.opendocument.presentation',
        ods : 'application/vnd.oasis.opendocument.spreadsheet',
        odt : 'application/vnd.oasis.opendocument.text',
        ogg : 'application/ogg',
        pdf : 'application/pdf',
        png : 'image/png',
        pps : 'application/vnd.ms-powerpoint',
        ppt : 'application/vnd.ms-powerpoint',
        ps : 'application/postscript',
        qt : 'video/quicktime',
        rdf : 'application/rdf+xml',
        rss : 'application/rss+xml',
        rtf : 'application/rtf',
        svg : 'image/svg+xml',
        swf : 'application/x-shockwave-flash',
        text : 'text/plain',
        tif : 'image/tiff',
        tiff : 'image/tiff',
        txt : 'text/plain',
        wav : 'audio/x-wav',
        wma : 'audio/x-ms-wma',
        wmv : 'video/x-ms-wmv',
        xml : 'application/xml',
        zip : 'application/zip',

        detectFromFilename : function(filename) {
            var ext = filename.toLowerCase();
            ext = getExtensionFromUri(ext);
            return MimeTypes[ext];
        }
    };

    var parser = new DOMParser();
    var autolinker = new Autolinker({
        stripPrefix : false,
        twitter : false,
        email : false,
        replaceFn : function(linker, match) {
            if (!match.protocolUrlMatch) {
                //Prevent matching of non-explicit urls.
                //i.e. foo.id won't match but http://foo.id will
                return false;
            }
        }
    });

    var BILLBOARD_SIZE = 32;

    var BILLBOARD_NEAR_DISTANCE = 2414016;
    var BILLBOARD_NEAR_RATIO = 1.0;
    var BILLBOARD_FAR_DISTANCE = 1.6093e+7;
    var BILLBOARD_FAR_RATIO = 0.1;

    function isZipFile(blob) {
        var magicBlob = blob.slice(0, Math.min(4, blob.size));
        var deferred = when.defer();
        var reader = new FileReader();
        reader.addEventListener('load', function() {
            deferred.resolve(new DataView(reader.result).getUint32(0, false) === 0x504b0304);
        });
        reader.addEventListener('error', function() {
            deferred.reject(reader.error);
        });
        reader.readAsArrayBuffer(magicBlob);
        return deferred.promise;
    }

    function readBlobAsText(blob) {
        var deferred = when.defer();
        var reader = new FileReader();
        reader.addEventListener('load', function() {
            deferred.resolve(reader.result);
        });
        reader.addEventListener('error', function() {
            deferred.reject(reader.error);
        });
        reader.readAsText(blob);
        return deferred.promise;
    }

    function insertNamespaces(text) {
        var namespaceMap = {
            xsi : 'http://www.w3.org/2001/XMLSchema-instance'
        };
        var firstPart, lastPart, reg, declaration;

        for (var key in namespaceMap) {
            if (namespaceMap.hasOwnProperty(key)) {
                reg = RegExp('[< ]' + key + ':');
                declaration = 'xmlns:' + key + '=';
                if (reg.test(text) && text.indexOf(declaration) === -1) {
                    if (!defined(firstPart)) {
                        firstPart = text.substr(0, text.indexOf('<kml') + 4);
                        lastPart = text.substr(firstPart.length);
                    }
                    firstPart += ' ' + declaration + '"' + namespaceMap[key] + '"';
                }
            }
        }

        if (defined(firstPart)) {
            text = firstPart + lastPart;
        }

        return text;
    }

    function removeDuplicateNamespaces(text) {
        var index = text.indexOf('xmlns:');
        var endDeclaration = text.indexOf('>', index);
        var namespace, startIndex, endIndex;

        while ((index !== -1) && (index < endDeclaration)) {
            namespace = text.slice(index, text.indexOf('\"', index));
            startIndex = index;
            index = text.indexOf(namespace, index + 1);
            if (index !== -1) {
                endIndex = text.indexOf('\"', (text.indexOf('\"', index) + 1));
                text = text.slice(0, index -1) + text.slice(endIndex + 1, text.length);
                index = text.indexOf('xmlns:', startIndex - 1);
            } else {
                index = text.indexOf('xmlns:', startIndex + 1);
            }
        }

        return text;
    }

    function loadXmlFromZip(entry, uriResolver, deferred) {
        entry.getData(new zip.TextWriter(), function(text) {
            text = insertNamespaces(text);
            text = removeDuplicateNamespaces(text);
            uriResolver.kml = parser.parseFromString(text, 'application/xml');
            deferred.resolve();
        });
    }

    function loadDataUriFromZip(entry, uriResolver, deferred) {
        var mimeType = defaultValue(MimeTypes.detectFromFilename(entry.filename), 'application/octet-stream');
        entry.getData(new zip.Data64URIWriter(mimeType), function(dataUri) {
            uriResolver[entry.filename] = dataUri;
            deferred.resolve();
        });
    }

    function embedDataUris(div, elementType, attributeName, uriResolver) {
        var keys = uriResolver.keys;
        var baseUri = new Uri('.');
        var elements = div.querySelectorAll(elementType);
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var value = element.getAttribute(attributeName);
            var uri = new Uri(value).resolve(baseUri).toString();
            var index = keys.indexOf(uri);
            if (index !== -1) {
                var key = keys[index];
                element.setAttribute(attributeName, uriResolver[key]);
                if (elementType === 'a' && element.getAttribute('download') === null) {
                    element.setAttribute('download', key);
                }
            }
        }
    }

    function applyBasePath(div, elementType, attributeName, sourceResource) {
        var elements = div.querySelectorAll(elementType);
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var value = element.getAttribute(attributeName);
            var resource = resolveHref(value, sourceResource);
            element.setAttribute(attributeName, resource.url);
        }
    }

    // an optional context is passed to allow for some malformed kmls (those with multiple geometries with same ids) to still parse
    // correctly, as they do in Google Earth.
    function createEntity(node, entityCollection, context) {
        var id = queryStringAttribute(node, 'id');
        id = defined(id) && id.length !== 0 ? id : createGuid();
        if (defined(context)) {
            id = context + id;
        }

        // If we have a duplicate ID just generate one.
        // This isn't valid KML but Google Earth handles this case.
        var entity = entityCollection.getById(id);
        if (defined(entity)) {
            id = createGuid();
            if (defined(context)) {
                id = context + id;
            }
        }

        entity = entityCollection.add(new Entity({id : id}));
        if (!defined(entity.kml)) {
            entity.addProperty('kml');
            entity.kml = new KmlFeatureData();
        }
        return entity;
    }

    function isExtrudable(altitudeMode, gxAltitudeMode) {
        return altitudeMode === 'absolute' || altitudeMode === 'relativeToGround' || gxAltitudeMode === 'relativeToSeaFloor';
    }

    function readCoordinate(value, ellipsoid) {
        //Google Earth treats empty or missing coordinates as 0.
        if (!defined(value)) {
            return Cartesian3.fromDegrees(0, 0, 0, ellipsoid);
        }

        var digits = value.match(/[^\s,\n]+/g);
        if (!defined(digits)) {
            return Cartesian3.fromDegrees(0, 0, 0, ellipsoid);
        }

        var longitude = parseFloat(digits[0]);
        var latitude = parseFloat(digits[1]);
        var height = parseFloat(digits[2]);

        longitude = isNaN(longitude) ? 0.0 : longitude;
        latitude = isNaN(latitude) ? 0.0 : latitude;
        height = isNaN(height) ? 0.0 : height;

        return Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid);
    }

    function readCoordinates(element, ellipsoid) {
        if (!defined(element)) {
            return undefined;
        }

        var tuples = element.textContent.match(/[^\s\n]+/g);
        if (!defined(tuples)) {
            return undefined;
        }

        var length = tuples.length;
        var result = new Array(length);
        var resultIndex = 0;
        for (var i = 0; i < length; i++) {
            result[resultIndex++] = readCoordinate(tuples[i], ellipsoid);
        }
        return result;
    }

    var kmlNamespaces = [null, undefined, 'http://www.opengis.net/kml/2.2', 'http://earth.google.com/kml/2.2', 'http://earth.google.com/kml/2.1', 'http://earth.google.com/kml/2.0'];
    var gxNamespaces = ['http://www.google.com/kml/ext/2.2'];
    var atomNamespaces = ['http://www.w3.org/2005/Atom'];
    var namespaces = {
        kml : kmlNamespaces,
        gx : gxNamespaces,
        atom : atomNamespaces,
        kmlgx : kmlNamespaces.concat(gxNamespaces)
    };

    function queryNumericAttribute(node, attributeName) {
        if (!defined(node)) {
            return undefined;
        }

        var value = node.getAttribute(attributeName);
        if (value !== null) {
            var result = parseFloat(value);
            return !isNaN(result) ? result : undefined;
        }
        return undefined;
    }

    function queryStringAttribute(node, attributeName) {
        if (!defined(node)) {
            return undefined;
        }
        var value = node.getAttribute(attributeName);
        return value !== null ? value : undefined;
    }

    function queryFirstNode(node, tagName, namespace) {
        if (!defined(node)) {
            return undefined;
        }
        var childNodes = node.childNodes;
        var length = childNodes.length;
        for (var q = 0; q < length; q++) {
            var child = childNodes[q];
            if (child.localName === tagName && namespace.indexOf(child.namespaceURI) !== -1) {
                return child;
            }
        }
        return undefined;
    }

    function queryNodes(node, tagName, namespace) {
        if (!defined(node)) {
            return undefined;
        }
        var result = [];
        var childNodes = node.getElementsByTagNameNS('*', tagName);
        var length = childNodes.length;
        for (var q = 0; q < length; q++) {
            var child = childNodes[q];
            if (child.localName === tagName && namespace.indexOf(child.namespaceURI) !== -1) {
                result.push(child);
            }
        }
        return result;
    }

    function queryChildNodes(node, tagName, namespace) {
        if (!defined(node)) {
            return [];
        }
        var result = [];
        var childNodes = node.childNodes;
        var length = childNodes.length;
        for (var q = 0; q < length; q++) {
            var child = childNodes[q];
            if (child.localName === tagName && namespace.indexOf(child.namespaceURI) !== -1) {
                result.push(child);
            }
        }
        return result;
    }

    function queryNumericValue(node, tagName, namespace) {
        var resultNode = queryFirstNode(node, tagName, namespace);
        if (defined(resultNode)) {
            var result = parseFloat(resultNode.textContent);
            return !isNaN(result) ? result : undefined;
        }
        return undefined;
    }

    function queryStringValue(node, tagName, namespace) {
        var result = queryFirstNode(node, tagName, namespace);
        if (defined(result)) {
            return result.textContent.trim();
        }
        return undefined;
    }

    function queryBooleanValue(node, tagName, namespace) {
        var result = queryFirstNode(node, tagName, namespace);
        if (defined(result)) {
            var value = result.textContent.trim();
            return value === '1' || /^true$/i.test(value);
        }
        return undefined;
    }

    function resolveHref(href, sourceResource, uriResolver) {
        if (!defined(href)) {
            return undefined;
        }

        var resource;
        if (defined(uriResolver)) {
            var blob = uriResolver[href];
            if (defined(blob)) {
                resource = new Resource({
                    url: blob
                });
            } else {
                // Needed for multiple levels of KML files in a KMZ
                var baseUri = new Uri(sourceResource.getUrlComponent());
                var uri = new Uri(href);
                blob = uriResolver[uri.resolve(baseUri)];
                if (defined(blob)) {
                    resource = new Resource({
                        url: blob
                    });
                }
            }
        }

        if (!defined(resource)) {
            resource = sourceResource.getDerivedResource({
                url: href
            });
        }

        return resource;
    }

    var colorOptions = {
        maximumRed : undefined,
        red : undefined,
        maximumGreen : undefined,
        green : undefined,
        maximumBlue : undefined,
        blue : undefined
    };

    function parseColorString(value, isRandom) {
        if (!defined(value) || /^\s*$/gm.test(value)) {
            return undefined;
        }

        if (value[0] === '#') {
            value = value.substring(1);
        }

        var alpha = parseInt(value.substring(0, 2), 16) / 255.0;
        var blue = parseInt(value.substring(2, 4), 16) / 255.0;
        var green = parseInt(value.substring(4, 6), 16) / 255.0;
        var red = parseInt(value.substring(6, 8), 16) / 255.0;

        if (!isRandom) {
            return new Color(red, green, blue, alpha);
        }

        if (red > 0) {
            colorOptions.maximumRed = red;
            colorOptions.red = undefined;
        } else {
            colorOptions.maximumRed = undefined;
            colorOptions.red = 0;
        }
        if (green > 0) {
            colorOptions.maximumGreen = green;
            colorOptions.green = undefined;
        } else {
            colorOptions.maximumGreen = undefined;
            colorOptions.green = 0;
        }
        if (blue > 0) {
            colorOptions.maximumBlue = blue;
            colorOptions.blue = undefined;
        } else {
            colorOptions.maximumBlue = undefined;
            colorOptions.blue = 0;
        }
        colorOptions.alpha = alpha;
        return Color.fromRandom(colorOptions);
    }

    function queryColorValue(node, tagName, namespace) {
        var value = queryStringValue(node, tagName, namespace);
        if (!defined(value)) {
            return undefined;
        }
        return parseColorString(value, queryStringValue(node, 'colorMode', namespace) === 'random');
    }

    function processTimeStamp(featureNode) {
        var node = queryFirstNode(featureNode, 'TimeStamp', namespaces.kmlgx);
        var whenString = queryStringValue(node, 'when', namespaces.kmlgx);

        if (!defined(node) || !defined(whenString) || whenString.length === 0) {
            return undefined;
        }

        //According to the KML spec, a TimeStamp represents a "single moment in time"
        //However, since Cesium animates much differently than Google Earth, that doesn't
        //Make much sense here.  Instead, we use the TimeStamp as the moment the feature
        //comes into existence.  This works much better and gives a similar feel to
        //GE's experience.
        var when = JulianDate.fromIso8601(whenString);
        var result = new TimeIntervalCollection();
        result.addInterval(new TimeInterval({
            start : when,
            stop : Iso8601.MAXIMUM_VALUE
        }));
        return result;
    }

    function processTimeSpan(featureNode) {
        var node = queryFirstNode(featureNode, 'TimeSpan', namespaces.kmlgx);
        if (!defined(node)) {
            return undefined;
        }
        var result;

        var beginNode = queryFirstNode(node, 'begin', namespaces.kmlgx);
        var beginDate = defined(beginNode) ? JulianDate.fromIso8601(beginNode.textContent) : undefined;

        var endNode = queryFirstNode(node, 'end', namespaces.kmlgx);
        var endDate = defined(endNode) ? JulianDate.fromIso8601(endNode.textContent) : undefined;

        if (defined(beginDate) && defined(endDate)) {
            if (JulianDate.lessThan(endDate, beginDate)) {
                var tmp = beginDate;
                beginDate = endDate;
                endDate = tmp;
            }
            result = new TimeIntervalCollection();
            result.addInterval(new TimeInterval({
                start : beginDate,
                stop : endDate
            }));
        } else if (defined(beginDate)) {
            result = new TimeIntervalCollection();
            result.addInterval(new TimeInterval({
                start : beginDate,
                stop : Iso8601.MAXIMUM_VALUE
            }));
        } else if (defined(endDate)) {
            result = new TimeIntervalCollection();
            result.addInterval(new TimeInterval({
                start : Iso8601.MINIMUM_VALUE,
                stop : endDate
            }));
        }

        return result;
    }

    function createDefaultBillboard() {
        var billboard = new BillboardGraphics();
        billboard.width = BILLBOARD_SIZE;
        billboard.height = BILLBOARD_SIZE;
        billboard.scaleByDistance = new NearFarScalar(BILLBOARD_NEAR_DISTANCE, BILLBOARD_NEAR_RATIO, BILLBOARD_FAR_DISTANCE, BILLBOARD_FAR_RATIO);
        billboard.pixelOffsetScaleByDistance = new NearFarScalar(BILLBOARD_NEAR_DISTANCE, BILLBOARD_NEAR_RATIO, BILLBOARD_FAR_DISTANCE, BILLBOARD_FAR_RATIO);
        return billboard;
    }

    function createDefaultPolygon() {
        var polygon = new PolygonGraphics();
        polygon.outline = true;
        polygon.outlineColor = Color.WHITE;
        return polygon;
    }

    function createDefaultLabel() {
        var label = new LabelGraphics();
        label.translucencyByDistance = new NearFarScalar(3000000, 1.0, 5000000, 0.0);
        label.pixelOffset = new Cartesian2(17, 0);
        label.horizontalOrigin = HorizontalOrigin.LEFT;
        label.font = '16px sans-serif';
        label.style = LabelStyle.FILL_AND_OUTLINE;
        return label;
    }

    function getIconHref(iconNode, dataSource, sourceResource, uriResolver, canRefresh) {
        var href = queryStringValue(iconNode, 'href', namespaces.kml);
        if (!defined(href) || (href.length === 0)) {
            return undefined;
        }

        if (href.indexOf('root://icons/palette-') === 0) {
            var palette = href.charAt(21);

            // Get the icon number
            var x = defaultValue(queryNumericValue(iconNode, 'x', namespaces.gx), 0);
            var y = defaultValue(queryNumericValue(iconNode, 'y', namespaces.gx), 0);
            x = Math.min(x / 32, 7);
            y = 7 - Math.min(y / 32, 7);
            var iconNum = (8 * y) + x;

            href = 'https://maps.google.com/mapfiles/kml/pal' + palette + '/icon' + iconNum + '.png';
        }

        var hrefResource = resolveHref(href, sourceResource, uriResolver);

        if (canRefresh) {
            var refreshMode = queryStringValue(iconNode, 'refreshMode', namespaces.kml);
            var viewRefreshMode = queryStringValue(iconNode, 'viewRefreshMode', namespaces.kml);
            if (refreshMode === 'onInterval' || refreshMode === 'onExpire') {
                oneTimeWarning('kml-refreshMode-' + refreshMode, 'KML - Unsupported Icon refreshMode: ' + refreshMode);
            } else if (viewRefreshMode === 'onStop' || viewRefreshMode === 'onRegion') {
                oneTimeWarning('kml-refreshMode-' + viewRefreshMode, 'KML - Unsupported Icon viewRefreshMode: ' + viewRefreshMode);
            }

            var viewBoundScale = defaultValue(queryStringValue(iconNode, 'viewBoundScale', namespaces.kml), 1.0);
            var defaultViewFormat = (viewRefreshMode === 'onStop') ? 'BBOX=[bboxWest],[bboxSouth],[bboxEast],[bboxNorth]' : '';
            var viewFormat = defaultValue(queryStringValue(iconNode, 'viewFormat', namespaces.kml), defaultViewFormat);
            var httpQuery = queryStringValue(iconNode, 'httpQuery', namespaces.kml);
            if (defined(viewFormat)) {
                hrefResource.setQueryParameters(queryToObject(cleanupString(viewFormat)));
            }
            if (defined(httpQuery)) {
                hrefResource.setQueryParameters(queryToObject(cleanupString(httpQuery)));
            }

            var ellipsoid = dataSource._ellipsoid;
            processNetworkLinkQueryString(hrefResource, dataSource._camera, dataSource._canvas, viewBoundScale, dataSource._lastCameraView.bbox, ellipsoid);

            return hrefResource;
        }

        return hrefResource;
    }

    function processBillboardIcon(dataSource, node, targetEntity, sourceResource, uriResolver) {
        var scale = queryNumericValue(node, 'scale', namespaces.kml);
        var heading = queryNumericValue(node, 'heading', namespaces.kml);
        var color = queryColorValue(node, 'color', namespaces.kml);

        var iconNode = queryFirstNode(node, 'Icon', namespaces.kml);
        var icon = getIconHref(iconNode, dataSource, sourceResource, uriResolver, false);

        // If icon tags are present but blank, we do not want to show an icon
        if (defined(iconNode) && !defined(icon)) {
            icon = false;
        }

        var x = queryNumericValue(iconNode, 'x', namespaces.gx);
        var y = queryNumericValue(iconNode, 'y', namespaces.gx);
        var w = queryNumericValue(iconNode, 'w', namespaces.gx);
        var h = queryNumericValue(iconNode, 'h', namespaces.gx);

        var hotSpotNode = queryFirstNode(node, 'hotSpot', namespaces.kml);
        var hotSpotX = queryNumericAttribute(hotSpotNode, 'x');
        var hotSpotY = queryNumericAttribute(hotSpotNode, 'y');
        var hotSpotXUnit = queryStringAttribute(hotSpotNode, 'xunits');
        var hotSpotYUnit = queryStringAttribute(hotSpotNode, 'yunits');

        var billboard = targetEntity.billboard;
        if (!defined(billboard)) {
            billboard = createDefaultBillboard();
            targetEntity.billboard = billboard;
        }

        billboard.image = icon;
        billboard.scale = scale;
        billboard.color = color;

        if (defined(x) || defined(y) || defined(w) || defined(h)) {
            billboard.imageSubRegion = new BoundingRectangle(x, y, w, h);
        }

        //GE treats a heading of zero as no heading
        //You can still point north using a 360 degree angle (or any multiple of 360)
        if (defined(heading) && heading !== 0) {
            billboard.rotation = CesiumMath.toRadians(-heading);
            billboard.alignedAxis = Cartesian3.UNIT_Z;
        }

        //Hotpot is the KML equivalent of pixel offset
        //The hotspot origin is the lower left, but we leave
        //our billboard origin at the center and simply
        //modify the pixel offset to take this into account
        scale = defaultValue(scale, 1.0);

        var xOffset;
        var yOffset;
        if (defined(hotSpotX)) {
            if (hotSpotXUnit === 'pixels') {
                xOffset = -hotSpotX * scale;
            } else if (hotSpotXUnit === 'insetPixels') {
                xOffset = (hotSpotX - BILLBOARD_SIZE) * scale;
            } else if (hotSpotXUnit === 'fraction') {
                xOffset = -hotSpotX * BILLBOARD_SIZE * scale;
            }
            xOffset += BILLBOARD_SIZE * 0.5 * scale;
        }

        if (defined(hotSpotY)) {
            if (hotSpotYUnit === 'pixels') {
                yOffset = hotSpotY * scale;
            } else if (hotSpotYUnit === 'insetPixels') {
                yOffset = (-hotSpotY + BILLBOARD_SIZE) * scale;
            } else if (hotSpotYUnit === 'fraction') {
                yOffset = hotSpotY * BILLBOARD_SIZE * scale;
            }

            yOffset -= BILLBOARD_SIZE * 0.5 * scale;
        }

        if (defined(xOffset) || defined(yOffset)) {
            billboard.pixelOffset = new Cartesian2(xOffset, yOffset);
        }
    }

    function applyStyle(dataSource, styleNode, targetEntity, sourceResource, uriResolver) {
        for (var i = 0, len = styleNode.childNodes.length; i < len; i++) {
            var node = styleNode.childNodes.item(i);
            if (node.localName === 'IconStyle') {
                processBillboardIcon(dataSource, node, targetEntity, sourceResource, uriResolver);
            } else if (node.localName === 'LabelStyle') {
                var label = targetEntity.label;
                if (!defined(label)) {
                    label = createDefaultLabel();
                    targetEntity.label = label;
                }
                label.scale = defaultValue(queryNumericValue(node, 'scale', namespaces.kml), label.scale);
                label.fillColor = defaultValue(queryColorValue(node, 'color', namespaces.kml), label.fillColor);
                label.text = targetEntity.name;
            } else if (node.localName === 'LineStyle') {
                var polyline = targetEntity.polyline;
                if (!defined(polyline)) {
                    polyline = new PolylineGraphics();
                    targetEntity.polyline = polyline;
                }
                polyline.width = queryNumericValue(node, 'width', namespaces.kml);
                polyline.material = queryColorValue(node, 'color', namespaces.kml);
                if (defined(queryColorValue(node, 'outerColor', namespaces.gx))) {
                    oneTimeWarning('kml-gx:outerColor', 'KML - gx:outerColor is not supported in a LineStyle');
                }
                if (defined(queryNumericValue(node, 'outerWidth', namespaces.gx))) {
                    oneTimeWarning('kml-gx:outerWidth', 'KML - gx:outerWidth is not supported in a LineStyle');
                }
                if (defined(queryNumericValue(node, 'physicalWidth', namespaces.gx))) {
                    oneTimeWarning('kml-gx:physicalWidth', 'KML - gx:physicalWidth is not supported in a LineStyle');
                }
                if (defined(queryBooleanValue(node, 'labelVisibility', namespaces.gx))) {
                    oneTimeWarning('kml-gx:labelVisibility', 'KML - gx:labelVisibility is not supported in a LineStyle');
                }
            } else if (node.localName === 'PolyStyle') {
                var polygon = targetEntity.polygon;
                if (!defined(polygon)) {
                    polygon = createDefaultPolygon();
                    targetEntity.polygon = polygon;
                }
                polygon.material = defaultValue(queryColorValue(node, 'color', namespaces.kml), polygon.material);
                polygon.fill = defaultValue(queryBooleanValue(node, 'fill', namespaces.kml), polygon.fill);
                polygon.outline = defaultValue(queryBooleanValue(node, 'outline', namespaces.kml), polygon.outline);
            } else if (node.localName === 'BalloonStyle') {
                var bgColor = defaultValue(parseColorString(queryStringValue(node, 'bgColor', namespaces.kml)), Color.WHITE);
                var textColor = defaultValue(parseColorString(queryStringValue(node, 'textColor', namespaces.kml)), Color.BLACK);
                var text = queryStringValue(node, 'text', namespaces.kml);

                //This is purely an internal property used in style processing,
                //it never ends up on the final entity.
                targetEntity.addProperty('balloonStyle');
                targetEntity.balloonStyle = {
                    bgColor : bgColor,
                    textColor : textColor,
                    text : text
                };
            } else if (node.localName === 'ListStyle') {
                var listItemType = queryStringValue(node, 'listItemType', namespaces.kml);
                if (listItemType === 'radioFolder' || listItemType === 'checkOffOnly') {
                    oneTimeWarning('kml-listStyle-' + listItemType, 'KML - Unsupported ListStyle with listItemType: ' + listItemType);
                }
            }
        }
    }

    //Processes and merges any inline styles for the provided node into the provided entity.
    function computeFinalStyle(dataSource, placeMark, styleCollection, sourceResource, uriResolver) {
        var result = new Entity();
        var styleEntity;

        //Google earth seems to always use the last inline Style/StyleMap only
        var styleIndex = -1;
        var childNodes = placeMark.childNodes;
        var length = childNodes.length;
        for (var q = 0; q < length; q++) {
            var child = childNodes[q];
            if (child.localName === 'Style' || child.localName === 'StyleMap') {
                styleIndex = q;
            }
        }

        if (styleIndex !== -1) {
            var inlineStyleNode = childNodes[styleIndex];
            if (inlineStyleNode.localName === 'Style') {
                applyStyle(dataSource, inlineStyleNode, result, sourceResource, uriResolver);
            } else { // StyleMap
                var pairs = queryChildNodes(inlineStyleNode, 'Pair', namespaces.kml);
                for (var p = 0; p < pairs.length; p++) {
                    var pair = pairs[p];
                    var key = queryStringValue(pair, 'key', namespaces.kml);
                    if (key === 'normal') {
                        var styleUrl = queryStringValue(pair, 'styleUrl', namespaces.kml);
                        if (defined(styleUrl)) {
                            styleEntity = styleCollection.getById(styleUrl);
                            if (!defined(styleEntity)) {
                                styleEntity = styleCollection.getById('#' + styleUrl);
                            }
                            if (defined(styleEntity)) {
                                result.merge(styleEntity);
                            }
                        } else {
                            var node = queryFirstNode(pair, 'Style', namespaces.kml);
                            applyStyle(dataSource, node, result, sourceResource, uriResolver);
                        }
                    } else {
                        oneTimeWarning('kml-styleMap-' + key, 'KML - Unsupported StyleMap key: ' + key);
                    }
                }
            }
        }

        //Google earth seems to always use the first external style only.
        var externalStyle = queryStringValue(placeMark, 'styleUrl', namespaces.kml);
        if (defined(externalStyle)) {
            var id = externalStyle;
            if (externalStyle[0] !== '#' && externalStyle.indexOf('#') !== -1) {
                var tokens = externalStyle.split('#');
                var uri = tokens[0];
                var resource = sourceResource.getDerivedResource({
                    url: uri
                });

                id = resource.getUrlComponent() + '#' + tokens[1];
            }

            styleEntity = styleCollection.getById(id);
            if (!defined(styleEntity)) {
                styleEntity = styleCollection.getById('#' + id);
            }
            if (defined(styleEntity)) {
                result.merge(styleEntity);
            }
        }

        return result;
    }

    //Asynchronously processes an external style file.
    function processExternalStyles(dataSource, resource, styleCollection) {
        return resource.fetchXML().then(function(styleKml) {
            return processStyles(dataSource, styleKml, styleCollection, resource, true);
        });
    }

    //Processes all shared and external styles and stores
    //their id into the provided styleCollection.
    //Returns an array of promises that will resolve when
    //each style is loaded.
    function processStyles(dataSource, kml, styleCollection, sourceResource, isExternal, uriResolver) {
        var i;
        var id;
        var styleEntity;

        var node;
        var styleNodes = queryNodes(kml, 'Style', namespaces.kml);
        if (defined(styleNodes)) {
            var styleNodesLength = styleNodes.length;
            for (i = 0; i < styleNodesLength; i++) {
                node = styleNodes[i];
                id = queryStringAttribute(node, 'id');
                if (defined(id)) {
                    id = '#' + id;
                    if (isExternal && defined(sourceResource)) {
                        id = sourceResource.getUrlComponent() + id;
                    }
                    if (!defined(styleCollection.getById(id))) {
                        styleEntity = new Entity({
                            id : id
                        });
                        styleCollection.add(styleEntity);
                        applyStyle(dataSource, node, styleEntity, sourceResource, uriResolver);
                    }
                }
            }
        }

        var styleMaps = queryNodes(kml, 'StyleMap', namespaces.kml);
        if (defined(styleMaps)) {
            var styleMapsLength = styleMaps.length;
            for (i = 0; i < styleMapsLength; i++) {
                var styleMap = styleMaps[i];
                id = queryStringAttribute(styleMap, 'id');
                if (defined(id)) {
                    var pairs = queryChildNodes(styleMap, 'Pair', namespaces.kml);
                    for (var p = 0; p < pairs.length; p++) {
                        var pair = pairs[p];
                        var key = queryStringValue(pair, 'key', namespaces.kml);
                        if (key === 'normal') {
                            id = '#' + id;
                            if (isExternal && defined(sourceResource)) {
                                id = sourceResource.getUrlComponent() + id;
                            }
                            if (!defined(styleCollection.getById(id))) {
                                styleEntity = styleCollection.getOrCreateEntity(id);

                                var styleUrl = queryStringValue(pair, 'styleUrl', namespaces.kml);
                                if (defined(styleUrl)) {
                                    if (styleUrl[0] !== '#') {
                                        styleUrl = '#' + styleUrl;
                                    }

                                    if (isExternal && defined(sourceResource)) {
                                        styleUrl = sourceResource.getUrlComponent() + styleUrl;
                                    }
                                    var base = styleCollection.getById(styleUrl);

                                    if (defined(base)) {
                                        styleEntity.merge(base);
                                    }
                                } else {
                                    node = queryFirstNode(pair, 'Style', namespaces.kml);
                                    applyStyle(dataSource, node, styleEntity, sourceResource, uriResolver);
                                }
                            }
                        } else {
                            oneTimeWarning('kml-styleMap-' + key, 'KML - Unsupported StyleMap key: ' + key);
                        }
                    }
                }
            }
        }

        var promises = [];
        var styleUrlNodes = kml.getElementsByTagName('styleUrl');
        var styleUrlNodesLength = styleUrlNodes.length;
        for (i = 0; i < styleUrlNodesLength; i++) {
            var styleReference = styleUrlNodes[i].textContent;
            if (styleReference[0] !== '#') {
                //According to the spec, all local styles should start with a #
                //and everything else is an external style that has a # seperating
                //the URL of the document and the style.  However, Google Earth
                //also accepts styleUrls without a # as meaning a local style.
                var tokens = styleReference.split('#');
                if (tokens.length === 2) {
                    var uri = tokens[0];
                    var resource = sourceResource.getDerivedResource({
                        url: uri
                    });

                    promises.push(processExternalStyles(dataSource, resource, styleCollection));
                }
            }
        }

        return promises;
    }

    function createDropLine(entityCollection, entity, styleEntity) {
        var entityPosition = new ReferenceProperty(entityCollection, entity.id, ['position']);
        var surfacePosition = new ScaledPositionProperty(entity.position);
        entity.polyline = defined(styleEntity.polyline) ? styleEntity.polyline.clone() : new PolylineGraphics();
        entity.polyline.positions = new PositionPropertyArray([entityPosition, surfacePosition]);
    }

    function heightReferenceFromAltitudeMode(altitudeMode, gxAltitudeMode) {
        if (!defined(altitudeMode) && !defined(gxAltitudeMode) || altitudeMode === 'clampToGround') {
            return HeightReference.CLAMP_TO_GROUND;
        }

        if (altitudeMode === 'relativeToGround') {
            return HeightReference.RELATIVE_TO_GROUND;
        }

        if (altitudeMode === 'absolute') {
            return HeightReference.NONE;
        }

        if (gxAltitudeMode === 'clampToSeaFloor') {
            oneTimeWarning('kml-gx:altitudeMode-clampToSeaFloor', 'KML - <gx:altitudeMode>:clampToSeaFloor is currently not supported, using <kml:altitudeMode>:clampToGround.');
            return HeightReference.CLAMP_TO_GROUND;
        }

        if (gxAltitudeMode === 'relativeToSeaFloor') {
            oneTimeWarning('kml-gx:altitudeMode-relativeToSeaFloor', 'KML - <gx:altitudeMode>:relativeToSeaFloor is currently not supported, using <kml:altitudeMode>:relativeToGround.');
            return HeightReference.RELATIVE_TO_GROUND;
        }

        if (defined(altitudeMode)) {
            oneTimeWarning('kml-altitudeMode-unknown', 'KML - Unknown <kml:altitudeMode>:' + altitudeMode + ', using <kml:altitudeMode>:CLAMP_TO_GROUND.');
        } else {
            oneTimeWarning('kml-gx:altitudeMode-unknown', 'KML - Unknown <gx:altitudeMode>:' + gxAltitudeMode + ', using <kml:altitudeMode>:CLAMP_TO_GROUND.');
        }

        // Clamp to ground is the default
        return HeightReference.CLAMP_TO_GROUND;
    }

    function createPositionPropertyFromAltitudeMode(property, altitudeMode, gxAltitudeMode) {
        if (gxAltitudeMode === 'relativeToSeaFloor' || altitudeMode === 'absolute' || altitudeMode === 'relativeToGround') {
            //Just return the ellipsoid referenced property until we support MSL
            return property;
        }

        if ((defined(altitudeMode) && altitudeMode !== 'clampToGround') || //
            (defined(gxAltitudeMode) && gxAltitudeMode !== 'clampToSeaFloor')) {
            oneTimeWarning('kml-altitudeMode-unknown', 'KML - Unknown altitudeMode: ' + defaultValue(altitudeMode, gxAltitudeMode));
        }

        // Clamp to ground is the default
        return new ScaledPositionProperty(property);
    }

    function createPositionPropertyArrayFromAltitudeMode(properties, altitudeMode, gxAltitudeMode, ellipsoid) {
        if (!defined(properties)) {
            return undefined;
        }

        if (gxAltitudeMode === 'relativeToSeaFloor' || altitudeMode === 'absolute' || altitudeMode === 'relativeToGround') {
            //Just return the ellipsoid referenced property until we support MSL
            return properties;
        }

        if ((defined(altitudeMode) && altitudeMode !== 'clampToGround') || //
            (defined(gxAltitudeMode) && gxAltitudeMode !== 'clampToSeaFloor')) {
            oneTimeWarning('kml-altitudeMode-unknown', 'KML - Unknown altitudeMode: ' + defaultValue(altitudeMode, gxAltitudeMode));
        }

        // Clamp to ground is the default
        var propertiesLength = properties.length;
        for (var i = 0; i < propertiesLength; i++) {
            var property = properties[i];
            ellipsoid.scaleToGeodeticSurface(property, property);
        }
        return properties;
    }

    function processPositionGraphics(dataSource, entity, styleEntity, heightReference) {
        var label = entity.label;
        if (!defined(label)) {
            label = defined(styleEntity.label) ? styleEntity.label.clone() : createDefaultLabel();
            entity.label = label;
        }
        label.text = entity.name;

        var billboard = entity.billboard;
        if (!defined(billboard)) {
            billboard = defined(styleEntity.billboard) ? styleEntity.billboard.clone() : createDefaultBillboard();
            entity.billboard = billboard;
        }

        if (!defined(billboard.image)) {
            billboard.image = dataSource._pinBuilder.fromColor(Color.YELLOW, 64);

        // If there were empty <Icon> tags in the KML, then billboard.image was set to false above
        // However, in this case, the false value would have been converted to a property afterwards
        // Thus, we check if billboard.image is defined with value of false
        } else if (!billboard.image.getValue()) {
            billboard.image = undefined;
        }

        var scale = 1.0;
        if (defined(billboard.scale)) {
            scale = billboard.scale.getValue();
            if (scale !== 0) {
                label.pixelOffset = new Cartesian2((scale * 16) + 1, 0);
            } else {
                //Minor tweaks to better match Google Earth.
                label.pixelOffset = undefined;
                label.horizontalOrigin = undefined;
            }
        }

        if (defined(heightReference) && dataSource._clampToGround) {
            billboard.heightReference = heightReference;
            label.heightReference = heightReference;
        }
    }

    function processPathGraphics(entity, styleEntity) {
        var path = entity.path;
        if (!defined(path)) {
            path = new PathGraphics();
            path.leadTime = 0;
            entity.path = path;
        }

        var polyline = styleEntity.polyline;
        if (defined(polyline)) {
            path.material = polyline.material;
            path.width = polyline.width;
        }
    }

    function processPoint(dataSource, entityCollection, geometryNode, entity, styleEntity) {
        var coordinatesString = queryStringValue(geometryNode, 'coordinates', namespaces.kml);
        var altitudeMode = queryStringValue(geometryNode, 'altitudeMode', namespaces.kml);
        var gxAltitudeMode = queryStringValue(geometryNode, 'altitudeMode', namespaces.gx);
        var extrude = queryBooleanValue(geometryNode, 'extrude', namespaces.kml);
        var ellipsoid = dataSource._ellipsoid;
        var position = readCoordinate(coordinatesString, ellipsoid);

        entity.position = position;
        processPositionGraphics(dataSource, entity, styleEntity, heightReferenceFromAltitudeMode(altitudeMode, gxAltitudeMode));

        if (extrude && isExtrudable(altitudeMode, gxAltitudeMode)) {
            createDropLine(entityCollection, entity, styleEntity);
        }

        return true;
    }

    function processLineStringOrLinearRing(dataSource, entityCollection, geometryNode, entity, styleEntity) {
        var coordinatesNode = queryFirstNode(geometryNode, 'coordinates', namespaces.kml);
        var altitudeMode = queryStringValue(geometryNode, 'altitudeMode', namespaces.kml);
        var gxAltitudeMode = queryStringValue(geometryNode, 'altitudeMode', namespaces.gx);
        var extrude = queryBooleanValue(geometryNode, 'extrude', namespaces.kml);
        var tessellate = queryBooleanValue(geometryNode, 'tessellate', namespaces.kml);
        var canExtrude = isExtrudable(altitudeMode, gxAltitudeMode);
        var zIndex = queryNumericValue(geometryNode, 'drawOrder', namespaces.gx);

        var ellipsoid = dataSource._ellipsoid;
        var coordinates = readCoordinates(coordinatesNode, ellipsoid);
        var polyline = styleEntity.polyline;
        if (canExtrude && extrude) {
            var wall = new WallGraphics();
            entity.wall = wall;
            wall.positions = coordinates;
            var polygon = styleEntity.polygon;

            if (defined(polygon)) {
                wall.fill = polygon.fill;
                wall.material = polygon.material;
            }

            //Always outline walls so they show up in 2D.
            wall.outline = true;
            if (defined(polyline)) {
                wall.outlineColor = defined(polyline.material) ? polyline.material.color : Color.WHITE;
                wall.outlineWidth = polyline.width;
            } else if (defined(polygon)) {
                wall.outlineColor = defined(polygon.material) ? polygon.material.color : Color.WHITE;
            }
        } else if (dataSource._clampToGround && !canExtrude && tessellate) {
            var polylineGraphics = new PolylineGraphics();
            polylineGraphics.clampToGround = true;
            entity.polyline = polylineGraphics;
            polylineGraphics.positions = coordinates;
            if (defined(polyline)) {
                polylineGraphics.material = defined(polyline.material) ? polyline.material.color.getValue(Iso8601.MINIMUM_VALUE) : Color.WHITE;
                polylineGraphics.width = defaultValue(polyline.width, 1.0);
            } else {
                polylineGraphics.material = Color.WHITE;
                polylineGraphics.width = 1.0;
            }
            polylineGraphics.zIndex = zIndex;
        } else {
            if (defined(zIndex)) {
                oneTimeWarning('kml-gx:drawOrder', 'KML - gx:drawOrder is not supported in LineStrings when clampToGround is false');
            }

            polyline = defined(polyline) ? polyline.clone() : new PolylineGraphics();
            entity.polyline = polyline;
            polyline.positions = createPositionPropertyArrayFromAltitudeMode(coordinates, altitudeMode, gxAltitudeMode, ellipsoid);
            if (!tessellate || canExtrude) {
                polyline.followSurface = false;
            }
        }

        return true;
    }

    function processPolygon(dataSource, entityCollection, geometryNode, entity, styleEntity) {
        var outerBoundaryIsNode = queryFirstNode(geometryNode, 'outerBoundaryIs', namespaces.kml);
        var linearRingNode = queryFirstNode(outerBoundaryIsNode, 'LinearRing', namespaces.kml);
        var coordinatesNode = queryFirstNode(linearRingNode, 'coordinates', namespaces.kml);
        var ellipsoid = dataSource._ellipsoid;
        var coordinates = readCoordinates(coordinatesNode, ellipsoid);
        var extrude = queryBooleanValue(geometryNode, 'extrude', namespaces.kml);
        var altitudeMode = queryStringValue(geometryNode, 'altitudeMode', namespaces.kml);
        var gxAltitudeMode = queryStringValue(geometryNode, 'altitudeMode', namespaces.gx);
        var canExtrude = isExtrudable(altitudeMode, gxAltitudeMode);

        var polygon = defined(styleEntity.polygon) ? styleEntity.polygon.clone() : createDefaultPolygon();

        var polyline = styleEntity.polyline;
        if (defined(polyline)) {
            polygon.outlineColor = defined(polyline.material) ? polyline.material.color : Color.WHITE;
            polygon.outlineWidth = polyline.width;
        }
        entity.polygon = polygon;

        if (canExtrude) {
            polygon.perPositionHeight = true;
            polygon.extrudedHeight = extrude ? 0 : undefined;
        } else if (!dataSource._clampToGround) {
            polygon.height = 0;
        }

        if (defined(coordinates)) {
            var hierarchy = new PolygonHierarchy(coordinates);
            var innerBoundaryIsNodes = queryChildNodes(geometryNode, 'innerBoundaryIs', namespaces.kml);
            for (var j = 0; j < innerBoundaryIsNodes.length; j++) {
                linearRingNode = queryChildNodes(innerBoundaryIsNodes[j], 'LinearRing', namespaces.kml);
                for (var k = 0; k < linearRingNode.length; k++) {
                    coordinatesNode = queryFirstNode(linearRingNode[k], 'coordinates', namespaces.kml);
                    coordinates = readCoordinates(coordinatesNode, ellipsoid);
                    if (defined(coordinates)) {
                        hierarchy.holes.push(new PolygonHierarchy(coordinates));
                    }
                }
            }
            polygon.hierarchy = hierarchy;
        }

        return true;
    }

    function processTrack(dataSource, entityCollection, geometryNode, entity, styleEntity) {
        var altitudeMode = queryStringValue(geometryNode, 'altitudeMode', namespaces.kml);
        var gxAltitudeMode = queryStringValue(geometryNode, 'altitudeMode', namespaces.gx);
        var coordNodes = queryChildNodes(geometryNode, 'coord', namespaces.gx);
        var angleNodes = queryChildNodes(geometryNode, 'angles', namespaces.gx);
        var timeNodes = queryChildNodes(geometryNode, 'when', namespaces.kml);
        var extrude = queryBooleanValue(geometryNode, 'extrude', namespaces.kml);
        var canExtrude = isExtrudable(altitudeMode, gxAltitudeMode);
        var ellipsoid = dataSource._ellipsoid;

        if (angleNodes.length > 0) {
            oneTimeWarning('kml-gx:angles', 'KML - gx:angles are not supported in gx:Tracks');
        }

        var length = Math.min(coordNodes.length, timeNodes.length);
        var coordinates = [];
        var times = [];
        for (var i = 0; i < length; i++) {
            var position = readCoordinate(coordNodes[i].textContent, ellipsoid);
            coordinates.push(position);
            times.push(JulianDate.fromIso8601(timeNodes[i].textContent));
        }
        var property = new SampledPositionProperty();
        property.addSamples(times, coordinates);
        entity.position = property;
        processPositionGraphics(dataSource, entity, styleEntity, heightReferenceFromAltitudeMode(altitudeMode, gxAltitudeMode));
        processPathGraphics(entity, styleEntity);

        entity.availability = new TimeIntervalCollection();

        if (timeNodes.length > 0) {
            entity.availability.addInterval(new TimeInterval({
                start : times[0],
                stop : times[times.length - 1]
            }));
        }

        if (canExtrude && extrude) {
            createDropLine(entityCollection, entity, styleEntity);
        }

        return true;
    }

    function addToMultiTrack(times, positions, composite, availability, dropShowProperty, extrude, altitudeMode, gxAltitudeMode, includeEndPoints) {
        var start = times[0];
        var stop = times[times.length - 1];

        var data = new SampledPositionProperty();
        data.addSamples(times, positions);

        composite.intervals.addInterval(new TimeInterval({
            start : start,
            stop : stop,
            isStartIncluded : includeEndPoints,
            isStopIncluded : includeEndPoints,
            data : createPositionPropertyFromAltitudeMode(data, altitudeMode, gxAltitudeMode)
        }));
        availability.addInterval(new TimeInterval({
            start : start,
            stop : stop,
            isStartIncluded : includeEndPoints,
            isStopIncluded : includeEndPoints
        }));
        dropShowProperty.intervals.addInterval(new TimeInterval({
            start : start,
            stop : stop,
            isStartIncluded : includeEndPoints,
            isStopIncluded : includeEndPoints,
            data : extrude
        }));
    }

    function processMultiTrack(dataSource, entityCollection, geometryNode, entity, styleEntity) {
        // Multitrack options do not work in GE as detailed in the spec,
        // rather than altitudeMode being at the MultiTrack level,
        // GE just defers all settings to the underlying track.

        var interpolate = queryBooleanValue(geometryNode, 'interpolate', namespaces.gx);
        var trackNodes = queryChildNodes(geometryNode, 'Track', namespaces.gx);

        var times;
        var lastStop;
        var lastStopPosition;
        var needDropLine = false;
        var dropShowProperty = new TimeIntervalCollectionProperty();
        var availability = new TimeIntervalCollection();
        var composite = new CompositePositionProperty();
        var ellipsoid = dataSource._ellipsoid;
        for (var i = 0, len = trackNodes.length; i < len; i++) {
            var trackNode = trackNodes[i];
            var timeNodes = queryChildNodes(trackNode, 'when', namespaces.kml);
            var coordNodes = queryChildNodes(trackNode, 'coord', namespaces.gx);
            var altitudeMode = queryStringValue(trackNode, 'altitudeMode', namespaces.kml);
            var gxAltitudeMode = queryStringValue(trackNode, 'altitudeMode', namespaces.gx);
            var canExtrude = isExtrudable(altitudeMode, gxAltitudeMode);
            var extrude = queryBooleanValue(trackNode, 'extrude', namespaces.kml);

            var length = Math.min(coordNodes.length, timeNodes.length);

            var positions = [];
            times = [];
            for (var x = 0; x < length; x++) {
                var position = readCoordinate(coordNodes[x].textContent, ellipsoid);
                positions.push(position);
                times.push(JulianDate.fromIso8601(timeNodes[x].textContent));
            }

            if (interpolate) {
                //If we are interpolating, then we need to fill in the end of
                //the last track and the beginning of this one with a sampled
                //property.  From testing in Google Earth, this property
                //is never extruded and always absolute.
                if (defined(lastStop)) {
                    addToMultiTrack([lastStop, times[0]], [lastStopPosition, positions[0]], composite, availability, dropShowProperty, false, 'absolute', undefined, false);
                }
                lastStop = times[length - 1];
                lastStopPosition = positions[positions.length - 1];
            }

            addToMultiTrack(times, positions, composite, availability, dropShowProperty, canExtrude && extrude, altitudeMode, gxAltitudeMode, true);
            needDropLine = needDropLine || (canExtrude && extrude);
        }

        entity.availability = availability;
        entity.position = composite;
        processPositionGraphics(dataSource, entity, styleEntity);
        processPathGraphics(entity, styleEntity);
        if (needDropLine) {
            createDropLine(entityCollection, entity, styleEntity);
            entity.polyline.show = dropShowProperty;
        }

        return true;
    }

    var geometryTypes = {
        Point : processPoint,
        LineString : processLineStringOrLinearRing,
        LinearRing : processLineStringOrLinearRing,
        Polygon : processPolygon,
        Track : processTrack,
        MultiTrack : processMultiTrack,
        MultiGeometry : processMultiGeometry,
        Model : processUnsupportedGeometry
    };

    function processMultiGeometry(dataSource, entityCollection, geometryNode, entity, styleEntity, context) {
        var childNodes = geometryNode.childNodes;
        var hasGeometry = false;
        for (var i = 0, len = childNodes.length; i < len; i++) {
            var childNode = childNodes.item(i);
            var geometryProcessor = geometryTypes[childNode.localName];
            if (defined(geometryProcessor)) {
                var childEntity = createEntity(childNode, entityCollection, context);
                childEntity.parent = entity;
                childEntity.name = entity.name;
                childEntity.availability = entity.availability;
                childEntity.description = entity.description;
                childEntity.kml = entity.kml;
                if (geometryProcessor(dataSource, entityCollection, childNode, childEntity, styleEntity)) {
                    hasGeometry = true;
                }
            }
        }

        return hasGeometry;
    }

    function processUnsupportedGeometry(dataSource, entityCollection, geometryNode, entity, styleEntity) {
        oneTimeWarning('kml-unsupportedGeometry', 'KML - Unsupported geometry: ' + geometryNode.localName);
        return false;
    }

    function processExtendedData(node, entity) {
        var extendedDataNode = queryFirstNode(node, 'ExtendedData', namespaces.kml);

        if (!defined(extendedDataNode)) {
            return undefined;
        }

        if (defined(queryFirstNode(extendedDataNode, 'SchemaData', namespaces.kml))) {
            oneTimeWarning('kml-schemaData', 'KML - SchemaData is unsupported');
        }
        if (defined(queryStringAttribute(extendedDataNode, 'xmlns:prefix'))) {
            oneTimeWarning('kml-extendedData', 'KML - ExtendedData with xmlns:prefix is unsupported');
        }

        var result = {};
        var dataNodes = queryChildNodes(extendedDataNode, 'Data', namespaces.kml);
        if (defined(dataNodes)) {
            var length = dataNodes.length;
            for (var i = 0; i < length; i++) {
                var dataNode = dataNodes[i];
                var name = queryStringAttribute(dataNode, 'name');
                if (defined(name)) {
                    result[name] = {
                        displayName : queryStringValue(dataNode, 'displayName', namespaces.kml),
                        value : queryStringValue(dataNode, 'value', namespaces.kml)
                    };
                }
            }
        }
        entity.kml.extendedData = result;
    }

    var scratchDiv = document.createElement('div');

    function processDescription(node, entity, styleEntity, uriResolver, sourceResource) {
        var i;
        var key;
        var keys;

        var kmlData = entity.kml;
        var extendedData = kmlData.extendedData;
        var description = queryStringValue(node, 'description', namespaces.kml);

        var balloonStyle = defaultValue(entity.balloonStyle, styleEntity.balloonStyle);

        var background = Color.WHITE;
        var foreground = Color.BLACK;
        var text = description;

        if (defined(balloonStyle)) {
            background = defaultValue(balloonStyle.bgColor, Color.WHITE);
            foreground = defaultValue(balloonStyle.textColor, Color.BLACK);
            text = defaultValue(balloonStyle.text, description);
        }

        var value;
        if (defined(text)) {
            text = text.replace('$[name]', defaultValue(entity.name, ''));
            text = text.replace('$[description]', defaultValue(description, ''));
            text = text.replace('$[address]', defaultValue(kmlData.address, ''));
            text = text.replace('$[Snippet]', defaultValue(kmlData.snippet, ''));
            text = text.replace('$[id]', entity.id);

            //While not explicitly defined by the OGC spec, in Google Earth
            //The appearance of geDirections adds the directions to/from links
            //We simply replace this string with nothing.
            text = text.replace('$[geDirections]', '');

            if (defined(extendedData)) {
                var matches = text.match(/\$\[.+?\]/g);
                if (matches !== null) {
                    for (i = 0; i < matches.length; i++) {
                        var token = matches[i];
                        var propertyName = token.substr(2, token.length - 3);
                        var isDisplayName = /\/displayName$/.test(propertyName);
                        propertyName = propertyName.replace(/\/displayName$/, '');

                        value = extendedData[propertyName];
                        if (defined(value)) {
                            value = isDisplayName ? value.displayName : value.value;
                        }
                        if (defined(value)) {
                            text = text.replace(token, defaultValue(value, ''));
                        }
                    }
                }
            }
        } else if (defined(extendedData)) {
            //If no description exists, build a table out of the extended data
            keys = Object.keys(extendedData);
            if (keys.length > 0) {
                text = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    value = extendedData[key];
                    text += '<tr><th>' + defaultValue(value.displayName, key) + '</th><td>' + defaultValue(value.value, '') + '</td></tr>';
                }
                text += '</tbody></table>';
            }
        }

        if (!defined(text)) {
            //No description
            return;
        }

        //Turns non-explicit links into clickable links.
        text = autolinker.link(text);

        //Use a temporary div to manipulate the links
        //so that they open in a new window.
        scratchDiv.innerHTML = text;
        var links = scratchDiv.querySelectorAll('a');
        for (i = 0; i < links.length; i++) {
            links[i].setAttribute('target', '_blank');
        }

        //Rewrite any KMZ embedded urls
        if (defined(uriResolver) && uriResolver.keys.length > 1) {
            embedDataUris(scratchDiv, 'a', 'href', uriResolver);
            embedDataUris(scratchDiv, 'img', 'src', uriResolver);
        }

        //Make relative urls absolute using the sourceResource
        applyBasePath(scratchDiv, 'a', 'href', sourceResource);
        applyBasePath(scratchDiv, 'img', 'src', sourceResource);

        var tmp = '<div class="cesium-infoBox-description-lighter" style="';
        tmp += 'overflow:auto;';
        tmp += 'word-wrap:break-word;';
        tmp += 'background-color:' + background.toCssColorString() + ';';
        tmp += 'color:' + foreground.toCssColorString() + ';';
        tmp += '">';
        tmp += scratchDiv.innerHTML + '</div>';
        scratchDiv.innerHTML = '';

        //Set the final HTML as the description.
        entity.description = tmp;
    }

    function processFeature(dataSource, parent, featureNode, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        var entity = createEntity(featureNode, entityCollection, context);
        var kmlData = entity.kml;
        var styleEntity = computeFinalStyle(dataSource, featureNode, styleCollection, sourceResource, uriResolver);

        var name = queryStringValue(featureNode, 'name', namespaces.kml);
        entity.name = name;
        entity.parent = parent;

        var availability = processTimeSpan(featureNode);
        if (!defined(availability)) {
            availability = processTimeStamp(featureNode);
        }
        entity.availability = availability;

        mergeAvailabilityWithParent(entity);

        // Per KML spec "A Feature is visible only if it and all its ancestors are visible."
        function ancestryIsVisible(parentEntity) {
            if (!parentEntity) {
                return true;
            }
            return parentEntity.show && ancestryIsVisible(parentEntity.parent);
        }

        var visibility = queryBooleanValue(featureNode, 'visibility', namespaces.kml);
        entity.show = ancestryIsVisible(parent) && defaultValue(visibility, true);
        //var open = queryBooleanValue(featureNode, 'open', namespaces.kml);

        var authorNode = queryFirstNode(featureNode, 'author', namespaces.atom);
        var author = kmlData.author;
        author.name = queryStringValue(authorNode, 'name', namespaces.atom);
        author.uri = queryStringValue(authorNode, 'uri', namespaces.atom);
        author.email = queryStringValue(authorNode, 'email', namespaces.atom);

        var linkNode = queryFirstNode(featureNode, 'link', namespaces.atom);
        var link = kmlData.link;
        link.href = queryStringAttribute(linkNode, 'href');
        link.hreflang = queryStringAttribute(linkNode, 'hreflang');
        link.rel = queryStringAttribute(linkNode, 'rel');
        link.type = queryStringAttribute(linkNode, 'type');
        link.title = queryStringAttribute(linkNode, 'title');
        link.length = queryStringAttribute(linkNode, 'length');

        kmlData.address = queryStringValue(featureNode, 'address', namespaces.kml);
        kmlData.phoneNumber = queryStringValue(featureNode, 'phoneNumber', namespaces.kml);
        kmlData.snippet = queryStringValue(featureNode, 'Snippet', namespaces.kml);

        processExtendedData(featureNode, entity);
        processDescription(featureNode, entity, styleEntity, uriResolver, sourceResource);

        var ellipsoid = dataSource._ellipsoid;
        processLookAt(featureNode, entity, ellipsoid);
        processCamera(featureNode, entity, ellipsoid);

        if (defined(queryFirstNode(featureNode, 'Region', namespaces.kml))) {
            oneTimeWarning('kml-region', 'KML - Placemark Regions are unsupported');
        }

        return {
            entity : entity,
            styleEntity : styleEntity
        };
    }

    // Ensure Specs/Data/KML/unsupported.kml is kept up to date with these supported types
    var featureTypes = {
        Document : processDocument,
        Folder : processFolder,
        Placemark : processPlacemark,
        NetworkLink : processNetworkLink,
        GroundOverlay : processGroundOverlay,
        PhotoOverlay : processUnsupportedFeature,
        ScreenOverlay : processUnsupportedFeature,
        Tour : processTour
    };

    function processDocument(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        var featureTypeNames = Object.keys(featureTypes);
        var featureTypeNamesLength = featureTypeNames.length;

        for (var i = 0; i < featureTypeNamesLength; i++) {
            var featureName = featureTypeNames[i];
            var processFeatureNode = featureTypes[featureName];

            var childNodes = node.childNodes;
            var length = childNodes.length;
            for (var q = 0; q < length; q++) {
                var child = childNodes[q];
                if (child.localName === featureName &&
                    ((namespaces.kml.indexOf(child.namespaceURI) !== -1) || (namespaces.gx.indexOf(child.namespaceURI) !== -1))) {
                    processFeatureNode(dataSource, parent, child, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
                }
            }
        }
    }

    function processFolder(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        var r = processFeature(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
        processDocument(dataSource, r.entity, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
    }

    function processPlacemark(dataSource, parent, placemark, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        var r = processFeature(dataSource, parent, placemark, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
        var entity = r.entity;
        var styleEntity = r.styleEntity;

        var hasGeometry = false;
        var childNodes = placemark.childNodes;
        for (var i = 0, len = childNodes.length; i < len && !hasGeometry; i++) {
            var childNode = childNodes.item(i);
            var geometryProcessor = geometryTypes[childNode.localName];
            if (defined(geometryProcessor)) {
                // pass the placemark entity id as a context for case of defining multiple child entities together to handle case
                // where some malformed kmls reuse the same id across placemarks, which works in GE, but is not technically to spec.
                geometryProcessor(dataSource, entityCollection, childNode, entity, styleEntity, entity.id);
                hasGeometry = true;
            }
        }

        if (!hasGeometry) {
            entity.merge(styleEntity);
            processPositionGraphics(dataSource, entity, styleEntity);
        }
    }

    var playlistNodeProcessors = {
        FlyTo: processTourFlyTo,
        Wait: processTourWait,
        SoundCue: processTourUnsupportedNode,
        AnimatedUpdate: processTourUnsupportedNode,
        TourControl: processTourUnsupportedNode
    };

    function processTour(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        var name = queryStringValue(node, 'name', namespaces.kml);
        var id = queryStringAttribute(node, 'id');
        var tour = new KmlTour(name, id);

        var playlistNode = queryFirstNode(node, 'Playlist', namespaces.gx);
        if(playlistNode) {
            var ellipsoid = dataSource._ellipsoid;
            var childNodes = playlistNode.childNodes;
            for(var i = 0; i < childNodes.length; i++) {
                var entryNode = childNodes[i];
                if (entryNode.localName) {
                    var playlistNodeProcessor = playlistNodeProcessors[entryNode.localName];
                    if (playlistNodeProcessor) {
                        playlistNodeProcessor(tour, entryNode, ellipsoid);
                    }
                    else {
                        console.log('Unknown KML Tour playlist entry type ' + entryNode.localName);
                    }
                }
            }
        }

        if (!defined(dataSource.kmlTours)) {
            dataSource.kmlTours = [];
        }

        dataSource.kmlTours.push(tour);
    }

    function processTourUnsupportedNode(tour, entryNode) {
        oneTimeWarning('KML Tour unsupported node ' + entryNode.localName);
    }

    function processTourWait(tour, entryNode) {
        var duration = queryNumericValue(entryNode, 'duration', namespaces.gx);
        tour.addPlaylistEntry(new KmlTourWait(duration));
    }

    function processTourFlyTo(tour, entryNode, ellipsoid) {
        var duration = queryNumericValue(entryNode, 'duration', namespaces.gx);
        var flyToMode = queryStringValue(entryNode, 'flyToMode', namespaces.gx);

        var t = {kml: {}};

        processLookAt(entryNode, t, ellipsoid);
        processCamera(entryNode, t, ellipsoid);

        var view = t.kml.lookAt || t.kml.camera;

        var flyto = new KmlTourFlyTo(duration, flyToMode, view);
        tour.addPlaylistEntry(flyto);
    }

    function processCamera(featureNode, entity, ellipsoid) {
        var camera = queryFirstNode(featureNode, 'Camera', namespaces.kml);
        if(defined(camera)) {
            var lon = defaultValue(queryNumericValue(camera, 'longitude', namespaces.kml), 0.0);
            var lat = defaultValue(queryNumericValue(camera, 'latitude', namespaces.kml), 0.0);
            var altitude = defaultValue(queryNumericValue(camera, 'altitude', namespaces.kml), 0.0);

            var heading = defaultValue(queryNumericValue(camera, 'heading', namespaces.kml), 0.0);
            var tilt = defaultValue(queryNumericValue(camera, 'tilt', namespaces.kml), 0.0);
            var roll = defaultValue(queryNumericValue(camera, 'roll', namespaces.kml), 0.0);

            var position = Cartesian3.fromDegrees(lon, lat, altitude, ellipsoid);
            var hpr = HeadingPitchRoll.fromDegrees(heading, tilt - 90.0, roll);

            entity.kml.camera = new KmlCamera(position, hpr);
        }
    }

    function processLookAt(featureNode, entity, ellipsoid) {
        var lookAt = queryFirstNode(featureNode, 'LookAt', namespaces.kml);
        if(defined(lookAt)) {
            var lon = defaultValue(queryNumericValue(lookAt, 'longitude', namespaces.kml), 0.0);
            var lat = defaultValue(queryNumericValue(lookAt, 'latitude', namespaces.kml), 0.0);
            var altitude = defaultValue(queryNumericValue(lookAt, 'altitude', namespaces.kml), 0.0);
            var heading = queryNumericValue(lookAt, 'heading', namespaces.kml);
            var tilt = queryNumericValue(lookAt, 'tilt', namespaces.kml);
            var range = defaultValue(queryNumericValue(lookAt, 'range', namespaces.kml), 0.0);

            tilt = CesiumMath.toRadians(defaultValue(tilt, 0.0));
            heading = CesiumMath.toRadians(defaultValue(heading, 0.0));

            var hpr = new HeadingPitchRange(heading, tilt - CesiumMath.PI_OVER_TWO, range);
            var viewPoint = Cartesian3.fromDegrees(lon, lat, altitude, ellipsoid);

            entity.kml.lookAt = new KmlLookAt(viewPoint, hpr);
        }
    }

    function processGroundOverlay(dataSource, parent, groundOverlay, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        var r = processFeature(dataSource, parent, groundOverlay, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
        var entity = r.entity;

        var geometry;
        var isLatLonQuad = false;

        var ellipsoid = dataSource._ellipsoid;
        var positions = readCoordinates(queryFirstNode(groundOverlay, 'LatLonQuad', namespaces.gx), ellipsoid);
        var zIndex = queryNumericValue(groundOverlay, 'drawOrder', namespaces.kml);
        if (defined(positions)) {
            geometry = createDefaultPolygon();
            geometry.hierarchy = new PolygonHierarchy(positions);
            geometry.zIndex = zIndex;
            entity.polygon = geometry;
            isLatLonQuad = true;
        } else {
            geometry = new RectangleGraphics();
            geometry.zIndex = zIndex;
            entity.rectangle = geometry;

            var latLonBox = queryFirstNode(groundOverlay, 'LatLonBox', namespaces.kml);
            if (defined(latLonBox)) {
                var west = queryNumericValue(latLonBox, 'west', namespaces.kml);
                var south = queryNumericValue(latLonBox, 'south', namespaces.kml);
                var east = queryNumericValue(latLonBox, 'east', namespaces.kml);
                var north = queryNumericValue(latLonBox, 'north', namespaces.kml);

                if (defined(west)) {
                    west = CesiumMath.negativePiToPi(CesiumMath.toRadians(west));
                }
                if (defined(south)) {
                    south = CesiumMath.clampToLatitudeRange(CesiumMath.toRadians(south));
                }
                if (defined(east)) {
                    east = CesiumMath.negativePiToPi(CesiumMath.toRadians(east));
                }
                if (defined(north)) {
                    north = CesiumMath.clampToLatitudeRange(CesiumMath.toRadians(north));
                }
                geometry.coordinates = new Rectangle(west, south, east, north);

                var rotation = queryNumericValue(latLonBox, 'rotation', namespaces.kml);
                if (defined(rotation)) {
                    var rotationRadians = CesiumMath.toRadians(rotation);
                    geometry.rotation = rotationRadians;
                    geometry.stRotation = rotationRadians;
                }
            }
        }

        var iconNode = queryFirstNode(groundOverlay, 'Icon', namespaces.kml);
        var href = getIconHref(iconNode, dataSource, sourceResource, uriResolver, true);
        if (defined(href)) {
            if (isLatLonQuad) {
                oneTimeWarning('kml-gx:LatLonQuad', 'KML - gx:LatLonQuad Icon does not support texture projection.');
            }
            var x = queryNumericValue(iconNode, 'x', namespaces.gx);
            var y = queryNumericValue(iconNode, 'y', namespaces.gx);
            var w = queryNumericValue(iconNode, 'w', namespaces.gx);
            var h = queryNumericValue(iconNode, 'h', namespaces.gx);

            if (defined(x) || defined(y) || defined(w) || defined(h)) {
                oneTimeWarning('kml-groundOverlay-xywh', 'KML - gx:x, gx:y, gx:w, gx:h aren\'t supported for GroundOverlays');
            }

            geometry.material = href;
            geometry.material.color = queryColorValue(groundOverlay, 'color', namespaces.kml);
            geometry.material.transparent = true;
        } else {
            geometry.material = queryColorValue(groundOverlay, 'color', namespaces.kml);
        }

        var altitudeMode = queryStringValue(groundOverlay, 'altitudeMode', namespaces.kml);

        if (defined(altitudeMode)) {
            if (altitudeMode === 'absolute') {
                //Use height above ellipsoid until we support MSL.
                geometry.height = queryNumericValue(groundOverlay, 'altitude', namespaces.kml);
                geometry.zIndex = undefined;
            } else if (altitudeMode !== 'clampToGround') {
                oneTimeWarning('kml-altitudeMode-unknown', 'KML - Unknown altitudeMode: ' + altitudeMode);
            }
            // else just use the default of 0 until we support 'clampToGround'
        } else {
            altitudeMode = queryStringValue(groundOverlay, 'altitudeMode', namespaces.gx);
            if (altitudeMode === 'relativeToSeaFloor') {
                oneTimeWarning('kml-altitudeMode-relativeToSeaFloor', 'KML - altitudeMode relativeToSeaFloor is currently not supported, treating as absolute.');
                geometry.height = queryNumericValue(groundOverlay, 'altitude', namespaces.kml);
                geometry.zIndex = undefined;
            } else if (altitudeMode === 'clampToSeaFloor') {
                oneTimeWarning('kml-altitudeMode-clampToSeaFloor', 'KML - altitudeMode clampToSeaFloor is currently not supported, treating as clampToGround.');
            } else if (defined(altitudeMode)) {
                oneTimeWarning('kml-altitudeMode-unknown', 'KML - Unknown altitudeMode: ' + altitudeMode);
            }
        }
    }

    function processUnsupportedFeature(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        dataSource._unsupportedNode.raiseEvent(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver);
        oneTimeWarning('kml-unsupportedFeature-' + node.nodeName, 'KML - Unsupported feature: ' + node.nodeName);
    }

    var RefreshMode = {
        INTERVAL : 0,
        EXPIRE : 1,
        STOP : 2
    };

    function cleanupString(s) {
        if (!defined(s) || s.length === 0) {
            return '';
        }

        var sFirst = s[0];
        if (sFirst === '&' || sFirst === '?') {
            s = s.substring(1);
        }

        return s;
    }

    var zeroRectangle = new Rectangle();
    var scratchCartographic = new Cartographic();
    var scratchCartesian2 = new Cartesian2();
    var scratchCartesian3 = new Cartesian3();

    function processNetworkLinkQueryString(resource, camera, canvas, viewBoundScale, bbox, ellipsoid) {
        function fixLatitude(value) {
            if (value < -CesiumMath.PI_OVER_TWO) {
                return -CesiumMath.PI_OVER_TWO;
            } else if (value > CesiumMath.PI_OVER_TWO) {
                return CesiumMath.PI_OVER_TWO;
            }
            return value;
        }

        function fixLongitude(value) {
            if (value > CesiumMath.PI) {
                return value - CesiumMath.TWO_PI;
            } else if (value < -CesiumMath.PI) {
                return value + CesiumMath.TWO_PI;
            }

            return value;
        }

        var queryString = objectToQuery(resource.queryParameters);

        // objectToQuery escapes [ and ], so fix that
        queryString = queryString.replace(/%5B/g, '[').replace(/%5D/g, ']');

        if (defined(camera) && camera._mode !== SceneMode.MORPHING) {
            var centerCartesian;
            var centerCartographic;

            bbox = defaultValue(bbox, zeroRectangle);
            if (defined(canvas)) {
                scratchCartesian2.x = canvas.clientWidth * 0.5;
                scratchCartesian2.y = canvas.clientHeight * 0.5;
                centerCartesian = camera.pickEllipsoid(scratchCartesian2, ellipsoid, scratchCartesian3);
            }

            if (defined(centerCartesian)) {
                centerCartographic = ellipsoid.cartesianToCartographic(centerCartesian, scratchCartographic);
            } else {
                centerCartographic = Rectangle.center(bbox, scratchCartographic);
                centerCartesian = ellipsoid.cartographicToCartesian(centerCartographic);
            }

            if (defined(viewBoundScale) && !CesiumMath.equalsEpsilon(viewBoundScale, 1.0, CesiumMath.EPSILON9)) {
                var newHalfWidth = bbox.width * viewBoundScale * 0.5;
                var newHalfHeight = bbox.height * viewBoundScale * 0.5;
                bbox = new Rectangle(fixLongitude(centerCartographic.longitude - newHalfWidth),
                    fixLatitude(centerCartographic.latitude - newHalfHeight),
                    fixLongitude(centerCartographic.longitude + newHalfWidth),
                    fixLatitude(centerCartographic.latitude + newHalfHeight)
                );
            }

            queryString = queryString.replace('[bboxWest]', CesiumMath.toDegrees(bbox.west).toString());
            queryString = queryString.replace('[bboxSouth]', CesiumMath.toDegrees(bbox.south).toString());
            queryString = queryString.replace('[bboxEast]', CesiumMath.toDegrees(bbox.east).toString());
            queryString = queryString.replace('[bboxNorth]', CesiumMath.toDegrees(bbox.north).toString());

            var lon = CesiumMath.toDegrees(centerCartographic.longitude).toString();
            var lat = CesiumMath.toDegrees(centerCartographic.latitude).toString();
            queryString = queryString.replace('[lookatLon]', lon);
            queryString = queryString.replace('[lookatLat]', lat);
            queryString = queryString.replace('[lookatTilt]', CesiumMath.toDegrees(camera.pitch).toString());
            queryString = queryString.replace('[lookatHeading]', CesiumMath.toDegrees(camera.heading).toString());
            queryString = queryString.replace('[lookatRange]', Cartesian3.distance(camera.positionWC, centerCartesian));
            queryString = queryString.replace('[lookatTerrainLon]', lon);
            queryString = queryString.replace('[lookatTerrainLat]', lat);
            queryString = queryString.replace('[lookatTerrainAlt]', centerCartographic.height.toString());

            ellipsoid.cartesianToCartographic(camera.positionWC, scratchCartographic);
            queryString = queryString.replace('[cameraLon]', CesiumMath.toDegrees(scratchCartographic.longitude).toString());
            queryString = queryString.replace('[cameraLat]', CesiumMath.toDegrees(scratchCartographic.latitude).toString());
            queryString = queryString.replace('[cameraAlt]', CesiumMath.toDegrees(scratchCartographic.height).toString());

            var frustum = camera.frustum;
            var aspectRatio = frustum.aspectRatio;
            var horizFov = '';
            var vertFov = '';
            if (defined(aspectRatio)) {
                var fov = CesiumMath.toDegrees(frustum.fov);
                if (aspectRatio > 1.0) {
                    horizFov = fov;
                    vertFov = fov / aspectRatio;
                } else {
                    vertFov = fov;
                    horizFov = fov * aspectRatio;
                }
            }
            queryString = queryString.replace('[horizFov]', horizFov.toString());
            queryString = queryString.replace('[vertFov]', vertFov.toString());
        } else {
            queryString = queryString.replace('[bboxWest]', '-180');
            queryString = queryString.replace('[bboxSouth]', '-90');
            queryString = queryString.replace('[bboxEast]', '180');
            queryString = queryString.replace('[bboxNorth]', '90');

            queryString = queryString.replace('[lookatLon]', '');
            queryString = queryString.replace('[lookatLat]', '');
            queryString = queryString.replace('[lookatRange]', '');
            queryString = queryString.replace('[lookatTilt]', '');
            queryString = queryString.replace('[lookatHeading]', '');
            queryString = queryString.replace('[lookatTerrainLon]', '');
            queryString = queryString.replace('[lookatTerrainLat]', '');
            queryString = queryString.replace('[lookatTerrainAlt]', '');

            queryString = queryString.replace('[cameraLon]', '');
            queryString = queryString.replace('[cameraLat]', '');
            queryString = queryString.replace('[cameraAlt]', '');
            queryString = queryString.replace('[horizFov]', '');
            queryString = queryString.replace('[vertFov]', '');
        }

        if (defined(canvas)) {
            queryString = queryString.replace('[horizPixels]', canvas.clientWidth);
            queryString = queryString.replace('[vertPixels]', canvas.clientHeight);
        } else {
            queryString = queryString.replace('[horizPixels]', '');
            queryString = queryString.replace('[vertPixels]', '');
        }

        queryString = queryString.replace('[terrainEnabled]', '1');
        queryString = queryString.replace('[clientVersion]', '1');
        queryString = queryString.replace('[kmlVersion]', '2.2');
        queryString = queryString.replace('[clientName]', 'Cesium');
        queryString = queryString.replace('[language]', 'English');

        resource.setQueryParameters(queryToObject(queryString));
    }

    function processNetworkLink(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        var r = processFeature(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
        var networkEntity = r.entity;

        var link = queryFirstNode(node, 'Link', namespaces.kml);

        if (!defined(link)) {
            link = queryFirstNode(node, 'Url', namespaces.kml);
        }
        if (defined(link)) {
            var href = queryStringValue(link, 'href', namespaces.kml);
            var viewRefreshMode;
            var viewBoundScale;
            if (defined(href)) {
                var newSourceUri = href;
                href = resolveHref(href, sourceResource, uriResolver);

                // We need to pass in the original path if resolveHref returns a data uri because the network link
                //  references a document in a KMZ archive
                if (/^data:/.test(href.getUrlComponent())) {
                    // So if sourceUri isn't the kmz file, then its another kml in the archive, so resolve it
                    if (!/\.kmz/i.test(sourceResource.getUrlComponent())) {
                        newSourceUri = sourceResource.getDerivedResource({
                            url: newSourceUri
                        });
                    }
                } else {
                    newSourceUri = href.clone(); // Not a data uri so use the fully qualified uri
                    viewRefreshMode = queryStringValue(link, 'viewRefreshMode', namespaces.kml);
                    viewBoundScale = defaultValue(queryStringValue(link, 'viewBoundScale', namespaces.kml), 1.0);
                    var defaultViewFormat = (viewRefreshMode === 'onStop') ? 'BBOX=[bboxWest],[bboxSouth],[bboxEast],[bboxNorth]' : '';
                    var viewFormat = defaultValue(queryStringValue(link, 'viewFormat', namespaces.kml), defaultViewFormat);
                    var httpQuery = queryStringValue(link, 'httpQuery', namespaces.kml);
                    if (defined(viewFormat)) {
                        href.setQueryParameters(queryToObject(cleanupString(viewFormat)));
                    }
                    if (defined(httpQuery)) {
                        href.setQueryParameters(queryToObject(cleanupString(httpQuery)));
                    }

                    var ellipsoid = dataSource._ellipsoid;
                    processNetworkLinkQueryString(href, dataSource._camera, dataSource._canvas, viewBoundScale, dataSource._lastCameraView.bbox, ellipsoid);
                }

                var options = {
                    sourceUri : newSourceUri,
                    uriResolver : uriResolver,
                    context : networkEntity.id
                };
                var networkLinkCollection = new EntityCollection();
                var promise = load(dataSource, networkLinkCollection, href, options).then(function(rootElement) {
                    var entities = dataSource._entityCollection;
                    var newEntities = networkLinkCollection.values;
                    entities.suspendEvents();
                    for (var i = 0; i < newEntities.length; i++) {
                        var newEntity = newEntities[i];
                        if (!defined(newEntity.parent)) {
                            newEntity.parent = networkEntity;
                            mergeAvailabilityWithParent(newEntity);
                        }

                        entities.add(newEntity);
                    }
                    entities.resumeEvents();

                    // Add network links to a list if we need they will need to be updated
                    var refreshMode = queryStringValue(link, 'refreshMode', namespaces.kml);
                    var refreshInterval = defaultValue(queryNumericValue(link, 'refreshInterval', namespaces.kml), 0);
                    if ((refreshMode === 'onInterval' && refreshInterval > 0 ) || (refreshMode === 'onExpire') || (viewRefreshMode === 'onStop')) {
                        var networkLinkControl = queryFirstNode(rootElement, 'NetworkLinkControl', namespaces.kml);
                        var hasNetworkLinkControl = defined(networkLinkControl);

                        var now = JulianDate.now();
                        var networkLinkInfo = {
                            id : createGuid(),
                            href : href,
                            cookie : {},
                            lastUpdated : now,
                            updating : false,
                            entity : networkEntity,
                            viewBoundScale : viewBoundScale,
                            needsUpdate : false,
                            cameraUpdateTime : now
                        };

                        var minRefreshPeriod = 0;
                        if (hasNetworkLinkControl) {
                            networkLinkInfo.cookie = queryToObject(defaultValue(queryStringValue(networkLinkControl, 'cookie', namespaces.kml), ''));
                            minRefreshPeriod = defaultValue(queryNumericValue(networkLinkControl, 'minRefreshPeriod', namespaces.kml), 0);
                        }

                        if (refreshMode === 'onInterval') {
                            if (hasNetworkLinkControl) {
                                refreshInterval = Math.max(minRefreshPeriod, refreshInterval);
                            }
                            networkLinkInfo.refreshMode = RefreshMode.INTERVAL;
                            networkLinkInfo.time = refreshInterval;
                        } else if (refreshMode === 'onExpire') {
                            var expires;
                            if (hasNetworkLinkControl) {
                                expires = queryStringValue(networkLinkControl, 'expires', namespaces.kml);
                            }
                            if (defined(expires)) {
                                try {
                                    var date = JulianDate.fromIso8601(expires);
                                    var diff = JulianDate.secondsDifference(date, now);
                                    if (diff > 0 && diff < minRefreshPeriod) {
                                        JulianDate.addSeconds(now, minRefreshPeriod, date);
                                    }
                                    networkLinkInfo.refreshMode = RefreshMode.EXPIRE;
                                    networkLinkInfo.time = date;
                                } catch (e) {
                                    oneTimeWarning('kml-refreshMode-onInterval-onExpire', 'KML - NetworkLinkControl expires is not a valid date');
                                }
                            } else {
                                oneTimeWarning('kml-refreshMode-onExpire', 'KML - refreshMode of onExpire requires the NetworkLinkControl to have an expires element');
                            }
                        } else if (dataSource._camera) { // Only allow onStop refreshes if we have a camera
                            networkLinkInfo.refreshMode = RefreshMode.STOP;
                            networkLinkInfo.time = defaultValue(queryNumericValue(link, 'viewRefreshTime', namespaces.kml), 0);
                        } else {
                            oneTimeWarning('kml-refrehMode-onStop-noCamera', 'A NetworkLink with viewRefreshMode=onStop requires a camera be passed in when creating the KmlDataSource');
                        }

                        if (defined(networkLinkInfo.refreshMode)) {
                            dataSource._networkLinks.set(networkLinkInfo.id, networkLinkInfo);
                        }
                    } else if (viewRefreshMode === 'onRegion') {
                        oneTimeWarning('kml-refrehMode-onRegion', 'KML - Unsupported viewRefreshMode: onRegion');
                    }
                }).otherwise(function(error) {
                    oneTimeWarning('An error occured during loading ' + href.url);
                    dataSource._error.raiseEvent(dataSource, error);
                });

                promises.push(promise);
            }
        }
    }

    function processFeatureNode(dataSource, node, parent, entityCollection, styleCollection, sourceResource, uriResolver, promises, context) {
        var featureProcessor = featureTypes[node.localName];
        if (defined(featureProcessor)) {
            featureProcessor(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
        } else {
            processUnsupportedFeature(dataSource, parent, node, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
        }
    }

    function loadKml(dataSource, entityCollection, kml, sourceResource, uriResolver, context) {
        entityCollection.removeAll();

        var promises = [];
        var documentElement = kml.documentElement;
        var document = documentElement.localName === 'Document' ? documentElement : queryFirstNode(documentElement, 'Document', namespaces.kml);
        var name = queryStringValue(document, 'name', namespaces.kml);
        if (!defined(name)) {
            name = getFilenameFromUri(sourceResource.getUrlComponent());
        }

        // Only set the name from the root document
        if (!defined(dataSource._name)) {
            dataSource._name = name;
        }

        var styleCollection = new EntityCollection(dataSource);
        return when.all(processStyles(dataSource, kml, styleCollection, sourceResource, false, uriResolver)).then(function() {
            var element = kml.documentElement;
            if (element.localName === 'kml') {
                var childNodes = element.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    var tmp = childNodes[i];
                    if (defined(featureTypes[tmp.localName])) {
                        element = tmp;
                        break;
                    }
                }
            }
            entityCollection.suspendEvents();
            processFeatureNode(dataSource, element, undefined, entityCollection, styleCollection, sourceResource, uriResolver, promises, context);
            entityCollection.resumeEvents();

            return when.all(promises).then(function() {
                return kml.documentElement;
            });
        });
    }

    function loadKmz(dataSource, entityCollection, blob, sourceResource) {
        var deferred = when.defer();
        zip.createReader(new zip.BlobReader(blob), function(reader) {
            reader.getEntries(function(entries) {
                var promises = [];
                var uriResolver = {};
                var docEntry;
                var docDefer;
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    if (!entry.directory) {
                        var innerDefer = when.defer();
                        promises.push(innerDefer.promise);
                        if (/\.kml$/i.test(entry.filename)) {
                            // We use the first KML document we come across
                            //  https://developers.google.com/kml/documentation/kmzarchives
                            // Unless we come across a .kml file at the root of the archive because GE does this
                            if (!defined(docEntry) || !/\//i.test(entry.filename)) {
                                if (defined(docEntry)) {
                                    // We found one at the root so load the initial kml as a data uri
                                    loadDataUriFromZip(docEntry, uriResolver, docDefer);
                                }
                                docEntry = entry;
                                docDefer = innerDefer;
                            } else {
                                // Wasn't the first kml and wasn't at the root
                                loadDataUriFromZip(entry, uriResolver, innerDefer);
                            }
                        } else {
                            loadDataUriFromZip(entry, uriResolver, innerDefer);
                        }
                    }
                }

                // Now load the root KML document
                if (defined(docEntry)) {
                    loadXmlFromZip(docEntry, uriResolver, docDefer);
                }
                when.all(promises).then(function() {
                    reader.close();
                    if (!defined(uriResolver.kml)) {
                        deferred.reject(new RuntimeError('KMZ file does not contain a KML document.'));
                        return;
                    }
                    uriResolver.keys = Object.keys(uriResolver);
                    return loadKml(dataSource, entityCollection, uriResolver.kml, sourceResource, uriResolver);
                }).then(deferred.resolve).otherwise(deferred.reject);
            });
        }, function(e) {
            deferred.reject(e);
        });

        return deferred.promise;
    }

    function load(dataSource, entityCollection, data, options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);
        var sourceUri = options.sourceUri;
        var uriResolver = options.uriResolver;
        var context = options.context;

        var promise = data;
        if (typeof data === 'string' || (data instanceof Resource)) {
            data = Resource.createIfNeeded(data);
            promise = data.fetchBlob();
            sourceUri = defaultValue(sourceUri, data.clone());
        } else {
            sourceUri = defaultValue(sourceUri, Resource.DEFAULT.clone());
        }

        sourceUri = Resource.createIfNeeded(sourceUri);

        return when(promise)
            .then(function(dataToLoad) {
                if (dataToLoad instanceof Blob) {
                    return isZipFile(dataToLoad).then(function(isZip) {
                        if (isZip) {
                            return loadKmz(dataSource, entityCollection, dataToLoad, sourceUri);
                        }
                        return readBlobAsText(dataToLoad).then(function(text) {
                            //There's no official way to validate if a parse was successful.
                            //The following check detects the error on various browsers.

                            //Insert missing namespaces
                            text = insertNamespaces(text);

                            //Remove Duplicate Namespaces
                            text = removeDuplicateNamespaces(text);

                            //IE raises an exception
                            var kml;
                            var error;
                            try {
                                kml = parser.parseFromString(text, 'application/xml');
                            } catch (e) {
                                error = e.toString();
                            }

                            //The parse succeeds on Chrome and Firefox, but the error
                            //handling is different in each.
                            if (defined(error) || kml.body || kml.documentElement.tagName === 'parsererror') {
                                //Firefox has error information as the firstChild nodeValue.
                                var msg = defined(error) ? error : kml.documentElement.firstChild.nodeValue;

                                //Chrome has it in the body text.
                                if (!msg) {
                                    msg = kml.body.innerText;
                                }

                                //Return the error
                                throw new RuntimeError(msg);
                            }
                            return loadKml(dataSource, entityCollection, kml, sourceUri, uriResolver, context);
                        });
                    });
                }
                return loadKml(dataSource, entityCollection, dataToLoad, sourceUri, uriResolver, context);
            })
            .otherwise(function(error) {
                dataSource._error.raiseEvent(dataSource, error);
                console.log(error);
                return when.reject(error);
            });
    }

    /**
     * A {@link DataSource} which processes Keyhole Markup Language 2.2 (KML).
     * <p>
     * KML support in Cesium is incomplete, but a large amount of the standard,
     * as well as Google's <code>gx</code> extension namespace, is supported. See Github issue
     * {@link https://github.com/AnalyticalGraphicsInc/cesium/issues/873|#873} for a
     * detailed list of what is and isn't support. Cesium will also write information to the
     * console when it encounters most unsupported features.
     * </p>
     * <p>
     * Non visual feature data, such as <code>atom:author</code> and <code>ExtendedData</code>
     * is exposed via an instance of {@link KmlFeatureData}, which is added to each {@link Entity}
     * under the <code>kml</code> property.
     * </p>
     *
     * @alias KmlDataSource
     * @constructor
     *
     * @param {Object} options An object with the following properties:
     * @param {Camera} options.camera The camera that is used for viewRefreshModes and sending camera properties to network links.
     * @param {Canvas} options.canvas The canvas that is used for sending viewer properties to network links.
     * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The global ellipsoid used for geographical calculations.
     *
     * @see {@link http://www.opengeospatial.org/standards/kml/|Open Geospatial Consortium KML Standard}
     * @see {@link https://developers.google.com/kml/|Google KML Documentation}
     *
     * @demo {@link https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=KML.html|Cesium Sandcastle KML Demo}
     *
     * @example
     * var viewer = new Cesium.Viewer('cesiumContainer');
     * viewer.dataSources.add(Cesium.KmlDataSource.load('../../SampleData/facilities.kmz',
     *      {
     *           camera: viewer.scene.camera,
     *           canvas: viewer.scene.canvas
     *      })
     * );
     */
    function KmlDataSource(options) {
        options = defaultValue(options, {});
        var camera = options.camera;
        var canvas = options.canvas;

        

        this._changed = new Event();
        this._error = new Event();
        this._loading = new Event();
        this._refresh = new Event();
        this._unsupportedNode = new Event();

        this._clock = undefined;
        this._entityCollection = new EntityCollection(this);
        this._name = undefined;
        this._isLoading = false;
        this._pinBuilder = new PinBuilder();
        this._networkLinks = new AssociativeArray();
        this._entityCluster = new EntityCluster();

        this._canvas = canvas;
        this._camera = camera;
        this._lastCameraView = {
            position : defined(camera) ? Cartesian3.clone(camera.positionWC) : undefined,
            direction : defined(camera) ? Cartesian3.clone(camera.directionWC) : undefined,
            up : defined(camera) ? Cartesian3.clone(camera.upWC) : undefined,
            bbox : defined(camera) ? camera.computeViewRectangle() : Rectangle.clone(Rectangle.MAX_VALUE)
        };

        this._ellipsoid = defaultValue(options.ellipsoid, Ellipsoid.WGS84);
    }

    /**
     * Creates a Promise to a new instance loaded with the provided KML data.
     *
     * @param {Resource|String|Document|Blob} data A url, parsed KML document, or Blob containing binary KMZ data or a parsed KML document.
     * @param {Object} options An object with the following properties:
     * @param {Camera} options.camera The camera that is used for viewRefreshModes and sending camera properties to network links.
     * @param {Canvas} options.canvas The canvas that is used for sending viewer properties to network links.
     * @param {String} [options.sourceUri] Overrides the url to use for resolving relative links and other KML network features.
     * @param {Boolean} [options.clampToGround=false] true if we want the geometry features (Polygons, LineStrings and LinearRings) clamped to the ground.
     * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The global ellipsoid used for geographical calculations.
     *
     * @returns {Promise.<KmlDataSource>} A promise that will resolve to a new KmlDataSource instance once the KML is loaded.
     */
    KmlDataSource.load = function(data, options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);
        var dataSource = new KmlDataSource(options);
        return dataSource.load(data, options);
    };

    defineProperties(KmlDataSource.prototype, {
        /**
         * Gets or sets a human-readable name for this instance.
         * This will be automatically be set to the KML document name on load.
         * @memberof KmlDataSource.prototype
         * @type {String}
         */
        name : {
            get : function() {
                return this._name;
            },
            set : function(value) {
                if (this._name !== value) {
                    this._name = value;
                    this._changed.raiseEvent(this);
                }
            }
        },
        /**
         * Gets the clock settings defined by the loaded KML. This represents the total
         * availability interval for all time-dynamic data. If the KML does not contain
         * time-dynamic data, this value is undefined.
         * @memberof KmlDataSource.prototype
         * @type {DataSourceClock}
         */
        clock : {
            get : function() {
                return this._clock;
            }
        },
        /**
         * Gets the collection of {@link Entity} instances.
         * @memberof KmlDataSource.prototype
         * @type {EntityCollection}
         */
        entities : {
            get : function() {
                return this._entityCollection;
            }
        },
        /**
         * Gets a value indicating if the data source is currently loading data.
         * @memberof KmlDataSource.prototype
         * @type {Boolean}
         */
        isLoading : {
            get : function() {
                return this._isLoading;
            }
        },
        /**
         * Gets an event that will be raised when the underlying data changes.
         * @memberof KmlDataSource.prototype
         * @type {Event}
         */
        changedEvent : {
            get : function() {
                return this._changed;
            }
        },
        /**
         * Gets an event that will be raised if an error is encountered during processing.
         * @memberof KmlDataSource.prototype
         * @type {Event}
         */
        errorEvent : {
            get : function() {
                return this._error;
            }
        },
        /**
         * Gets an event that will be raised when the data source either starts or stops loading.
         * @memberof KmlDataSource.prototype
         * @type {Event}
         */
        loadingEvent : {
            get : function() {
                return this._loading;
            }
        },
        /**
         * Gets an event that will be raised when the data source refreshes a network link.
         * @memberof KmlDataSource.prototype
         * @type {Event}
         */
        refreshEvent : {
            get : function() {
                return this._refresh;
            }
        },
        /**
         * Gets an event that will be raised when the data source finds an unsupported node type.
         * @memberof KmlDataSource.prototype
         * @type {Event}
         */
        unsupportedNodeEvent : {
            get : function() {
                return this._unsupportedNode;
            }
        },
        /**
         * Gets whether or not this data source should be displayed.
         * @memberof KmlDataSource.prototype
         * @type {Boolean}
         */
        show : {
            get : function() {
                return this._entityCollection.show;
            },
            set : function(value) {
                this._entityCollection.show = value;
            }
        },

        /**
         * Gets or sets the clustering options for this data source. This object can be shared between multiple data sources.
         *
         * @memberof KmlDataSource.prototype
         * @type {EntityCluster}
         */
        clustering : {
            get : function() {
                return this._entityCluster;
            },
            set : function(value) {
                
                this._entityCluster = value;
            }
        }
    });

    /**
     * Asynchronously loads the provided KML data, replacing any existing data.
     *
     * @param {Resource|String|Document|Blob} data A url, parsed KML document, or Blob containing binary KMZ data or a parsed KML document.
     * @param {Object} [options] An object with the following properties:
     * @param {Resource|String} [options.sourceUri] Overrides the url to use for resolving relative links and other KML network features.
     * @param {Boolean} [options.clampToGround=false] true if we want the geometry features (Polygons, LineStrings and LinearRings) clamped to the ground. If true, lines will use corridors so use Entity.corridor instead of Entity.polyline.
     * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The global ellipsoid used for geographical calculations.
     *
     * @returns {Promise.<KmlDataSource>} A promise that will resolve to this instances once the KML is loaded.
     */
    KmlDataSource.prototype.load = function(data, options) {
        

        options = defaultValue(options, {});
        DataSource.setLoading(this, true);

        var oldName = this._name;
        this._name = undefined;
        this._clampToGround = defaultValue(options.clampToGround, false);

        var that = this;
        return load(this, this._entityCollection, data, options).then(function() {
            var clock;

            var availability = that._entityCollection.computeAvailability();

            var start = availability.start;
            var stop = availability.stop;
            var isMinStart = JulianDate.equals(start, Iso8601.MINIMUM_VALUE);
            var isMaxStop = JulianDate.equals(stop, Iso8601.MAXIMUM_VALUE);
            if (!isMinStart || !isMaxStop) {
                var date;

                //If start is min time just start at midnight this morning, local time
                if (isMinStart) {
                    date = new Date();
                    date.setHours(0, 0, 0, 0);
                    start = JulianDate.fromDate(date);
                }

                //If stop is max value just stop at midnight tonight, local time
                if (isMaxStop) {
                    date = new Date();
                    date.setHours(24, 0, 0, 0);
                    stop = JulianDate.fromDate(date);
                }

                clock = new DataSourceClock();
                clock.startTime = start;
                clock.stopTime = stop;
                clock.currentTime = JulianDate.clone(start);
                clock.clockRange = ClockRange.LOOP_STOP;
                clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
                clock.multiplier = Math.round(Math.min(Math.max(JulianDate.secondsDifference(stop, start) / 60, 1), 3.15569e7));
            }

            var changed = false;
            if (clock !== that._clock) {
                that._clock = clock;
                changed = true;
            }

            if (oldName !== that._name) {
                changed = true;
            }

            if (changed) {
                that._changed.raiseEvent(that);
            }

            DataSource.setLoading(that, false);

            return that;
        }).otherwise(function(error) {
            DataSource.setLoading(that, false);
            that._error.raiseEvent(that, error);
            console.log(error);
            return when.reject(error);
        });
    };

    function mergeAvailabilityWithParent(child) {
        var parent = child.parent;
        if (defined(parent)) {
            var parentAvailability = parent.availability;
            if (defined(parentAvailability)) {
                var childAvailability = child.availability;
                if (defined(childAvailability)) {
                    childAvailability.intersect(parentAvailability);
                } else {
                    child.availability = parentAvailability;
                }
            }
        }
    }

    function getNetworkLinkUpdateCallback(dataSource, networkLink, newEntityCollection, networkLinks, processedHref) {
        return function(rootElement) {
            if (!networkLinks.contains(networkLink.id)) {
                // Got into the odd case where a parent network link was updated while a child
                //  network link update was in flight, so just throw it away.
                return;
            }
            var remove = false;
            var networkLinkControl = queryFirstNode(rootElement, 'NetworkLinkControl', namespaces.kml);
            var hasNetworkLinkControl = defined(networkLinkControl);

            var minRefreshPeriod = 0;
            if (hasNetworkLinkControl) {
                if (defined(queryFirstNode(networkLinkControl, 'Update', namespaces.kml))) {
                    oneTimeWarning('kml-networkLinkControl-update', 'KML - NetworkLinkControl updates aren\'t supported.');
                    networkLink.updating = false;
                    networkLinks.remove(networkLink.id);
                    return;
                }
                networkLink.cookie = queryToObject(defaultValue(queryStringValue(networkLinkControl, 'cookie', namespaces.kml), ''));
                minRefreshPeriod = defaultValue(queryNumericValue(networkLinkControl, 'minRefreshPeriod', namespaces.kml), 0);
            }

            var now = JulianDate.now();
            var refreshMode = networkLink.refreshMode;
            if (refreshMode === RefreshMode.INTERVAL) {
                if (defined(networkLinkControl)) {
                    networkLink.time = Math.max(minRefreshPeriod, networkLink.time);
                }
            } else if (refreshMode === RefreshMode.EXPIRE) {
                var expires;
                if (defined(networkLinkControl)) {
                    expires = queryStringValue(networkLinkControl, 'expires', namespaces.kml);
                }
                if (defined(expires)) {
                    try {
                        var date = JulianDate.fromIso8601(expires);
                        var diff = JulianDate.secondsDifference(date, now);
                        if (diff > 0 && diff < minRefreshPeriod) {
                            JulianDate.addSeconds(now, minRefreshPeriod, date);
                        }
                        networkLink.time = date;
                    } catch (e) {
                        oneTimeWarning('kml-networkLinkControl-expires', 'KML - NetworkLinkControl expires is not a valid date');
                        remove = true;
                    }
                } else {
                    oneTimeWarning('kml-refreshMode-onExpire', 'KML - refreshMode of onExpire requires the NetworkLinkControl to have an expires element');
                    remove = true;
                }
            }

            var networkLinkEntity = networkLink.entity;
            var entityCollection = dataSource._entityCollection;
            var newEntities = newEntityCollection.values;

            function removeChildren(entity) {
                entityCollection.remove(entity);
                var children = entity._children;
                var count = children.length;
                for (var i = 0; i < count; ++i) {
                    removeChildren(children[i]);
                }
            }

            // Remove old entities
            entityCollection.suspendEvents();
            var entitiesCopy = entityCollection.values.slice();
            var i;
            for (i = 0; i < entitiesCopy.length; ++i) {
                var entityToRemove = entitiesCopy[i];
                if (entityToRemove.parent === networkLinkEntity) {
                    entityToRemove.parent = undefined;
                    removeChildren(entityToRemove);
                }
            }
            entityCollection.resumeEvents();

            // Add new entities
            entityCollection.suspendEvents();
            for (i = 0; i < newEntities.length; i++) {
                var newEntity = newEntities[i];
                if (!defined(newEntity.parent)) {
                    newEntity.parent = networkLinkEntity;
                    mergeAvailabilityWithParent(newEntity);
                }
                entityCollection.add(newEntity);
            }
            entityCollection.resumeEvents();

            // No refresh information remove it, otherwise update lastUpdate time
            if (remove) {
                networkLinks.remove(networkLink.id);
            } else {
                networkLink.lastUpdated = now;
            }

            var availability = entityCollection.computeAvailability();

            var start = availability.start;
            var stop = availability.stop;
            var isMinStart = JulianDate.equals(start, Iso8601.MINIMUM_VALUE);
            var isMaxStop = JulianDate.equals(stop, Iso8601.MAXIMUM_VALUE);
            if (!isMinStart || !isMaxStop) {
                var clock = dataSource._clock;

                if (clock.startTime !== start || clock.stopTime !== stop) {
                    clock.startTime = start;
                    clock.stopTime = stop;
                    dataSource._changed.raiseEvent(dataSource);
                }
            }

            networkLink.updating = false;
            networkLink.needsUpdate = false;
            dataSource._refresh.raiseEvent(dataSource, processedHref.getUrlComponent(true));
        };
    }

    var entitiesToIgnore = new AssociativeArray();

    /**
     * Updates any NetworkLink that require updating
     * @function
     *
     * @param {JulianDate} time The simulation time.
     * @returns {Boolean} True if this data source is ready to be displayed at the provided time, false otherwise.
     */
    KmlDataSource.prototype.update = function(time) {
        var networkLinks = this._networkLinks;
        if (networkLinks.length === 0) {
            return true;
        }

        var now = JulianDate.now();
        var that = this;

        entitiesToIgnore.removeAll();

        function recurseIgnoreEntities(entity) {
            var children = entity._children;
            var count = children.length;
            for (var i = 0; i < count; ++i) {
                var child = children[i];
                entitiesToIgnore.set(child.id, child);
                recurseIgnoreEntities(child);
            }
        }

        var cameraViewUpdate = false;
        var lastCameraView = this._lastCameraView;
        var camera = this._camera;
        if (defined(camera) &&
            !(camera.positionWC.equalsEpsilon(lastCameraView.position, CesiumMath.EPSILON7) &&
            camera.directionWC.equalsEpsilon(lastCameraView.direction, CesiumMath.EPSILON7) &&
            camera.upWC.equalsEpsilon(lastCameraView.up, CesiumMath.EPSILON7))) {

            // Camera has changed so update the last view
            lastCameraView.position = Cartesian3.clone(camera.positionWC);
            lastCameraView.direction = Cartesian3.clone(camera.directionWC);
            lastCameraView.up = Cartesian3.clone(camera.upWC);
            lastCameraView.bbox = camera.computeViewRectangle();
            cameraViewUpdate = true;
        }

        var newNetworkLinks = new AssociativeArray();
        var changed = false;
        networkLinks.values.forEach(function(networkLink) {
            var entity = networkLink.entity;
            if (entitiesToIgnore.contains(entity.id)) {
                return;
            }

            if (!networkLink.updating) {
                var doUpdate = false;
                if (networkLink.refreshMode === RefreshMode.INTERVAL) {
                    if (JulianDate.secondsDifference(now, networkLink.lastUpdated) > networkLink.time) {
                        doUpdate = true;
                    }
                }
                else if (networkLink.refreshMode === RefreshMode.EXPIRE) {
                    if (JulianDate.greaterThan(now, networkLink.time)) {
                        doUpdate = true;
                    }

                } else if (networkLink.refreshMode === RefreshMode.STOP) {
                    if (cameraViewUpdate) {
                        networkLink.needsUpdate = true;
                        networkLink.cameraUpdateTime = now;
                    }

                    if (networkLink.needsUpdate && JulianDate.secondsDifference(now, networkLink.cameraUpdateTime) >= networkLink.time) {
                        doUpdate = true;
                    }
                }

                if (doUpdate) {
                    recurseIgnoreEntities(entity);
                    networkLink.updating = true;
                    var newEntityCollection = new EntityCollection();
                    var href = networkLink.href.clone();

                    href.setQueryParameters(networkLink.cookie);
                    var ellipsoid = defaultValue(that._ellipsoid, Ellipsoid.WGS84);
                    processNetworkLinkQueryString(href, that._camera, that._canvas, networkLink.viewBoundScale, lastCameraView.bbox, ellipsoid);

                    load(that, newEntityCollection, href, {context : entity.id})
                        .then(getNetworkLinkUpdateCallback(that, networkLink, newEntityCollection, newNetworkLinks, href))
                        .otherwise(function(error) {
                            var msg = 'NetworkLink ' + networkLink.href + ' refresh failed: ' + error;
                            console.log(msg);
                            that._error.raiseEvent(that, msg);
                        });
                    changed = true;
                }
            }
            newNetworkLinks.set(networkLink.id, networkLink);
        });

        if (changed) {
            this._networkLinks = newNetworkLinks;
            this._changed.raiseEvent(this);
        }

        return true;
    };

    /**
     * Contains KML Feature data loaded into the <code>Entity.kml</code> property by {@link KmlDataSource}.
     * @alias KmlFeatureData
     * @constructor
     */
    function KmlFeatureData() {
        /**
         * Gets the atom syndication format author field.
         * @type Object
         */
        this.author = {
            /**
             * Gets the name.
             * @type String
             * @alias author.name
             * @memberof! KmlFeatureData#
             * @property author.name
             */
            name : undefined,
            /**
             * Gets the URI.
             * @type String
             * @alias author.uri
             * @memberof! KmlFeatureData#
             * @property author.uri
             */
            uri : undefined,
            /**
             * Gets the email.
             * @type String
             * @alias author.email
             * @memberof! KmlFeatureData#
             * @property author.email
             */
            email : undefined
        };

        /**
         * Gets the link.
         * @type Object
         */
        this.link = {
            /**
             * Gets the href.
             * @type String
             * @alias link.href
             * @memberof! KmlFeatureData#
             * @property link.href
             */
            href : undefined,
            /**
             * Gets the language of the linked resource.
             * @type String
             * @alias link.hreflang
             * @memberof! KmlFeatureData#
             * @property link.hreflang
             */
            hreflang : undefined,
            /**
             * Gets the link relation.
             * @type String
             * @alias link.rel
             * @memberof! KmlFeatureData#
             * @property link.rel
             */
            rel : undefined,
            /**
             * Gets the link type.
             * @type String
             * @alias link.type
             * @memberof! KmlFeatureData#
             * @property link.type
             */
            type : undefined,
            /**
             * Gets the link title.
             * @type String
             * @alias link.title
             * @memberof! KmlFeatureData#
             * @property link.title
             */
            title : undefined,
            /**
             * Gets the link length.
             * @type String
             * @alias link.length
             * @memberof! KmlFeatureData#
             * @property link.length
             */
            length : undefined
        };

        /**
         * Gets the unstructured address field.
         * @type String
         */
        this.address = undefined;
        /**
         * Gets the phone number.
         * @type String
         */
        this.phoneNumber = undefined;
        /**
         * Gets the snippet.
         * @type String
         */
        this.snippet = undefined;
        /**
         * Gets the extended data, parsed into a JSON object.
         * Currently only the <code>Data</code> property is supported.
         * <code>SchemaData</code> and custom data are ignored.
         * @type String
         */
        this.extendedData = undefined;
    }

    return KmlDataSource;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

});
//# sourceMappingURL=0.TerriaJS-specs.js.map