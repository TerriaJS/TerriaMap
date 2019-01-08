/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
 Copyright (c) 2013 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright 
 notice, this list of conditions and the following disclaimer in 
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * This program is based on JZlib 1.0.2 ymnk, JCraft,Inc.
 * JZlib is based on zlib-1.1.3, so all credit should go authors
 * Jean-loup Gailly(jloup@gzip.org) and Mark Adler(madler@alumni.caltech.edu)
 * and contributors of zlib.
 */

(function(obj) {

	// Global
	var MAX_BITS = 15;

	var Z_OK = 0;
	var Z_STREAM_END = 1;
	var Z_NEED_DICT = 2;
	var Z_STREAM_ERROR = -2;
	var Z_DATA_ERROR = -3;
	var Z_MEM_ERROR = -4;
	var Z_BUF_ERROR = -5;

	var inflate_mask = [ 0x00000000, 0x00000001, 0x00000003, 0x00000007, 0x0000000f, 0x0000001f, 0x0000003f, 0x0000007f, 0x000000ff, 0x000001ff, 0x000003ff,
			0x000007ff, 0x00000fff, 0x00001fff, 0x00003fff, 0x00007fff, 0x0000ffff ];

	var MANY = 1440;

	// JZlib version : "1.0.2"
	var Z_NO_FLUSH = 0;
	var Z_FINISH = 4;

	// InfTree
	var fixed_bl = 9;
	var fixed_bd = 5;

	var fixed_tl = [ 96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 192, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 160, 0, 8, 0,
			0, 8, 128, 0, 8, 64, 0, 9, 224, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 144, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 208, 81, 7, 17, 0, 8, 104, 0, 8, 40,
			0, 9, 176, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 240, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 200, 81, 7, 13,
			0, 8, 100, 0, 8, 36, 0, 9, 168, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 232, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 152, 84, 7, 83, 0, 8, 124, 0, 8, 60,
			0, 9, 216, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 184, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 248, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7,
			35, 0, 8, 114, 0, 8, 50, 0, 9, 196, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 164, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 228, 80, 7, 7, 0, 8, 90, 0, 8,
			26, 0, 9, 148, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 212, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 180, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 244, 80,
			7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 204, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 172, 0, 8, 6, 0, 8, 134, 0,
			8, 70, 0, 9, 236, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 156, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 220, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 188, 0,
			8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 252, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 194, 80, 7, 10, 0, 8, 97,
			0, 8, 33, 0, 9, 162, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 226, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 146, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 210,
			81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 178, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 242, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117,
			0, 8, 53, 0, 9, 202, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 170, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 234, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 154,
			84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 218, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 186, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 250, 80, 7, 3, 0, 8, 83,
			0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 198, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 166, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 230,
			80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 150, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 214, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 182, 0, 8, 11, 0, 8, 139,
			0, 8, 75, 0, 9, 246, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 206, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 174,
			0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 238, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 158, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 222, 82, 7, 27, 0, 8, 111,
			0, 8, 47, 0, 9, 190, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 254, 96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9,
			193, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 161, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 225, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 145, 83, 7, 59, 0, 8,
			120, 0, 8, 56, 0, 9, 209, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 177, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 241, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8,
			227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 201, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 169, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 233, 80, 7, 8, 0, 8,
			92, 0, 8, 28, 0, 9, 153, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 217, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 185, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9,
			249, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 197, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 165, 0, 8, 2, 0, 8,
			130, 0, 8, 66, 0, 9, 229, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 149, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 213, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9,
			181, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 245, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 205, 81, 7, 15, 0, 8,
			102, 0, 8, 38, 0, 9, 173, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 237, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 157, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9,
			221, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 189, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 253, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0,
			8, 113, 0, 8, 49, 0, 9, 195, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 163, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 227, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9,
			147, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 211, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 179, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 243, 80, 7, 4, 0, 8,
			85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 203, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 171, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9,
			235, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 155, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 219, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 187, 0, 8, 13, 0, 8,
			141, 0, 8, 77, 0, 9, 251, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 199, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9,
			167, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 231, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 151, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 215, 82, 7, 19, 0, 8,
			107, 0, 8, 43, 0, 9, 183, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 247, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9,
			207, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 175, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 239, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 159, 84, 7, 99, 0, 8,
			127, 0, 8, 63, 0, 9, 223, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 191, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 255 ];
	var fixed_td = [ 80, 5, 1, 87, 5, 257, 83, 5, 17, 91, 5, 4097, 81, 5, 5, 89, 5, 1025, 85, 5, 65, 93, 5, 16385, 80, 5, 3, 88, 5, 513, 84, 5, 33, 92, 5,
			8193, 82, 5, 9, 90, 5, 2049, 86, 5, 129, 192, 5, 24577, 80, 5, 2, 87, 5, 385, 83, 5, 25, 91, 5, 6145, 81, 5, 7, 89, 5, 1537, 85, 5, 97, 93, 5,
			24577, 80, 5, 4, 88, 5, 769, 84, 5, 49, 92, 5, 12289, 82, 5, 13, 90, 5, 3073, 86, 5, 193, 192, 5, 24577 ];

	// Tables for deflate from PKZIP's appnote.txt.
	var cplens = [ // Copy lengths for literal codes 257..285
	3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0 ];

	// see note #13 above about 258
	var cplext = [ // Extra bits for literal codes 257..285
	0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 112, 112 // 112==invalid
	];

	var cpdist = [ // Copy offsets for distance codes 0..29
	1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577 ];

	var cpdext = [ // Extra bits for distance codes
	0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 ];

	// If BMAX needs to be larger than 16, then h and x[] should be uLong.
	var BMAX = 15; // maximum bit length of any code

	function InfTree() {
		var that = this;

		var hn; // hufts used in space
		var v; // work area for huft_build
		var c; // bit length count table
		var r; // table entry for structure assignment
		var u; // table stack
		var x; // bit offsets, then code stack

		function huft_build(b, // code lengths in bits (all assumed <=
		// BMAX)
		bindex, n, // number of codes (assumed <= 288)
		s, // number of simple-valued codes (0..s-1)
		d, // list of base values for non-simple codes
		e, // list of extra bits for non-simple codes
		t, // result: starting table
		m, // maximum lookup bits, returns actual
		hp,// space for trees
		hn,// hufts used in space
		v // working area: values in order of bit length
		) {
			// Given a list of code lengths and a maximum table size, make a set of
			// tables to decode that set of codes. Return Z_OK on success,
			// Z_BUF_ERROR
			// if the given code set is incomplete (the tables are still built in
			// this
			// case), Z_DATA_ERROR if the input is invalid (an over-subscribed set
			// of
			// lengths), or Z_MEM_ERROR if not enough memory.

			var a; // counter for codes of length k
			var f; // i repeats in table every f entries
			var g; // maximum code length
			var h; // table level
			var i; // counter, current code
			var j; // counter
			var k; // number of bits in current code
			var l; // bits per table (returned in m)
			var mask; // (1 << w) - 1, to avoid cc -O bug on HP
			var p; // pointer into c[], b[], or v[]
			var q; // points to current table
			var w; // bits before this table == (l * h)
			var xp; // pointer into x
			var y; // number of dummy codes added
			var z; // number of entries in current table

			// Generate counts for each bit length

			p = 0;
			i = n;
			do {
				c[b[bindex + p]]++;
				p++;
				i--; // assume all entries <= BMAX
			} while (i !== 0);

			if (c[0] == n) { // null input--all zero length codes
				t[0] = -1;
				m[0] = 0;
				return Z_OK;
			}

			// Find minimum and maximum length, bound *m by those
			l = m[0];
			for (j = 1; j <= BMAX; j++)
				if (c[j] !== 0)
					break;
			k = j; // minimum code length
			if (l < j) {
				l = j;
			}
			for (i = BMAX; i !== 0; i--) {
				if (c[i] !== 0)
					break;
			}
			g = i; // maximum code length
			if (l > i) {
				l = i;
			}
			m[0] = l;

			// Adjust last length count to fill out codes, if needed
			for (y = 1 << j; j < i; j++, y <<= 1) {
				if ((y -= c[j]) < 0) {
					return Z_DATA_ERROR;
				}
			}
			if ((y -= c[i]) < 0) {
				return Z_DATA_ERROR;
			}
			c[i] += y;

			// Generate starting offsets into the value table for each length
			x[1] = j = 0;
			p = 1;
			xp = 2;
			while (--i !== 0) { // note that i == g from above
				x[xp] = (j += c[p]);
				xp++;
				p++;
			}

			// Make a table of values in order of bit lengths
			i = 0;
			p = 0;
			do {
				if ((j = b[bindex + p]) !== 0) {
					v[x[j]++] = i;
				}
				p++;
			} while (++i < n);
			n = x[g]; // set n to length of v

			// Generate the Huffman codes and for each, make the table entries
			x[0] = i = 0; // first Huffman code is zero
			p = 0; // grab values in bit order
			h = -1; // no tables yet--level -1
			w = -l; // bits decoded == (l * h)
			u[0] = 0; // just to keep compilers happy
			q = 0; // ditto
			z = 0; // ditto

			// go through the bit lengths (k already is bits in shortest code)
			for (; k <= g; k++) {
				a = c[k];
				while (a-- !== 0) {
					// here i is the Huffman code of length k bits for value *p
					// make tables up to required level
					while (k > w + l) {
						h++;
						w += l; // previous table always l bits
						// compute minimum size table less than or equal to l bits
						z = g - w;
						z = (z > l) ? l : z; // table size upper limit
						if ((f = 1 << (j = k - w)) > a + 1) { // try a k-w bit table
							// too few codes for
							// k-w bit table
							f -= a + 1; // deduct codes from patterns left
							xp = k;
							if (j < z) {
								while (++j < z) { // try smaller tables up to z bits
									if ((f <<= 1) <= c[++xp])
										break; // enough codes to use up j bits
									f -= c[xp]; // else deduct codes from patterns
								}
							}
						}
						z = 1 << j; // table entries for j-bit table

						// allocate new table
						if (hn[0] + z > MANY) { // (note: doesn't matter for fixed)
							return Z_DATA_ERROR; // overflow of MANY
						}
						u[h] = q = /* hp+ */hn[0]; // DEBUG
						hn[0] += z;

						// connect to last table, if there is one
						if (h !== 0) {
							x[h] = i; // save pattern for backing up
							r[0] = /* (byte) */j; // bits in this table
							r[1] = /* (byte) */l; // bits to dump before this table
							j = i >>> (w - l);
							r[2] = /* (int) */(q - u[h - 1] - j); // offset to this table
							hp.set(r, (u[h - 1] + j) * 3);
							// to
							// last
							// table
						} else {
							t[0] = q; // first table is returned result
						}
					}

					// set up table entry in r
					r[1] = /* (byte) */(k - w);
					if (p >= n) {
						r[0] = 128 + 64; // out of values--invalid code
					} else if (v[p] < s) {
						r[0] = /* (byte) */(v[p] < 256 ? 0 : 32 + 64); // 256 is
						// end-of-block
						r[2] = v[p++]; // simple code is just the value
					} else {
						r[0] = /* (byte) */(e[v[p] - s] + 16 + 64); // non-simple--look
						// up in lists
						r[2] = d[v[p++] - s];
					}

					// fill code-like entries with r
					f = 1 << (k - w);
					for (j = i >>> w; j < z; j += f) {
						hp.set(r, (q + j) * 3);
					}

					// backwards increment the k-bit code i
					for (j = 1 << (k - 1); (i & j) !== 0; j >>>= 1) {
						i ^= j;
					}
					i ^= j;

					// backup over finished tables
					mask = (1 << w) - 1; // needed on HP, cc -O bug
					while ((i & mask) != x[h]) {
						h--; // don't need to update q
						w -= l;
						mask = (1 << w) - 1;
					}
				}
			}
			// Return Z_BUF_ERROR if we were given an incomplete table
			return y !== 0 && g != 1 ? Z_BUF_ERROR : Z_OK;
		}

		function initWorkArea(vsize) {
			var i;
			if (!hn) {
				hn = []; // []; //new Array(1);
				v = []; // new Array(vsize);
				c = new Int32Array(BMAX + 1); // new Array(BMAX + 1);
				r = []; // new Array(3);
				u = new Int32Array(BMAX); // new Array(BMAX);
				x = new Int32Array(BMAX + 1); // new Array(BMAX + 1);
			}
			if (v.length < vsize) {
				v = []; // new Array(vsize);
			}
			for (i = 0; i < vsize; i++) {
				v[i] = 0;
			}
			for (i = 0; i < BMAX + 1; i++) {
				c[i] = 0;
			}
			for (i = 0; i < 3; i++) {
				r[i] = 0;
			}
			// for(int i=0; i<BMAX; i++){u[i]=0;}
			u.set(c.subarray(0, BMAX), 0);
			// for(int i=0; i<BMAX+1; i++){x[i]=0;}
			x.set(c.subarray(0, BMAX + 1), 0);
		}

		that.inflate_trees_bits = function(c, // 19 code lengths
		bb, // bits tree desired/actual depth
		tb, // bits tree result
		hp, // space for trees
		z // for messages
		) {
			var result;
			initWorkArea(19);
			hn[0] = 0;
			result = huft_build(c, 0, 19, 19, null, null, tb, bb, hp, hn, v);

			if (result == Z_DATA_ERROR) {
				z.msg = "oversubscribed dynamic bit lengths tree";
			} else if (result == Z_BUF_ERROR || bb[0] === 0) {
				z.msg = "incomplete dynamic bit lengths tree";
				result = Z_DATA_ERROR;
			}
			return result;
		};

		that.inflate_trees_dynamic = function(nl, // number of literal/length codes
		nd, // number of distance codes
		c, // that many (total) code lengths
		bl, // literal desired/actual bit depth
		bd, // distance desired/actual bit depth
		tl, // literal/length tree result
		td, // distance tree result
		hp, // space for trees
		z // for messages
		) {
			var result;

			// build literal/length tree
			initWorkArea(288);
			hn[0] = 0;
			result = huft_build(c, 0, nl, 257, cplens, cplext, tl, bl, hp, hn, v);
			if (result != Z_OK || bl[0] === 0) {
				if (result == Z_DATA_ERROR) {
					z.msg = "oversubscribed literal/length tree";
				} else if (result != Z_MEM_ERROR) {
					z.msg = "incomplete literal/length tree";
					result = Z_DATA_ERROR;
				}
				return result;
			}

			// build distance tree
			initWorkArea(288);
			result = huft_build(c, nl, nd, 0, cpdist, cpdext, td, bd, hp, hn, v);

			if (result != Z_OK || (bd[0] === 0 && nl > 257)) {
				if (result == Z_DATA_ERROR) {
					z.msg = "oversubscribed distance tree";
				} else if (result == Z_BUF_ERROR) {
					z.msg = "incomplete distance tree";
					result = Z_DATA_ERROR;
				} else if (result != Z_MEM_ERROR) {
					z.msg = "empty distance tree with lengths";
					result = Z_DATA_ERROR;
				}
				return result;
			}

			return Z_OK;
		};

	}

	InfTree.inflate_trees_fixed = function(bl, // literal desired/actual bit depth
	bd, // distance desired/actual bit depth
	tl,// literal/length tree result
	td// distance tree result
	) {
		bl[0] = fixed_bl;
		bd[0] = fixed_bd;
		tl[0] = fixed_tl;
		td[0] = fixed_td;
		return Z_OK;
	};

	// InfCodes

	// waiting for "i:"=input,
	// "o:"=output,
	// "x:"=nothing
	var START = 0; // x: set up for LEN
	var LEN = 1; // i: get length/literal/eob next
	var LENEXT = 2; // i: getting length extra (have base)
	var DIST = 3; // i: get distance next
	var DISTEXT = 4;// i: getting distance extra
	var COPY = 5; // o: copying bytes in window, waiting
	// for space
	var LIT = 6; // o: got literal, waiting for output
	// space
	var WASH = 7; // o: got eob, possibly still output
	// waiting
	var END = 8; // x: got eob and all data flushed
	var BADCODE = 9;// x: got error

	function InfCodes() {
		var that = this;

		var mode; // current inflate_codes mode

		// mode dependent information
		var len = 0;

		var tree; // pointer into tree
		var tree_index = 0;
		var need = 0; // bits needed

		var lit = 0;

		// if EXT or COPY, where and how much
		var get = 0; // bits to get for extra
		var dist = 0; // distance back to copy from

		var lbits = 0; // ltree bits decoded per branch
		var dbits = 0; // dtree bits decoder per branch
		var ltree; // literal/length/eob tree
		var ltree_index = 0; // literal/length/eob tree
		var dtree; // distance tree
		var dtree_index = 0; // distance tree

		// Called with number of bytes left to write in window at least 258
		// (the maximum string length) and number of input bytes available
		// at least ten. The ten bytes are six bytes for the longest length/
		// distance pair plus four bytes for overloading the bit buffer.

		function inflate_fast(bl, bd, tl, tl_index, td, td_index, s, z) {
			var t; // temporary pointer
			var tp; // temporary pointer
			var tp_index; // temporary pointer
			var e; // extra bits or operation
			var b; // bit buffer
			var k; // bits in bit buffer
			var p; // input data pointer
			var n; // bytes available there
			var q; // output window write pointer
			var m; // bytes to end of window or read pointer
			var ml; // mask for literal/length tree
			var md; // mask for distance tree
			var c; // bytes to copy
			var d; // distance back to copy from
			var r; // copy source pointer

			var tp_index_t_3; // (tp_index+t)*3

			// load input, output, bit values
			p = z.next_in_index;
			n = z.avail_in;
			b = s.bitb;
			k = s.bitk;
			q = s.write;
			m = q < s.read ? s.read - q - 1 : s.end - q;

			// initialize masks
			ml = inflate_mask[bl];
			md = inflate_mask[bd];

			// do until not enough input or output space for fast loop
			do { // assume called with m >= 258 && n >= 10
				// get literal/length code
				while (k < (20)) { // max bits for literal/length code
					n--;
					b |= (z.read_byte(p++) & 0xff) << k;
					k += 8;
				}

				t = b & ml;
				tp = tl;
				tp_index = tl_index;
				tp_index_t_3 = (tp_index + t) * 3;
				if ((e = tp[tp_index_t_3]) === 0) {
					b >>= (tp[tp_index_t_3 + 1]);
					k -= (tp[tp_index_t_3 + 1]);

					s.window[q++] = /* (byte) */tp[tp_index_t_3 + 2];
					m--;
					continue;
				}
				do {

					b >>= (tp[tp_index_t_3 + 1]);
					k -= (tp[tp_index_t_3 + 1]);

					if ((e & 16) !== 0) {
						e &= 15;
						c = tp[tp_index_t_3 + 2] + (/* (int) */b & inflate_mask[e]);

						b >>= e;
						k -= e;

						// decode distance base of block to copy
						while (k < (15)) { // max bits for distance code
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						t = b & md;
						tp = td;
						tp_index = td_index;
						tp_index_t_3 = (tp_index + t) * 3;
						e = tp[tp_index_t_3];

						do {

							b >>= (tp[tp_index_t_3 + 1]);
							k -= (tp[tp_index_t_3 + 1]);

							if ((e & 16) !== 0) {
								// get extra bits to add to distance base
								e &= 15;
								while (k < (e)) { // get extra bits (up to 13)
									n--;
									b |= (z.read_byte(p++) & 0xff) << k;
									k += 8;
								}

								d = tp[tp_index_t_3 + 2] + (b & inflate_mask[e]);

								b >>= (e);
								k -= (e);

								// do the copy
								m -= c;
								if (q >= d) { // offset before dest
									// just copy
									r = q - d;
									if (q - r > 0 && 2 > (q - r)) {
										s.window[q++] = s.window[r++]; // minimum
										// count is
										// three,
										s.window[q++] = s.window[r++]; // so unroll
										// loop a
										// little
										c -= 2;
									} else {
										s.window.set(s.window.subarray(r, r + 2), q);
										q += 2;
										r += 2;
										c -= 2;
									}
								} else { // else offset after destination
									r = q - d;
									do {
										r += s.end; // force pointer in window
									} while (r < 0); // covers invalid distances
									e = s.end - r;
									if (c > e) { // if source crosses,
										c -= e; // wrapped copy
										if (q - r > 0 && e > (q - r)) {
											do {
												s.window[q++] = s.window[r++];
											} while (--e !== 0);
										} else {
											s.window.set(s.window.subarray(r, r + e), q);
											q += e;
											r += e;
											e = 0;
										}
										r = 0; // copy rest from start of window
									}

								}

								// copy all or what's left
								if (q - r > 0 && c > (q - r)) {
									do {
										s.window[q++] = s.window[r++];
									} while (--c !== 0);
								} else {
									s.window.set(s.window.subarray(r, r + c), q);
									q += c;
									r += c;
									c = 0;
								}
								break;
							} else if ((e & 64) === 0) {
								t += tp[tp_index_t_3 + 2];
								t += (b & inflate_mask[e]);
								tp_index_t_3 = (tp_index + t) * 3;
								e = tp[tp_index_t_3];
							} else {
								z.msg = "invalid distance code";

								c = z.avail_in - n;
								c = (k >> 3) < c ? k >> 3 : c;
								n += c;
								p -= c;
								k -= c << 3;

								s.bitb = b;
								s.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								s.write = q;

								return Z_DATA_ERROR;
							}
						} while (true);
						break;
					}

					if ((e & 64) === 0) {
						t += tp[tp_index_t_3 + 2];
						t += (b & inflate_mask[e]);
						tp_index_t_3 = (tp_index + t) * 3;
						if ((e = tp[tp_index_t_3]) === 0) {

							b >>= (tp[tp_index_t_3 + 1]);
							k -= (tp[tp_index_t_3 + 1]);

							s.window[q++] = /* (byte) */tp[tp_index_t_3 + 2];
							m--;
							break;
						}
					} else if ((e & 32) !== 0) {

						c = z.avail_in - n;
						c = (k >> 3) < c ? k >> 3 : c;
						n += c;
						p -= c;
						k -= c << 3;

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;

						return Z_STREAM_END;
					} else {
						z.msg = "invalid literal/length code";

						c = z.avail_in - n;
						c = (k >> 3) < c ? k >> 3 : c;
						n += c;
						p -= c;
						k -= c << 3;

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;

						return Z_DATA_ERROR;
					}
				} while (true);
			} while (m >= 258 && n >= 10);

			// not enough input or output--restore pointers and return
			c = z.avail_in - n;
			c = (k >> 3) < c ? k >> 3 : c;
			n += c;
			p -= c;
			k -= c << 3;

			s.bitb = b;
			s.bitk = k;
			z.avail_in = n;
			z.total_in += p - z.next_in_index;
			z.next_in_index = p;
			s.write = q;

			return Z_OK;
		}

		that.init = function(bl, bd, tl, tl_index, td, td_index) {
			mode = START;
			lbits = /* (byte) */bl;
			dbits = /* (byte) */bd;
			ltree = tl;
			ltree_index = tl_index;
			dtree = td;
			dtree_index = td_index;
			tree = null;
		};

		that.proc = function(s, z, r) {
			var j; // temporary storage
			var tindex; // temporary pointer
			var e; // extra bits or operation
			var b = 0; // bit buffer
			var k = 0; // bits in bit buffer
			var p = 0; // input data pointer
			var n; // bytes available there
			var q; // output window write pointer
			var m; // bytes to end of window or read pointer
			var f; // pointer to copy strings from

			// copy input/output information to locals (UPDATE macro restores)
			p = z.next_in_index;
			n = z.avail_in;
			b = s.bitb;
			k = s.bitk;
			q = s.write;
			m = q < s.read ? s.read - q - 1 : s.end - q;

			// process input and output based on current state
			while (true) {
				switch (mode) {
				// waiting for "i:"=input, "o:"=output, "x:"=nothing
				case START: // x: set up for LEN
					if (m >= 258 && n >= 10) {

						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;
						r = inflate_fast(lbits, dbits, ltree, ltree_index, dtree, dtree_index, s, z);

						p = z.next_in_index;
						n = z.avail_in;
						b = s.bitb;
						k = s.bitk;
						q = s.write;
						m = q < s.read ? s.read - q - 1 : s.end - q;

						if (r != Z_OK) {
							mode = r == Z_STREAM_END ? WASH : BADCODE;
							break;
						}
					}
					need = lbits;
					tree = ltree;
					tree_index = ltree_index;

					mode = LEN;
				case LEN: // i: get length/literal/eob next
					j = need;

					while (k < (j)) {
						if (n !== 0)
							r = Z_OK;
						else {

							s.bitb = b;
							s.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							s.write = q;
							return s.inflate_flush(z, r);
						}
						n--;
						b |= (z.read_byte(p++) & 0xff) << k;
						k += 8;
					}

					tindex = (tree_index + (b & inflate_mask[j])) * 3;

					b >>>= (tree[tindex + 1]);
					k -= (tree[tindex + 1]);

					e = tree[tindex];

					if (e === 0) { // literal
						lit = tree[tindex + 2];
						mode = LIT;
						break;
					}
					if ((e & 16) !== 0) { // length
						get = e & 15;
						len = tree[tindex + 2];
						mode = LENEXT;
						break;
					}
					if ((e & 64) === 0) { // next table
						need = e;
						tree_index = tindex / 3 + tree[tindex + 2];
						break;
					}
					if ((e & 32) !== 0) { // end of block
						mode = WASH;
						break;
					}
					mode = BADCODE; // invalid code
					z.msg = "invalid literal/length code";
					r = Z_DATA_ERROR;

					s.bitb = b;
					s.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					s.write = q;
					return s.inflate_flush(z, r);

				case LENEXT: // i: getting length extra (have base)
					j = get;

					while (k < (j)) {
						if (n !== 0)
							r = Z_OK;
						else {

							s.bitb = b;
							s.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							s.write = q;
							return s.inflate_flush(z, r);
						}
						n--;
						b |= (z.read_byte(p++) & 0xff) << k;
						k += 8;
					}

					len += (b & inflate_mask[j]);

					b >>= j;
					k -= j;

					need = dbits;
					tree = dtree;
					tree_index = dtree_index;
					mode = DIST;
				case DIST: // i: get distance next
					j = need;

					while (k < (j)) {
						if (n !== 0)
							r = Z_OK;
						else {

							s.bitb = b;
							s.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							s.write = q;
							return s.inflate_flush(z, r);
						}
						n--;
						b |= (z.read_byte(p++) & 0xff) << k;
						k += 8;
					}

					tindex = (tree_index + (b & inflate_mask[j])) * 3;

					b >>= tree[tindex + 1];
					k -= tree[tindex + 1];

					e = (tree[tindex]);
					if ((e & 16) !== 0) { // distance
						get = e & 15;
						dist = tree[tindex + 2];
						mode = DISTEXT;
						break;
					}
					if ((e & 64) === 0) { // next table
						need = e;
						tree_index = tindex / 3 + tree[tindex + 2];
						break;
					}
					mode = BADCODE; // invalid code
					z.msg = "invalid distance code";
					r = Z_DATA_ERROR;

					s.bitb = b;
					s.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					s.write = q;
					return s.inflate_flush(z, r);

				case DISTEXT: // i: getting distance extra
					j = get;

					while (k < (j)) {
						if (n !== 0)
							r = Z_OK;
						else {

							s.bitb = b;
							s.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							s.write = q;
							return s.inflate_flush(z, r);
						}
						n--;
						b |= (z.read_byte(p++) & 0xff) << k;
						k += 8;
					}

					dist += (b & inflate_mask[j]);

					b >>= j;
					k -= j;

					mode = COPY;
				case COPY: // o: copying bytes in window, waiting for space
					f = q - dist;
					while (f < 0) { // modulo window size-"while" instead
						f += s.end; // of "if" handles invalid distances
					}
					while (len !== 0) {

						if (m === 0) {
							if (q == s.end && s.read !== 0) {
								q = 0;
								m = q < s.read ? s.read - q - 1 : s.end - q;
							}
							if (m === 0) {
								s.write = q;
								r = s.inflate_flush(z, r);
								q = s.write;
								m = q < s.read ? s.read - q - 1 : s.end - q;

								if (q == s.end && s.read !== 0) {
									q = 0;
									m = q < s.read ? s.read - q - 1 : s.end - q;
								}

								if (m === 0) {
									s.bitb = b;
									s.bitk = k;
									z.avail_in = n;
									z.total_in += p - z.next_in_index;
									z.next_in_index = p;
									s.write = q;
									return s.inflate_flush(z, r);
								}
							}
						}

						s.window[q++] = s.window[f++];
						m--;

						if (f == s.end)
							f = 0;
						len--;
					}
					mode = START;
					break;
				case LIT: // o: got literal, waiting for output space
					if (m === 0) {
						if (q == s.end && s.read !== 0) {
							q = 0;
							m = q < s.read ? s.read - q - 1 : s.end - q;
						}
						if (m === 0) {
							s.write = q;
							r = s.inflate_flush(z, r);
							q = s.write;
							m = q < s.read ? s.read - q - 1 : s.end - q;

							if (q == s.end && s.read !== 0) {
								q = 0;
								m = q < s.read ? s.read - q - 1 : s.end - q;
							}
							if (m === 0) {
								s.bitb = b;
								s.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								s.write = q;
								return s.inflate_flush(z, r);
							}
						}
					}
					r = Z_OK;

					s.window[q++] = /* (byte) */lit;
					m--;

					mode = START;
					break;
				case WASH: // o: got eob, possibly more output
					if (k > 7) { // return unused byte, if any
						k -= 8;
						n++;
						p--; // can always return one
					}

					s.write = q;
					r = s.inflate_flush(z, r);
					q = s.write;
					m = q < s.read ? s.read - q - 1 : s.end - q;

					if (s.read != s.write) {
						s.bitb = b;
						s.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						s.write = q;
						return s.inflate_flush(z, r);
					}
					mode = END;
				case END:
					r = Z_STREAM_END;
					s.bitb = b;
					s.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					s.write = q;
					return s.inflate_flush(z, r);

				case BADCODE: // x: got error

					r = Z_DATA_ERROR;

					s.bitb = b;
					s.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					s.write = q;
					return s.inflate_flush(z, r);

				default:
					r = Z_STREAM_ERROR;

					s.bitb = b;
					s.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					s.write = q;
					return s.inflate_flush(z, r);
				}
			}
		};

		that.free = function() {
			// ZFREE(z, c);
		};

	}

	// InfBlocks

	// Table for deflate from PKZIP's appnote.txt.
	var border = [ // Order of the bit length code lengths
	16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];

	var TYPE = 0; // get type bits (3, including end bit)
	var LENS = 1; // get lengths for stored
	var STORED = 2;// processing stored block
	var TABLE = 3; // get table lengths
	var BTREE = 4; // get bit lengths tree for a dynamic
	// block
	var DTREE = 5; // get length, distance trees for a
	// dynamic block
	var CODES = 6; // processing fixed or dynamic block
	var DRY = 7; // output remaining window bytes
	var DONELOCKS = 8; // finished last block, done
	var BADBLOCKS = 9; // ot a data error--stuck here

	function InfBlocks(z, w) {
		var that = this;

		var mode = TYPE; // current inflate_block mode

		var left = 0; // if STORED, bytes left to copy

		var table = 0; // table lengths (14 bits)
		var index = 0; // index into blens (or border)
		var blens; // bit lengths of codes
		var bb = [ 0 ]; // bit length tree depth
		var tb = [ 0 ]; // bit length decoding tree

		var codes = new InfCodes(); // if CODES, current state

		var last = 0; // true if this block is the last block

		var hufts = new Int32Array(MANY * 3); // single malloc for tree space
		var check = 0; // check on output
		var inftree = new InfTree();

		that.bitk = 0; // bits in bit buffer
		that.bitb = 0; // bit buffer
		that.window = new Uint8Array(w); // sliding window
		that.end = w; // one byte after sliding window
		that.read = 0; // window read pointer
		that.write = 0; // window write pointer

		that.reset = function(z, c) {
			if (c)
				c[0] = check;
			// if (mode == BTREE || mode == DTREE) {
			// }
			if (mode == CODES) {
				codes.free(z);
			}
			mode = TYPE;
			that.bitk = 0;
			that.bitb = 0;
			that.read = that.write = 0;
		};

		that.reset(z, null);

		// copy as much as possible from the sliding window to the output area
		that.inflate_flush = function(z, r) {
			var n;
			var p;
			var q;

			// local copies of source and destination pointers
			p = z.next_out_index;
			q = that.read;

			// compute number of bytes to copy as far as end of window
			n = /* (int) */((q <= that.write ? that.write : that.end) - q);
			if (n > z.avail_out)
				n = z.avail_out;
			if (n !== 0 && r == Z_BUF_ERROR)
				r = Z_OK;

			// update counters
			z.avail_out -= n;
			z.total_out += n;

			// copy as far as end of window
			z.next_out.set(that.window.subarray(q, q + n), p);
			p += n;
			q += n;

			// see if more to copy at beginning of window
			if (q == that.end) {
				// wrap pointers
				q = 0;
				if (that.write == that.end)
					that.write = 0;

				// compute bytes to copy
				n = that.write - q;
				if (n > z.avail_out)
					n = z.avail_out;
				if (n !== 0 && r == Z_BUF_ERROR)
					r = Z_OK;

				// update counters
				z.avail_out -= n;
				z.total_out += n;

				// copy
				z.next_out.set(that.window.subarray(q, q + n), p);
				p += n;
				q += n;
			}

			// update pointers
			z.next_out_index = p;
			that.read = q;

			// done
			return r;
		};

		that.proc = function(z, r) {
			var t; // temporary storage
			var b; // bit buffer
			var k; // bits in bit buffer
			var p; // input data pointer
			var n; // bytes available there
			var q; // output window write pointer
			var m; // bytes to end of window or read pointer

			var i;

			// copy input/output information to locals (UPDATE macro restores)
			// {
			p = z.next_in_index;
			n = z.avail_in;
			b = that.bitb;
			k = that.bitk;
			// }
			// {
			q = that.write;
			m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
			// }

			// process input based on current state
			// DEBUG dtree
			while (true) {
				switch (mode) {
				case TYPE:

					while (k < (3)) {
						if (n !== 0) {
							r = Z_OK;
						} else {
							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}
						n--;
						b |= (z.read_byte(p++) & 0xff) << k;
						k += 8;
					}
					t = /* (int) */(b & 7);
					last = t & 1;

					switch (t >>> 1) {
					case 0: // stored
						// {
						b >>>= (3);
						k -= (3);
						// }
						t = k & 7; // go to byte boundary

						// {
						b >>>= (t);
						k -= (t);
						// }
						mode = LENS; // get length of stored block
						break;
					case 1: // fixed
						// {
						var bl = []; // new Array(1);
						var bd = []; // new Array(1);
						var tl = [ [] ]; // new Array(1);
						var td = [ [] ]; // new Array(1);

						InfTree.inflate_trees_fixed(bl, bd, tl, td);
						codes.init(bl[0], bd[0], tl[0], 0, td[0], 0);
						// }

						// {
						b >>>= (3);
						k -= (3);
						// }

						mode = CODES;
						break;
					case 2: // dynamic

						// {
						b >>>= (3);
						k -= (3);
						// }

						mode = TABLE;
						break;
					case 3: // illegal

						// {
						b >>>= (3);
						k -= (3);
						// }
						mode = BADBLOCKS;
						z.msg = "invalid block type";
						r = Z_DATA_ERROR;

						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
					}
					break;
				case LENS:

					while (k < (32)) {
						if (n !== 0) {
							r = Z_OK;
						} else {
							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}
						n--;
						b |= (z.read_byte(p++) & 0xff) << k;
						k += 8;
					}

					if ((((~b) >>> 16) & 0xffff) != (b & 0xffff)) {
						mode = BADBLOCKS;
						z.msg = "invalid stored block lengths";
						r = Z_DATA_ERROR;

						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
					}
					left = (b & 0xffff);
					b = k = 0; // dump bits
					mode = left !== 0 ? STORED : (last !== 0 ? DRY : TYPE);
					break;
				case STORED:
					if (n === 0) {
						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
					}

					if (m === 0) {
						if (q == that.end && that.read !== 0) {
							q = 0;
							m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
						}
						if (m === 0) {
							that.write = q;
							r = that.inflate_flush(z, r);
							q = that.write;
							m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
							if (q == that.end && that.read !== 0) {
								q = 0;
								m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
							}
							if (m === 0) {
								that.bitb = b;
								that.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								that.write = q;
								return that.inflate_flush(z, r);
							}
						}
					}
					r = Z_OK;

					t = left;
					if (t > n)
						t = n;
					if (t > m)
						t = m;
					that.window.set(z.read_buf(p, t), q);
					p += t;
					n -= t;
					q += t;
					m -= t;
					if ((left -= t) !== 0)
						break;
					mode = last !== 0 ? DRY : TYPE;
					break;
				case TABLE:

					while (k < (14)) {
						if (n !== 0) {
							r = Z_OK;
						} else {
							that.bitb = b;
							that.bitk = k;
							z.avail_in = n;
							z.total_in += p - z.next_in_index;
							z.next_in_index = p;
							that.write = q;
							return that.inflate_flush(z, r);
						}

						n--;
						b |= (z.read_byte(p++) & 0xff) << k;
						k += 8;
					}

					table = t = (b & 0x3fff);
					if ((t & 0x1f) > 29 || ((t >> 5) & 0x1f) > 29) {
						mode = BADBLOCKS;
						z.msg = "too many length or distance symbols";
						r = Z_DATA_ERROR;

						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
					}
					t = 258 + (t & 0x1f) + ((t >> 5) & 0x1f);
					if (!blens || blens.length < t) {
						blens = []; // new Array(t);
					} else {
						for (i = 0; i < t; i++) {
							blens[i] = 0;
						}
					}

					// {
					b >>>= (14);
					k -= (14);
					// }

					index = 0;
					mode = BTREE;
				case BTREE:
					while (index < 4 + (table >>> 10)) {
						while (k < (3)) {
							if (n !== 0) {
								r = Z_OK;
							} else {
								that.bitb = b;
								that.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								that.write = q;
								return that.inflate_flush(z, r);
							}
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						blens[border[index++]] = b & 7;

						// {
						b >>>= (3);
						k -= (3);
						// }
					}

					while (index < 19) {
						blens[border[index++]] = 0;
					}

					bb[0] = 7;
					t = inftree.inflate_trees_bits(blens, bb, tb, hufts, z);
					if (t != Z_OK) {
						r = t;
						if (r == Z_DATA_ERROR) {
							blens = null;
							mode = BADBLOCKS;
						}

						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
					}

					index = 0;
					mode = DTREE;
				case DTREE:
					while (true) {
						t = table;
						if (!(index < 258 + (t & 0x1f) + ((t >> 5) & 0x1f))) {
							break;
						}

						var j, c;

						t = bb[0];

						while (k < (t)) {
							if (n !== 0) {
								r = Z_OK;
							} else {
								that.bitb = b;
								that.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								that.write = q;
								return that.inflate_flush(z, r);
							}
							n--;
							b |= (z.read_byte(p++) & 0xff) << k;
							k += 8;
						}

						// if (tb[0] == -1) {
						// System.err.println("null...");
						// }

						t = hufts[(tb[0] + (b & inflate_mask[t])) * 3 + 1];
						c = hufts[(tb[0] + (b & inflate_mask[t])) * 3 + 2];

						if (c < 16) {
							b >>>= (t);
							k -= (t);
							blens[index++] = c;
						} else { // c == 16..18
							i = c == 18 ? 7 : c - 14;
							j = c == 18 ? 11 : 3;

							while (k < (t + i)) {
								if (n !== 0) {
									r = Z_OK;
								} else {
									that.bitb = b;
									that.bitk = k;
									z.avail_in = n;
									z.total_in += p - z.next_in_index;
									z.next_in_index = p;
									that.write = q;
									return that.inflate_flush(z, r);
								}
								n--;
								b |= (z.read_byte(p++) & 0xff) << k;
								k += 8;
							}

							b >>>= (t);
							k -= (t);

							j += (b & inflate_mask[i]);

							b >>>= (i);
							k -= (i);

							i = index;
							t = table;
							if (i + j > 258 + (t & 0x1f) + ((t >> 5) & 0x1f) || (c == 16 && i < 1)) {
								blens = null;
								mode = BADBLOCKS;
								z.msg = "invalid bit length repeat";
								r = Z_DATA_ERROR;

								that.bitb = b;
								that.bitk = k;
								z.avail_in = n;
								z.total_in += p - z.next_in_index;
								z.next_in_index = p;
								that.write = q;
								return that.inflate_flush(z, r);
							}

							c = c == 16 ? blens[i - 1] : 0;
							do {
								blens[i++] = c;
							} while (--j !== 0);
							index = i;
						}
					}

					tb[0] = -1;
					// {
					var bl_ = []; // new Array(1);
					var bd_ = []; // new Array(1);
					var tl_ = []; // new Array(1);
					var td_ = []; // new Array(1);
					bl_[0] = 9; // must be <= 9 for lookahead assumptions
					bd_[0] = 6; // must be <= 9 for lookahead assumptions

					t = table;
					t = inftree.inflate_trees_dynamic(257 + (t & 0x1f), 1 + ((t >> 5) & 0x1f), blens, bl_, bd_, tl_, td_, hufts, z);

					if (t != Z_OK) {
						if (t == Z_DATA_ERROR) {
							blens = null;
							mode = BADBLOCKS;
						}
						r = t;

						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
					}
					codes.init(bl_[0], bd_[0], hufts, tl_[0], hufts, td_[0]);
					// }
					mode = CODES;
				case CODES:
					that.bitb = b;
					that.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					that.write = q;

					if ((r = codes.proc(that, z, r)) != Z_STREAM_END) {
						return that.inflate_flush(z, r);
					}
					r = Z_OK;
					codes.free(z);

					p = z.next_in_index;
					n = z.avail_in;
					b = that.bitb;
					k = that.bitk;
					q = that.write;
					m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);

					if (last === 0) {
						mode = TYPE;
						break;
					}
					mode = DRY;
				case DRY:
					that.write = q;
					r = that.inflate_flush(z, r);
					q = that.write;
					m = /* (int) */(q < that.read ? that.read - q - 1 : that.end - q);
					if (that.read != that.write) {
						that.bitb = b;
						that.bitk = k;
						z.avail_in = n;
						z.total_in += p - z.next_in_index;
						z.next_in_index = p;
						that.write = q;
						return that.inflate_flush(z, r);
					}
					mode = DONELOCKS;
				case DONELOCKS:
					r = Z_STREAM_END;

					that.bitb = b;
					that.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					that.write = q;
					return that.inflate_flush(z, r);
				case BADBLOCKS:
					r = Z_DATA_ERROR;

					that.bitb = b;
					that.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					that.write = q;
					return that.inflate_flush(z, r);

				default:
					r = Z_STREAM_ERROR;

					that.bitb = b;
					that.bitk = k;
					z.avail_in = n;
					z.total_in += p - z.next_in_index;
					z.next_in_index = p;
					that.write = q;
					return that.inflate_flush(z, r);
				}
			}
		};

		that.free = function(z) {
			that.reset(z, null);
			that.window = null;
			hufts = null;
			// ZFREE(z, s);
		};

		that.set_dictionary = function(d, start, n) {
			that.window.set(d.subarray(start, start + n), 0);
			that.read = that.write = n;
		};

		// Returns true if inflate is currently at the end of a block generated
		// by Z_SYNC_FLUSH or Z_FULL_FLUSH.
		that.sync_point = function() {
			return mode == LENS ? 1 : 0;
		};

	}

	// Inflate

	// preset dictionary flag in zlib header
	var PRESET_DICT = 0x20;

	var Z_DEFLATED = 8;

	var METHOD = 0; // waiting for method byte
	var FLAG = 1; // waiting for flag byte
	var DICT4 = 2; // four dictionary check bytes to go
	var DICT3 = 3; // three dictionary check bytes to go
	var DICT2 = 4; // two dictionary check bytes to go
	var DICT1 = 5; // one dictionary check byte to go
	var DICT0 = 6; // waiting for inflateSetDictionary
	var BLOCKS = 7; // decompressing blocks
	var DONE = 12; // finished check, done
	var BAD = 13; // got an error--stay here

	var mark = [ 0, 0, 0xff, 0xff ];

	function Inflate() {
		var that = this;

		that.mode = 0; // current inflate mode

		// mode dependent information
		that.method = 0; // if FLAGS, method byte

		// if CHECK, check values to compare
		that.was = [ 0 ]; // new Array(1); // computed check value
		that.need = 0; // stream check value

		// if BAD, inflateSync's marker bytes count
		that.marker = 0;

		// mode independent information
		that.wbits = 0; // log2(window size) (8..15, defaults to 15)

		// this.blocks; // current inflate_blocks state

		function inflateReset(z) {
			if (!z || !z.istate)
				return Z_STREAM_ERROR;

			z.total_in = z.total_out = 0;
			z.msg = null;
			z.istate.mode = BLOCKS;
			z.istate.blocks.reset(z, null);
			return Z_OK;
		}

		that.inflateEnd = function(z) {
			if (that.blocks)
				that.blocks.free(z);
			that.blocks = null;
			// ZFREE(z, z->state);
			return Z_OK;
		};

		that.inflateInit = function(z, w) {
			z.msg = null;
			that.blocks = null;

			// set window size
			if (w < 8 || w > 15) {
				that.inflateEnd(z);
				return Z_STREAM_ERROR;
			}
			that.wbits = w;

			z.istate.blocks = new InfBlocks(z, 1 << w);

			// reset state
			inflateReset(z);
			return Z_OK;
		};

		that.inflate = function(z, f) {
			var r;
			var b;

			if (!z || !z.istate || !z.next_in)
				return Z_STREAM_ERROR;
			f = f == Z_FINISH ? Z_BUF_ERROR : Z_OK;
			r = Z_BUF_ERROR;
			while (true) {
				// System.out.println("mode: "+z.istate.mode);
				switch (z.istate.mode) {
				case METHOD:

					if (z.avail_in === 0)
						return r;
					r = f;

					z.avail_in--;
					z.total_in++;
					if (((z.istate.method = z.read_byte(z.next_in_index++)) & 0xf) != Z_DEFLATED) {
						z.istate.mode = BAD;
						z.msg = "unknown compression method";
						z.istate.marker = 5; // can't try inflateSync
						break;
					}
					if ((z.istate.method >> 4) + 8 > z.istate.wbits) {
						z.istate.mode = BAD;
						z.msg = "invalid window size";
						z.istate.marker = 5; // can't try inflateSync
						break;
					}
					z.istate.mode = FLAG;
				case FLAG:

					if (z.avail_in === 0)
						return r;
					r = f;

					z.avail_in--;
					z.total_in++;
					b = (z.read_byte(z.next_in_index++)) & 0xff;

					if ((((z.istate.method << 8) + b) % 31) !== 0) {
						z.istate.mode = BAD;
						z.msg = "incorrect header check";
						z.istate.marker = 5; // can't try inflateSync
						break;
					}

					if ((b & PRESET_DICT) === 0) {
						z.istate.mode = BLOCKS;
						break;
					}
					z.istate.mode = DICT4;
				case DICT4:

					if (z.avail_in === 0)
						return r;
					r = f;

					z.avail_in--;
					z.total_in++;
					z.istate.need = ((z.read_byte(z.next_in_index++) & 0xff) << 24) & 0xff000000;
					z.istate.mode = DICT3;
				case DICT3:

					if (z.avail_in === 0)
						return r;
					r = f;

					z.avail_in--;
					z.total_in++;
					z.istate.need += ((z.read_byte(z.next_in_index++) & 0xff) << 16) & 0xff0000;
					z.istate.mode = DICT2;
				case DICT2:

					if (z.avail_in === 0)
						return r;
					r = f;

					z.avail_in--;
					z.total_in++;
					z.istate.need += ((z.read_byte(z.next_in_index++) & 0xff) << 8) & 0xff00;
					z.istate.mode = DICT1;
				case DICT1:

					if (z.avail_in === 0)
						return r;
					r = f;

					z.avail_in--;
					z.total_in++;
					z.istate.need += (z.read_byte(z.next_in_index++) & 0xff);
					z.istate.mode = DICT0;
					return Z_NEED_DICT;
				case DICT0:
					z.istate.mode = BAD;
					z.msg = "need dictionary";
					z.istate.marker = 0; // can try inflateSync
					return Z_STREAM_ERROR;
				case BLOCKS:

					r = z.istate.blocks.proc(z, r);
					if (r == Z_DATA_ERROR) {
						z.istate.mode = BAD;
						z.istate.marker = 0; // can try inflateSync
						break;
					}
					if (r == Z_OK) {
						r = f;
					}
					if (r != Z_STREAM_END) {
						return r;
					}
					r = f;
					z.istate.blocks.reset(z, z.istate.was);
					z.istate.mode = DONE;
				case DONE:
					return Z_STREAM_END;
				case BAD:
					return Z_DATA_ERROR;
				default:
					return Z_STREAM_ERROR;
				}
			}
		};

		that.inflateSetDictionary = function(z, dictionary, dictLength) {
			var index = 0;
			var length = dictLength;
			if (!z || !z.istate || z.istate.mode != DICT0)
				return Z_STREAM_ERROR;

			if (length >= (1 << z.istate.wbits)) {
				length = (1 << z.istate.wbits) - 1;
				index = dictLength - length;
			}
			z.istate.blocks.set_dictionary(dictionary, index, length);
			z.istate.mode = BLOCKS;
			return Z_OK;
		};

		that.inflateSync = function(z) {
			var n; // number of bytes to look at
			var p; // pointer to bytes
			var m; // number of marker bytes found in a row
			var r, w; // temporaries to save total_in and total_out

			// set up
			if (!z || !z.istate)
				return Z_STREAM_ERROR;
			if (z.istate.mode != BAD) {
				z.istate.mode = BAD;
				z.istate.marker = 0;
			}
			if ((n = z.avail_in) === 0)
				return Z_BUF_ERROR;
			p = z.next_in_index;
			m = z.istate.marker;

			// search
			while (n !== 0 && m < 4) {
				if (z.read_byte(p) == mark[m]) {
					m++;
				} else if (z.read_byte(p) !== 0) {
					m = 0;
				} else {
					m = 4 - m;
				}
				p++;
				n--;
			}

			// restore
			z.total_in += p - z.next_in_index;
			z.next_in_index = p;
			z.avail_in = n;
			z.istate.marker = m;

			// return no joy or set up to restart on a new block
			if (m != 4) {
				return Z_DATA_ERROR;
			}
			r = z.total_in;
			w = z.total_out;
			inflateReset(z);
			z.total_in = r;
			z.total_out = w;
			z.istate.mode = BLOCKS;
			return Z_OK;
		};

		// Returns true if inflate is currently at the end of a block generated
		// by Z_SYNC_FLUSH or Z_FULL_FLUSH. This function is used by one PPP
		// implementation to provide an additional safety check. PPP uses
		// Z_SYNC_FLUSH
		// but removes the length bytes of the resulting empty stored block. When
		// decompressing, PPP checks that at the end of input packet, inflate is
		// waiting for these length bytes.
		that.inflateSyncPoint = function(z) {
			if (!z || !z.istate || !z.istate.blocks)
				return Z_STREAM_ERROR;
			return z.istate.blocks.sync_point();
		};
	}

	// ZStream

	function ZStream() {
	}

	ZStream.prototype = {
		inflateInit : function(bits) {
			var that = this;
			that.istate = new Inflate();
			if (!bits)
				bits = MAX_BITS;
			return that.istate.inflateInit(that, bits);
		},

		inflate : function(f) {
			var that = this;
			if (!that.istate)
				return Z_STREAM_ERROR;
			return that.istate.inflate(that, f);
		},

		inflateEnd : function() {
			var that = this;
			if (!that.istate)
				return Z_STREAM_ERROR;
			var ret = that.istate.inflateEnd(that);
			that.istate = null;
			return ret;
		},

		inflateSync : function() {
			var that = this;
			if (!that.istate)
				return Z_STREAM_ERROR;
			return that.istate.inflateSync(that);
		},
		inflateSetDictionary : function(dictionary, dictLength) {
			var that = this;
			if (!that.istate)
				return Z_STREAM_ERROR;
			return that.istate.inflateSetDictionary(that, dictionary, dictLength);
		},
		read_byte : function(start) {
			var that = this;
			return that.next_in.subarray(start, start + 1)[0];
		},
		read_buf : function(start, size) {
			var that = this;
			return that.next_in.subarray(start, start + size);
		}
	};

	// Inflater

	function Inflater() {
		var that = this;
		var z = new ZStream();
		var bufsize = 512;
		var flush = Z_NO_FLUSH;
		var buf = new Uint8Array(bufsize);
		var nomoreinput = false;

		z.inflateInit();
		z.next_out = buf;

		that.append = function(data, onprogress) {
			var err, buffers = [], lastIndex = 0, bufferIndex = 0, bufferSize = 0, array;
			if (data.length === 0)
				return;
			z.next_in_index = 0;
			z.next_in = data;
			z.avail_in = data.length;
			do {
				z.next_out_index = 0;
				z.avail_out = bufsize;
				if ((z.avail_in === 0) && (!nomoreinput)) { // if buffer is empty and more input is available, refill it
					z.next_in_index = 0;
					nomoreinput = true;
				}
				err = z.inflate(flush);
				if (nomoreinput && (err == Z_BUF_ERROR))
					return -1;
				if (err != Z_OK && err != Z_STREAM_END)
					throw "inflating: " + z.msg;
				if ((nomoreinput || err == Z_STREAM_END) && (z.avail_in == data.length))
					return -1;
				if (z.next_out_index)
					if (z.next_out_index == bufsize)
						buffers.push(new Uint8Array(buf));
					else
						buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
				bufferSize += z.next_out_index;
				if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
					onprogress(z.next_in_index);
					lastIndex = z.next_in_index;
				}
			} while (z.avail_in > 0 || z.avail_out === 0);
			array = new Uint8Array(bufferSize);
			buffers.forEach(function(chunk) {
				array.set(chunk, bufferIndex);
				bufferIndex += chunk.length;
			});
			return array;
		};
		that.flush = function() {
			z.inflateEnd();
		};
	}

	var inflater;

	if (obj.zip)
		obj.zip.Inflater = Inflater;
	else {
		inflater = new Inflater();
		obj.addEventListener("message", function(event) {
			var message = event.data;

			if (message.append)
				obj.postMessage({
					onappend : true,
					data : inflater.append(message.data, function(current) {
						obj.postMessage({
							progress : true,
							current : current
						});
					})
				});
			if (message.flush) {
				inflater.flush();
				obj.postMessage({
					onflush : true
				});
			}
		}, false);
	}

})(self);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDA5NzI4ZDcyMjAwNTc3M2UzZGIud29ya2VyLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGQwOTcyOGQ3MjIwMDU3NzNlM2RiIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL1RoaXJkUGFydHkvV29ya2Vycy9pbmZsYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImRpc3QvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDA5NzI4ZDcyMjAwNTc3M2UzZGIiLCIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzIEdpbGRhcyBMb3JtZWF1LiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5cclxuIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxyXG4gbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcblxyXG4gMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxyXG4gdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuXHJcbiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBcclxuIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiBcclxuIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG5cclxuIDMuIFRoZSBuYW1lcyBvZiB0aGUgYXV0aG9ycyBtYXkgbm90IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzXHJcbiBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuXHJcbiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIGBgQVMgSVMnJyBBTkQgQU5ZIEVYUFJFU1NFRCBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsXHJcbiBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgSkNSQUZULFxyXG4gSU5DLiBPUiBBTlkgQ09OVFJJQlVUT1JTIFRPIFRISVMgU09GVFdBUkUgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCxcclxuIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcclxuIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLFxyXG4gT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSxcclxuIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcbiAqL1xyXG5cclxuLypcclxuICogVGhpcyBwcm9ncmFtIGlzIGJhc2VkIG9uIEpabGliIDEuMC4yIHltbmssIEpDcmFmdCxJbmMuXHJcbiAqIEpabGliIGlzIGJhc2VkIG9uIHpsaWItMS4xLjMsIHNvIGFsbCBjcmVkaXQgc2hvdWxkIGdvIGF1dGhvcnNcclxuICogSmVhbi1sb3VwIEdhaWxseShqbG91cEBnemlwLm9yZykgYW5kIE1hcmsgQWRsZXIobWFkbGVyQGFsdW1uaS5jYWx0ZWNoLmVkdSlcclxuICogYW5kIGNvbnRyaWJ1dG9ycyBvZiB6bGliLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbihvYmopIHtcclxuXHJcblx0Ly8gR2xvYmFsXHJcblx0dmFyIE1BWF9CSVRTID0gMTU7XHJcblxyXG5cdHZhciBaX09LID0gMDtcclxuXHR2YXIgWl9TVFJFQU1fRU5EID0gMTtcclxuXHR2YXIgWl9ORUVEX0RJQ1QgPSAyO1xyXG5cdHZhciBaX1NUUkVBTV9FUlJPUiA9IC0yO1xyXG5cdHZhciBaX0RBVEFfRVJST1IgPSAtMztcclxuXHR2YXIgWl9NRU1fRVJST1IgPSAtNDtcclxuXHR2YXIgWl9CVUZfRVJST1IgPSAtNTtcclxuXHJcblx0dmFyIGluZmxhdGVfbWFzayA9IFsgMHgwMDAwMDAwMCwgMHgwMDAwMDAwMSwgMHgwMDAwMDAwMywgMHgwMDAwMDAwNywgMHgwMDAwMDAwZiwgMHgwMDAwMDAxZiwgMHgwMDAwMDAzZiwgMHgwMDAwMDA3ZiwgMHgwMDAwMDBmZiwgMHgwMDAwMDFmZiwgMHgwMDAwMDNmZixcclxuXHRcdFx0MHgwMDAwMDdmZiwgMHgwMDAwMGZmZiwgMHgwMDAwMWZmZiwgMHgwMDAwM2ZmZiwgMHgwMDAwN2ZmZiwgMHgwMDAwZmZmZiBdO1xyXG5cclxuXHR2YXIgTUFOWSA9IDE0NDA7XHJcblxyXG5cdC8vIEpabGliIHZlcnNpb24gOiBcIjEuMC4yXCJcclxuXHR2YXIgWl9OT19GTFVTSCA9IDA7XHJcblx0dmFyIFpfRklOSVNIID0gNDtcclxuXHJcblx0Ly8gSW5mVHJlZVxyXG5cdHZhciBmaXhlZF9ibCA9IDk7XHJcblx0dmFyIGZpeGVkX2JkID0gNTtcclxuXHJcblx0dmFyIGZpeGVkX3RsID0gWyA5NiwgNywgMjU2LCAwLCA4LCA4MCwgMCwgOCwgMTYsIDg0LCA4LCAxMTUsIDgyLCA3LCAzMSwgMCwgOCwgMTEyLCAwLCA4LCA0OCwgMCwgOSwgMTkyLCA4MCwgNywgMTAsIDAsIDgsIDk2LCAwLCA4LCAzMiwgMCwgOSwgMTYwLCAwLCA4LCAwLFxyXG5cdFx0XHQwLCA4LCAxMjgsIDAsIDgsIDY0LCAwLCA5LCAyMjQsIDgwLCA3LCA2LCAwLCA4LCA4OCwgMCwgOCwgMjQsIDAsIDksIDE0NCwgODMsIDcsIDU5LCAwLCA4LCAxMjAsIDAsIDgsIDU2LCAwLCA5LCAyMDgsIDgxLCA3LCAxNywgMCwgOCwgMTA0LCAwLCA4LCA0MCxcclxuXHRcdFx0MCwgOSwgMTc2LCAwLCA4LCA4LCAwLCA4LCAxMzYsIDAsIDgsIDcyLCAwLCA5LCAyNDAsIDgwLCA3LCA0LCAwLCA4LCA4NCwgMCwgOCwgMjAsIDg1LCA4LCAyMjcsIDgzLCA3LCA0MywgMCwgOCwgMTE2LCAwLCA4LCA1MiwgMCwgOSwgMjAwLCA4MSwgNywgMTMsXHJcblx0XHRcdDAsIDgsIDEwMCwgMCwgOCwgMzYsIDAsIDksIDE2OCwgMCwgOCwgNCwgMCwgOCwgMTMyLCAwLCA4LCA2OCwgMCwgOSwgMjMyLCA4MCwgNywgOCwgMCwgOCwgOTIsIDAsIDgsIDI4LCAwLCA5LCAxNTIsIDg0LCA3LCA4MywgMCwgOCwgMTI0LCAwLCA4LCA2MCxcclxuXHRcdFx0MCwgOSwgMjE2LCA4MiwgNywgMjMsIDAsIDgsIDEwOCwgMCwgOCwgNDQsIDAsIDksIDE4NCwgMCwgOCwgMTIsIDAsIDgsIDE0MCwgMCwgOCwgNzYsIDAsIDksIDI0OCwgODAsIDcsIDMsIDAsIDgsIDgyLCAwLCA4LCAxOCwgODUsIDgsIDE2MywgODMsIDcsXHJcblx0XHRcdDM1LCAwLCA4LCAxMTQsIDAsIDgsIDUwLCAwLCA5LCAxOTYsIDgxLCA3LCAxMSwgMCwgOCwgOTgsIDAsIDgsIDM0LCAwLCA5LCAxNjQsIDAsIDgsIDIsIDAsIDgsIDEzMCwgMCwgOCwgNjYsIDAsIDksIDIyOCwgODAsIDcsIDcsIDAsIDgsIDkwLCAwLCA4LFxyXG5cdFx0XHQyNiwgMCwgOSwgMTQ4LCA4NCwgNywgNjcsIDAsIDgsIDEyMiwgMCwgOCwgNTgsIDAsIDksIDIxMiwgODIsIDcsIDE5LCAwLCA4LCAxMDYsIDAsIDgsIDQyLCAwLCA5LCAxODAsIDAsIDgsIDEwLCAwLCA4LCAxMzgsIDAsIDgsIDc0LCAwLCA5LCAyNDQsIDgwLFxyXG5cdFx0XHQ3LCA1LCAwLCA4LCA4NiwgMCwgOCwgMjIsIDE5MiwgOCwgMCwgODMsIDcsIDUxLCAwLCA4LCAxMTgsIDAsIDgsIDU0LCAwLCA5LCAyMDQsIDgxLCA3LCAxNSwgMCwgOCwgMTAyLCAwLCA4LCAzOCwgMCwgOSwgMTcyLCAwLCA4LCA2LCAwLCA4LCAxMzQsIDAsXHJcblx0XHRcdDgsIDcwLCAwLCA5LCAyMzYsIDgwLCA3LCA5LCAwLCA4LCA5NCwgMCwgOCwgMzAsIDAsIDksIDE1NiwgODQsIDcsIDk5LCAwLCA4LCAxMjYsIDAsIDgsIDYyLCAwLCA5LCAyMjAsIDgyLCA3LCAyNywgMCwgOCwgMTEwLCAwLCA4LCA0NiwgMCwgOSwgMTg4LCAwLFxyXG5cdFx0XHQ4LCAxNCwgMCwgOCwgMTQyLCAwLCA4LCA3OCwgMCwgOSwgMjUyLCA5NiwgNywgMjU2LCAwLCA4LCA4MSwgMCwgOCwgMTcsIDg1LCA4LCAxMzEsIDgyLCA3LCAzMSwgMCwgOCwgMTEzLCAwLCA4LCA0OSwgMCwgOSwgMTk0LCA4MCwgNywgMTAsIDAsIDgsIDk3LFxyXG5cdFx0XHQwLCA4LCAzMywgMCwgOSwgMTYyLCAwLCA4LCAxLCAwLCA4LCAxMjksIDAsIDgsIDY1LCAwLCA5LCAyMjYsIDgwLCA3LCA2LCAwLCA4LCA4OSwgMCwgOCwgMjUsIDAsIDksIDE0NiwgODMsIDcsIDU5LCAwLCA4LCAxMjEsIDAsIDgsIDU3LCAwLCA5LCAyMTAsXHJcblx0XHRcdDgxLCA3LCAxNywgMCwgOCwgMTA1LCAwLCA4LCA0MSwgMCwgOSwgMTc4LCAwLCA4LCA5LCAwLCA4LCAxMzcsIDAsIDgsIDczLCAwLCA5LCAyNDIsIDgwLCA3LCA0LCAwLCA4LCA4NSwgMCwgOCwgMjEsIDgwLCA4LCAyNTgsIDgzLCA3LCA0MywgMCwgOCwgMTE3LFxyXG5cdFx0XHQwLCA4LCA1MywgMCwgOSwgMjAyLCA4MSwgNywgMTMsIDAsIDgsIDEwMSwgMCwgOCwgMzcsIDAsIDksIDE3MCwgMCwgOCwgNSwgMCwgOCwgMTMzLCAwLCA4LCA2OSwgMCwgOSwgMjM0LCA4MCwgNywgOCwgMCwgOCwgOTMsIDAsIDgsIDI5LCAwLCA5LCAxNTQsXHJcblx0XHRcdDg0LCA3LCA4MywgMCwgOCwgMTI1LCAwLCA4LCA2MSwgMCwgOSwgMjE4LCA4MiwgNywgMjMsIDAsIDgsIDEwOSwgMCwgOCwgNDUsIDAsIDksIDE4NiwgMCwgOCwgMTMsIDAsIDgsIDE0MSwgMCwgOCwgNzcsIDAsIDksIDI1MCwgODAsIDcsIDMsIDAsIDgsIDgzLFxyXG5cdFx0XHQwLCA4LCAxOSwgODUsIDgsIDE5NSwgODMsIDcsIDM1LCAwLCA4LCAxMTUsIDAsIDgsIDUxLCAwLCA5LCAxOTgsIDgxLCA3LCAxMSwgMCwgOCwgOTksIDAsIDgsIDM1LCAwLCA5LCAxNjYsIDAsIDgsIDMsIDAsIDgsIDEzMSwgMCwgOCwgNjcsIDAsIDksIDIzMCxcclxuXHRcdFx0ODAsIDcsIDcsIDAsIDgsIDkxLCAwLCA4LCAyNywgMCwgOSwgMTUwLCA4NCwgNywgNjcsIDAsIDgsIDEyMywgMCwgOCwgNTksIDAsIDksIDIxNCwgODIsIDcsIDE5LCAwLCA4LCAxMDcsIDAsIDgsIDQzLCAwLCA5LCAxODIsIDAsIDgsIDExLCAwLCA4LCAxMzksXHJcblx0XHRcdDAsIDgsIDc1LCAwLCA5LCAyNDYsIDgwLCA3LCA1LCAwLCA4LCA4NywgMCwgOCwgMjMsIDE5MiwgOCwgMCwgODMsIDcsIDUxLCAwLCA4LCAxMTksIDAsIDgsIDU1LCAwLCA5LCAyMDYsIDgxLCA3LCAxNSwgMCwgOCwgMTAzLCAwLCA4LCAzOSwgMCwgOSwgMTc0LFxyXG5cdFx0XHQwLCA4LCA3LCAwLCA4LCAxMzUsIDAsIDgsIDcxLCAwLCA5LCAyMzgsIDgwLCA3LCA5LCAwLCA4LCA5NSwgMCwgOCwgMzEsIDAsIDksIDE1OCwgODQsIDcsIDk5LCAwLCA4LCAxMjcsIDAsIDgsIDYzLCAwLCA5LCAyMjIsIDgyLCA3LCAyNywgMCwgOCwgMTExLFxyXG5cdFx0XHQwLCA4LCA0NywgMCwgOSwgMTkwLCAwLCA4LCAxNSwgMCwgOCwgMTQzLCAwLCA4LCA3OSwgMCwgOSwgMjU0LCA5NiwgNywgMjU2LCAwLCA4LCA4MCwgMCwgOCwgMTYsIDg0LCA4LCAxMTUsIDgyLCA3LCAzMSwgMCwgOCwgMTEyLCAwLCA4LCA0OCwgMCwgOSxcclxuXHRcdFx0MTkzLCA4MCwgNywgMTAsIDAsIDgsIDk2LCAwLCA4LCAzMiwgMCwgOSwgMTYxLCAwLCA4LCAwLCAwLCA4LCAxMjgsIDAsIDgsIDY0LCAwLCA5LCAyMjUsIDgwLCA3LCA2LCAwLCA4LCA4OCwgMCwgOCwgMjQsIDAsIDksIDE0NSwgODMsIDcsIDU5LCAwLCA4LFxyXG5cdFx0XHQxMjAsIDAsIDgsIDU2LCAwLCA5LCAyMDksIDgxLCA3LCAxNywgMCwgOCwgMTA0LCAwLCA4LCA0MCwgMCwgOSwgMTc3LCAwLCA4LCA4LCAwLCA4LCAxMzYsIDAsIDgsIDcyLCAwLCA5LCAyNDEsIDgwLCA3LCA0LCAwLCA4LCA4NCwgMCwgOCwgMjAsIDg1LCA4LFxyXG5cdFx0XHQyMjcsIDgzLCA3LCA0MywgMCwgOCwgMTE2LCAwLCA4LCA1MiwgMCwgOSwgMjAxLCA4MSwgNywgMTMsIDAsIDgsIDEwMCwgMCwgOCwgMzYsIDAsIDksIDE2OSwgMCwgOCwgNCwgMCwgOCwgMTMyLCAwLCA4LCA2OCwgMCwgOSwgMjMzLCA4MCwgNywgOCwgMCwgOCxcclxuXHRcdFx0OTIsIDAsIDgsIDI4LCAwLCA5LCAxNTMsIDg0LCA3LCA4MywgMCwgOCwgMTI0LCAwLCA4LCA2MCwgMCwgOSwgMjE3LCA4MiwgNywgMjMsIDAsIDgsIDEwOCwgMCwgOCwgNDQsIDAsIDksIDE4NSwgMCwgOCwgMTIsIDAsIDgsIDE0MCwgMCwgOCwgNzYsIDAsIDksXHJcblx0XHRcdDI0OSwgODAsIDcsIDMsIDAsIDgsIDgyLCAwLCA4LCAxOCwgODUsIDgsIDE2MywgODMsIDcsIDM1LCAwLCA4LCAxMTQsIDAsIDgsIDUwLCAwLCA5LCAxOTcsIDgxLCA3LCAxMSwgMCwgOCwgOTgsIDAsIDgsIDM0LCAwLCA5LCAxNjUsIDAsIDgsIDIsIDAsIDgsXHJcblx0XHRcdDEzMCwgMCwgOCwgNjYsIDAsIDksIDIyOSwgODAsIDcsIDcsIDAsIDgsIDkwLCAwLCA4LCAyNiwgMCwgOSwgMTQ5LCA4NCwgNywgNjcsIDAsIDgsIDEyMiwgMCwgOCwgNTgsIDAsIDksIDIxMywgODIsIDcsIDE5LCAwLCA4LCAxMDYsIDAsIDgsIDQyLCAwLCA5LFxyXG5cdFx0XHQxODEsIDAsIDgsIDEwLCAwLCA4LCAxMzgsIDAsIDgsIDc0LCAwLCA5LCAyNDUsIDgwLCA3LCA1LCAwLCA4LCA4NiwgMCwgOCwgMjIsIDE5MiwgOCwgMCwgODMsIDcsIDUxLCAwLCA4LCAxMTgsIDAsIDgsIDU0LCAwLCA5LCAyMDUsIDgxLCA3LCAxNSwgMCwgOCxcclxuXHRcdFx0MTAyLCAwLCA4LCAzOCwgMCwgOSwgMTczLCAwLCA4LCA2LCAwLCA4LCAxMzQsIDAsIDgsIDcwLCAwLCA5LCAyMzcsIDgwLCA3LCA5LCAwLCA4LCA5NCwgMCwgOCwgMzAsIDAsIDksIDE1NywgODQsIDcsIDk5LCAwLCA4LCAxMjYsIDAsIDgsIDYyLCAwLCA5LFxyXG5cdFx0XHQyMjEsIDgyLCA3LCAyNywgMCwgOCwgMTEwLCAwLCA4LCA0NiwgMCwgOSwgMTg5LCAwLCA4LCAxNCwgMCwgOCwgMTQyLCAwLCA4LCA3OCwgMCwgOSwgMjUzLCA5NiwgNywgMjU2LCAwLCA4LCA4MSwgMCwgOCwgMTcsIDg1LCA4LCAxMzEsIDgyLCA3LCAzMSwgMCxcclxuXHRcdFx0OCwgMTEzLCAwLCA4LCA0OSwgMCwgOSwgMTk1LCA4MCwgNywgMTAsIDAsIDgsIDk3LCAwLCA4LCAzMywgMCwgOSwgMTYzLCAwLCA4LCAxLCAwLCA4LCAxMjksIDAsIDgsIDY1LCAwLCA5LCAyMjcsIDgwLCA3LCA2LCAwLCA4LCA4OSwgMCwgOCwgMjUsIDAsIDksXHJcblx0XHRcdDE0NywgODMsIDcsIDU5LCAwLCA4LCAxMjEsIDAsIDgsIDU3LCAwLCA5LCAyMTEsIDgxLCA3LCAxNywgMCwgOCwgMTA1LCAwLCA4LCA0MSwgMCwgOSwgMTc5LCAwLCA4LCA5LCAwLCA4LCAxMzcsIDAsIDgsIDczLCAwLCA5LCAyNDMsIDgwLCA3LCA0LCAwLCA4LFxyXG5cdFx0XHQ4NSwgMCwgOCwgMjEsIDgwLCA4LCAyNTgsIDgzLCA3LCA0MywgMCwgOCwgMTE3LCAwLCA4LCA1MywgMCwgOSwgMjAzLCA4MSwgNywgMTMsIDAsIDgsIDEwMSwgMCwgOCwgMzcsIDAsIDksIDE3MSwgMCwgOCwgNSwgMCwgOCwgMTMzLCAwLCA4LCA2OSwgMCwgOSxcclxuXHRcdFx0MjM1LCA4MCwgNywgOCwgMCwgOCwgOTMsIDAsIDgsIDI5LCAwLCA5LCAxNTUsIDg0LCA3LCA4MywgMCwgOCwgMTI1LCAwLCA4LCA2MSwgMCwgOSwgMjE5LCA4MiwgNywgMjMsIDAsIDgsIDEwOSwgMCwgOCwgNDUsIDAsIDksIDE4NywgMCwgOCwgMTMsIDAsIDgsXHJcblx0XHRcdDE0MSwgMCwgOCwgNzcsIDAsIDksIDI1MSwgODAsIDcsIDMsIDAsIDgsIDgzLCAwLCA4LCAxOSwgODUsIDgsIDE5NSwgODMsIDcsIDM1LCAwLCA4LCAxMTUsIDAsIDgsIDUxLCAwLCA5LCAxOTksIDgxLCA3LCAxMSwgMCwgOCwgOTksIDAsIDgsIDM1LCAwLCA5LFxyXG5cdFx0XHQxNjcsIDAsIDgsIDMsIDAsIDgsIDEzMSwgMCwgOCwgNjcsIDAsIDksIDIzMSwgODAsIDcsIDcsIDAsIDgsIDkxLCAwLCA4LCAyNywgMCwgOSwgMTUxLCA4NCwgNywgNjcsIDAsIDgsIDEyMywgMCwgOCwgNTksIDAsIDksIDIxNSwgODIsIDcsIDE5LCAwLCA4LFxyXG5cdFx0XHQxMDcsIDAsIDgsIDQzLCAwLCA5LCAxODMsIDAsIDgsIDExLCAwLCA4LCAxMzksIDAsIDgsIDc1LCAwLCA5LCAyNDcsIDgwLCA3LCA1LCAwLCA4LCA4NywgMCwgOCwgMjMsIDE5MiwgOCwgMCwgODMsIDcsIDUxLCAwLCA4LCAxMTksIDAsIDgsIDU1LCAwLCA5LFxyXG5cdFx0XHQyMDcsIDgxLCA3LCAxNSwgMCwgOCwgMTAzLCAwLCA4LCAzOSwgMCwgOSwgMTc1LCAwLCA4LCA3LCAwLCA4LCAxMzUsIDAsIDgsIDcxLCAwLCA5LCAyMzksIDgwLCA3LCA5LCAwLCA4LCA5NSwgMCwgOCwgMzEsIDAsIDksIDE1OSwgODQsIDcsIDk5LCAwLCA4LFxyXG5cdFx0XHQxMjcsIDAsIDgsIDYzLCAwLCA5LCAyMjMsIDgyLCA3LCAyNywgMCwgOCwgMTExLCAwLCA4LCA0NywgMCwgOSwgMTkxLCAwLCA4LCAxNSwgMCwgOCwgMTQzLCAwLCA4LCA3OSwgMCwgOSwgMjU1IF07XHJcblx0dmFyIGZpeGVkX3RkID0gWyA4MCwgNSwgMSwgODcsIDUsIDI1NywgODMsIDUsIDE3LCA5MSwgNSwgNDA5NywgODEsIDUsIDUsIDg5LCA1LCAxMDI1LCA4NSwgNSwgNjUsIDkzLCA1LCAxNjM4NSwgODAsIDUsIDMsIDg4LCA1LCA1MTMsIDg0LCA1LCAzMywgOTIsIDUsXHJcblx0XHRcdDgxOTMsIDgyLCA1LCA5LCA5MCwgNSwgMjA0OSwgODYsIDUsIDEyOSwgMTkyLCA1LCAyNDU3NywgODAsIDUsIDIsIDg3LCA1LCAzODUsIDgzLCA1LCAyNSwgOTEsIDUsIDYxNDUsIDgxLCA1LCA3LCA4OSwgNSwgMTUzNywgODUsIDUsIDk3LCA5MywgNSxcclxuXHRcdFx0MjQ1NzcsIDgwLCA1LCA0LCA4OCwgNSwgNzY5LCA4NCwgNSwgNDksIDkyLCA1LCAxMjI4OSwgODIsIDUsIDEzLCA5MCwgNSwgMzA3MywgODYsIDUsIDE5MywgMTkyLCA1LCAyNDU3NyBdO1xyXG5cclxuXHQvLyBUYWJsZXMgZm9yIGRlZmxhdGUgZnJvbSBQS1pJUCdzIGFwcG5vdGUudHh0LlxyXG5cdHZhciBjcGxlbnMgPSBbIC8vIENvcHkgbGVuZ3RocyBmb3IgbGl0ZXJhbCBjb2RlcyAyNTcuLjI4NVxyXG5cdDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTMsIDE1LCAxNywgMTksIDIzLCAyNywgMzEsIDM1LCA0MywgNTEsIDU5LCA2NywgODMsIDk5LCAxMTUsIDEzMSwgMTYzLCAxOTUsIDIyNywgMjU4LCAwLCAwIF07XHJcblxyXG5cdC8vIHNlZSBub3RlICMxMyBhYm92ZSBhYm91dCAyNThcclxuXHR2YXIgY3BsZXh0ID0gWyAvLyBFeHRyYSBiaXRzIGZvciBsaXRlcmFsIGNvZGVzIDI1Ny4uMjg1XHJcblx0MCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMiwgMiwgMiwgMiwgMywgMywgMywgMywgNCwgNCwgNCwgNCwgNSwgNSwgNSwgNSwgMCwgMTEyLCAxMTIgLy8gMTEyPT1pbnZhbGlkXHJcblx0XTtcclxuXHJcblx0dmFyIGNwZGlzdCA9IFsgLy8gQ29weSBvZmZzZXRzIGZvciBkaXN0YW5jZSBjb2RlcyAwLi4yOVxyXG5cdDEsIDIsIDMsIDQsIDUsIDcsIDksIDEzLCAxNywgMjUsIDMzLCA0OSwgNjUsIDk3LCAxMjksIDE5MywgMjU3LCAzODUsIDUxMywgNzY5LCAxMDI1LCAxNTM3LCAyMDQ5LCAzMDczLCA0MDk3LCA2MTQ1LCA4MTkzLCAxMjI4OSwgMTYzODUsIDI0NTc3IF07XHJcblxyXG5cdHZhciBjcGRleHQgPSBbIC8vIEV4dHJhIGJpdHMgZm9yIGRpc3RhbmNlIGNvZGVzXHJcblx0MCwgMCwgMCwgMCwgMSwgMSwgMiwgMiwgMywgMywgNCwgNCwgNSwgNSwgNiwgNiwgNywgNywgOCwgOCwgOSwgOSwgMTAsIDEwLCAxMSwgMTEsIDEyLCAxMiwgMTMsIDEzIF07XHJcblxyXG5cdC8vIElmIEJNQVggbmVlZHMgdG8gYmUgbGFyZ2VyIHRoYW4gMTYsIHRoZW4gaCBhbmQgeFtdIHNob3VsZCBiZSB1TG9uZy5cclxuXHR2YXIgQk1BWCA9IDE1OyAvLyBtYXhpbXVtIGJpdCBsZW5ndGggb2YgYW55IGNvZGVcclxuXHJcblx0ZnVuY3Rpb24gSW5mVHJlZSgpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHR2YXIgaG47IC8vIGh1ZnRzIHVzZWQgaW4gc3BhY2VcclxuXHRcdHZhciB2OyAvLyB3b3JrIGFyZWEgZm9yIGh1ZnRfYnVpbGRcclxuXHRcdHZhciBjOyAvLyBiaXQgbGVuZ3RoIGNvdW50IHRhYmxlXHJcblx0XHR2YXIgcjsgLy8gdGFibGUgZW50cnkgZm9yIHN0cnVjdHVyZSBhc3NpZ25tZW50XHJcblx0XHR2YXIgdTsgLy8gdGFibGUgc3RhY2tcclxuXHRcdHZhciB4OyAvLyBiaXQgb2Zmc2V0cywgdGhlbiBjb2RlIHN0YWNrXHJcblxyXG5cdFx0ZnVuY3Rpb24gaHVmdF9idWlsZChiLCAvLyBjb2RlIGxlbmd0aHMgaW4gYml0cyAoYWxsIGFzc3VtZWQgPD1cclxuXHRcdC8vIEJNQVgpXHJcblx0XHRiaW5kZXgsIG4sIC8vIG51bWJlciBvZiBjb2RlcyAoYXNzdW1lZCA8PSAyODgpXHJcblx0XHRzLCAvLyBudW1iZXIgb2Ygc2ltcGxlLXZhbHVlZCBjb2RlcyAoMC4ucy0xKVxyXG5cdFx0ZCwgLy8gbGlzdCBvZiBiYXNlIHZhbHVlcyBmb3Igbm9uLXNpbXBsZSBjb2Rlc1xyXG5cdFx0ZSwgLy8gbGlzdCBvZiBleHRyYSBiaXRzIGZvciBub24tc2ltcGxlIGNvZGVzXHJcblx0XHR0LCAvLyByZXN1bHQ6IHN0YXJ0aW5nIHRhYmxlXHJcblx0XHRtLCAvLyBtYXhpbXVtIGxvb2t1cCBiaXRzLCByZXR1cm5zIGFjdHVhbFxyXG5cdFx0aHAsLy8gc3BhY2UgZm9yIHRyZWVzXHJcblx0XHRobiwvLyBodWZ0cyB1c2VkIGluIHNwYWNlXHJcblx0XHR2IC8vIHdvcmtpbmcgYXJlYTogdmFsdWVzIGluIG9yZGVyIG9mIGJpdCBsZW5ndGhcclxuXHRcdCkge1xyXG5cdFx0XHQvLyBHaXZlbiBhIGxpc3Qgb2YgY29kZSBsZW5ndGhzIGFuZCBhIG1heGltdW0gdGFibGUgc2l6ZSwgbWFrZSBhIHNldCBvZlxyXG5cdFx0XHQvLyB0YWJsZXMgdG8gZGVjb2RlIHRoYXQgc2V0IG9mIGNvZGVzLiBSZXR1cm4gWl9PSyBvbiBzdWNjZXNzLFxyXG5cdFx0XHQvLyBaX0JVRl9FUlJPUlxyXG5cdFx0XHQvLyBpZiB0aGUgZ2l2ZW4gY29kZSBzZXQgaXMgaW5jb21wbGV0ZSAodGhlIHRhYmxlcyBhcmUgc3RpbGwgYnVpbHQgaW5cclxuXHRcdFx0Ly8gdGhpc1xyXG5cdFx0XHQvLyBjYXNlKSwgWl9EQVRBX0VSUk9SIGlmIHRoZSBpbnB1dCBpcyBpbnZhbGlkIChhbiBvdmVyLXN1YnNjcmliZWQgc2V0XHJcblx0XHRcdC8vIG9mXHJcblx0XHRcdC8vIGxlbmd0aHMpLCBvciBaX01FTV9FUlJPUiBpZiBub3QgZW5vdWdoIG1lbW9yeS5cclxuXHJcblx0XHRcdHZhciBhOyAvLyBjb3VudGVyIGZvciBjb2RlcyBvZiBsZW5ndGgga1xyXG5cdFx0XHR2YXIgZjsgLy8gaSByZXBlYXRzIGluIHRhYmxlIGV2ZXJ5IGYgZW50cmllc1xyXG5cdFx0XHR2YXIgZzsgLy8gbWF4aW11bSBjb2RlIGxlbmd0aFxyXG5cdFx0XHR2YXIgaDsgLy8gdGFibGUgbGV2ZWxcclxuXHRcdFx0dmFyIGk7IC8vIGNvdW50ZXIsIGN1cnJlbnQgY29kZVxyXG5cdFx0XHR2YXIgajsgLy8gY291bnRlclxyXG5cdFx0XHR2YXIgazsgLy8gbnVtYmVyIG9mIGJpdHMgaW4gY3VycmVudCBjb2RlXHJcblx0XHRcdHZhciBsOyAvLyBiaXRzIHBlciB0YWJsZSAocmV0dXJuZWQgaW4gbSlcclxuXHRcdFx0dmFyIG1hc2s7IC8vICgxIDw8IHcpIC0gMSwgdG8gYXZvaWQgY2MgLU8gYnVnIG9uIEhQXHJcblx0XHRcdHZhciBwOyAvLyBwb2ludGVyIGludG8gY1tdLCBiW10sIG9yIHZbXVxyXG5cdFx0XHR2YXIgcTsgLy8gcG9pbnRzIHRvIGN1cnJlbnQgdGFibGVcclxuXHRcdFx0dmFyIHc7IC8vIGJpdHMgYmVmb3JlIHRoaXMgdGFibGUgPT0gKGwgKiBoKVxyXG5cdFx0XHR2YXIgeHA7IC8vIHBvaW50ZXIgaW50byB4XHJcblx0XHRcdHZhciB5OyAvLyBudW1iZXIgb2YgZHVtbXkgY29kZXMgYWRkZWRcclxuXHRcdFx0dmFyIHo7IC8vIG51bWJlciBvZiBlbnRyaWVzIGluIGN1cnJlbnQgdGFibGVcclxuXHJcblx0XHRcdC8vIEdlbmVyYXRlIGNvdW50cyBmb3IgZWFjaCBiaXQgbGVuZ3RoXHJcblxyXG5cdFx0XHRwID0gMDtcclxuXHRcdFx0aSA9IG47XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRjW2JbYmluZGV4ICsgcF1dKys7XHJcblx0XHRcdFx0cCsrO1xyXG5cdFx0XHRcdGktLTsgLy8gYXNzdW1lIGFsbCBlbnRyaWVzIDw9IEJNQVhcclxuXHRcdFx0fSB3aGlsZSAoaSAhPT0gMCk7XHJcblxyXG5cdFx0XHRpZiAoY1swXSA9PSBuKSB7IC8vIG51bGwgaW5wdXQtLWFsbCB6ZXJvIGxlbmd0aCBjb2Rlc1xyXG5cdFx0XHRcdHRbMF0gPSAtMTtcclxuXHRcdFx0XHRtWzBdID0gMDtcclxuXHRcdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRmluZCBtaW5pbXVtIGFuZCBtYXhpbXVtIGxlbmd0aCwgYm91bmQgKm0gYnkgdGhvc2VcclxuXHRcdFx0bCA9IG1bMF07XHJcblx0XHRcdGZvciAoaiA9IDE7IGogPD0gQk1BWDsgaisrKVxyXG5cdFx0XHRcdGlmIChjW2pdICE9PSAwKVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGsgPSBqOyAvLyBtaW5pbXVtIGNvZGUgbGVuZ3RoXHJcblx0XHRcdGlmIChsIDwgaikge1xyXG5cdFx0XHRcdGwgPSBqO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAoaSA9IEJNQVg7IGkgIT09IDA7IGktLSkge1xyXG5cdFx0XHRcdGlmIChjW2ldICE9PSAwKVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0ZyA9IGk7IC8vIG1heGltdW0gY29kZSBsZW5ndGhcclxuXHRcdFx0aWYgKGwgPiBpKSB7XHJcblx0XHRcdFx0bCA9IGk7XHJcblx0XHRcdH1cclxuXHRcdFx0bVswXSA9IGw7XHJcblxyXG5cdFx0XHQvLyBBZGp1c3QgbGFzdCBsZW5ndGggY291bnQgdG8gZmlsbCBvdXQgY29kZXMsIGlmIG5lZWRlZFxyXG5cdFx0XHRmb3IgKHkgPSAxIDw8IGo7IGogPCBpOyBqKyssIHkgPDw9IDEpIHtcclxuXHRcdFx0XHRpZiAoKHkgLT0gY1tqXSkgPCAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gWl9EQVRBX0VSUk9SO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoKHkgLT0gY1tpXSkgPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIFpfREFUQV9FUlJPUjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjW2ldICs9IHk7XHJcblxyXG5cdFx0XHQvLyBHZW5lcmF0ZSBzdGFydGluZyBvZmZzZXRzIGludG8gdGhlIHZhbHVlIHRhYmxlIGZvciBlYWNoIGxlbmd0aFxyXG5cdFx0XHR4WzFdID0gaiA9IDA7XHJcblx0XHRcdHAgPSAxO1xyXG5cdFx0XHR4cCA9IDI7XHJcblx0XHRcdHdoaWxlICgtLWkgIT09IDApIHsgLy8gbm90ZSB0aGF0IGkgPT0gZyBmcm9tIGFib3ZlXHJcblx0XHRcdFx0eFt4cF0gPSAoaiArPSBjW3BdKTtcclxuXHRcdFx0XHR4cCsrO1xyXG5cdFx0XHRcdHArKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gTWFrZSBhIHRhYmxlIG9mIHZhbHVlcyBpbiBvcmRlciBvZiBiaXQgbGVuZ3Roc1xyXG5cdFx0XHRpID0gMDtcclxuXHRcdFx0cCA9IDA7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRpZiAoKGogPSBiW2JpbmRleCArIHBdKSAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dlt4W2pdKytdID0gaTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cCsrO1xyXG5cdFx0XHR9IHdoaWxlICgrK2kgPCBuKTtcclxuXHRcdFx0biA9IHhbZ107IC8vIHNldCBuIHRvIGxlbmd0aCBvZiB2XHJcblxyXG5cdFx0XHQvLyBHZW5lcmF0ZSB0aGUgSHVmZm1hbiBjb2RlcyBhbmQgZm9yIGVhY2gsIG1ha2UgdGhlIHRhYmxlIGVudHJpZXNcclxuXHRcdFx0eFswXSA9IGkgPSAwOyAvLyBmaXJzdCBIdWZmbWFuIGNvZGUgaXMgemVyb1xyXG5cdFx0XHRwID0gMDsgLy8gZ3JhYiB2YWx1ZXMgaW4gYml0IG9yZGVyXHJcblx0XHRcdGggPSAtMTsgLy8gbm8gdGFibGVzIHlldC0tbGV2ZWwgLTFcclxuXHRcdFx0dyA9IC1sOyAvLyBiaXRzIGRlY29kZWQgPT0gKGwgKiBoKVxyXG5cdFx0XHR1WzBdID0gMDsgLy8ganVzdCB0byBrZWVwIGNvbXBpbGVycyBoYXBweVxyXG5cdFx0XHRxID0gMDsgLy8gZGl0dG9cclxuXHRcdFx0eiA9IDA7IC8vIGRpdHRvXHJcblxyXG5cdFx0XHQvLyBnbyB0aHJvdWdoIHRoZSBiaXQgbGVuZ3RocyAoayBhbHJlYWR5IGlzIGJpdHMgaW4gc2hvcnRlc3QgY29kZSlcclxuXHRcdFx0Zm9yICg7IGsgPD0gZzsgaysrKSB7XHJcblx0XHRcdFx0YSA9IGNba107XHJcblx0XHRcdFx0d2hpbGUgKGEtLSAhPT0gMCkge1xyXG5cdFx0XHRcdFx0Ly8gaGVyZSBpIGlzIHRoZSBIdWZmbWFuIGNvZGUgb2YgbGVuZ3RoIGsgYml0cyBmb3IgdmFsdWUgKnBcclxuXHRcdFx0XHRcdC8vIG1ha2UgdGFibGVzIHVwIHRvIHJlcXVpcmVkIGxldmVsXHJcblx0XHRcdFx0XHR3aGlsZSAoayA+IHcgKyBsKSB7XHJcblx0XHRcdFx0XHRcdGgrKztcclxuXHRcdFx0XHRcdFx0dyArPSBsOyAvLyBwcmV2aW91cyB0YWJsZSBhbHdheXMgbCBiaXRzXHJcblx0XHRcdFx0XHRcdC8vIGNvbXB1dGUgbWluaW11bSBzaXplIHRhYmxlIGxlc3MgdGhhbiBvciBlcXVhbCB0byBsIGJpdHNcclxuXHRcdFx0XHRcdFx0eiA9IGcgLSB3O1xyXG5cdFx0XHRcdFx0XHR6ID0gKHogPiBsKSA/IGwgOiB6OyAvLyB0YWJsZSBzaXplIHVwcGVyIGxpbWl0XHJcblx0XHRcdFx0XHRcdGlmICgoZiA9IDEgPDwgKGogPSBrIC0gdykpID4gYSArIDEpIHsgLy8gdHJ5IGEgay13IGJpdCB0YWJsZVxyXG5cdFx0XHRcdFx0XHRcdC8vIHRvbyBmZXcgY29kZXMgZm9yXHJcblx0XHRcdFx0XHRcdFx0Ly8gay13IGJpdCB0YWJsZVxyXG5cdFx0XHRcdFx0XHRcdGYgLT0gYSArIDE7IC8vIGRlZHVjdCBjb2RlcyBmcm9tIHBhdHRlcm5zIGxlZnRcclxuXHRcdFx0XHRcdFx0XHR4cCA9IGs7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGogPCB6KSB7XHJcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoKytqIDwgeikgeyAvLyB0cnkgc21hbGxlciB0YWJsZXMgdXAgdG8geiBiaXRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICgoZiA8PD0gMSkgPD0gY1srK3hwXSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhazsgLy8gZW5vdWdoIGNvZGVzIHRvIHVzZSB1cCBqIGJpdHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZiAtPSBjW3hwXTsgLy8gZWxzZSBkZWR1Y3QgY29kZXMgZnJvbSBwYXR0ZXJuc1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR6ID0gMSA8PCBqOyAvLyB0YWJsZSBlbnRyaWVzIGZvciBqLWJpdCB0YWJsZVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gYWxsb2NhdGUgbmV3IHRhYmxlXHJcblx0XHRcdFx0XHRcdGlmIChoblswXSArIHogPiBNQU5ZKSB7IC8vIChub3RlOiBkb2Vzbid0IG1hdHRlciBmb3IgZml4ZWQpXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFpfREFUQV9FUlJPUjsgLy8gb3ZlcmZsb3cgb2YgTUFOWVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHVbaF0gPSBxID0gLyogaHArICovaG5bMF07IC8vIERFQlVHXHJcblx0XHRcdFx0XHRcdGhuWzBdICs9IHo7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBjb25uZWN0IHRvIGxhc3QgdGFibGUsIGlmIHRoZXJlIGlzIG9uZVxyXG5cdFx0XHRcdFx0XHRpZiAoaCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHhbaF0gPSBpOyAvLyBzYXZlIHBhdHRlcm4gZm9yIGJhY2tpbmcgdXBcclxuXHRcdFx0XHRcdFx0XHRyWzBdID0gLyogKGJ5dGUpICovajsgLy8gYml0cyBpbiB0aGlzIHRhYmxlXHJcblx0XHRcdFx0XHRcdFx0clsxXSA9IC8qIChieXRlKSAqL2w7IC8vIGJpdHMgdG8gZHVtcCBiZWZvcmUgdGhpcyB0YWJsZVxyXG5cdFx0XHRcdFx0XHRcdGogPSBpID4+PiAodyAtIGwpO1xyXG5cdFx0XHRcdFx0XHRcdHJbMl0gPSAvKiAoaW50KSAqLyhxIC0gdVtoIC0gMV0gLSBqKTsgLy8gb2Zmc2V0IHRvIHRoaXMgdGFibGVcclxuXHRcdFx0XHRcdFx0XHRocC5zZXQociwgKHVbaCAtIDFdICsgaikgKiAzKTtcclxuXHRcdFx0XHRcdFx0XHQvLyB0b1xyXG5cdFx0XHRcdFx0XHRcdC8vIGxhc3RcclxuXHRcdFx0XHRcdFx0XHQvLyB0YWJsZVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRbMF0gPSBxOyAvLyBmaXJzdCB0YWJsZSBpcyByZXR1cm5lZCByZXN1bHRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIHNldCB1cCB0YWJsZSBlbnRyeSBpbiByXHJcblx0XHRcdFx0XHRyWzFdID0gLyogKGJ5dGUpICovKGsgLSB3KTtcclxuXHRcdFx0XHRcdGlmIChwID49IG4pIHtcclxuXHRcdFx0XHRcdFx0clswXSA9IDEyOCArIDY0OyAvLyBvdXQgb2YgdmFsdWVzLS1pbnZhbGlkIGNvZGVcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodltwXSA8IHMpIHtcclxuXHRcdFx0XHRcdFx0clswXSA9IC8qIChieXRlKSAqLyh2W3BdIDwgMjU2ID8gMCA6IDMyICsgNjQpOyAvLyAyNTYgaXNcclxuXHRcdFx0XHRcdFx0Ly8gZW5kLW9mLWJsb2NrXHJcblx0XHRcdFx0XHRcdHJbMl0gPSB2W3ArK107IC8vIHNpbXBsZSBjb2RlIGlzIGp1c3QgdGhlIHZhbHVlXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyWzBdID0gLyogKGJ5dGUpICovKGVbdltwXSAtIHNdICsgMTYgKyA2NCk7IC8vIG5vbi1zaW1wbGUtLWxvb2tcclxuXHRcdFx0XHRcdFx0Ly8gdXAgaW4gbGlzdHNcclxuXHRcdFx0XHRcdFx0clsyXSA9IGRbdltwKytdIC0gc107XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gZmlsbCBjb2RlLWxpa2UgZW50cmllcyB3aXRoIHJcclxuXHRcdFx0XHRcdGYgPSAxIDw8IChrIC0gdyk7XHJcblx0XHRcdFx0XHRmb3IgKGogPSBpID4+PiB3OyBqIDwgejsgaiArPSBmKSB7XHJcblx0XHRcdFx0XHRcdGhwLnNldChyLCAocSArIGopICogMyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gYmFja3dhcmRzIGluY3JlbWVudCB0aGUgay1iaXQgY29kZSBpXHJcblx0XHRcdFx0XHRmb3IgKGogPSAxIDw8IChrIC0gMSk7IChpICYgaikgIT09IDA7IGogPj4+PSAxKSB7XHJcblx0XHRcdFx0XHRcdGkgXj0gajtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGkgXj0gajtcclxuXHJcblx0XHRcdFx0XHQvLyBiYWNrdXAgb3ZlciBmaW5pc2hlZCB0YWJsZXNcclxuXHRcdFx0XHRcdG1hc2sgPSAoMSA8PCB3KSAtIDE7IC8vIG5lZWRlZCBvbiBIUCwgY2MgLU8gYnVnXHJcblx0XHRcdFx0XHR3aGlsZSAoKGkgJiBtYXNrKSAhPSB4W2hdKSB7XHJcblx0XHRcdFx0XHRcdGgtLTsgLy8gZG9uJ3QgbmVlZCB0byB1cGRhdGUgcVxyXG5cdFx0XHRcdFx0XHR3IC09IGw7XHJcblx0XHRcdFx0XHRcdG1hc2sgPSAoMSA8PCB3KSAtIDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFJldHVybiBaX0JVRl9FUlJPUiBpZiB3ZSB3ZXJlIGdpdmVuIGFuIGluY29tcGxldGUgdGFibGVcclxuXHRcdFx0cmV0dXJuIHkgIT09IDAgJiYgZyAhPSAxID8gWl9CVUZfRVJST1IgOiBaX09LO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGluaXRXb3JrQXJlYSh2c2l6ZSkge1xyXG5cdFx0XHR2YXIgaTtcclxuXHRcdFx0aWYgKCFobikge1xyXG5cdFx0XHRcdGhuID0gW107IC8vIFtdOyAvL25ldyBBcnJheSgxKTtcclxuXHRcdFx0XHR2ID0gW107IC8vIG5ldyBBcnJheSh2c2l6ZSk7XHJcblx0XHRcdFx0YyA9IG5ldyBJbnQzMkFycmF5KEJNQVggKyAxKTsgLy8gbmV3IEFycmF5KEJNQVggKyAxKTtcclxuXHRcdFx0XHRyID0gW107IC8vIG5ldyBBcnJheSgzKTtcclxuXHRcdFx0XHR1ID0gbmV3IEludDMyQXJyYXkoQk1BWCk7IC8vIG5ldyBBcnJheShCTUFYKTtcclxuXHRcdFx0XHR4ID0gbmV3IEludDMyQXJyYXkoQk1BWCArIDEpOyAvLyBuZXcgQXJyYXkoQk1BWCArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh2Lmxlbmd0aCA8IHZzaXplKSB7XHJcblx0XHRcdFx0diA9IFtdOyAvLyBuZXcgQXJyYXkodnNpemUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAoaSA9IDA7IGkgPCB2c2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0dltpXSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IEJNQVggKyAxOyBpKyspIHtcclxuXHRcdFx0XHRjW2ldID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcblx0XHRcdFx0cltpXSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZm9yKGludCBpPTA7IGk8Qk1BWDsgaSsrKXt1W2ldPTA7fVxyXG5cdFx0XHR1LnNldChjLnN1YmFycmF5KDAsIEJNQVgpLCAwKTtcclxuXHRcdFx0Ly8gZm9yKGludCBpPTA7IGk8Qk1BWCsxOyBpKyspe3hbaV09MDt9XHJcblx0XHRcdHguc2V0KGMuc3ViYXJyYXkoMCwgQk1BWCArIDEpLCAwKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGF0LmluZmxhdGVfdHJlZXNfYml0cyA9IGZ1bmN0aW9uKGMsIC8vIDE5IGNvZGUgbGVuZ3Roc1xyXG5cdFx0YmIsIC8vIGJpdHMgdHJlZSBkZXNpcmVkL2FjdHVhbCBkZXB0aFxyXG5cdFx0dGIsIC8vIGJpdHMgdHJlZSByZXN1bHRcclxuXHRcdGhwLCAvLyBzcGFjZSBmb3IgdHJlZXNcclxuXHRcdHogLy8gZm9yIG1lc3NhZ2VzXHJcblx0XHQpIHtcclxuXHRcdFx0dmFyIHJlc3VsdDtcclxuXHRcdFx0aW5pdFdvcmtBcmVhKDE5KTtcclxuXHRcdFx0aG5bMF0gPSAwO1xyXG5cdFx0XHRyZXN1bHQgPSBodWZ0X2J1aWxkKGMsIDAsIDE5LCAxOSwgbnVsbCwgbnVsbCwgdGIsIGJiLCBocCwgaG4sIHYpO1xyXG5cclxuXHRcdFx0aWYgKHJlc3VsdCA9PSBaX0RBVEFfRVJST1IpIHtcclxuXHRcdFx0XHR6Lm1zZyA9IFwib3ZlcnN1YnNjcmliZWQgZHluYW1pYyBiaXQgbGVuZ3RocyB0cmVlXCI7XHJcblx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IFpfQlVGX0VSUk9SIHx8IGJiWzBdID09PSAwKSB7XHJcblx0XHRcdFx0ei5tc2cgPSBcImluY29tcGxldGUgZHluYW1pYyBiaXQgbGVuZ3RocyB0cmVlXCI7XHJcblx0XHRcdFx0cmVzdWx0ID0gWl9EQVRBX0VSUk9SO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuaW5mbGF0ZV90cmVlc19keW5hbWljID0gZnVuY3Rpb24obmwsIC8vIG51bWJlciBvZiBsaXRlcmFsL2xlbmd0aCBjb2Rlc1xyXG5cdFx0bmQsIC8vIG51bWJlciBvZiBkaXN0YW5jZSBjb2Rlc1xyXG5cdFx0YywgLy8gdGhhdCBtYW55ICh0b3RhbCkgY29kZSBsZW5ndGhzXHJcblx0XHRibCwgLy8gbGl0ZXJhbCBkZXNpcmVkL2FjdHVhbCBiaXQgZGVwdGhcclxuXHRcdGJkLCAvLyBkaXN0YW5jZSBkZXNpcmVkL2FjdHVhbCBiaXQgZGVwdGhcclxuXHRcdHRsLCAvLyBsaXRlcmFsL2xlbmd0aCB0cmVlIHJlc3VsdFxyXG5cdFx0dGQsIC8vIGRpc3RhbmNlIHRyZWUgcmVzdWx0XHJcblx0XHRocCwgLy8gc3BhY2UgZm9yIHRyZWVzXHJcblx0XHR6IC8vIGZvciBtZXNzYWdlc1xyXG5cdFx0KSB7XHJcblx0XHRcdHZhciByZXN1bHQ7XHJcblxyXG5cdFx0XHQvLyBidWlsZCBsaXRlcmFsL2xlbmd0aCB0cmVlXHJcblx0XHRcdGluaXRXb3JrQXJlYSgyODgpO1xyXG5cdFx0XHRoblswXSA9IDA7XHJcblx0XHRcdHJlc3VsdCA9IGh1ZnRfYnVpbGQoYywgMCwgbmwsIDI1NywgY3BsZW5zLCBjcGxleHQsIHRsLCBibCwgaHAsIGhuLCB2KTtcclxuXHRcdFx0aWYgKHJlc3VsdCAhPSBaX09LIHx8IGJsWzBdID09PSAwKSB7XHJcblx0XHRcdFx0aWYgKHJlc3VsdCA9PSBaX0RBVEFfRVJST1IpIHtcclxuXHRcdFx0XHRcdHoubXNnID0gXCJvdmVyc3Vic2NyaWJlZCBsaXRlcmFsL2xlbmd0aCB0cmVlXCI7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgIT0gWl9NRU1fRVJST1IpIHtcclxuXHRcdFx0XHRcdHoubXNnID0gXCJpbmNvbXBsZXRlIGxpdGVyYWwvbGVuZ3RoIHRyZWVcIjtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IFpfREFUQV9FUlJPUjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gYnVpbGQgZGlzdGFuY2UgdHJlZVxyXG5cdFx0XHRpbml0V29ya0FyZWEoMjg4KTtcclxuXHRcdFx0cmVzdWx0ID0gaHVmdF9idWlsZChjLCBubCwgbmQsIDAsIGNwZGlzdCwgY3BkZXh0LCB0ZCwgYmQsIGhwLCBobiwgdik7XHJcblxyXG5cdFx0XHRpZiAocmVzdWx0ICE9IFpfT0sgfHwgKGJkWzBdID09PSAwICYmIG5sID4gMjU3KSkge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT0gWl9EQVRBX0VSUk9SKSB7XHJcblx0XHRcdFx0XHR6Lm1zZyA9IFwib3ZlcnN1YnNjcmliZWQgZGlzdGFuY2UgdHJlZVwiO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ID09IFpfQlVGX0VSUk9SKSB7XHJcblx0XHRcdFx0XHR6Lm1zZyA9IFwiaW5jb21wbGV0ZSBkaXN0YW5jZSB0cmVlXCI7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBaX0RBVEFfRVJST1I7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChyZXN1bHQgIT0gWl9NRU1fRVJST1IpIHtcclxuXHRcdFx0XHRcdHoubXNnID0gXCJlbXB0eSBkaXN0YW5jZSB0cmVlIHdpdGggbGVuZ3Roc1wiO1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gWl9EQVRBX0VSUk9SO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdH07XHJcblxyXG5cdH1cclxuXHJcblx0SW5mVHJlZS5pbmZsYXRlX3RyZWVzX2ZpeGVkID0gZnVuY3Rpb24oYmwsIC8vIGxpdGVyYWwgZGVzaXJlZC9hY3R1YWwgYml0IGRlcHRoXHJcblx0YmQsIC8vIGRpc3RhbmNlIGRlc2lyZWQvYWN0dWFsIGJpdCBkZXB0aFxyXG5cdHRsLC8vIGxpdGVyYWwvbGVuZ3RoIHRyZWUgcmVzdWx0XHJcblx0dGQvLyBkaXN0YW5jZSB0cmVlIHJlc3VsdFxyXG5cdCkge1xyXG5cdFx0YmxbMF0gPSBmaXhlZF9ibDtcclxuXHRcdGJkWzBdID0gZml4ZWRfYmQ7XHJcblx0XHR0bFswXSA9IGZpeGVkX3RsO1xyXG5cdFx0dGRbMF0gPSBmaXhlZF90ZDtcclxuXHRcdHJldHVybiBaX09LO1xyXG5cdH07XHJcblxyXG5cdC8vIEluZkNvZGVzXHJcblxyXG5cdC8vIHdhaXRpbmcgZm9yIFwiaTpcIj1pbnB1dCxcclxuXHQvLyBcIm86XCI9b3V0cHV0LFxyXG5cdC8vIFwieDpcIj1ub3RoaW5nXHJcblx0dmFyIFNUQVJUID0gMDsgLy8geDogc2V0IHVwIGZvciBMRU5cclxuXHR2YXIgTEVOID0gMTsgLy8gaTogZ2V0IGxlbmd0aC9saXRlcmFsL2VvYiBuZXh0XHJcblx0dmFyIExFTkVYVCA9IDI7IC8vIGk6IGdldHRpbmcgbGVuZ3RoIGV4dHJhIChoYXZlIGJhc2UpXHJcblx0dmFyIERJU1QgPSAzOyAvLyBpOiBnZXQgZGlzdGFuY2UgbmV4dFxyXG5cdHZhciBESVNURVhUID0gNDsvLyBpOiBnZXR0aW5nIGRpc3RhbmNlIGV4dHJhXHJcblx0dmFyIENPUFkgPSA1OyAvLyBvOiBjb3B5aW5nIGJ5dGVzIGluIHdpbmRvdywgd2FpdGluZ1xyXG5cdC8vIGZvciBzcGFjZVxyXG5cdHZhciBMSVQgPSA2OyAvLyBvOiBnb3QgbGl0ZXJhbCwgd2FpdGluZyBmb3Igb3V0cHV0XHJcblx0Ly8gc3BhY2VcclxuXHR2YXIgV0FTSCA9IDc7IC8vIG86IGdvdCBlb2IsIHBvc3NpYmx5IHN0aWxsIG91dHB1dFxyXG5cdC8vIHdhaXRpbmdcclxuXHR2YXIgRU5EID0gODsgLy8geDogZ290IGVvYiBhbmQgYWxsIGRhdGEgZmx1c2hlZFxyXG5cdHZhciBCQURDT0RFID0gOTsvLyB4OiBnb3QgZXJyb3JcclxuXHJcblx0ZnVuY3Rpb24gSW5mQ29kZXMoKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIG1vZGU7IC8vIGN1cnJlbnQgaW5mbGF0ZV9jb2RlcyBtb2RlXHJcblxyXG5cdFx0Ly8gbW9kZSBkZXBlbmRlbnQgaW5mb3JtYXRpb25cclxuXHRcdHZhciBsZW4gPSAwO1xyXG5cclxuXHRcdHZhciB0cmVlOyAvLyBwb2ludGVyIGludG8gdHJlZVxyXG5cdFx0dmFyIHRyZWVfaW5kZXggPSAwO1xyXG5cdFx0dmFyIG5lZWQgPSAwOyAvLyBiaXRzIG5lZWRlZFxyXG5cclxuXHRcdHZhciBsaXQgPSAwO1xyXG5cclxuXHRcdC8vIGlmIEVYVCBvciBDT1BZLCB3aGVyZSBhbmQgaG93IG11Y2hcclxuXHRcdHZhciBnZXQgPSAwOyAvLyBiaXRzIHRvIGdldCBmb3IgZXh0cmFcclxuXHRcdHZhciBkaXN0ID0gMDsgLy8gZGlzdGFuY2UgYmFjayB0byBjb3B5IGZyb21cclxuXHJcblx0XHR2YXIgbGJpdHMgPSAwOyAvLyBsdHJlZSBiaXRzIGRlY29kZWQgcGVyIGJyYW5jaFxyXG5cdFx0dmFyIGRiaXRzID0gMDsgLy8gZHRyZWUgYml0cyBkZWNvZGVyIHBlciBicmFuY2hcclxuXHRcdHZhciBsdHJlZTsgLy8gbGl0ZXJhbC9sZW5ndGgvZW9iIHRyZWVcclxuXHRcdHZhciBsdHJlZV9pbmRleCA9IDA7IC8vIGxpdGVyYWwvbGVuZ3RoL2VvYiB0cmVlXHJcblx0XHR2YXIgZHRyZWU7IC8vIGRpc3RhbmNlIHRyZWVcclxuXHRcdHZhciBkdHJlZV9pbmRleCA9IDA7IC8vIGRpc3RhbmNlIHRyZWVcclxuXHJcblx0XHQvLyBDYWxsZWQgd2l0aCBudW1iZXIgb2YgYnl0ZXMgbGVmdCB0byB3cml0ZSBpbiB3aW5kb3cgYXQgbGVhc3QgMjU4XHJcblx0XHQvLyAodGhlIG1heGltdW0gc3RyaW5nIGxlbmd0aCkgYW5kIG51bWJlciBvZiBpbnB1dCBieXRlcyBhdmFpbGFibGVcclxuXHRcdC8vIGF0IGxlYXN0IHRlbi4gVGhlIHRlbiBieXRlcyBhcmUgc2l4IGJ5dGVzIGZvciB0aGUgbG9uZ2VzdCBsZW5ndGgvXHJcblx0XHQvLyBkaXN0YW5jZSBwYWlyIHBsdXMgZm91ciBieXRlcyBmb3Igb3ZlcmxvYWRpbmcgdGhlIGJpdCBidWZmZXIuXHJcblxyXG5cdFx0ZnVuY3Rpb24gaW5mbGF0ZV9mYXN0KGJsLCBiZCwgdGwsIHRsX2luZGV4LCB0ZCwgdGRfaW5kZXgsIHMsIHopIHtcclxuXHRcdFx0dmFyIHQ7IC8vIHRlbXBvcmFyeSBwb2ludGVyXHJcblx0XHRcdHZhciB0cDsgLy8gdGVtcG9yYXJ5IHBvaW50ZXJcclxuXHRcdFx0dmFyIHRwX2luZGV4OyAvLyB0ZW1wb3JhcnkgcG9pbnRlclxyXG5cdFx0XHR2YXIgZTsgLy8gZXh0cmEgYml0cyBvciBvcGVyYXRpb25cclxuXHRcdFx0dmFyIGI7IC8vIGJpdCBidWZmZXJcclxuXHRcdFx0dmFyIGs7IC8vIGJpdHMgaW4gYml0IGJ1ZmZlclxyXG5cdFx0XHR2YXIgcDsgLy8gaW5wdXQgZGF0YSBwb2ludGVyXHJcblx0XHRcdHZhciBuOyAvLyBieXRlcyBhdmFpbGFibGUgdGhlcmVcclxuXHRcdFx0dmFyIHE7IC8vIG91dHB1dCB3aW5kb3cgd3JpdGUgcG9pbnRlclxyXG5cdFx0XHR2YXIgbTsgLy8gYnl0ZXMgdG8gZW5kIG9mIHdpbmRvdyBvciByZWFkIHBvaW50ZXJcclxuXHRcdFx0dmFyIG1sOyAvLyBtYXNrIGZvciBsaXRlcmFsL2xlbmd0aCB0cmVlXHJcblx0XHRcdHZhciBtZDsgLy8gbWFzayBmb3IgZGlzdGFuY2UgdHJlZVxyXG5cdFx0XHR2YXIgYzsgLy8gYnl0ZXMgdG8gY29weVxyXG5cdFx0XHR2YXIgZDsgLy8gZGlzdGFuY2UgYmFjayB0byBjb3B5IGZyb21cclxuXHRcdFx0dmFyIHI7IC8vIGNvcHkgc291cmNlIHBvaW50ZXJcclxuXHJcblx0XHRcdHZhciB0cF9pbmRleF90XzM7IC8vICh0cF9pbmRleCt0KSozXHJcblxyXG5cdFx0XHQvLyBsb2FkIGlucHV0LCBvdXRwdXQsIGJpdCB2YWx1ZXNcclxuXHRcdFx0cCA9IHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0biA9IHouYXZhaWxfaW47XHJcblx0XHRcdGIgPSBzLmJpdGI7XHJcblx0XHRcdGsgPSBzLmJpdGs7XHJcblx0XHRcdHEgPSBzLndyaXRlO1xyXG5cdFx0XHRtID0gcSA8IHMucmVhZCA/IHMucmVhZCAtIHEgLSAxIDogcy5lbmQgLSBxO1xyXG5cclxuXHRcdFx0Ly8gaW5pdGlhbGl6ZSBtYXNrc1xyXG5cdFx0XHRtbCA9IGluZmxhdGVfbWFza1tibF07XHJcblx0XHRcdG1kID0gaW5mbGF0ZV9tYXNrW2JkXTtcclxuXHJcblx0XHRcdC8vIGRvIHVudGlsIG5vdCBlbm91Z2ggaW5wdXQgb3Igb3V0cHV0IHNwYWNlIGZvciBmYXN0IGxvb3BcclxuXHRcdFx0ZG8geyAvLyBhc3N1bWUgY2FsbGVkIHdpdGggbSA+PSAyNTggJiYgbiA+PSAxMFxyXG5cdFx0XHRcdC8vIGdldCBsaXRlcmFsL2xlbmd0aCBjb2RlXHJcblx0XHRcdFx0d2hpbGUgKGsgPCAoMjApKSB7IC8vIG1heCBiaXRzIGZvciBsaXRlcmFsL2xlbmd0aCBjb2RlXHJcblx0XHRcdFx0XHRuLS07XHJcblx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHQgPSBiICYgbWw7XHJcblx0XHRcdFx0dHAgPSB0bDtcclxuXHRcdFx0XHR0cF9pbmRleCA9IHRsX2luZGV4O1xyXG5cdFx0XHRcdHRwX2luZGV4X3RfMyA9ICh0cF9pbmRleCArIHQpICogMztcclxuXHRcdFx0XHRpZiAoKGUgPSB0cFt0cF9pbmRleF90XzNdKSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0YiA+Pj0gKHRwW3RwX2luZGV4X3RfMyArIDFdKTtcclxuXHRcdFx0XHRcdGsgLT0gKHRwW3RwX2luZGV4X3RfMyArIDFdKTtcclxuXHJcblx0XHRcdFx0XHRzLndpbmRvd1txKytdID0gLyogKGJ5dGUpICovdHBbdHBfaW5kZXhfdF8zICsgMl07XHJcblx0XHRcdFx0XHRtLS07XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZG8ge1xyXG5cclxuXHRcdFx0XHRcdGIgPj49ICh0cFt0cF9pbmRleF90XzMgKyAxXSk7XHJcblx0XHRcdFx0XHRrIC09ICh0cFt0cF9pbmRleF90XzMgKyAxXSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKChlICYgMTYpICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdGUgJj0gMTU7XHJcblx0XHRcdFx0XHRcdGMgPSB0cFt0cF9pbmRleF90XzMgKyAyXSArICgvKiAoaW50KSAqL2IgJiBpbmZsYXRlX21hc2tbZV0pO1xyXG5cclxuXHRcdFx0XHRcdFx0YiA+Pj0gZTtcclxuXHRcdFx0XHRcdFx0ayAtPSBlO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gZGVjb2RlIGRpc3RhbmNlIGJhc2Ugb2YgYmxvY2sgdG8gY29weVxyXG5cdFx0XHRcdFx0XHR3aGlsZSAoayA8ICgxNSkpIHsgLy8gbWF4IGJpdHMgZm9yIGRpc3RhbmNlIGNvZGVcclxuXHRcdFx0XHRcdFx0XHRuLS07XHJcblx0XHRcdFx0XHRcdFx0YiB8PSAoei5yZWFkX2J5dGUocCsrKSAmIDB4ZmYpIDw8IGs7XHJcblx0XHRcdFx0XHRcdFx0ayArPSA4O1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR0ID0gYiAmIG1kO1xyXG5cdFx0XHRcdFx0XHR0cCA9IHRkO1xyXG5cdFx0XHRcdFx0XHR0cF9pbmRleCA9IHRkX2luZGV4O1xyXG5cdFx0XHRcdFx0XHR0cF9pbmRleF90XzMgPSAodHBfaW5kZXggKyB0KSAqIDM7XHJcblx0XHRcdFx0XHRcdGUgPSB0cFt0cF9pbmRleF90XzNdO1xyXG5cclxuXHRcdFx0XHRcdFx0ZG8ge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRiID4+PSAodHBbdHBfaW5kZXhfdF8zICsgMV0pO1xyXG5cdFx0XHRcdFx0XHRcdGsgLT0gKHRwW3RwX2luZGV4X3RfMyArIDFdKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKChlICYgMTYpICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBnZXQgZXh0cmEgYml0cyB0byBhZGQgdG8gZGlzdGFuY2UgYmFzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZSAmPSAxNTtcclxuXHRcdFx0XHRcdFx0XHRcdHdoaWxlIChrIDwgKGUpKSB7IC8vIGdldCBleHRyYSBiaXRzICh1cCB0byAxMylcclxuXHRcdFx0XHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0ayArPSA4O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGQgPSB0cFt0cF9pbmRleF90XzMgKyAyXSArIChiICYgaW5mbGF0ZV9tYXNrW2VdKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRiID4+PSAoZSk7XHJcblx0XHRcdFx0XHRcdFx0XHRrIC09IChlKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBkbyB0aGUgY29weVxyXG5cdFx0XHRcdFx0XHRcdFx0bSAtPSBjO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHEgPj0gZCkgeyAvLyBvZmZzZXQgYmVmb3JlIGRlc3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8ganVzdCBjb3B5XHJcblx0XHRcdFx0XHRcdFx0XHRcdHIgPSBxIC0gZDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHEgLSByID4gMCAmJiAyID4gKHEgLSByKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHMud2luZG93W3ErK10gPSBzLndpbmRvd1tyKytdOyAvLyBtaW5pbXVtXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY291bnQgaXNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyB0aHJlZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzLndpbmRvd1txKytdID0gcy53aW5kb3dbcisrXTsgLy8gc28gdW5yb2xsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gbG9vcCBhXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gbGl0dGxlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YyAtPSAyO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHMud2luZG93LnNldChzLndpbmRvdy5zdWJhcnJheShyLCByICsgMiksIHEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHEgKz0gMjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyICs9IDI7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YyAtPSAyO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgeyAvLyBlbHNlIG9mZnNldCBhZnRlciBkZXN0aW5hdGlvblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyID0gcSAtIGQ7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyICs9IHMuZW5kOyAvLyBmb3JjZSBwb2ludGVyIGluIHdpbmRvd1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IHdoaWxlIChyIDwgMCk7IC8vIGNvdmVycyBpbnZhbGlkIGRpc3RhbmNlc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlID0gcy5lbmQgLSByO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYyA+IGUpIHsgLy8gaWYgc291cmNlIGNyb3NzZXMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YyAtPSBlOyAvLyB3cmFwcGVkIGNvcHlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocSAtIHIgPiAwICYmIGUgPiAocSAtIHIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkbyB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHMud2luZG93W3ErK10gPSBzLndpbmRvd1tyKytdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSB3aGlsZSAoLS1lICE9PSAwKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cy53aW5kb3cuc2V0KHMud2luZG93LnN1YmFycmF5KHIsIHIgKyBlKSwgcSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRxICs9IGU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyICs9IGU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ciA9IDA7IC8vIGNvcHkgcmVzdCBmcm9tIHN0YXJ0IG9mIHdpbmRvd1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNvcHkgYWxsIG9yIHdoYXQncyBsZWZ0XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocSAtIHIgPiAwICYmIGMgPiAocSAtIHIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzLndpbmRvd1txKytdID0gcy53aW5kb3dbcisrXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSB3aGlsZSAoLS1jICE9PSAwKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHMud2luZG93LnNldChzLndpbmRvdy5zdWJhcnJheShyLCByICsgYyksIHEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRxICs9IGM7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHIgKz0gYztcclxuXHRcdFx0XHRcdFx0XHRcdFx0YyA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKChlICYgNjQpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0ICs9IHRwW3RwX2luZGV4X3RfMyArIDJdO1xyXG5cdFx0XHRcdFx0XHRcdFx0dCArPSAoYiAmIGluZmxhdGVfbWFza1tlXSk7XHJcblx0XHRcdFx0XHRcdFx0XHR0cF9pbmRleF90XzMgPSAodHBfaW5kZXggKyB0KSAqIDM7XHJcblx0XHRcdFx0XHRcdFx0XHRlID0gdHBbdHBfaW5kZXhfdF8zXTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0ei5tc2cgPSBcImludmFsaWQgZGlzdGFuY2UgY29kZVwiO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGMgPSB6LmF2YWlsX2luIC0gbjtcclxuXHRcdFx0XHRcdFx0XHRcdGMgPSAoayA+PiAzKSA8IGMgPyBrID4+IDMgOiBjO1xyXG5cdFx0XHRcdFx0XHRcdFx0biArPSBjO1xyXG5cdFx0XHRcdFx0XHRcdFx0cCAtPSBjO1xyXG5cdFx0XHRcdFx0XHRcdFx0ayAtPSBjIDw8IDM7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gWl9EQVRBX0VSUk9SO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSB3aGlsZSAodHJ1ZSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICgoZSAmIDY0KSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHR0ICs9IHRwW3RwX2luZGV4X3RfMyArIDJdO1xyXG5cdFx0XHRcdFx0XHR0ICs9IChiICYgaW5mbGF0ZV9tYXNrW2VdKTtcclxuXHRcdFx0XHRcdFx0dHBfaW5kZXhfdF8zID0gKHRwX2luZGV4ICsgdCkgKiAzO1xyXG5cdFx0XHRcdFx0XHRpZiAoKGUgPSB0cFt0cF9pbmRleF90XzNdKSA9PT0gMCkge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRiID4+PSAodHBbdHBfaW5kZXhfdF8zICsgMV0pO1xyXG5cdFx0XHRcdFx0XHRcdGsgLT0gKHRwW3RwX2luZGV4X3RfMyArIDFdKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0cy53aW5kb3dbcSsrXSA9IC8qIChieXRlKSAqL3RwW3RwX2luZGV4X3RfMyArIDJdO1xyXG5cdFx0XHRcdFx0XHRcdG0tLTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICgoZSAmIDMyKSAhPT0gMCkge1xyXG5cclxuXHRcdFx0XHRcdFx0YyA9IHouYXZhaWxfaW4gLSBuO1xyXG5cdFx0XHRcdFx0XHRjID0gKGsgPj4gMykgPCBjID8gayA+PiAzIDogYztcclxuXHRcdFx0XHRcdFx0biArPSBjO1xyXG5cdFx0XHRcdFx0XHRwIC09IGM7XHJcblx0XHRcdFx0XHRcdGsgLT0gYyA8PCAzO1xyXG5cclxuXHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRU5EO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0ei5tc2cgPSBcImludmFsaWQgbGl0ZXJhbC9sZW5ndGggY29kZVwiO1xyXG5cclxuXHRcdFx0XHRcdFx0YyA9IHouYXZhaWxfaW4gLSBuO1xyXG5cdFx0XHRcdFx0XHRjID0gKGsgPj4gMykgPCBjID8gayA+PiAzIDogYztcclxuXHRcdFx0XHRcdFx0biArPSBjO1xyXG5cdFx0XHRcdFx0XHRwIC09IGM7XHJcblx0XHRcdFx0XHRcdGsgLT0gYyA8PCAzO1xyXG5cclxuXHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gWl9EQVRBX0VSUk9SO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gd2hpbGUgKHRydWUpO1xyXG5cdFx0XHR9IHdoaWxlIChtID49IDI1OCAmJiBuID49IDEwKTtcclxuXHJcblx0XHRcdC8vIG5vdCBlbm91Z2ggaW5wdXQgb3Igb3V0cHV0LS1yZXN0b3JlIHBvaW50ZXJzIGFuZCByZXR1cm5cclxuXHRcdFx0YyA9IHouYXZhaWxfaW4gLSBuO1xyXG5cdFx0XHRjID0gKGsgPj4gMykgPCBjID8gayA+PiAzIDogYztcclxuXHRcdFx0biArPSBjO1xyXG5cdFx0XHRwIC09IGM7XHJcblx0XHRcdGsgLT0gYyA8PCAzO1xyXG5cclxuXHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0cy53cml0ZSA9IHE7XHJcblxyXG5cdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdH1cclxuXHJcblx0XHR0aGF0LmluaXQgPSBmdW5jdGlvbihibCwgYmQsIHRsLCB0bF9pbmRleCwgdGQsIHRkX2luZGV4KSB7XHJcblx0XHRcdG1vZGUgPSBTVEFSVDtcclxuXHRcdFx0bGJpdHMgPSAvKiAoYnl0ZSkgKi9ibDtcclxuXHRcdFx0ZGJpdHMgPSAvKiAoYnl0ZSkgKi9iZDtcclxuXHRcdFx0bHRyZWUgPSB0bDtcclxuXHRcdFx0bHRyZWVfaW5kZXggPSB0bF9pbmRleDtcclxuXHRcdFx0ZHRyZWUgPSB0ZDtcclxuXHRcdFx0ZHRyZWVfaW5kZXggPSB0ZF9pbmRleDtcclxuXHRcdFx0dHJlZSA9IG51bGw7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQucHJvYyA9IGZ1bmN0aW9uKHMsIHosIHIpIHtcclxuXHRcdFx0dmFyIGo7IC8vIHRlbXBvcmFyeSBzdG9yYWdlXHJcblx0XHRcdHZhciB0aW5kZXg7IC8vIHRlbXBvcmFyeSBwb2ludGVyXHJcblx0XHRcdHZhciBlOyAvLyBleHRyYSBiaXRzIG9yIG9wZXJhdGlvblxyXG5cdFx0XHR2YXIgYiA9IDA7IC8vIGJpdCBidWZmZXJcclxuXHRcdFx0dmFyIGsgPSAwOyAvLyBiaXRzIGluIGJpdCBidWZmZXJcclxuXHRcdFx0dmFyIHAgPSAwOyAvLyBpbnB1dCBkYXRhIHBvaW50ZXJcclxuXHRcdFx0dmFyIG47IC8vIGJ5dGVzIGF2YWlsYWJsZSB0aGVyZVxyXG5cdFx0XHR2YXIgcTsgLy8gb3V0cHV0IHdpbmRvdyB3cml0ZSBwb2ludGVyXHJcblx0XHRcdHZhciBtOyAvLyBieXRlcyB0byBlbmQgb2Ygd2luZG93IG9yIHJlYWQgcG9pbnRlclxyXG5cdFx0XHR2YXIgZjsgLy8gcG9pbnRlciB0byBjb3B5IHN0cmluZ3MgZnJvbVxyXG5cclxuXHRcdFx0Ly8gY29weSBpbnB1dC9vdXRwdXQgaW5mb3JtYXRpb24gdG8gbG9jYWxzIChVUERBVEUgbWFjcm8gcmVzdG9yZXMpXHJcblx0XHRcdHAgPSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdG4gPSB6LmF2YWlsX2luO1xyXG5cdFx0XHRiID0gcy5iaXRiO1xyXG5cdFx0XHRrID0gcy5iaXRrO1xyXG5cdFx0XHRxID0gcy53cml0ZTtcclxuXHRcdFx0bSA9IHEgPCBzLnJlYWQgPyBzLnJlYWQgLSBxIC0gMSA6IHMuZW5kIC0gcTtcclxuXHJcblx0XHRcdC8vIHByb2Nlc3MgaW5wdXQgYW5kIG91dHB1dCBiYXNlZCBvbiBjdXJyZW50IHN0YXRlXHJcblx0XHRcdHdoaWxlICh0cnVlKSB7XHJcblx0XHRcdFx0c3dpdGNoIChtb2RlKSB7XHJcblx0XHRcdFx0Ly8gd2FpdGluZyBmb3IgXCJpOlwiPWlucHV0LCBcIm86XCI9b3V0cHV0LCBcIng6XCI9bm90aGluZ1xyXG5cdFx0XHRcdGNhc2UgU1RBUlQ6IC8vIHg6IHNldCB1cCBmb3IgTEVOXHJcblx0XHRcdFx0XHRpZiAobSA+PSAyNTggJiYgbiA+PSAxMCkge1xyXG5cclxuXHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdHIgPSBpbmZsYXRlX2Zhc3QobGJpdHMsIGRiaXRzLCBsdHJlZSwgbHRyZWVfaW5kZXgsIGR0cmVlLCBkdHJlZV9pbmRleCwgcywgeik7XHJcblxyXG5cdFx0XHRcdFx0XHRwID0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHRuID0gei5hdmFpbF9pbjtcclxuXHRcdFx0XHRcdFx0YiA9IHMuYml0YjtcclxuXHRcdFx0XHRcdFx0ayA9IHMuYml0aztcclxuXHRcdFx0XHRcdFx0cSA9IHMud3JpdGU7XHJcblx0XHRcdFx0XHRcdG0gPSBxIDwgcy5yZWFkID8gcy5yZWFkIC0gcSAtIDEgOiBzLmVuZCAtIHE7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAociAhPSBaX09LKSB7XHJcblx0XHRcdFx0XHRcdFx0bW9kZSA9IHIgPT0gWl9TVFJFQU1fRU5EID8gV0FTSCA6IEJBRENPREU7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5lZWQgPSBsYml0cztcclxuXHRcdFx0XHRcdHRyZWUgPSBsdHJlZTtcclxuXHRcdFx0XHRcdHRyZWVfaW5kZXggPSBsdHJlZV9pbmRleDtcclxuXHJcblx0XHRcdFx0XHRtb2RlID0gTEVOO1xyXG5cdFx0XHRcdGNhc2UgTEVOOiAvLyBpOiBnZXQgbGVuZ3RoL2xpdGVyYWwvZW9iIG5leHRcclxuXHRcdFx0XHRcdGogPSBuZWVkO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChrIDwgKGopKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuICE9PSAwKVxyXG5cdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0ayArPSA4O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRpbmRleCA9ICh0cmVlX2luZGV4ICsgKGIgJiBpbmZsYXRlX21hc2tbal0pKSAqIDM7XHJcblxyXG5cdFx0XHRcdFx0YiA+Pj49ICh0cmVlW3RpbmRleCArIDFdKTtcclxuXHRcdFx0XHRcdGsgLT0gKHRyZWVbdGluZGV4ICsgMV0pO1xyXG5cclxuXHRcdFx0XHRcdGUgPSB0cmVlW3RpbmRleF07XHJcblxyXG5cdFx0XHRcdFx0aWYgKGUgPT09IDApIHsgLy8gbGl0ZXJhbFxyXG5cdFx0XHRcdFx0XHRsaXQgPSB0cmVlW3RpbmRleCArIDJdO1xyXG5cdFx0XHRcdFx0XHRtb2RlID0gTElUO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICgoZSAmIDE2KSAhPT0gMCkgeyAvLyBsZW5ndGhcclxuXHRcdFx0XHRcdFx0Z2V0ID0gZSAmIDE1O1xyXG5cdFx0XHRcdFx0XHRsZW4gPSB0cmVlW3RpbmRleCArIDJdO1xyXG5cdFx0XHRcdFx0XHRtb2RlID0gTEVORVhUO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICgoZSAmIDY0KSA9PT0gMCkgeyAvLyBuZXh0IHRhYmxlXHJcblx0XHRcdFx0XHRcdG5lZWQgPSBlO1xyXG5cdFx0XHRcdFx0XHR0cmVlX2luZGV4ID0gdGluZGV4IC8gMyArIHRyZWVbdGluZGV4ICsgMl07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKChlICYgMzIpICE9PSAwKSB7IC8vIGVuZCBvZiBibG9ja1xyXG5cdFx0XHRcdFx0XHRtb2RlID0gV0FTSDtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRtb2RlID0gQkFEQ09ERTsgLy8gaW52YWxpZCBjb2RlXHJcblx0XHRcdFx0XHR6Lm1zZyA9IFwiaW52YWxpZCBsaXRlcmFsL2xlbmd0aCBjb2RlXCI7XHJcblx0XHRcdFx0XHRyID0gWl9EQVRBX0VSUk9SO1xyXG5cclxuXHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cclxuXHRcdFx0XHRjYXNlIExFTkVYVDogLy8gaTogZ2V0dGluZyBsZW5ndGggZXh0cmEgKGhhdmUgYmFzZSlcclxuXHRcdFx0XHRcdGogPSBnZXQ7XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKGsgPCAoaikpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG4gIT09IDApXHJcblx0XHRcdFx0XHRcdFx0ciA9IFpfT0s7XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRzLmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRuLS07XHJcblx0XHRcdFx0XHRcdGIgfD0gKHoucmVhZF9ieXRlKHArKykgJiAweGZmKSA8PCBrO1xyXG5cdFx0XHRcdFx0XHRrICs9IDg7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0bGVuICs9IChiICYgaW5mbGF0ZV9tYXNrW2pdKTtcclxuXHJcblx0XHRcdFx0XHRiID4+PSBqO1xyXG5cdFx0XHRcdFx0ayAtPSBqO1xyXG5cclxuXHRcdFx0XHRcdG5lZWQgPSBkYml0cztcclxuXHRcdFx0XHRcdHRyZWUgPSBkdHJlZTtcclxuXHRcdFx0XHRcdHRyZWVfaW5kZXggPSBkdHJlZV9pbmRleDtcclxuXHRcdFx0XHRcdG1vZGUgPSBESVNUO1xyXG5cdFx0XHRcdGNhc2UgRElTVDogLy8gaTogZ2V0IGRpc3RhbmNlIG5leHRcclxuXHRcdFx0XHRcdGogPSBuZWVkO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChrIDwgKGopKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuICE9PSAwKVxyXG5cdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0ayArPSA4O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRpbmRleCA9ICh0cmVlX2luZGV4ICsgKGIgJiBpbmZsYXRlX21hc2tbal0pKSAqIDM7XHJcblxyXG5cdFx0XHRcdFx0YiA+Pj0gdHJlZVt0aW5kZXggKyAxXTtcclxuXHRcdFx0XHRcdGsgLT0gdHJlZVt0aW5kZXggKyAxXTtcclxuXHJcblx0XHRcdFx0XHRlID0gKHRyZWVbdGluZGV4XSk7XHJcblx0XHRcdFx0XHRpZiAoKGUgJiAxNikgIT09IDApIHsgLy8gZGlzdGFuY2VcclxuXHRcdFx0XHRcdFx0Z2V0ID0gZSAmIDE1O1xyXG5cdFx0XHRcdFx0XHRkaXN0ID0gdHJlZVt0aW5kZXggKyAyXTtcclxuXHRcdFx0XHRcdFx0bW9kZSA9IERJU1RFWFQ7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKChlICYgNjQpID09PSAwKSB7IC8vIG5leHQgdGFibGVcclxuXHRcdFx0XHRcdFx0bmVlZCA9IGU7XHJcblx0XHRcdFx0XHRcdHRyZWVfaW5kZXggPSB0aW5kZXggLyAzICsgdHJlZVt0aW5kZXggKyAyXTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRtb2RlID0gQkFEQ09ERTsgLy8gaW52YWxpZCBjb2RlXHJcblx0XHRcdFx0XHR6Lm1zZyA9IFwiaW52YWxpZCBkaXN0YW5jZSBjb2RlXCI7XHJcblx0XHRcdFx0XHRyID0gWl9EQVRBX0VSUk9SO1xyXG5cclxuXHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cclxuXHRcdFx0XHRjYXNlIERJU1RFWFQ6IC8vIGk6IGdldHRpbmcgZGlzdGFuY2UgZXh0cmFcclxuXHRcdFx0XHRcdGogPSBnZXQ7XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKGsgPCAoaikpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG4gIT09IDApXHJcblx0XHRcdFx0XHRcdFx0ciA9IFpfT0s7XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRzLmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRuLS07XHJcblx0XHRcdFx0XHRcdGIgfD0gKHoucmVhZF9ieXRlKHArKykgJiAweGZmKSA8PCBrO1xyXG5cdFx0XHRcdFx0XHRrICs9IDg7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0ZGlzdCArPSAoYiAmIGluZmxhdGVfbWFza1tqXSk7XHJcblxyXG5cdFx0XHRcdFx0YiA+Pj0gajtcclxuXHRcdFx0XHRcdGsgLT0gajtcclxuXHJcblx0XHRcdFx0XHRtb2RlID0gQ09QWTtcclxuXHRcdFx0XHRjYXNlIENPUFk6IC8vIG86IGNvcHlpbmcgYnl0ZXMgaW4gd2luZG93LCB3YWl0aW5nIGZvciBzcGFjZVxyXG5cdFx0XHRcdFx0ZiA9IHEgLSBkaXN0O1xyXG5cdFx0XHRcdFx0d2hpbGUgKGYgPCAwKSB7IC8vIG1vZHVsbyB3aW5kb3cgc2l6ZS1cIndoaWxlXCIgaW5zdGVhZFxyXG5cdFx0XHRcdFx0XHRmICs9IHMuZW5kOyAvLyBvZiBcImlmXCIgaGFuZGxlcyBpbnZhbGlkIGRpc3RhbmNlc1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0d2hpbGUgKGxlbiAhPT0gMCkge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKG0gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocSA9PSBzLmVuZCAmJiBzLnJlYWQgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHEgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0bSA9IHEgPCBzLnJlYWQgPyBzLnJlYWQgLSBxIC0gMSA6IHMuZW5kIC0gcTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKG0gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdFx0ciA9IHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0XHRcdHEgPSBzLndyaXRlO1xyXG5cdFx0XHRcdFx0XHRcdFx0bSA9IHEgPCBzLnJlYWQgPyBzLnJlYWQgLSBxIC0gMSA6IHMuZW5kIC0gcTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocSA9PSBzLmVuZCAmJiBzLnJlYWQgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG0gPSBxIDwgcy5yZWFkID8gcy5yZWFkIC0gcSAtIDEgOiBzLmVuZCAtIHE7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG0gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRzLndpbmRvd1txKytdID0gcy53aW5kb3dbZisrXTtcclxuXHRcdFx0XHRcdFx0bS0tO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGYgPT0gcy5lbmQpXHJcblx0XHRcdFx0XHRcdFx0ZiA9IDA7XHJcblx0XHRcdFx0XHRcdGxlbi0tO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bW9kZSA9IFNUQVJUO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBMSVQ6IC8vIG86IGdvdCBsaXRlcmFsLCB3YWl0aW5nIGZvciBvdXRwdXQgc3BhY2VcclxuXHRcdFx0XHRcdGlmIChtID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdGlmIChxID09IHMuZW5kICYmIHMucmVhZCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHEgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdG0gPSBxIDwgcy5yZWFkID8gcy5yZWFkIC0gcSAtIDEgOiBzLmVuZCAtIHE7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKG0gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRyID0gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHRcdHEgPSBzLndyaXRlO1xyXG5cdFx0XHRcdFx0XHRcdG0gPSBxIDwgcy5yZWFkID8gcy5yZWFkIC0gcSAtIDEgOiBzLmVuZCAtIHE7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChxID09IHMuZW5kICYmIHMucmVhZCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRtID0gcSA8IHMucmVhZCA/IHMucmVhZCAtIHEgLSAxIDogcy5lbmQgLSBxO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAobSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyID0gWl9PSztcclxuXHJcblx0XHRcdFx0XHRzLndpbmRvd1txKytdID0gLyogKGJ5dGUpICovbGl0O1xyXG5cdFx0XHRcdFx0bS0tO1xyXG5cclxuXHRcdFx0XHRcdG1vZGUgPSBTVEFSVDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgV0FTSDogLy8gbzogZ290IGVvYiwgcG9zc2libHkgbW9yZSBvdXRwdXRcclxuXHRcdFx0XHRcdGlmIChrID4gNykgeyAvLyByZXR1cm4gdW51c2VkIGJ5dGUsIGlmIGFueVxyXG5cdFx0XHRcdFx0XHRrIC09IDg7XHJcblx0XHRcdFx0XHRcdG4rKztcclxuXHRcdFx0XHRcdFx0cC0tOyAvLyBjYW4gYWx3YXlzIHJldHVybiBvbmVcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHRcdFx0XHRcdHIgPSBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRxID0gcy53cml0ZTtcclxuXHRcdFx0XHRcdG0gPSBxIDwgcy5yZWFkID8gcy5yZWFkIC0gcSAtIDEgOiBzLmVuZCAtIHE7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHMucmVhZCAhPSBzLndyaXRlKSB7XHJcblx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bW9kZSA9IEVORDtcclxuXHRcdFx0XHRjYXNlIEVORDpcclxuXHRcdFx0XHRcdHIgPSBaX1NUUkVBTV9FTkQ7XHJcblx0XHRcdFx0XHRzLmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHJcblx0XHRcdFx0Y2FzZSBCQURDT0RFOiAvLyB4OiBnb3QgZXJyb3JcclxuXHJcblx0XHRcdFx0XHRyID0gWl9EQVRBX0VSUk9SO1xyXG5cclxuXHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0ciA9IFpfU1RSRUFNX0VSUk9SO1xyXG5cclxuXHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmZyZWUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gWkZSRUUoeiwgYyk7XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIEluZkJsb2Nrc1xyXG5cclxuXHQvLyBUYWJsZSBmb3IgZGVmbGF0ZSBmcm9tIFBLWklQJ3MgYXBwbm90ZS50eHQuXHJcblx0dmFyIGJvcmRlciA9IFsgLy8gT3JkZXIgb2YgdGhlIGJpdCBsZW5ndGggY29kZSBsZW5ndGhzXHJcblx0MTYsIDE3LCAxOCwgMCwgOCwgNywgOSwgNiwgMTAsIDUsIDExLCA0LCAxMiwgMywgMTMsIDIsIDE0LCAxLCAxNSBdO1xyXG5cclxuXHR2YXIgVFlQRSA9IDA7IC8vIGdldCB0eXBlIGJpdHMgKDMsIGluY2x1ZGluZyBlbmQgYml0KVxyXG5cdHZhciBMRU5TID0gMTsgLy8gZ2V0IGxlbmd0aHMgZm9yIHN0b3JlZFxyXG5cdHZhciBTVE9SRUQgPSAyOy8vIHByb2Nlc3Npbmcgc3RvcmVkIGJsb2NrXHJcblx0dmFyIFRBQkxFID0gMzsgLy8gZ2V0IHRhYmxlIGxlbmd0aHNcclxuXHR2YXIgQlRSRUUgPSA0OyAvLyBnZXQgYml0IGxlbmd0aHMgdHJlZSBmb3IgYSBkeW5hbWljXHJcblx0Ly8gYmxvY2tcclxuXHR2YXIgRFRSRUUgPSA1OyAvLyBnZXQgbGVuZ3RoLCBkaXN0YW5jZSB0cmVlcyBmb3IgYVxyXG5cdC8vIGR5bmFtaWMgYmxvY2tcclxuXHR2YXIgQ09ERVMgPSA2OyAvLyBwcm9jZXNzaW5nIGZpeGVkIG9yIGR5bmFtaWMgYmxvY2tcclxuXHR2YXIgRFJZID0gNzsgLy8gb3V0cHV0IHJlbWFpbmluZyB3aW5kb3cgYnl0ZXNcclxuXHR2YXIgRE9ORUxPQ0tTID0gODsgLy8gZmluaXNoZWQgbGFzdCBibG9jaywgZG9uZVxyXG5cdHZhciBCQURCTE9DS1MgPSA5OyAvLyBvdCBhIGRhdGEgZXJyb3ItLXN0dWNrIGhlcmVcclxuXHJcblx0ZnVuY3Rpb24gSW5mQmxvY2tzKHosIHcpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHR2YXIgbW9kZSA9IFRZUEU7IC8vIGN1cnJlbnQgaW5mbGF0ZV9ibG9jayBtb2RlXHJcblxyXG5cdFx0dmFyIGxlZnQgPSAwOyAvLyBpZiBTVE9SRUQsIGJ5dGVzIGxlZnQgdG8gY29weVxyXG5cclxuXHRcdHZhciB0YWJsZSA9IDA7IC8vIHRhYmxlIGxlbmd0aHMgKDE0IGJpdHMpXHJcblx0XHR2YXIgaW5kZXggPSAwOyAvLyBpbmRleCBpbnRvIGJsZW5zIChvciBib3JkZXIpXHJcblx0XHR2YXIgYmxlbnM7IC8vIGJpdCBsZW5ndGhzIG9mIGNvZGVzXHJcblx0XHR2YXIgYmIgPSBbIDAgXTsgLy8gYml0IGxlbmd0aCB0cmVlIGRlcHRoXHJcblx0XHR2YXIgdGIgPSBbIDAgXTsgLy8gYml0IGxlbmd0aCBkZWNvZGluZyB0cmVlXHJcblxyXG5cdFx0dmFyIGNvZGVzID0gbmV3IEluZkNvZGVzKCk7IC8vIGlmIENPREVTLCBjdXJyZW50IHN0YXRlXHJcblxyXG5cdFx0dmFyIGxhc3QgPSAwOyAvLyB0cnVlIGlmIHRoaXMgYmxvY2sgaXMgdGhlIGxhc3QgYmxvY2tcclxuXHJcblx0XHR2YXIgaHVmdHMgPSBuZXcgSW50MzJBcnJheShNQU5ZICogMyk7IC8vIHNpbmdsZSBtYWxsb2MgZm9yIHRyZWUgc3BhY2VcclxuXHRcdHZhciBjaGVjayA9IDA7IC8vIGNoZWNrIG9uIG91dHB1dFxyXG5cdFx0dmFyIGluZnRyZWUgPSBuZXcgSW5mVHJlZSgpO1xyXG5cclxuXHRcdHRoYXQuYml0ayA9IDA7IC8vIGJpdHMgaW4gYml0IGJ1ZmZlclxyXG5cdFx0dGhhdC5iaXRiID0gMDsgLy8gYml0IGJ1ZmZlclxyXG5cdFx0dGhhdC53aW5kb3cgPSBuZXcgVWludDhBcnJheSh3KTsgLy8gc2xpZGluZyB3aW5kb3dcclxuXHRcdHRoYXQuZW5kID0gdzsgLy8gb25lIGJ5dGUgYWZ0ZXIgc2xpZGluZyB3aW5kb3dcclxuXHRcdHRoYXQucmVhZCA9IDA7IC8vIHdpbmRvdyByZWFkIHBvaW50ZXJcclxuXHRcdHRoYXQud3JpdGUgPSAwOyAvLyB3aW5kb3cgd3JpdGUgcG9pbnRlclxyXG5cclxuXHRcdHRoYXQucmVzZXQgPSBmdW5jdGlvbih6LCBjKSB7XHJcblx0XHRcdGlmIChjKVxyXG5cdFx0XHRcdGNbMF0gPSBjaGVjaztcclxuXHRcdFx0Ly8gaWYgKG1vZGUgPT0gQlRSRUUgfHwgbW9kZSA9PSBEVFJFRSkge1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdGlmIChtb2RlID09IENPREVTKSB7XHJcblx0XHRcdFx0Y29kZXMuZnJlZSh6KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRtb2RlID0gVFlQRTtcclxuXHRcdFx0dGhhdC5iaXRrID0gMDtcclxuXHRcdFx0dGhhdC5iaXRiID0gMDtcclxuXHRcdFx0dGhhdC5yZWFkID0gdGhhdC53cml0ZSA9IDA7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQucmVzZXQoeiwgbnVsbCk7XHJcblxyXG5cdFx0Ly8gY29weSBhcyBtdWNoIGFzIHBvc3NpYmxlIGZyb20gdGhlIHNsaWRpbmcgd2luZG93IHRvIHRoZSBvdXRwdXQgYXJlYVxyXG5cdFx0dGhhdC5pbmZsYXRlX2ZsdXNoID0gZnVuY3Rpb24oeiwgcikge1xyXG5cdFx0XHR2YXIgbjtcclxuXHRcdFx0dmFyIHA7XHJcblx0XHRcdHZhciBxO1xyXG5cclxuXHRcdFx0Ly8gbG9jYWwgY29waWVzIG9mIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gcG9pbnRlcnNcclxuXHRcdFx0cCA9IHoubmV4dF9vdXRfaW5kZXg7XHJcblx0XHRcdHEgPSB0aGF0LnJlYWQ7XHJcblxyXG5cdFx0XHQvLyBjb21wdXRlIG51bWJlciBvZiBieXRlcyB0byBjb3B5IGFzIGZhciBhcyBlbmQgb2Ygd2luZG93XHJcblx0XHRcdG4gPSAvKiAoaW50KSAqLygocSA8PSB0aGF0LndyaXRlID8gdGhhdC53cml0ZSA6IHRoYXQuZW5kKSAtIHEpO1xyXG5cdFx0XHRpZiAobiA+IHouYXZhaWxfb3V0KVxyXG5cdFx0XHRcdG4gPSB6LmF2YWlsX291dDtcclxuXHRcdFx0aWYgKG4gIT09IDAgJiYgciA9PSBaX0JVRl9FUlJPUilcclxuXHRcdFx0XHRyID0gWl9PSztcclxuXHJcblx0XHRcdC8vIHVwZGF0ZSBjb3VudGVyc1xyXG5cdFx0XHR6LmF2YWlsX291dCAtPSBuO1xyXG5cdFx0XHR6LnRvdGFsX291dCArPSBuO1xyXG5cclxuXHRcdFx0Ly8gY29weSBhcyBmYXIgYXMgZW5kIG9mIHdpbmRvd1xyXG5cdFx0XHR6Lm5leHRfb3V0LnNldCh0aGF0LndpbmRvdy5zdWJhcnJheShxLCBxICsgbiksIHApO1xyXG5cdFx0XHRwICs9IG47XHJcblx0XHRcdHEgKz0gbjtcclxuXHJcblx0XHRcdC8vIHNlZSBpZiBtb3JlIHRvIGNvcHkgYXQgYmVnaW5uaW5nIG9mIHdpbmRvd1xyXG5cdFx0XHRpZiAocSA9PSB0aGF0LmVuZCkge1xyXG5cdFx0XHRcdC8vIHdyYXAgcG9pbnRlcnNcclxuXHRcdFx0XHRxID0gMDtcclxuXHRcdFx0XHRpZiAodGhhdC53cml0ZSA9PSB0aGF0LmVuZClcclxuXHRcdFx0XHRcdHRoYXQud3JpdGUgPSAwO1xyXG5cclxuXHRcdFx0XHQvLyBjb21wdXRlIGJ5dGVzIHRvIGNvcHlcclxuXHRcdFx0XHRuID0gdGhhdC53cml0ZSAtIHE7XHJcblx0XHRcdFx0aWYgKG4gPiB6LmF2YWlsX291dClcclxuXHRcdFx0XHRcdG4gPSB6LmF2YWlsX291dDtcclxuXHRcdFx0XHRpZiAobiAhPT0gMCAmJiByID09IFpfQlVGX0VSUk9SKVxyXG5cdFx0XHRcdFx0ciA9IFpfT0s7XHJcblxyXG5cdFx0XHRcdC8vIHVwZGF0ZSBjb3VudGVyc1xyXG5cdFx0XHRcdHouYXZhaWxfb3V0IC09IG47XHJcblx0XHRcdFx0ei50b3RhbF9vdXQgKz0gbjtcclxuXHJcblx0XHRcdFx0Ly8gY29weVxyXG5cdFx0XHRcdHoubmV4dF9vdXQuc2V0KHRoYXQud2luZG93LnN1YmFycmF5KHEsIHEgKyBuKSwgcCk7XHJcblx0XHRcdFx0cCArPSBuO1xyXG5cdFx0XHRcdHEgKz0gbjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdXBkYXRlIHBvaW50ZXJzXHJcblx0XHRcdHoubmV4dF9vdXRfaW5kZXggPSBwO1xyXG5cdFx0XHR0aGF0LnJlYWQgPSBxO1xyXG5cclxuXHRcdFx0Ly8gZG9uZVxyXG5cdFx0XHRyZXR1cm4gcjtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5wcm9jID0gZnVuY3Rpb24oeiwgcikge1xyXG5cdFx0XHR2YXIgdDsgLy8gdGVtcG9yYXJ5IHN0b3JhZ2VcclxuXHRcdFx0dmFyIGI7IC8vIGJpdCBidWZmZXJcclxuXHRcdFx0dmFyIGs7IC8vIGJpdHMgaW4gYml0IGJ1ZmZlclxyXG5cdFx0XHR2YXIgcDsgLy8gaW5wdXQgZGF0YSBwb2ludGVyXHJcblx0XHRcdHZhciBuOyAvLyBieXRlcyBhdmFpbGFibGUgdGhlcmVcclxuXHRcdFx0dmFyIHE7IC8vIG91dHB1dCB3aW5kb3cgd3JpdGUgcG9pbnRlclxyXG5cdFx0XHR2YXIgbTsgLy8gYnl0ZXMgdG8gZW5kIG9mIHdpbmRvdyBvciByZWFkIHBvaW50ZXJcclxuXHJcblx0XHRcdHZhciBpO1xyXG5cclxuXHRcdFx0Ly8gY29weSBpbnB1dC9vdXRwdXQgaW5mb3JtYXRpb24gdG8gbG9jYWxzIChVUERBVEUgbWFjcm8gcmVzdG9yZXMpXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0cCA9IHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0biA9IHouYXZhaWxfaW47XHJcblx0XHRcdGIgPSB0aGF0LmJpdGI7XHJcblx0XHRcdGsgPSB0aGF0LmJpdGs7XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Ly8ge1xyXG5cdFx0XHRxID0gdGhhdC53cml0ZTtcclxuXHRcdFx0bSA9IC8qIChpbnQpICovKHEgPCB0aGF0LnJlYWQgPyB0aGF0LnJlYWQgLSBxIC0gMSA6IHRoYXQuZW5kIC0gcSk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIHByb2Nlc3MgaW5wdXQgYmFzZWQgb24gY3VycmVudCBzdGF0ZVxyXG5cdFx0XHQvLyBERUJVRyBkdHJlZVxyXG5cdFx0XHR3aGlsZSAodHJ1ZSkge1xyXG5cdFx0XHRcdHN3aXRjaCAobW9kZSkge1xyXG5cdFx0XHRcdGNhc2UgVFlQRTpcclxuXHJcblx0XHRcdFx0XHR3aGlsZSAoayA8ICgzKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAobiAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0YiB8PSAoei5yZWFkX2J5dGUocCsrKSAmIDB4ZmYpIDw8IGs7XHJcblx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHQgPSAvKiAoaW50KSAqLyhiICYgNyk7XHJcblx0XHRcdFx0XHRsYXN0ID0gdCAmIDE7XHJcblxyXG5cdFx0XHRcdFx0c3dpdGNoICh0ID4+PiAxKSB7XHJcblx0XHRcdFx0XHRjYXNlIDA6IC8vIHN0b3JlZFxyXG5cdFx0XHRcdFx0XHQvLyB7XHJcblx0XHRcdFx0XHRcdGIgPj4+PSAoMyk7XHJcblx0XHRcdFx0XHRcdGsgLT0gKDMpO1xyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdHQgPSBrICYgNzsgLy8gZ28gdG8gYnl0ZSBib3VuZGFyeVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8ge1xyXG5cdFx0XHRcdFx0XHRiID4+Pj0gKHQpO1xyXG5cdFx0XHRcdFx0XHRrIC09ICh0KTtcclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRtb2RlID0gTEVOUzsgLy8gZ2V0IGxlbmd0aCBvZiBzdG9yZWQgYmxvY2tcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDE6IC8vIGZpeGVkXHJcblx0XHRcdFx0XHRcdC8vIHtcclxuXHRcdFx0XHRcdFx0dmFyIGJsID0gW107IC8vIG5ldyBBcnJheSgxKTtcclxuXHRcdFx0XHRcdFx0dmFyIGJkID0gW107IC8vIG5ldyBBcnJheSgxKTtcclxuXHRcdFx0XHRcdFx0dmFyIHRsID0gWyBbXSBdOyAvLyBuZXcgQXJyYXkoMSk7XHJcblx0XHRcdFx0XHRcdHZhciB0ZCA9IFsgW10gXTsgLy8gbmV3IEFycmF5KDEpO1xyXG5cclxuXHRcdFx0XHRcdFx0SW5mVHJlZS5pbmZsYXRlX3RyZWVzX2ZpeGVkKGJsLCBiZCwgdGwsIHRkKTtcclxuXHRcdFx0XHRcdFx0Y29kZXMuaW5pdChibFswXSwgYmRbMF0sIHRsWzBdLCAwLCB0ZFswXSwgMCk7XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIHtcclxuXHRcdFx0XHRcdFx0YiA+Pj49ICgzKTtcclxuXHRcdFx0XHRcdFx0ayAtPSAoMyk7XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdG1vZGUgPSBDT0RFUztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDI6IC8vIGR5bmFtaWNcclxuXHJcblx0XHRcdFx0XHRcdC8vIHtcclxuXHRcdFx0XHRcdFx0YiA+Pj49ICgzKTtcclxuXHRcdFx0XHRcdFx0ayAtPSAoMyk7XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdG1vZGUgPSBUQUJMRTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDM6IC8vIGlsbGVnYWxcclxuXHJcblx0XHRcdFx0XHRcdC8vIHtcclxuXHRcdFx0XHRcdFx0YiA+Pj49ICgzKTtcclxuXHRcdFx0XHRcdFx0ayAtPSAoMyk7XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0bW9kZSA9IEJBREJMT0NLUztcclxuXHRcdFx0XHRcdFx0ei5tc2cgPSBcImludmFsaWQgYmxvY2sgdHlwZVwiO1xyXG5cdFx0XHRcdFx0XHRyID0gWl9EQVRBX0VSUk9SO1xyXG5cclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIExFTlM6XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKGsgPCAoMzIpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0ciA9IFpfT0s7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0ayArPSA4O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICgoKCh+YikgPj4+IDE2KSAmIDB4ZmZmZikgIT0gKGIgJiAweGZmZmYpKSB7XHJcblx0XHRcdFx0XHRcdG1vZGUgPSBCQURCTE9DS1M7XHJcblx0XHRcdFx0XHRcdHoubXNnID0gXCJpbnZhbGlkIHN0b3JlZCBibG9jayBsZW5ndGhzXCI7XHJcblx0XHRcdFx0XHRcdHIgPSBaX0RBVEFfRVJST1I7XHJcblxyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxlZnQgPSAoYiAmIDB4ZmZmZik7XHJcblx0XHRcdFx0XHRiID0gayA9IDA7IC8vIGR1bXAgYml0c1xyXG5cdFx0XHRcdFx0bW9kZSA9IGxlZnQgIT09IDAgPyBTVE9SRUQgOiAobGFzdCAhPT0gMCA/IERSWSA6IFRZUEUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTVE9SRUQ6XHJcblx0XHRcdFx0XHRpZiAobiA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAobSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRpZiAocSA9PSB0aGF0LmVuZCAmJiB0aGF0LnJlYWQgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRxID0gMDtcclxuXHRcdFx0XHRcdFx0XHRtID0gLyogKGludCkgKi8ocSA8IHRoYXQucmVhZCA/IHRoYXQucmVhZCAtIHEgLSAxIDogdGhhdC5lbmQgLSBxKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAobSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdHIgPSB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdFx0cSA9IHRoYXQud3JpdGU7XHJcblx0XHRcdFx0XHRcdFx0bSA9IC8qIChpbnQpICovKHEgPCB0aGF0LnJlYWQgPyB0aGF0LnJlYWQgLSBxIC0gMSA6IHRoYXQuZW5kIC0gcSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHEgPT0gdGhhdC5lbmQgJiYgdGhhdC5yZWFkICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRxID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdG0gPSAvKiAoaW50KSAqLyhxIDwgdGhhdC5yZWFkID8gdGhhdC5yZWFkIC0gcSAtIDEgOiB0aGF0LmVuZCAtIHEpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAobSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyID0gWl9PSztcclxuXHJcblx0XHRcdFx0XHR0ID0gbGVmdDtcclxuXHRcdFx0XHRcdGlmICh0ID4gbilcclxuXHRcdFx0XHRcdFx0dCA9IG47XHJcblx0XHRcdFx0XHRpZiAodCA+IG0pXHJcblx0XHRcdFx0XHRcdHQgPSBtO1xyXG5cdFx0XHRcdFx0dGhhdC53aW5kb3cuc2V0KHoucmVhZF9idWYocCwgdCksIHEpO1xyXG5cdFx0XHRcdFx0cCArPSB0O1xyXG5cdFx0XHRcdFx0biAtPSB0O1xyXG5cdFx0XHRcdFx0cSArPSB0O1xyXG5cdFx0XHRcdFx0bSAtPSB0O1xyXG5cdFx0XHRcdFx0aWYgKChsZWZ0IC09IHQpICE9PSAwKVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdG1vZGUgPSBsYXN0ICE9PSAwID8gRFJZIDogVFlQRTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgVEFCTEU6XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKGsgPCAoMTQpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0ciA9IFpfT0s7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0YiB8PSAoei5yZWFkX2J5dGUocCsrKSAmIDB4ZmYpIDw8IGs7XHJcblx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR0YWJsZSA9IHQgPSAoYiAmIDB4M2ZmZik7XHJcblx0XHRcdFx0XHRpZiAoKHQgJiAweDFmKSA+IDI5IHx8ICgodCA+PiA1KSAmIDB4MWYpID4gMjkpIHtcclxuXHRcdFx0XHRcdFx0bW9kZSA9IEJBREJMT0NLUztcclxuXHRcdFx0XHRcdFx0ei5tc2cgPSBcInRvbyBtYW55IGxlbmd0aCBvciBkaXN0YW5jZSBzeW1ib2xzXCI7XHJcblx0XHRcdFx0XHRcdHIgPSBaX0RBVEFfRVJST1I7XHJcblxyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHQgPSAyNTggKyAodCAmIDB4MWYpICsgKCh0ID4+IDUpICYgMHgxZik7XHJcblx0XHRcdFx0XHRpZiAoIWJsZW5zIHx8IGJsZW5zLmxlbmd0aCA8IHQpIHtcclxuXHRcdFx0XHRcdFx0YmxlbnMgPSBbXTsgLy8gbmV3IEFycmF5KHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHQ7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdGJsZW5zW2ldID0gMDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIHtcclxuXHRcdFx0XHRcdGIgPj4+PSAoMTQpO1xyXG5cdFx0XHRcdFx0ayAtPSAoMTQpO1xyXG5cdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdGluZGV4ID0gMDtcclxuXHRcdFx0XHRcdG1vZGUgPSBCVFJFRTtcclxuXHRcdFx0XHRjYXNlIEJUUkVFOlxyXG5cdFx0XHRcdFx0d2hpbGUgKGluZGV4IDwgNCArICh0YWJsZSA+Pj4gMTApKSB7XHJcblx0XHRcdFx0XHRcdHdoaWxlIChrIDwgKDMpKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKG4gIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRcdGIgfD0gKHoucmVhZF9ieXRlKHArKykgJiAweGZmKSA8PCBrO1xyXG5cdFx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0YmxlbnNbYm9yZGVyW2luZGV4KytdXSA9IGIgJiA3O1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8ge1xyXG5cdFx0XHRcdFx0XHRiID4+Pj0gKDMpO1xyXG5cdFx0XHRcdFx0XHRrIC09ICgzKTtcclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChpbmRleCA8IDE5KSB7XHJcblx0XHRcdFx0XHRcdGJsZW5zW2JvcmRlcltpbmRleCsrXV0gPSAwO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGJiWzBdID0gNztcclxuXHRcdFx0XHRcdHQgPSBpbmZ0cmVlLmluZmxhdGVfdHJlZXNfYml0cyhibGVucywgYmIsIHRiLCBodWZ0cywgeik7XHJcblx0XHRcdFx0XHRpZiAodCAhPSBaX09LKSB7XHJcblx0XHRcdFx0XHRcdHIgPSB0O1xyXG5cdFx0XHRcdFx0XHRpZiAociA9PSBaX0RBVEFfRVJST1IpIHtcclxuXHRcdFx0XHRcdFx0XHRibGVucyA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0bW9kZSA9IEJBREJMT0NLUztcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aW5kZXggPSAwO1xyXG5cdFx0XHRcdFx0bW9kZSA9IERUUkVFO1xyXG5cdFx0XHRcdGNhc2UgRFRSRUU6XHJcblx0XHRcdFx0XHR3aGlsZSAodHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHR0ID0gdGFibGU7XHJcblx0XHRcdFx0XHRcdGlmICghKGluZGV4IDwgMjU4ICsgKHQgJiAweDFmKSArICgodCA+PiA1KSAmIDB4MWYpKSkge1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgaiwgYztcclxuXHJcblx0XHRcdFx0XHRcdHQgPSBiYlswXTtcclxuXHJcblx0XHRcdFx0XHRcdHdoaWxlIChrIDwgKHQpKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKG4gIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRcdGIgfD0gKHoucmVhZF9ieXRlKHArKykgJiAweGZmKSA8PCBrO1xyXG5cdFx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gaWYgKHRiWzBdID09IC0xKSB7XHJcblx0XHRcdFx0XHRcdC8vIFN5c3RlbS5lcnIucHJpbnRsbihcIm51bGwuLi5cIik7XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdHQgPSBodWZ0c1sodGJbMF0gKyAoYiAmIGluZmxhdGVfbWFza1t0XSkpICogMyArIDFdO1xyXG5cdFx0XHRcdFx0XHRjID0gaHVmdHNbKHRiWzBdICsgKGIgJiBpbmZsYXRlX21hc2tbdF0pKSAqIDMgKyAyXTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChjIDwgMTYpIHtcclxuXHRcdFx0XHRcdFx0XHRiID4+Pj0gKHQpO1xyXG5cdFx0XHRcdFx0XHRcdGsgLT0gKHQpO1xyXG5cdFx0XHRcdFx0XHRcdGJsZW5zW2luZGV4KytdID0gYztcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHsgLy8gYyA9PSAxNi4uMThcclxuXHRcdFx0XHRcdFx0XHRpID0gYyA9PSAxOCA/IDcgOiBjIC0gMTQ7XHJcblx0XHRcdFx0XHRcdFx0aiA9IGMgPT0gMTggPyAxMSA6IDM7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHdoaWxlIChrIDwgKHQgKyBpKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG4gIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ciA9IFpfT0s7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0XHRcdGIgfD0gKHoucmVhZF9ieXRlKHArKykgJiAweGZmKSA8PCBrO1xyXG5cdFx0XHRcdFx0XHRcdFx0ayArPSA4O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YiA+Pj49ICh0KTtcclxuXHRcdFx0XHRcdFx0XHRrIC09ICh0KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aiArPSAoYiAmIGluZmxhdGVfbWFza1tpXSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGIgPj4+PSAoaSk7XHJcblx0XHRcdFx0XHRcdFx0ayAtPSAoaSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGkgPSBpbmRleDtcclxuXHRcdFx0XHRcdFx0XHR0ID0gdGFibGU7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGkgKyBqID4gMjU4ICsgKHQgJiAweDFmKSArICgodCA+PiA1KSAmIDB4MWYpIHx8IChjID09IDE2ICYmIGkgPCAxKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YmxlbnMgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW9kZSA9IEJBREJMT0NLUztcclxuXHRcdFx0XHRcdFx0XHRcdHoubXNnID0gXCJpbnZhbGlkIGJpdCBsZW5ndGggcmVwZWF0XCI7XHJcblx0XHRcdFx0XHRcdFx0XHRyID0gWl9EQVRBX0VSUk9SO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YyA9IGMgPT0gMTYgPyBibGVuc1tpIC0gMV0gOiAwO1xyXG5cdFx0XHRcdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdFx0XHRcdGJsZW5zW2krK10gPSBjO1xyXG5cdFx0XHRcdFx0XHRcdH0gd2hpbGUgKC0taiAhPT0gMCk7XHJcblx0XHRcdFx0XHRcdFx0aW5kZXggPSBpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGJbMF0gPSAtMTtcclxuXHRcdFx0XHRcdC8vIHtcclxuXHRcdFx0XHRcdHZhciBibF8gPSBbXTsgLy8gbmV3IEFycmF5KDEpO1xyXG5cdFx0XHRcdFx0dmFyIGJkXyA9IFtdOyAvLyBuZXcgQXJyYXkoMSk7XHJcblx0XHRcdFx0XHR2YXIgdGxfID0gW107IC8vIG5ldyBBcnJheSgxKTtcclxuXHRcdFx0XHRcdHZhciB0ZF8gPSBbXTsgLy8gbmV3IEFycmF5KDEpO1xyXG5cdFx0XHRcdFx0YmxfWzBdID0gOTsgLy8gbXVzdCBiZSA8PSA5IGZvciBsb29rYWhlYWQgYXNzdW1wdGlvbnNcclxuXHRcdFx0XHRcdGJkX1swXSA9IDY7IC8vIG11c3QgYmUgPD0gOSBmb3IgbG9va2FoZWFkIGFzc3VtcHRpb25zXHJcblxyXG5cdFx0XHRcdFx0dCA9IHRhYmxlO1xyXG5cdFx0XHRcdFx0dCA9IGluZnRyZWUuaW5mbGF0ZV90cmVlc19keW5hbWljKDI1NyArICh0ICYgMHgxZiksIDEgKyAoKHQgPj4gNSkgJiAweDFmKSwgYmxlbnMsIGJsXywgYmRfLCB0bF8sIHRkXywgaHVmdHMsIHopO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0ICE9IFpfT0spIHtcclxuXHRcdFx0XHRcdFx0aWYgKHQgPT0gWl9EQVRBX0VSUk9SKSB7XHJcblx0XHRcdFx0XHRcdFx0YmxlbnMgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdG1vZGUgPSBCQURCTE9DS1M7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ciA9IHQ7XHJcblxyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvZGVzLmluaXQoYmxfWzBdLCBiZF9bMF0sIGh1ZnRzLCB0bF9bMF0sIGh1ZnRzLCB0ZF9bMF0pO1xyXG5cdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0bW9kZSA9IENPREVTO1xyXG5cdFx0XHRcdGNhc2UgQ09ERVM6XHJcblx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cclxuXHRcdFx0XHRcdGlmICgociA9IGNvZGVzLnByb2ModGhhdCwgeiwgcikpICE9IFpfU1RSRUFNX0VORCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ciA9IFpfT0s7XHJcblx0XHRcdFx0XHRjb2Rlcy5mcmVlKHopO1xyXG5cclxuXHRcdFx0XHRcdHAgPSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRuID0gei5hdmFpbF9pbjtcclxuXHRcdFx0XHRcdGIgPSB0aGF0LmJpdGI7XHJcblx0XHRcdFx0XHRrID0gdGhhdC5iaXRrO1xyXG5cdFx0XHRcdFx0cSA9IHRoYXQud3JpdGU7XHJcblx0XHRcdFx0XHRtID0gLyogKGludCkgKi8ocSA8IHRoYXQucmVhZCA/IHRoYXQucmVhZCAtIHEgLSAxIDogdGhhdC5lbmQgLSBxKTtcclxuXHJcblx0XHRcdFx0XHRpZiAobGFzdCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRtb2RlID0gVFlQRTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRtb2RlID0gRFJZO1xyXG5cdFx0XHRcdGNhc2UgRFJZOlxyXG5cdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRyID0gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0cSA9IHRoYXQud3JpdGU7XHJcblx0XHRcdFx0XHRtID0gLyogKGludCkgKi8ocSA8IHRoYXQucmVhZCA/IHRoYXQucmVhZCAtIHEgLSAxIDogdGhhdC5lbmQgLSBxKTtcclxuXHRcdFx0XHRcdGlmICh0aGF0LnJlYWQgIT0gdGhhdC53cml0ZSkge1xyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG1vZGUgPSBET05FTE9DS1M7XHJcblx0XHRcdFx0Y2FzZSBET05FTE9DS1M6XHJcblx0XHRcdFx0XHRyID0gWl9TVFJFQU1fRU5EO1xyXG5cclxuXHRcdFx0XHRcdHRoYXQuYml0YiA9IGI7XHJcblx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdGNhc2UgQkFEQkxPQ0tTOlxyXG5cdFx0XHRcdFx0ciA9IFpfREFUQV9FUlJPUjtcclxuXHJcblx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHIgPSBaX1NUUkVBTV9FUlJPUjtcclxuXHJcblx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5mcmVlID0gZnVuY3Rpb24oeikge1xyXG5cdFx0XHR0aGF0LnJlc2V0KHosIG51bGwpO1xyXG5cdFx0XHR0aGF0LndpbmRvdyA9IG51bGw7XHJcblx0XHRcdGh1ZnRzID0gbnVsbDtcclxuXHRcdFx0Ly8gWkZSRUUoeiwgcyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuc2V0X2RpY3Rpb25hcnkgPSBmdW5jdGlvbihkLCBzdGFydCwgbikge1xyXG5cdFx0XHR0aGF0LndpbmRvdy5zZXQoZC5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBuKSwgMCk7XHJcblx0XHRcdHRoYXQucmVhZCA9IHRoYXQud3JpdGUgPSBuO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBSZXR1cm5zIHRydWUgaWYgaW5mbGF0ZSBpcyBjdXJyZW50bHkgYXQgdGhlIGVuZCBvZiBhIGJsb2NrIGdlbmVyYXRlZFxyXG5cdFx0Ly8gYnkgWl9TWU5DX0ZMVVNIIG9yIFpfRlVMTF9GTFVTSC5cclxuXHRcdHRoYXQuc3luY19wb2ludCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gbW9kZSA9PSBMRU5TID8gMSA6IDA7XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIEluZmxhdGVcclxuXHJcblx0Ly8gcHJlc2V0IGRpY3Rpb25hcnkgZmxhZyBpbiB6bGliIGhlYWRlclxyXG5cdHZhciBQUkVTRVRfRElDVCA9IDB4MjA7XHJcblxyXG5cdHZhciBaX0RFRkxBVEVEID0gODtcclxuXHJcblx0dmFyIE1FVEhPRCA9IDA7IC8vIHdhaXRpbmcgZm9yIG1ldGhvZCBieXRlXHJcblx0dmFyIEZMQUcgPSAxOyAvLyB3YWl0aW5nIGZvciBmbGFnIGJ5dGVcclxuXHR2YXIgRElDVDQgPSAyOyAvLyBmb3VyIGRpY3Rpb25hcnkgY2hlY2sgYnl0ZXMgdG8gZ29cclxuXHR2YXIgRElDVDMgPSAzOyAvLyB0aHJlZSBkaWN0aW9uYXJ5IGNoZWNrIGJ5dGVzIHRvIGdvXHJcblx0dmFyIERJQ1QyID0gNDsgLy8gdHdvIGRpY3Rpb25hcnkgY2hlY2sgYnl0ZXMgdG8gZ29cclxuXHR2YXIgRElDVDEgPSA1OyAvLyBvbmUgZGljdGlvbmFyeSBjaGVjayBieXRlIHRvIGdvXHJcblx0dmFyIERJQ1QwID0gNjsgLy8gd2FpdGluZyBmb3IgaW5mbGF0ZVNldERpY3Rpb25hcnlcclxuXHR2YXIgQkxPQ0tTID0gNzsgLy8gZGVjb21wcmVzc2luZyBibG9ja3NcclxuXHR2YXIgRE9ORSA9IDEyOyAvLyBmaW5pc2hlZCBjaGVjaywgZG9uZVxyXG5cdHZhciBCQUQgPSAxMzsgLy8gZ290IGFuIGVycm9yLS1zdGF5IGhlcmVcclxuXHJcblx0dmFyIG1hcmsgPSBbIDAsIDAsIDB4ZmYsIDB4ZmYgXTtcclxuXHJcblx0ZnVuY3Rpb24gSW5mbGF0ZSgpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHR0aGF0Lm1vZGUgPSAwOyAvLyBjdXJyZW50IGluZmxhdGUgbW9kZVxyXG5cclxuXHRcdC8vIG1vZGUgZGVwZW5kZW50IGluZm9ybWF0aW9uXHJcblx0XHR0aGF0Lm1ldGhvZCA9IDA7IC8vIGlmIEZMQUdTLCBtZXRob2QgYnl0ZVxyXG5cclxuXHRcdC8vIGlmIENIRUNLLCBjaGVjayB2YWx1ZXMgdG8gY29tcGFyZVxyXG5cdFx0dGhhdC53YXMgPSBbIDAgXTsgLy8gbmV3IEFycmF5KDEpOyAvLyBjb21wdXRlZCBjaGVjayB2YWx1ZVxyXG5cdFx0dGhhdC5uZWVkID0gMDsgLy8gc3RyZWFtIGNoZWNrIHZhbHVlXHJcblxyXG5cdFx0Ly8gaWYgQkFELCBpbmZsYXRlU3luYydzIG1hcmtlciBieXRlcyBjb3VudFxyXG5cdFx0dGhhdC5tYXJrZXIgPSAwO1xyXG5cclxuXHRcdC8vIG1vZGUgaW5kZXBlbmRlbnQgaW5mb3JtYXRpb25cclxuXHRcdHRoYXQud2JpdHMgPSAwOyAvLyBsb2cyKHdpbmRvdyBzaXplKSAoOC4uMTUsIGRlZmF1bHRzIHRvIDE1KVxyXG5cclxuXHRcdC8vIHRoaXMuYmxvY2tzOyAvLyBjdXJyZW50IGluZmxhdGVfYmxvY2tzIHN0YXRlXHJcblxyXG5cdFx0ZnVuY3Rpb24gaW5mbGF0ZVJlc2V0KHopIHtcclxuXHRcdFx0aWYgKCF6IHx8ICF6LmlzdGF0ZSlcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblxyXG5cdFx0XHR6LnRvdGFsX2luID0gei50b3RhbF9vdXQgPSAwO1xyXG5cdFx0XHR6Lm1zZyA9IG51bGw7XHJcblx0XHRcdHouaXN0YXRlLm1vZGUgPSBCTE9DS1M7XHJcblx0XHRcdHouaXN0YXRlLmJsb2Nrcy5yZXNldCh6LCBudWxsKTtcclxuXHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhhdC5pbmZsYXRlRW5kID0gZnVuY3Rpb24oeikge1xyXG5cdFx0XHRpZiAodGhhdC5ibG9ja3MpXHJcblx0XHRcdFx0dGhhdC5ibG9ja3MuZnJlZSh6KTtcclxuXHRcdFx0dGhhdC5ibG9ja3MgPSBudWxsO1xyXG5cdFx0XHQvLyBaRlJFRSh6LCB6LT5zdGF0ZSk7XHJcblx0XHRcdHJldHVybiBaX09LO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmluZmxhdGVJbml0ID0gZnVuY3Rpb24oeiwgdykge1xyXG5cdFx0XHR6Lm1zZyA9IG51bGw7XHJcblx0XHRcdHRoYXQuYmxvY2tzID0gbnVsbDtcclxuXHJcblx0XHRcdC8vIHNldCB3aW5kb3cgc2l6ZVxyXG5cdFx0XHRpZiAodyA8IDggfHwgdyA+IDE1KSB7XHJcblx0XHRcdFx0dGhhdC5pbmZsYXRlRW5kKHopO1xyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGF0LndiaXRzID0gdztcclxuXHJcblx0XHRcdHouaXN0YXRlLmJsb2NrcyA9IG5ldyBJbmZCbG9ja3MoeiwgMSA8PCB3KTtcclxuXHJcblx0XHRcdC8vIHJlc2V0IHN0YXRlXHJcblx0XHRcdGluZmxhdGVSZXNldCh6KTtcclxuXHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuaW5mbGF0ZSA9IGZ1bmN0aW9uKHosIGYpIHtcclxuXHRcdFx0dmFyIHI7XHJcblx0XHRcdHZhciBiO1xyXG5cclxuXHRcdFx0aWYgKCF6IHx8ICF6LmlzdGF0ZSB8fCAhei5uZXh0X2luKVxyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0ZiA9IGYgPT0gWl9GSU5JU0ggPyBaX0JVRl9FUlJPUiA6IFpfT0s7XHJcblx0XHRcdHIgPSBaX0JVRl9FUlJPUjtcclxuXHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHQvLyBTeXN0ZW0ub3V0LnByaW50bG4oXCJtb2RlOiBcIit6LmlzdGF0ZS5tb2RlKTtcclxuXHRcdFx0XHRzd2l0Y2ggKHouaXN0YXRlLm1vZGUpIHtcclxuXHRcdFx0XHRjYXNlIE1FVEhPRDpcclxuXHJcblx0XHRcdFx0XHRpZiAoei5hdmFpbF9pbiA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHI7XHJcblx0XHRcdFx0XHRyID0gZjtcclxuXHJcblx0XHRcdFx0XHR6LmF2YWlsX2luLS07XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luKys7XHJcblx0XHRcdFx0XHRpZiAoKCh6LmlzdGF0ZS5tZXRob2QgPSB6LnJlYWRfYnl0ZSh6Lm5leHRfaW5faW5kZXgrKykpICYgMHhmKSAhPSBaX0RFRkxBVEVEKSB7XHJcblx0XHRcdFx0XHRcdHouaXN0YXRlLm1vZGUgPSBCQUQ7XHJcblx0XHRcdFx0XHRcdHoubXNnID0gXCJ1bmtub3duIGNvbXByZXNzaW9uIG1ldGhvZFwiO1xyXG5cdFx0XHRcdFx0XHR6LmlzdGF0ZS5tYXJrZXIgPSA1OyAvLyBjYW4ndCB0cnkgaW5mbGF0ZVN5bmNcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoKHouaXN0YXRlLm1ldGhvZCA+PiA0KSArIDggPiB6LmlzdGF0ZS53Yml0cykge1xyXG5cdFx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gQkFEO1xyXG5cdFx0XHRcdFx0XHR6Lm1zZyA9IFwiaW52YWxpZCB3aW5kb3cgc2l6ZVwiO1xyXG5cdFx0XHRcdFx0XHR6LmlzdGF0ZS5tYXJrZXIgPSA1OyAvLyBjYW4ndCB0cnkgaW5mbGF0ZVN5bmNcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gRkxBRztcclxuXHRcdFx0XHRjYXNlIEZMQUc6XHJcblxyXG5cdFx0XHRcdFx0aWYgKHouYXZhaWxfaW4gPT09IDApXHJcblx0XHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdFx0ciA9IGY7XHJcblxyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbi0tO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbisrO1xyXG5cdFx0XHRcdFx0YiA9ICh6LnJlYWRfYnl0ZSh6Lm5leHRfaW5faW5kZXgrKykpICYgMHhmZjtcclxuXHJcblx0XHRcdFx0XHRpZiAoKCgoei5pc3RhdGUubWV0aG9kIDw8IDgpICsgYikgJSAzMSkgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IEJBRDtcclxuXHRcdFx0XHRcdFx0ei5tc2cgPSBcImluY29ycmVjdCBoZWFkZXIgY2hlY2tcIjtcclxuXHRcdFx0XHRcdFx0ei5pc3RhdGUubWFya2VyID0gNTsgLy8gY2FuJ3QgdHJ5IGluZmxhdGVTeW5jXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICgoYiAmIFBSRVNFVF9ESUNUKSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gQkxPQ0tTO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHouaXN0YXRlLm1vZGUgPSBESUNUNDtcclxuXHRcdFx0XHRjYXNlIERJQ1Q0OlxyXG5cclxuXHRcdFx0XHRcdGlmICh6LmF2YWlsX2luID09PSAwKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0XHRcdHIgPSBmO1xyXG5cclxuXHRcdFx0XHRcdHouYXZhaWxfaW4tLTtcclxuXHRcdFx0XHRcdHoudG90YWxfaW4rKztcclxuXHRcdFx0XHRcdHouaXN0YXRlLm5lZWQgPSAoKHoucmVhZF9ieXRlKHoubmV4dF9pbl9pbmRleCsrKSAmIDB4ZmYpIDw8IDI0KSAmIDB4ZmYwMDAwMDA7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gRElDVDM7XHJcblx0XHRcdFx0Y2FzZSBESUNUMzpcclxuXHJcblx0XHRcdFx0XHRpZiAoei5hdmFpbF9pbiA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHI7XHJcblx0XHRcdFx0XHRyID0gZjtcclxuXHJcblx0XHRcdFx0XHR6LmF2YWlsX2luLS07XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luKys7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5uZWVkICs9ICgoei5yZWFkX2J5dGUoei5uZXh0X2luX2luZGV4KyspICYgMHhmZikgPDwgMTYpICYgMHhmZjAwMDA7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gRElDVDI7XHJcblx0XHRcdFx0Y2FzZSBESUNUMjpcclxuXHJcblx0XHRcdFx0XHRpZiAoei5hdmFpbF9pbiA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHI7XHJcblx0XHRcdFx0XHRyID0gZjtcclxuXHJcblx0XHRcdFx0XHR6LmF2YWlsX2luLS07XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luKys7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5uZWVkICs9ICgoei5yZWFkX2J5dGUoei5uZXh0X2luX2luZGV4KyspICYgMHhmZikgPDwgOCkgJiAweGZmMDA7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gRElDVDE7XHJcblx0XHRcdFx0Y2FzZSBESUNUMTpcclxuXHJcblx0XHRcdFx0XHRpZiAoei5hdmFpbF9pbiA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHI7XHJcblx0XHRcdFx0XHRyID0gZjtcclxuXHJcblx0XHRcdFx0XHR6LmF2YWlsX2luLS07XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luKys7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5uZWVkICs9ICh6LnJlYWRfYnl0ZSh6Lm5leHRfaW5faW5kZXgrKykgJiAweGZmKTtcclxuXHRcdFx0XHRcdHouaXN0YXRlLm1vZGUgPSBESUNUMDtcclxuXHRcdFx0XHRcdHJldHVybiBaX05FRURfRElDVDtcclxuXHRcdFx0XHRjYXNlIERJQ1QwOlxyXG5cdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IEJBRDtcclxuXHRcdFx0XHRcdHoubXNnID0gXCJuZWVkIGRpY3Rpb25hcnlcIjtcclxuXHRcdFx0XHRcdHouaXN0YXRlLm1hcmtlciA9IDA7IC8vIGNhbiB0cnkgaW5mbGF0ZVN5bmNcclxuXHRcdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0XHRjYXNlIEJMT0NLUzpcclxuXHJcblx0XHRcdFx0XHRyID0gei5pc3RhdGUuYmxvY2tzLnByb2Moeiwgcik7XHJcblx0XHRcdFx0XHRpZiAociA9PSBaX0RBVEFfRVJST1IpIHtcclxuXHRcdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IEJBRDtcclxuXHRcdFx0XHRcdFx0ei5pc3RhdGUubWFya2VyID0gMDsgLy8gY2FuIHRyeSBpbmZsYXRlU3luY1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyID09IFpfT0spIHtcclxuXHRcdFx0XHRcdFx0ciA9IGY7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAociAhPSBaX1NUUkVBTV9FTkQpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyID0gZjtcclxuXHRcdFx0XHRcdHouaXN0YXRlLmJsb2Nrcy5yZXNldCh6LCB6LmlzdGF0ZS53YXMpO1xyXG5cdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IERPTkU7XHJcblx0XHRcdFx0Y2FzZSBET05FOlxyXG5cdFx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VORDtcclxuXHRcdFx0XHRjYXNlIEJBRDpcclxuXHRcdFx0XHRcdHJldHVybiBaX0RBVEFfRVJST1I7XHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5pbmZsYXRlU2V0RGljdGlvbmFyeSA9IGZ1bmN0aW9uKHosIGRpY3Rpb25hcnksIGRpY3RMZW5ndGgpIHtcclxuXHRcdFx0dmFyIGluZGV4ID0gMDtcclxuXHRcdFx0dmFyIGxlbmd0aCA9IGRpY3RMZW5ndGg7XHJcblx0XHRcdGlmICgheiB8fCAhei5pc3RhdGUgfHwgei5pc3RhdGUubW9kZSAhPSBESUNUMClcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblxyXG5cdFx0XHRpZiAobGVuZ3RoID49ICgxIDw8IHouaXN0YXRlLndiaXRzKSkge1xyXG5cdFx0XHRcdGxlbmd0aCA9ICgxIDw8IHouaXN0YXRlLndiaXRzKSAtIDE7XHJcblx0XHRcdFx0aW5kZXggPSBkaWN0TGVuZ3RoIC0gbGVuZ3RoO1xyXG5cdFx0XHR9XHJcblx0XHRcdHouaXN0YXRlLmJsb2Nrcy5zZXRfZGljdGlvbmFyeShkaWN0aW9uYXJ5LCBpbmRleCwgbGVuZ3RoKTtcclxuXHRcdFx0ei5pc3RhdGUubW9kZSA9IEJMT0NLUztcclxuXHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuaW5mbGF0ZVN5bmMgPSBmdW5jdGlvbih6KSB7XHJcblx0XHRcdHZhciBuOyAvLyBudW1iZXIgb2YgYnl0ZXMgdG8gbG9vayBhdFxyXG5cdFx0XHR2YXIgcDsgLy8gcG9pbnRlciB0byBieXRlc1xyXG5cdFx0XHR2YXIgbTsgLy8gbnVtYmVyIG9mIG1hcmtlciBieXRlcyBmb3VuZCBpbiBhIHJvd1xyXG5cdFx0XHR2YXIgciwgdzsgLy8gdGVtcG9yYXJpZXMgdG8gc2F2ZSB0b3RhbF9pbiBhbmQgdG90YWxfb3V0XHJcblxyXG5cdFx0XHQvLyBzZXQgdXBcclxuXHRcdFx0aWYgKCF6IHx8ICF6LmlzdGF0ZSlcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdGlmICh6LmlzdGF0ZS5tb2RlICE9IEJBRCkge1xyXG5cdFx0XHRcdHouaXN0YXRlLm1vZGUgPSBCQUQ7XHJcblx0XHRcdFx0ei5pc3RhdGUubWFya2VyID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoKG4gPSB6LmF2YWlsX2luKSA9PT0gMClcclxuXHRcdFx0XHRyZXR1cm4gWl9CVUZfRVJST1I7XHJcblx0XHRcdHAgPSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdG0gPSB6LmlzdGF0ZS5tYXJrZXI7XHJcblxyXG5cdFx0XHQvLyBzZWFyY2hcclxuXHRcdFx0d2hpbGUgKG4gIT09IDAgJiYgbSA8IDQpIHtcclxuXHRcdFx0XHRpZiAoei5yZWFkX2J5dGUocCkgPT0gbWFya1ttXSkge1xyXG5cdFx0XHRcdFx0bSsrO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoei5yZWFkX2J5dGUocCkgIT09IDApIHtcclxuXHRcdFx0XHRcdG0gPSAwO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtID0gNCAtIG07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHArKztcclxuXHRcdFx0XHRuLS07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHJlc3RvcmVcclxuXHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0ei5pc3RhdGUubWFya2VyID0gbTtcclxuXHJcblx0XHRcdC8vIHJldHVybiBubyBqb3kgb3Igc2V0IHVwIHRvIHJlc3RhcnQgb24gYSBuZXcgYmxvY2tcclxuXHRcdFx0aWYgKG0gIT0gNCkge1xyXG5cdFx0XHRcdHJldHVybiBaX0RBVEFfRVJST1I7XHJcblx0XHRcdH1cclxuXHRcdFx0ciA9IHoudG90YWxfaW47XHJcblx0XHRcdHcgPSB6LnRvdGFsX291dDtcclxuXHRcdFx0aW5mbGF0ZVJlc2V0KHopO1xyXG5cdFx0XHR6LnRvdGFsX2luID0gcjtcclxuXHRcdFx0ei50b3RhbF9vdXQgPSB3O1xyXG5cdFx0XHR6LmlzdGF0ZS5tb2RlID0gQkxPQ0tTO1xyXG5cdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gUmV0dXJucyB0cnVlIGlmIGluZmxhdGUgaXMgY3VycmVudGx5IGF0IHRoZSBlbmQgb2YgYSBibG9jayBnZW5lcmF0ZWRcclxuXHRcdC8vIGJ5IFpfU1lOQ19GTFVTSCBvciBaX0ZVTExfRkxVU0guIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBieSBvbmUgUFBQXHJcblx0XHQvLyBpbXBsZW1lbnRhdGlvbiB0byBwcm92aWRlIGFuIGFkZGl0aW9uYWwgc2FmZXR5IGNoZWNrLiBQUFAgdXNlc1xyXG5cdFx0Ly8gWl9TWU5DX0ZMVVNIXHJcblx0XHQvLyBidXQgcmVtb3ZlcyB0aGUgbGVuZ3RoIGJ5dGVzIG9mIHRoZSByZXN1bHRpbmcgZW1wdHkgc3RvcmVkIGJsb2NrLiBXaGVuXHJcblx0XHQvLyBkZWNvbXByZXNzaW5nLCBQUFAgY2hlY2tzIHRoYXQgYXQgdGhlIGVuZCBvZiBpbnB1dCBwYWNrZXQsIGluZmxhdGUgaXNcclxuXHRcdC8vIHdhaXRpbmcgZm9yIHRoZXNlIGxlbmd0aCBieXRlcy5cclxuXHRcdHRoYXQuaW5mbGF0ZVN5bmNQb2ludCA9IGZ1bmN0aW9uKHopIHtcclxuXHRcdFx0aWYgKCF6IHx8ICF6LmlzdGF0ZSB8fCAhei5pc3RhdGUuYmxvY2tzKVxyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0cmV0dXJuIHouaXN0YXRlLmJsb2Nrcy5zeW5jX3BvaW50KCk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Ly8gWlN0cmVhbVxyXG5cclxuXHRmdW5jdGlvbiBaU3RyZWFtKCkge1xyXG5cdH1cclxuXHJcblx0WlN0cmVhbS5wcm90b3R5cGUgPSB7XHJcblx0XHRpbmZsYXRlSW5pdCA6IGZ1bmN0aW9uKGJpdHMpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHR0aGF0LmlzdGF0ZSA9IG5ldyBJbmZsYXRlKCk7XHJcblx0XHRcdGlmICghYml0cylcclxuXHRcdFx0XHRiaXRzID0gTUFYX0JJVFM7XHJcblx0XHRcdHJldHVybiB0aGF0LmlzdGF0ZS5pbmZsYXRlSW5pdCh0aGF0LCBiaXRzKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0aW5mbGF0ZSA6IGZ1bmN0aW9uKGYpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRpZiAoIXRoYXQuaXN0YXRlKVxyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0cmV0dXJuIHRoYXQuaXN0YXRlLmluZmxhdGUodGhhdCwgZik7XHJcblx0XHR9LFxyXG5cclxuXHRcdGluZmxhdGVFbmQgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRpZiAoIXRoYXQuaXN0YXRlKVxyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0dmFyIHJldCA9IHRoYXQuaXN0YXRlLmluZmxhdGVFbmQodGhhdCk7XHJcblx0XHRcdHRoYXQuaXN0YXRlID0gbnVsbDtcclxuXHRcdFx0cmV0dXJuIHJldDtcclxuXHRcdH0sXHJcblxyXG5cdFx0aW5mbGF0ZVN5bmMgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRpZiAoIXRoYXQuaXN0YXRlKVxyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0cmV0dXJuIHRoYXQuaXN0YXRlLmluZmxhdGVTeW5jKHRoYXQpO1xyXG5cdFx0fSxcclxuXHRcdGluZmxhdGVTZXREaWN0aW9uYXJ5IDogZnVuY3Rpb24oZGljdGlvbmFyeSwgZGljdExlbmd0aCkge1xyXG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHRcdGlmICghdGhhdC5pc3RhdGUpXHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5pc3RhdGUuaW5mbGF0ZVNldERpY3Rpb25hcnkodGhhdCwgZGljdGlvbmFyeSwgZGljdExlbmd0aCk7XHJcblx0XHR9LFxyXG5cdFx0cmVhZF9ieXRlIDogZnVuY3Rpb24oc3RhcnQpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5uZXh0X2luLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIDEpWzBdO1xyXG5cdFx0fSxcclxuXHRcdHJlYWRfYnVmIDogZnVuY3Rpb24oc3RhcnQsIHNpemUpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5uZXh0X2luLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIHNpemUpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIEluZmxhdGVyXHJcblxyXG5cdGZ1bmN0aW9uIEluZmxhdGVyKCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIHogPSBuZXcgWlN0cmVhbSgpO1xyXG5cdFx0dmFyIGJ1ZnNpemUgPSA1MTI7XHJcblx0XHR2YXIgZmx1c2ggPSBaX05PX0ZMVVNIO1xyXG5cdFx0dmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGJ1ZnNpemUpO1xyXG5cdFx0dmFyIG5vbW9yZWlucHV0ID0gZmFsc2U7XHJcblxyXG5cdFx0ei5pbmZsYXRlSW5pdCgpO1xyXG5cdFx0ei5uZXh0X291dCA9IGJ1ZjtcclxuXHJcblx0XHR0aGF0LmFwcGVuZCA9IGZ1bmN0aW9uKGRhdGEsIG9ucHJvZ3Jlc3MpIHtcclxuXHRcdFx0dmFyIGVyciwgYnVmZmVycyA9IFtdLCBsYXN0SW5kZXggPSAwLCBidWZmZXJJbmRleCA9IDAsIGJ1ZmZlclNpemUgPSAwLCBhcnJheTtcclxuXHRcdFx0aWYgKGRhdGEubGVuZ3RoID09PSAwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0ei5uZXh0X2luX2luZGV4ID0gMDtcclxuXHRcdFx0ei5uZXh0X2luID0gZGF0YTtcclxuXHRcdFx0ei5hdmFpbF9pbiA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0ei5uZXh0X291dF9pbmRleCA9IDA7XHJcblx0XHRcdFx0ei5hdmFpbF9vdXQgPSBidWZzaXplO1xyXG5cdFx0XHRcdGlmICgoei5hdmFpbF9pbiA9PT0gMCkgJiYgKCFub21vcmVpbnB1dCkpIHsgLy8gaWYgYnVmZmVyIGlzIGVtcHR5IGFuZCBtb3JlIGlucHV0IGlzIGF2YWlsYWJsZSwgcmVmaWxsIGl0XHJcblx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSAwO1xyXG5cdFx0XHRcdFx0bm9tb3JlaW5wdXQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlcnIgPSB6LmluZmxhdGUoZmx1c2gpO1xyXG5cdFx0XHRcdGlmIChub21vcmVpbnB1dCAmJiAoZXJyID09IFpfQlVGX0VSUk9SKSlcclxuXHRcdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0XHRpZiAoZXJyICE9IFpfT0sgJiYgZXJyICE9IFpfU1RSRUFNX0VORClcclxuXHRcdFx0XHRcdHRocm93IFwiaW5mbGF0aW5nOiBcIiArIHoubXNnO1xyXG5cdFx0XHRcdGlmICgobm9tb3JlaW5wdXQgfHwgZXJyID09IFpfU1RSRUFNX0VORCkgJiYgKHouYXZhaWxfaW4gPT0gZGF0YS5sZW5ndGgpKVxyXG5cdFx0XHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0XHRcdGlmICh6Lm5leHRfb3V0X2luZGV4KVxyXG5cdFx0XHRcdFx0aWYgKHoubmV4dF9vdXRfaW5kZXggPT0gYnVmc2l6ZSlcclxuXHRcdFx0XHRcdFx0YnVmZmVycy5wdXNoKG5ldyBVaW50OEFycmF5KGJ1ZikpO1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRidWZmZXJzLnB1c2gobmV3IFVpbnQ4QXJyYXkoYnVmLnN1YmFycmF5KDAsIHoubmV4dF9vdXRfaW5kZXgpKSk7XHJcblx0XHRcdFx0YnVmZmVyU2l6ZSArPSB6Lm5leHRfb3V0X2luZGV4O1xyXG5cdFx0XHRcdGlmIChvbnByb2dyZXNzICYmIHoubmV4dF9pbl9pbmRleCA+IDAgJiYgei5uZXh0X2luX2luZGV4ICE9IGxhc3RJbmRleCkge1xyXG5cdFx0XHRcdFx0b25wcm9ncmVzcyh6Lm5leHRfaW5faW5kZXgpO1xyXG5cdFx0XHRcdFx0bGFzdEluZGV4ID0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSB3aGlsZSAoei5hdmFpbF9pbiA+IDAgfHwgei5hdmFpbF9vdXQgPT09IDApO1xyXG5cdFx0XHRhcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlclNpemUpO1xyXG5cdFx0XHRidWZmZXJzLmZvckVhY2goZnVuY3Rpb24oY2h1bmspIHtcclxuXHRcdFx0XHRhcnJheS5zZXQoY2h1bmssIGJ1ZmZlckluZGV4KTtcclxuXHRcdFx0XHRidWZmZXJJbmRleCArPSBjaHVuay5sZW5ndGg7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gYXJyYXk7XHJcblx0XHR9O1xyXG5cdFx0dGhhdC5mbHVzaCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR6LmluZmxhdGVFbmQoKTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR2YXIgaW5mbGF0ZXI7XHJcblxyXG5cdGlmIChvYmouemlwKVxyXG5cdFx0b2JqLnppcC5JbmZsYXRlciA9IEluZmxhdGVyO1xyXG5cdGVsc2Uge1xyXG5cdFx0aW5mbGF0ZXIgPSBuZXcgSW5mbGF0ZXIoKTtcclxuXHRcdG9iai5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHR2YXIgbWVzc2FnZSA9IGV2ZW50LmRhdGE7XHJcblxyXG5cdFx0XHRpZiAobWVzc2FnZS5hcHBlbmQpXHJcblx0XHRcdFx0b2JqLnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0XHRcdG9uYXBwZW5kIDogdHJ1ZSxcclxuXHRcdFx0XHRcdGRhdGEgOiBpbmZsYXRlci5hcHBlbmQobWVzc2FnZS5kYXRhLCBmdW5jdGlvbihjdXJyZW50KSB7XHJcblx0XHRcdFx0XHRcdG9iai5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdFx0cHJvZ3Jlc3MgOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnQgOiBjdXJyZW50XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0aWYgKG1lc3NhZ2UuZmx1c2gpIHtcclxuXHRcdFx0XHRpbmZsYXRlci5mbHVzaCgpO1xyXG5cdFx0XHRcdG9iai5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdFx0XHRvbmZsdXNoIDogdHJ1ZVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LCBmYWxzZSk7XHJcblx0fVxyXG5cclxufSkoc2VsZik7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzLWNlc2l1bS9Tb3VyY2UvVGhpcmRQYXJ0eS9Xb3JrZXJzL2luZmxhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==