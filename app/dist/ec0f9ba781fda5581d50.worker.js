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
/******/ 	__webpack_require__.p = "build/";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWMwZjliYTc4MWZkYTU1ODFkNTAud29ya2VyLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGVjMGY5YmE3ODFmZGE1NTgxZDUwIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL1RoaXJkUGFydHkvV29ya2Vycy9pbmZsYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImJ1aWxkL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGVjMGY5YmE3ODFmZGE1NTgxZDUwIiwiLypcclxuIENvcHlyaWdodCAoYykgMjAxMyBHaWxkYXMgTG9ybWVhdS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuXHJcbiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcclxuIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG5cclxuIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcclxuIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcblxyXG4gMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgXHJcbiBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gXHJcbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuXHJcbiAzLiBUaGUgbmFtZXMgb2YgdGhlIGF1dGhvcnMgbWF5IG5vdCBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0c1xyXG4gZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcblxyXG4gVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBgYEFTIElTJycgQU5EIEFOWSBFWFBSRVNTRUQgT1IgSU1QTElFRCBXQVJSQU5USUVTLFxyXG4gSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIEpDUkFGVCxcclxuIElOQy4gT1IgQU5ZIENPTlRSSUJVVE9SUyBUTyBUSElTIFNPRlRXQVJFIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsXHJcbiBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UXHJcbiBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSxcclxuIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0ZcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcbiBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsXHJcbiBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIFRoaXMgcHJvZ3JhbSBpcyBiYXNlZCBvbiBKWmxpYiAxLjAuMiB5bW5rLCBKQ3JhZnQsSW5jLlxyXG4gKiBKWmxpYiBpcyBiYXNlZCBvbiB6bGliLTEuMS4zLCBzbyBhbGwgY3JlZGl0IHNob3VsZCBnbyBhdXRob3JzXHJcbiAqIEplYW4tbG91cCBHYWlsbHkoamxvdXBAZ3ppcC5vcmcpIGFuZCBNYXJrIEFkbGVyKG1hZGxlckBhbHVtbmkuY2FsdGVjaC5lZHUpXHJcbiAqIGFuZCBjb250cmlidXRvcnMgb2YgemxpYi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24ob2JqKSB7XHJcblxyXG5cdC8vIEdsb2JhbFxyXG5cdHZhciBNQVhfQklUUyA9IDE1O1xyXG5cclxuXHR2YXIgWl9PSyA9IDA7XHJcblx0dmFyIFpfU1RSRUFNX0VORCA9IDE7XHJcblx0dmFyIFpfTkVFRF9ESUNUID0gMjtcclxuXHR2YXIgWl9TVFJFQU1fRVJST1IgPSAtMjtcclxuXHR2YXIgWl9EQVRBX0VSUk9SID0gLTM7XHJcblx0dmFyIFpfTUVNX0VSUk9SID0gLTQ7XHJcblx0dmFyIFpfQlVGX0VSUk9SID0gLTU7XHJcblxyXG5cdHZhciBpbmZsYXRlX21hc2sgPSBbIDB4MDAwMDAwMDAsIDB4MDAwMDAwMDEsIDB4MDAwMDAwMDMsIDB4MDAwMDAwMDcsIDB4MDAwMDAwMGYsIDB4MDAwMDAwMWYsIDB4MDAwMDAwM2YsIDB4MDAwMDAwN2YsIDB4MDAwMDAwZmYsIDB4MDAwMDAxZmYsIDB4MDAwMDAzZmYsXHJcblx0XHRcdDB4MDAwMDA3ZmYsIDB4MDAwMDBmZmYsIDB4MDAwMDFmZmYsIDB4MDAwMDNmZmYsIDB4MDAwMDdmZmYsIDB4MDAwMGZmZmYgXTtcclxuXHJcblx0dmFyIE1BTlkgPSAxNDQwO1xyXG5cclxuXHQvLyBKWmxpYiB2ZXJzaW9uIDogXCIxLjAuMlwiXHJcblx0dmFyIFpfTk9fRkxVU0ggPSAwO1xyXG5cdHZhciBaX0ZJTklTSCA9IDQ7XHJcblxyXG5cdC8vIEluZlRyZWVcclxuXHR2YXIgZml4ZWRfYmwgPSA5O1xyXG5cdHZhciBmaXhlZF9iZCA9IDU7XHJcblxyXG5cdHZhciBmaXhlZF90bCA9IFsgOTYsIDcsIDI1NiwgMCwgOCwgODAsIDAsIDgsIDE2LCA4NCwgOCwgMTE1LCA4MiwgNywgMzEsIDAsIDgsIDExMiwgMCwgOCwgNDgsIDAsIDksIDE5MiwgODAsIDcsIDEwLCAwLCA4LCA5NiwgMCwgOCwgMzIsIDAsIDksIDE2MCwgMCwgOCwgMCxcclxuXHRcdFx0MCwgOCwgMTI4LCAwLCA4LCA2NCwgMCwgOSwgMjI0LCA4MCwgNywgNiwgMCwgOCwgODgsIDAsIDgsIDI0LCAwLCA5LCAxNDQsIDgzLCA3LCA1OSwgMCwgOCwgMTIwLCAwLCA4LCA1NiwgMCwgOSwgMjA4LCA4MSwgNywgMTcsIDAsIDgsIDEwNCwgMCwgOCwgNDAsXHJcblx0XHRcdDAsIDksIDE3NiwgMCwgOCwgOCwgMCwgOCwgMTM2LCAwLCA4LCA3MiwgMCwgOSwgMjQwLCA4MCwgNywgNCwgMCwgOCwgODQsIDAsIDgsIDIwLCA4NSwgOCwgMjI3LCA4MywgNywgNDMsIDAsIDgsIDExNiwgMCwgOCwgNTIsIDAsIDksIDIwMCwgODEsIDcsIDEzLFxyXG5cdFx0XHQwLCA4LCAxMDAsIDAsIDgsIDM2LCAwLCA5LCAxNjgsIDAsIDgsIDQsIDAsIDgsIDEzMiwgMCwgOCwgNjgsIDAsIDksIDIzMiwgODAsIDcsIDgsIDAsIDgsIDkyLCAwLCA4LCAyOCwgMCwgOSwgMTUyLCA4NCwgNywgODMsIDAsIDgsIDEyNCwgMCwgOCwgNjAsXHJcblx0XHRcdDAsIDksIDIxNiwgODIsIDcsIDIzLCAwLCA4LCAxMDgsIDAsIDgsIDQ0LCAwLCA5LCAxODQsIDAsIDgsIDEyLCAwLCA4LCAxNDAsIDAsIDgsIDc2LCAwLCA5LCAyNDgsIDgwLCA3LCAzLCAwLCA4LCA4MiwgMCwgOCwgMTgsIDg1LCA4LCAxNjMsIDgzLCA3LFxyXG5cdFx0XHQzNSwgMCwgOCwgMTE0LCAwLCA4LCA1MCwgMCwgOSwgMTk2LCA4MSwgNywgMTEsIDAsIDgsIDk4LCAwLCA4LCAzNCwgMCwgOSwgMTY0LCAwLCA4LCAyLCAwLCA4LCAxMzAsIDAsIDgsIDY2LCAwLCA5LCAyMjgsIDgwLCA3LCA3LCAwLCA4LCA5MCwgMCwgOCxcclxuXHRcdFx0MjYsIDAsIDksIDE0OCwgODQsIDcsIDY3LCAwLCA4LCAxMjIsIDAsIDgsIDU4LCAwLCA5LCAyMTIsIDgyLCA3LCAxOSwgMCwgOCwgMTA2LCAwLCA4LCA0MiwgMCwgOSwgMTgwLCAwLCA4LCAxMCwgMCwgOCwgMTM4LCAwLCA4LCA3NCwgMCwgOSwgMjQ0LCA4MCxcclxuXHRcdFx0NywgNSwgMCwgOCwgODYsIDAsIDgsIDIyLCAxOTIsIDgsIDAsIDgzLCA3LCA1MSwgMCwgOCwgMTE4LCAwLCA4LCA1NCwgMCwgOSwgMjA0LCA4MSwgNywgMTUsIDAsIDgsIDEwMiwgMCwgOCwgMzgsIDAsIDksIDE3MiwgMCwgOCwgNiwgMCwgOCwgMTM0LCAwLFxyXG5cdFx0XHQ4LCA3MCwgMCwgOSwgMjM2LCA4MCwgNywgOSwgMCwgOCwgOTQsIDAsIDgsIDMwLCAwLCA5LCAxNTYsIDg0LCA3LCA5OSwgMCwgOCwgMTI2LCAwLCA4LCA2MiwgMCwgOSwgMjIwLCA4MiwgNywgMjcsIDAsIDgsIDExMCwgMCwgOCwgNDYsIDAsIDksIDE4OCwgMCxcclxuXHRcdFx0OCwgMTQsIDAsIDgsIDE0MiwgMCwgOCwgNzgsIDAsIDksIDI1MiwgOTYsIDcsIDI1NiwgMCwgOCwgODEsIDAsIDgsIDE3LCA4NSwgOCwgMTMxLCA4MiwgNywgMzEsIDAsIDgsIDExMywgMCwgOCwgNDksIDAsIDksIDE5NCwgODAsIDcsIDEwLCAwLCA4LCA5NyxcclxuXHRcdFx0MCwgOCwgMzMsIDAsIDksIDE2MiwgMCwgOCwgMSwgMCwgOCwgMTI5LCAwLCA4LCA2NSwgMCwgOSwgMjI2LCA4MCwgNywgNiwgMCwgOCwgODksIDAsIDgsIDI1LCAwLCA5LCAxNDYsIDgzLCA3LCA1OSwgMCwgOCwgMTIxLCAwLCA4LCA1NywgMCwgOSwgMjEwLFxyXG5cdFx0XHQ4MSwgNywgMTcsIDAsIDgsIDEwNSwgMCwgOCwgNDEsIDAsIDksIDE3OCwgMCwgOCwgOSwgMCwgOCwgMTM3LCAwLCA4LCA3MywgMCwgOSwgMjQyLCA4MCwgNywgNCwgMCwgOCwgODUsIDAsIDgsIDIxLCA4MCwgOCwgMjU4LCA4MywgNywgNDMsIDAsIDgsIDExNyxcclxuXHRcdFx0MCwgOCwgNTMsIDAsIDksIDIwMiwgODEsIDcsIDEzLCAwLCA4LCAxMDEsIDAsIDgsIDM3LCAwLCA5LCAxNzAsIDAsIDgsIDUsIDAsIDgsIDEzMywgMCwgOCwgNjksIDAsIDksIDIzNCwgODAsIDcsIDgsIDAsIDgsIDkzLCAwLCA4LCAyOSwgMCwgOSwgMTU0LFxyXG5cdFx0XHQ4NCwgNywgODMsIDAsIDgsIDEyNSwgMCwgOCwgNjEsIDAsIDksIDIxOCwgODIsIDcsIDIzLCAwLCA4LCAxMDksIDAsIDgsIDQ1LCAwLCA5LCAxODYsIDAsIDgsIDEzLCAwLCA4LCAxNDEsIDAsIDgsIDc3LCAwLCA5LCAyNTAsIDgwLCA3LCAzLCAwLCA4LCA4MyxcclxuXHRcdFx0MCwgOCwgMTksIDg1LCA4LCAxOTUsIDgzLCA3LCAzNSwgMCwgOCwgMTE1LCAwLCA4LCA1MSwgMCwgOSwgMTk4LCA4MSwgNywgMTEsIDAsIDgsIDk5LCAwLCA4LCAzNSwgMCwgOSwgMTY2LCAwLCA4LCAzLCAwLCA4LCAxMzEsIDAsIDgsIDY3LCAwLCA5LCAyMzAsXHJcblx0XHRcdDgwLCA3LCA3LCAwLCA4LCA5MSwgMCwgOCwgMjcsIDAsIDksIDE1MCwgODQsIDcsIDY3LCAwLCA4LCAxMjMsIDAsIDgsIDU5LCAwLCA5LCAyMTQsIDgyLCA3LCAxOSwgMCwgOCwgMTA3LCAwLCA4LCA0MywgMCwgOSwgMTgyLCAwLCA4LCAxMSwgMCwgOCwgMTM5LFxyXG5cdFx0XHQwLCA4LCA3NSwgMCwgOSwgMjQ2LCA4MCwgNywgNSwgMCwgOCwgODcsIDAsIDgsIDIzLCAxOTIsIDgsIDAsIDgzLCA3LCA1MSwgMCwgOCwgMTE5LCAwLCA4LCA1NSwgMCwgOSwgMjA2LCA4MSwgNywgMTUsIDAsIDgsIDEwMywgMCwgOCwgMzksIDAsIDksIDE3NCxcclxuXHRcdFx0MCwgOCwgNywgMCwgOCwgMTM1LCAwLCA4LCA3MSwgMCwgOSwgMjM4LCA4MCwgNywgOSwgMCwgOCwgOTUsIDAsIDgsIDMxLCAwLCA5LCAxNTgsIDg0LCA3LCA5OSwgMCwgOCwgMTI3LCAwLCA4LCA2MywgMCwgOSwgMjIyLCA4MiwgNywgMjcsIDAsIDgsIDExMSxcclxuXHRcdFx0MCwgOCwgNDcsIDAsIDksIDE5MCwgMCwgOCwgMTUsIDAsIDgsIDE0MywgMCwgOCwgNzksIDAsIDksIDI1NCwgOTYsIDcsIDI1NiwgMCwgOCwgODAsIDAsIDgsIDE2LCA4NCwgOCwgMTE1LCA4MiwgNywgMzEsIDAsIDgsIDExMiwgMCwgOCwgNDgsIDAsIDksXHJcblx0XHRcdDE5MywgODAsIDcsIDEwLCAwLCA4LCA5NiwgMCwgOCwgMzIsIDAsIDksIDE2MSwgMCwgOCwgMCwgMCwgOCwgMTI4LCAwLCA4LCA2NCwgMCwgOSwgMjI1LCA4MCwgNywgNiwgMCwgOCwgODgsIDAsIDgsIDI0LCAwLCA5LCAxNDUsIDgzLCA3LCA1OSwgMCwgOCxcclxuXHRcdFx0MTIwLCAwLCA4LCA1NiwgMCwgOSwgMjA5LCA4MSwgNywgMTcsIDAsIDgsIDEwNCwgMCwgOCwgNDAsIDAsIDksIDE3NywgMCwgOCwgOCwgMCwgOCwgMTM2LCAwLCA4LCA3MiwgMCwgOSwgMjQxLCA4MCwgNywgNCwgMCwgOCwgODQsIDAsIDgsIDIwLCA4NSwgOCxcclxuXHRcdFx0MjI3LCA4MywgNywgNDMsIDAsIDgsIDExNiwgMCwgOCwgNTIsIDAsIDksIDIwMSwgODEsIDcsIDEzLCAwLCA4LCAxMDAsIDAsIDgsIDM2LCAwLCA5LCAxNjksIDAsIDgsIDQsIDAsIDgsIDEzMiwgMCwgOCwgNjgsIDAsIDksIDIzMywgODAsIDcsIDgsIDAsIDgsXHJcblx0XHRcdDkyLCAwLCA4LCAyOCwgMCwgOSwgMTUzLCA4NCwgNywgODMsIDAsIDgsIDEyNCwgMCwgOCwgNjAsIDAsIDksIDIxNywgODIsIDcsIDIzLCAwLCA4LCAxMDgsIDAsIDgsIDQ0LCAwLCA5LCAxODUsIDAsIDgsIDEyLCAwLCA4LCAxNDAsIDAsIDgsIDc2LCAwLCA5LFxyXG5cdFx0XHQyNDksIDgwLCA3LCAzLCAwLCA4LCA4MiwgMCwgOCwgMTgsIDg1LCA4LCAxNjMsIDgzLCA3LCAzNSwgMCwgOCwgMTE0LCAwLCA4LCA1MCwgMCwgOSwgMTk3LCA4MSwgNywgMTEsIDAsIDgsIDk4LCAwLCA4LCAzNCwgMCwgOSwgMTY1LCAwLCA4LCAyLCAwLCA4LFxyXG5cdFx0XHQxMzAsIDAsIDgsIDY2LCAwLCA5LCAyMjksIDgwLCA3LCA3LCAwLCA4LCA5MCwgMCwgOCwgMjYsIDAsIDksIDE0OSwgODQsIDcsIDY3LCAwLCA4LCAxMjIsIDAsIDgsIDU4LCAwLCA5LCAyMTMsIDgyLCA3LCAxOSwgMCwgOCwgMTA2LCAwLCA4LCA0MiwgMCwgOSxcclxuXHRcdFx0MTgxLCAwLCA4LCAxMCwgMCwgOCwgMTM4LCAwLCA4LCA3NCwgMCwgOSwgMjQ1LCA4MCwgNywgNSwgMCwgOCwgODYsIDAsIDgsIDIyLCAxOTIsIDgsIDAsIDgzLCA3LCA1MSwgMCwgOCwgMTE4LCAwLCA4LCA1NCwgMCwgOSwgMjA1LCA4MSwgNywgMTUsIDAsIDgsXHJcblx0XHRcdDEwMiwgMCwgOCwgMzgsIDAsIDksIDE3MywgMCwgOCwgNiwgMCwgOCwgMTM0LCAwLCA4LCA3MCwgMCwgOSwgMjM3LCA4MCwgNywgOSwgMCwgOCwgOTQsIDAsIDgsIDMwLCAwLCA5LCAxNTcsIDg0LCA3LCA5OSwgMCwgOCwgMTI2LCAwLCA4LCA2MiwgMCwgOSxcclxuXHRcdFx0MjIxLCA4MiwgNywgMjcsIDAsIDgsIDExMCwgMCwgOCwgNDYsIDAsIDksIDE4OSwgMCwgOCwgMTQsIDAsIDgsIDE0MiwgMCwgOCwgNzgsIDAsIDksIDI1MywgOTYsIDcsIDI1NiwgMCwgOCwgODEsIDAsIDgsIDE3LCA4NSwgOCwgMTMxLCA4MiwgNywgMzEsIDAsXHJcblx0XHRcdDgsIDExMywgMCwgOCwgNDksIDAsIDksIDE5NSwgODAsIDcsIDEwLCAwLCA4LCA5NywgMCwgOCwgMzMsIDAsIDksIDE2MywgMCwgOCwgMSwgMCwgOCwgMTI5LCAwLCA4LCA2NSwgMCwgOSwgMjI3LCA4MCwgNywgNiwgMCwgOCwgODksIDAsIDgsIDI1LCAwLCA5LFxyXG5cdFx0XHQxNDcsIDgzLCA3LCA1OSwgMCwgOCwgMTIxLCAwLCA4LCA1NywgMCwgOSwgMjExLCA4MSwgNywgMTcsIDAsIDgsIDEwNSwgMCwgOCwgNDEsIDAsIDksIDE3OSwgMCwgOCwgOSwgMCwgOCwgMTM3LCAwLCA4LCA3MywgMCwgOSwgMjQzLCA4MCwgNywgNCwgMCwgOCxcclxuXHRcdFx0ODUsIDAsIDgsIDIxLCA4MCwgOCwgMjU4LCA4MywgNywgNDMsIDAsIDgsIDExNywgMCwgOCwgNTMsIDAsIDksIDIwMywgODEsIDcsIDEzLCAwLCA4LCAxMDEsIDAsIDgsIDM3LCAwLCA5LCAxNzEsIDAsIDgsIDUsIDAsIDgsIDEzMywgMCwgOCwgNjksIDAsIDksXHJcblx0XHRcdDIzNSwgODAsIDcsIDgsIDAsIDgsIDkzLCAwLCA4LCAyOSwgMCwgOSwgMTU1LCA4NCwgNywgODMsIDAsIDgsIDEyNSwgMCwgOCwgNjEsIDAsIDksIDIxOSwgODIsIDcsIDIzLCAwLCA4LCAxMDksIDAsIDgsIDQ1LCAwLCA5LCAxODcsIDAsIDgsIDEzLCAwLCA4LFxyXG5cdFx0XHQxNDEsIDAsIDgsIDc3LCAwLCA5LCAyNTEsIDgwLCA3LCAzLCAwLCA4LCA4MywgMCwgOCwgMTksIDg1LCA4LCAxOTUsIDgzLCA3LCAzNSwgMCwgOCwgMTE1LCAwLCA4LCA1MSwgMCwgOSwgMTk5LCA4MSwgNywgMTEsIDAsIDgsIDk5LCAwLCA4LCAzNSwgMCwgOSxcclxuXHRcdFx0MTY3LCAwLCA4LCAzLCAwLCA4LCAxMzEsIDAsIDgsIDY3LCAwLCA5LCAyMzEsIDgwLCA3LCA3LCAwLCA4LCA5MSwgMCwgOCwgMjcsIDAsIDksIDE1MSwgODQsIDcsIDY3LCAwLCA4LCAxMjMsIDAsIDgsIDU5LCAwLCA5LCAyMTUsIDgyLCA3LCAxOSwgMCwgOCxcclxuXHRcdFx0MTA3LCAwLCA4LCA0MywgMCwgOSwgMTgzLCAwLCA4LCAxMSwgMCwgOCwgMTM5LCAwLCA4LCA3NSwgMCwgOSwgMjQ3LCA4MCwgNywgNSwgMCwgOCwgODcsIDAsIDgsIDIzLCAxOTIsIDgsIDAsIDgzLCA3LCA1MSwgMCwgOCwgMTE5LCAwLCA4LCA1NSwgMCwgOSxcclxuXHRcdFx0MjA3LCA4MSwgNywgMTUsIDAsIDgsIDEwMywgMCwgOCwgMzksIDAsIDksIDE3NSwgMCwgOCwgNywgMCwgOCwgMTM1LCAwLCA4LCA3MSwgMCwgOSwgMjM5LCA4MCwgNywgOSwgMCwgOCwgOTUsIDAsIDgsIDMxLCAwLCA5LCAxNTksIDg0LCA3LCA5OSwgMCwgOCxcclxuXHRcdFx0MTI3LCAwLCA4LCA2MywgMCwgOSwgMjIzLCA4MiwgNywgMjcsIDAsIDgsIDExMSwgMCwgOCwgNDcsIDAsIDksIDE5MSwgMCwgOCwgMTUsIDAsIDgsIDE0MywgMCwgOCwgNzksIDAsIDksIDI1NSBdO1xyXG5cdHZhciBmaXhlZF90ZCA9IFsgODAsIDUsIDEsIDg3LCA1LCAyNTcsIDgzLCA1LCAxNywgOTEsIDUsIDQwOTcsIDgxLCA1LCA1LCA4OSwgNSwgMTAyNSwgODUsIDUsIDY1LCA5MywgNSwgMTYzODUsIDgwLCA1LCAzLCA4OCwgNSwgNTEzLCA4NCwgNSwgMzMsIDkyLCA1LFxyXG5cdFx0XHQ4MTkzLCA4MiwgNSwgOSwgOTAsIDUsIDIwNDksIDg2LCA1LCAxMjksIDE5MiwgNSwgMjQ1NzcsIDgwLCA1LCAyLCA4NywgNSwgMzg1LCA4MywgNSwgMjUsIDkxLCA1LCA2MTQ1LCA4MSwgNSwgNywgODksIDUsIDE1MzcsIDg1LCA1LCA5NywgOTMsIDUsXHJcblx0XHRcdDI0NTc3LCA4MCwgNSwgNCwgODgsIDUsIDc2OSwgODQsIDUsIDQ5LCA5MiwgNSwgMTIyODksIDgyLCA1LCAxMywgOTAsIDUsIDMwNzMsIDg2LCA1LCAxOTMsIDE5MiwgNSwgMjQ1NzcgXTtcclxuXHJcblx0Ly8gVGFibGVzIGZvciBkZWZsYXRlIGZyb20gUEtaSVAncyBhcHBub3RlLnR4dC5cclxuXHR2YXIgY3BsZW5zID0gWyAvLyBDb3B5IGxlbmd0aHMgZm9yIGxpdGVyYWwgY29kZXMgMjU3Li4yODVcclxuXHQzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEzLCAxNSwgMTcsIDE5LCAyMywgMjcsIDMxLCAzNSwgNDMsIDUxLCA1OSwgNjcsIDgzLCA5OSwgMTE1LCAxMzEsIDE2MywgMTk1LCAyMjcsIDI1OCwgMCwgMCBdO1xyXG5cclxuXHQvLyBzZWUgbm90ZSAjMTMgYWJvdmUgYWJvdXQgMjU4XHJcblx0dmFyIGNwbGV4dCA9IFsgLy8gRXh0cmEgYml0cyBmb3IgbGl0ZXJhbCBjb2RlcyAyNTcuLjI4NVxyXG5cdDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDIsIDIsIDIsIDIsIDMsIDMsIDMsIDMsIDQsIDQsIDQsIDQsIDUsIDUsIDUsIDUsIDAsIDExMiwgMTEyIC8vIDExMj09aW52YWxpZFxyXG5cdF07XHJcblxyXG5cdHZhciBjcGRpc3QgPSBbIC8vIENvcHkgb2Zmc2V0cyBmb3IgZGlzdGFuY2UgY29kZXMgMC4uMjlcclxuXHQxLCAyLCAzLCA0LCA1LCA3LCA5LCAxMywgMTcsIDI1LCAzMywgNDksIDY1LCA5NywgMTI5LCAxOTMsIDI1NywgMzg1LCA1MTMsIDc2OSwgMTAyNSwgMTUzNywgMjA0OSwgMzA3MywgNDA5NywgNjE0NSwgODE5MywgMTIyODksIDE2Mzg1LCAyNDU3NyBdO1xyXG5cclxuXHR2YXIgY3BkZXh0ID0gWyAvLyBFeHRyYSBiaXRzIGZvciBkaXN0YW5jZSBjb2Rlc1xyXG5cdDAsIDAsIDAsIDAsIDEsIDEsIDIsIDIsIDMsIDMsIDQsIDQsIDUsIDUsIDYsIDYsIDcsIDcsIDgsIDgsIDksIDksIDEwLCAxMCwgMTEsIDExLCAxMiwgMTIsIDEzLCAxMyBdO1xyXG5cclxuXHQvLyBJZiBCTUFYIG5lZWRzIHRvIGJlIGxhcmdlciB0aGFuIDE2LCB0aGVuIGggYW5kIHhbXSBzaG91bGQgYmUgdUxvbmcuXHJcblx0dmFyIEJNQVggPSAxNTsgLy8gbWF4aW11bSBiaXQgbGVuZ3RoIG9mIGFueSBjb2RlXHJcblxyXG5cdGZ1bmN0aW9uIEluZlRyZWUoKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIGhuOyAvLyBodWZ0cyB1c2VkIGluIHNwYWNlXHJcblx0XHR2YXIgdjsgLy8gd29yayBhcmVhIGZvciBodWZ0X2J1aWxkXHJcblx0XHR2YXIgYzsgLy8gYml0IGxlbmd0aCBjb3VudCB0YWJsZVxyXG5cdFx0dmFyIHI7IC8vIHRhYmxlIGVudHJ5IGZvciBzdHJ1Y3R1cmUgYXNzaWdubWVudFxyXG5cdFx0dmFyIHU7IC8vIHRhYmxlIHN0YWNrXHJcblx0XHR2YXIgeDsgLy8gYml0IG9mZnNldHMsIHRoZW4gY29kZSBzdGFja1xyXG5cclxuXHRcdGZ1bmN0aW9uIGh1ZnRfYnVpbGQoYiwgLy8gY29kZSBsZW5ndGhzIGluIGJpdHMgKGFsbCBhc3N1bWVkIDw9XHJcblx0XHQvLyBCTUFYKVxyXG5cdFx0YmluZGV4LCBuLCAvLyBudW1iZXIgb2YgY29kZXMgKGFzc3VtZWQgPD0gMjg4KVxyXG5cdFx0cywgLy8gbnVtYmVyIG9mIHNpbXBsZS12YWx1ZWQgY29kZXMgKDAuLnMtMSlcclxuXHRcdGQsIC8vIGxpc3Qgb2YgYmFzZSB2YWx1ZXMgZm9yIG5vbi1zaW1wbGUgY29kZXNcclxuXHRcdGUsIC8vIGxpc3Qgb2YgZXh0cmEgYml0cyBmb3Igbm9uLXNpbXBsZSBjb2Rlc1xyXG5cdFx0dCwgLy8gcmVzdWx0OiBzdGFydGluZyB0YWJsZVxyXG5cdFx0bSwgLy8gbWF4aW11bSBsb29rdXAgYml0cywgcmV0dXJucyBhY3R1YWxcclxuXHRcdGhwLC8vIHNwYWNlIGZvciB0cmVlc1xyXG5cdFx0aG4sLy8gaHVmdHMgdXNlZCBpbiBzcGFjZVxyXG5cdFx0diAvLyB3b3JraW5nIGFyZWE6IHZhbHVlcyBpbiBvcmRlciBvZiBiaXQgbGVuZ3RoXHJcblx0XHQpIHtcclxuXHRcdFx0Ly8gR2l2ZW4gYSBsaXN0IG9mIGNvZGUgbGVuZ3RocyBhbmQgYSBtYXhpbXVtIHRhYmxlIHNpemUsIG1ha2UgYSBzZXQgb2ZcclxuXHRcdFx0Ly8gdGFibGVzIHRvIGRlY29kZSB0aGF0IHNldCBvZiBjb2Rlcy4gUmV0dXJuIFpfT0sgb24gc3VjY2VzcyxcclxuXHRcdFx0Ly8gWl9CVUZfRVJST1JcclxuXHRcdFx0Ly8gaWYgdGhlIGdpdmVuIGNvZGUgc2V0IGlzIGluY29tcGxldGUgKHRoZSB0YWJsZXMgYXJlIHN0aWxsIGJ1aWx0IGluXHJcblx0XHRcdC8vIHRoaXNcclxuXHRcdFx0Ly8gY2FzZSksIFpfREFUQV9FUlJPUiBpZiB0aGUgaW5wdXQgaXMgaW52YWxpZCAoYW4gb3Zlci1zdWJzY3JpYmVkIHNldFxyXG5cdFx0XHQvLyBvZlxyXG5cdFx0XHQvLyBsZW5ndGhzKSwgb3IgWl9NRU1fRVJST1IgaWYgbm90IGVub3VnaCBtZW1vcnkuXHJcblxyXG5cdFx0XHR2YXIgYTsgLy8gY291bnRlciBmb3IgY29kZXMgb2YgbGVuZ3RoIGtcclxuXHRcdFx0dmFyIGY7IC8vIGkgcmVwZWF0cyBpbiB0YWJsZSBldmVyeSBmIGVudHJpZXNcclxuXHRcdFx0dmFyIGc7IC8vIG1heGltdW0gY29kZSBsZW5ndGhcclxuXHRcdFx0dmFyIGg7IC8vIHRhYmxlIGxldmVsXHJcblx0XHRcdHZhciBpOyAvLyBjb3VudGVyLCBjdXJyZW50IGNvZGVcclxuXHRcdFx0dmFyIGo7IC8vIGNvdW50ZXJcclxuXHRcdFx0dmFyIGs7IC8vIG51bWJlciBvZiBiaXRzIGluIGN1cnJlbnQgY29kZVxyXG5cdFx0XHR2YXIgbDsgLy8gYml0cyBwZXIgdGFibGUgKHJldHVybmVkIGluIG0pXHJcblx0XHRcdHZhciBtYXNrOyAvLyAoMSA8PCB3KSAtIDEsIHRvIGF2b2lkIGNjIC1PIGJ1ZyBvbiBIUFxyXG5cdFx0XHR2YXIgcDsgLy8gcG9pbnRlciBpbnRvIGNbXSwgYltdLCBvciB2W11cclxuXHRcdFx0dmFyIHE7IC8vIHBvaW50cyB0byBjdXJyZW50IHRhYmxlXHJcblx0XHRcdHZhciB3OyAvLyBiaXRzIGJlZm9yZSB0aGlzIHRhYmxlID09IChsICogaClcclxuXHRcdFx0dmFyIHhwOyAvLyBwb2ludGVyIGludG8geFxyXG5cdFx0XHR2YXIgeTsgLy8gbnVtYmVyIG9mIGR1bW15IGNvZGVzIGFkZGVkXHJcblx0XHRcdHZhciB6OyAvLyBudW1iZXIgb2YgZW50cmllcyBpbiBjdXJyZW50IHRhYmxlXHJcblxyXG5cdFx0XHQvLyBHZW5lcmF0ZSBjb3VudHMgZm9yIGVhY2ggYml0IGxlbmd0aFxyXG5cclxuXHRcdFx0cCA9IDA7XHJcblx0XHRcdGkgPSBuO1xyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0Y1tiW2JpbmRleCArIHBdXSsrO1xyXG5cdFx0XHRcdHArKztcclxuXHRcdFx0XHRpLS07IC8vIGFzc3VtZSBhbGwgZW50cmllcyA8PSBCTUFYXHJcblx0XHRcdH0gd2hpbGUgKGkgIT09IDApO1xyXG5cclxuXHRcdFx0aWYgKGNbMF0gPT0gbikgeyAvLyBudWxsIGlucHV0LS1hbGwgemVybyBsZW5ndGggY29kZXNcclxuXHRcdFx0XHR0WzBdID0gLTE7XHJcblx0XHRcdFx0bVswXSA9IDA7XHJcblx0XHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEZpbmQgbWluaW11bSBhbmQgbWF4aW11bSBsZW5ndGgsIGJvdW5kICptIGJ5IHRob3NlXHJcblx0XHRcdGwgPSBtWzBdO1xyXG5cdFx0XHRmb3IgKGogPSAxOyBqIDw9IEJNQVg7IGorKylcclxuXHRcdFx0XHRpZiAoY1tqXSAhPT0gMClcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRrID0gajsgLy8gbWluaW11bSBjb2RlIGxlbmd0aFxyXG5cdFx0XHRpZiAobCA8IGopIHtcclxuXHRcdFx0XHRsID0gajtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGkgPSBCTUFYOyBpICE9PSAwOyBpLS0pIHtcclxuXHRcdFx0XHRpZiAoY1tpXSAhPT0gMClcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGcgPSBpOyAvLyBtYXhpbXVtIGNvZGUgbGVuZ3RoXHJcblx0XHRcdGlmIChsID4gaSkge1xyXG5cdFx0XHRcdGwgPSBpO1xyXG5cdFx0XHR9XHJcblx0XHRcdG1bMF0gPSBsO1xyXG5cclxuXHRcdFx0Ly8gQWRqdXN0IGxhc3QgbGVuZ3RoIGNvdW50IHRvIGZpbGwgb3V0IGNvZGVzLCBpZiBuZWVkZWRcclxuXHRcdFx0Zm9yICh5ID0gMSA8PCBqOyBqIDwgaTsgaisrLCB5IDw8PSAxKSB7XHJcblx0XHRcdFx0aWYgKCh5IC09IGNbal0pIDwgMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIFpfREFUQV9FUlJPUjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCh5IC09IGNbaV0pIDwgMCkge1xyXG5cdFx0XHRcdHJldHVybiBaX0RBVEFfRVJST1I7XHJcblx0XHRcdH1cclxuXHRcdFx0Y1tpXSArPSB5O1xyXG5cclxuXHRcdFx0Ly8gR2VuZXJhdGUgc3RhcnRpbmcgb2Zmc2V0cyBpbnRvIHRoZSB2YWx1ZSB0YWJsZSBmb3IgZWFjaCBsZW5ndGhcclxuXHRcdFx0eFsxXSA9IGogPSAwO1xyXG5cdFx0XHRwID0gMTtcclxuXHRcdFx0eHAgPSAyO1xyXG5cdFx0XHR3aGlsZSAoLS1pICE9PSAwKSB7IC8vIG5vdGUgdGhhdCBpID09IGcgZnJvbSBhYm92ZVxyXG5cdFx0XHRcdHhbeHBdID0gKGogKz0gY1twXSk7XHJcblx0XHRcdFx0eHArKztcclxuXHRcdFx0XHRwKys7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE1ha2UgYSB0YWJsZSBvZiB2YWx1ZXMgaW4gb3JkZXIgb2YgYml0IGxlbmd0aHNcclxuXHRcdFx0aSA9IDA7XHJcblx0XHRcdHAgPSAwO1xyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0aWYgKChqID0gYltiaW5kZXggKyBwXSkgIT09IDApIHtcclxuXHRcdFx0XHRcdHZbeFtqXSsrXSA9IGk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHArKztcclxuXHRcdFx0fSB3aGlsZSAoKytpIDwgbik7XHJcblx0XHRcdG4gPSB4W2ddOyAvLyBzZXQgbiB0byBsZW5ndGggb2YgdlxyXG5cclxuXHRcdFx0Ly8gR2VuZXJhdGUgdGhlIEh1ZmZtYW4gY29kZXMgYW5kIGZvciBlYWNoLCBtYWtlIHRoZSB0YWJsZSBlbnRyaWVzXHJcblx0XHRcdHhbMF0gPSBpID0gMDsgLy8gZmlyc3QgSHVmZm1hbiBjb2RlIGlzIHplcm9cclxuXHRcdFx0cCA9IDA7IC8vIGdyYWIgdmFsdWVzIGluIGJpdCBvcmRlclxyXG5cdFx0XHRoID0gLTE7IC8vIG5vIHRhYmxlcyB5ZXQtLWxldmVsIC0xXHJcblx0XHRcdHcgPSAtbDsgLy8gYml0cyBkZWNvZGVkID09IChsICogaClcclxuXHRcdFx0dVswXSA9IDA7IC8vIGp1c3QgdG8ga2VlcCBjb21waWxlcnMgaGFwcHlcclxuXHRcdFx0cSA9IDA7IC8vIGRpdHRvXHJcblx0XHRcdHogPSAwOyAvLyBkaXR0b1xyXG5cclxuXHRcdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYml0IGxlbmd0aHMgKGsgYWxyZWFkeSBpcyBiaXRzIGluIHNob3J0ZXN0IGNvZGUpXHJcblx0XHRcdGZvciAoOyBrIDw9IGc7IGsrKykge1xyXG5cdFx0XHRcdGEgPSBjW2tdO1xyXG5cdFx0XHRcdHdoaWxlIChhLS0gIT09IDApIHtcclxuXHRcdFx0XHRcdC8vIGhlcmUgaSBpcyB0aGUgSHVmZm1hbiBjb2RlIG9mIGxlbmd0aCBrIGJpdHMgZm9yIHZhbHVlICpwXHJcblx0XHRcdFx0XHQvLyBtYWtlIHRhYmxlcyB1cCB0byByZXF1aXJlZCBsZXZlbFxyXG5cdFx0XHRcdFx0d2hpbGUgKGsgPiB3ICsgbCkge1xyXG5cdFx0XHRcdFx0XHRoKys7XHJcblx0XHRcdFx0XHRcdHcgKz0gbDsgLy8gcHJldmlvdXMgdGFibGUgYWx3YXlzIGwgYml0c1xyXG5cdFx0XHRcdFx0XHQvLyBjb21wdXRlIG1pbmltdW0gc2l6ZSB0YWJsZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gbCBiaXRzXHJcblx0XHRcdFx0XHRcdHogPSBnIC0gdztcclxuXHRcdFx0XHRcdFx0eiA9ICh6ID4gbCkgPyBsIDogejsgLy8gdGFibGUgc2l6ZSB1cHBlciBsaW1pdFxyXG5cdFx0XHRcdFx0XHRpZiAoKGYgPSAxIDw8IChqID0gayAtIHcpKSA+IGEgKyAxKSB7IC8vIHRyeSBhIGstdyBiaXQgdGFibGVcclxuXHRcdFx0XHRcdFx0XHQvLyB0b28gZmV3IGNvZGVzIGZvclxyXG5cdFx0XHRcdFx0XHRcdC8vIGstdyBiaXQgdGFibGVcclxuXHRcdFx0XHRcdFx0XHRmIC09IGEgKyAxOyAvLyBkZWR1Y3QgY29kZXMgZnJvbSBwYXR0ZXJucyBsZWZ0XHJcblx0XHRcdFx0XHRcdFx0eHAgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChqIDwgeikge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCsraiA8IHopIHsgLy8gdHJ5IHNtYWxsZXIgdGFibGVzIHVwIHRvIHogYml0c1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoKGYgPDw9IDEpIDw9IGNbKyt4cF0pXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7IC8vIGVub3VnaCBjb2RlcyB0byB1c2UgdXAgaiBiaXRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGYgLT0gY1t4cF07IC8vIGVsc2UgZGVkdWN0IGNvZGVzIGZyb20gcGF0dGVybnNcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0eiA9IDEgPDwgajsgLy8gdGFibGUgZW50cmllcyBmb3Igai1iaXQgdGFibGVcclxuXHJcblx0XHRcdFx0XHRcdC8vIGFsbG9jYXRlIG5ldyB0YWJsZVxyXG5cdFx0XHRcdFx0XHRpZiAoaG5bMF0gKyB6ID4gTUFOWSkgeyAvLyAobm90ZTogZG9lc24ndCBtYXR0ZXIgZm9yIGZpeGVkKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBaX0RBVEFfRVJST1I7IC8vIG92ZXJmbG93IG9mIE1BTllcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR1W2hdID0gcSA9IC8qIGhwKyAqL2huWzBdOyAvLyBERUJVR1xyXG5cdFx0XHRcdFx0XHRoblswXSArPSB6O1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gY29ubmVjdCB0byBsYXN0IHRhYmxlLCBpZiB0aGVyZSBpcyBvbmVcclxuXHRcdFx0XHRcdFx0aWYgKGggIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHR4W2hdID0gaTsgLy8gc2F2ZSBwYXR0ZXJuIGZvciBiYWNraW5nIHVwXHJcblx0XHRcdFx0XHRcdFx0clswXSA9IC8qIChieXRlKSAqL2o7IC8vIGJpdHMgaW4gdGhpcyB0YWJsZVxyXG5cdFx0XHRcdFx0XHRcdHJbMV0gPSAvKiAoYnl0ZSkgKi9sOyAvLyBiaXRzIHRvIGR1bXAgYmVmb3JlIHRoaXMgdGFibGVcclxuXHRcdFx0XHRcdFx0XHRqID0gaSA+Pj4gKHcgLSBsKTtcclxuXHRcdFx0XHRcdFx0XHRyWzJdID0gLyogKGludCkgKi8ocSAtIHVbaCAtIDFdIC0gaik7IC8vIG9mZnNldCB0byB0aGlzIHRhYmxlXHJcblx0XHRcdFx0XHRcdFx0aHAuc2V0KHIsICh1W2ggLSAxXSArIGopICogMyk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gdG9cclxuXHRcdFx0XHRcdFx0XHQvLyBsYXN0XHJcblx0XHRcdFx0XHRcdFx0Ly8gdGFibGVcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR0WzBdID0gcTsgLy8gZmlyc3QgdGFibGUgaXMgcmV0dXJuZWQgcmVzdWx0XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBzZXQgdXAgdGFibGUgZW50cnkgaW4gclxyXG5cdFx0XHRcdFx0clsxXSA9IC8qIChieXRlKSAqLyhrIC0gdyk7XHJcblx0XHRcdFx0XHRpZiAocCA+PSBuKSB7XHJcblx0XHRcdFx0XHRcdHJbMF0gPSAxMjggKyA2NDsgLy8gb3V0IG9mIHZhbHVlcy0taW52YWxpZCBjb2RlXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHZbcF0gPCBzKSB7XHJcblx0XHRcdFx0XHRcdHJbMF0gPSAvKiAoYnl0ZSkgKi8odltwXSA8IDI1NiA/IDAgOiAzMiArIDY0KTsgLy8gMjU2IGlzXHJcblx0XHRcdFx0XHRcdC8vIGVuZC1vZi1ibG9ja1xyXG5cdFx0XHRcdFx0XHRyWzJdID0gdltwKytdOyAvLyBzaW1wbGUgY29kZSBpcyBqdXN0IHRoZSB2YWx1ZVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0clswXSA9IC8qIChieXRlKSAqLyhlW3ZbcF0gLSBzXSArIDE2ICsgNjQpOyAvLyBub24tc2ltcGxlLS1sb29rXHJcblx0XHRcdFx0XHRcdC8vIHVwIGluIGxpc3RzXHJcblx0XHRcdFx0XHRcdHJbMl0gPSBkW3ZbcCsrXSAtIHNdO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIGZpbGwgY29kZS1saWtlIGVudHJpZXMgd2l0aCByXHJcblx0XHRcdFx0XHRmID0gMSA8PCAoayAtIHcpO1xyXG5cdFx0XHRcdFx0Zm9yIChqID0gaSA+Pj4gdzsgaiA8IHo7IGogKz0gZikge1xyXG5cdFx0XHRcdFx0XHRocC5zZXQociwgKHEgKyBqKSAqIDMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIGJhY2t3YXJkcyBpbmNyZW1lbnQgdGhlIGstYml0IGNvZGUgaVxyXG5cdFx0XHRcdFx0Zm9yIChqID0gMSA8PCAoayAtIDEpOyAoaSAmIGopICE9PSAwOyBqID4+Pj0gMSkge1xyXG5cdFx0XHRcdFx0XHRpIF49IGo7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpIF49IGo7XHJcblxyXG5cdFx0XHRcdFx0Ly8gYmFja3VwIG92ZXIgZmluaXNoZWQgdGFibGVzXHJcblx0XHRcdFx0XHRtYXNrID0gKDEgPDwgdykgLSAxOyAvLyBuZWVkZWQgb24gSFAsIGNjIC1PIGJ1Z1xyXG5cdFx0XHRcdFx0d2hpbGUgKChpICYgbWFzaykgIT0geFtoXSkge1xyXG5cdFx0XHRcdFx0XHRoLS07IC8vIGRvbid0IG5lZWQgdG8gdXBkYXRlIHFcclxuXHRcdFx0XHRcdFx0dyAtPSBsO1xyXG5cdFx0XHRcdFx0XHRtYXNrID0gKDEgPDwgdykgLSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBSZXR1cm4gWl9CVUZfRVJST1IgaWYgd2Ugd2VyZSBnaXZlbiBhbiBpbmNvbXBsZXRlIHRhYmxlXHJcblx0XHRcdHJldHVybiB5ICE9PSAwICYmIGcgIT0gMSA/IFpfQlVGX0VSUk9SIDogWl9PSztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbml0V29ya0FyZWEodnNpemUpIHtcclxuXHRcdFx0dmFyIGk7XHJcblx0XHRcdGlmICghaG4pIHtcclxuXHRcdFx0XHRobiA9IFtdOyAvLyBbXTsgLy9uZXcgQXJyYXkoMSk7XHJcblx0XHRcdFx0diA9IFtdOyAvLyBuZXcgQXJyYXkodnNpemUpO1xyXG5cdFx0XHRcdGMgPSBuZXcgSW50MzJBcnJheShCTUFYICsgMSk7IC8vIG5ldyBBcnJheShCTUFYICsgMSk7XHJcblx0XHRcdFx0ciA9IFtdOyAvLyBuZXcgQXJyYXkoMyk7XHJcblx0XHRcdFx0dSA9IG5ldyBJbnQzMkFycmF5KEJNQVgpOyAvLyBuZXcgQXJyYXkoQk1BWCk7XHJcblx0XHRcdFx0eCA9IG5ldyBJbnQzMkFycmF5KEJNQVggKyAxKTsgLy8gbmV3IEFycmF5KEJNQVggKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodi5sZW5ndGggPCB2c2l6ZSkge1xyXG5cdFx0XHRcdHYgPSBbXTsgLy8gbmV3IEFycmF5KHZzaXplKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgdnNpemU7IGkrKykge1xyXG5cdFx0XHRcdHZbaV0gPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBCTUFYICsgMTsgaSsrKSB7XHJcblx0XHRcdFx0Y1tpXSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xyXG5cdFx0XHRcdHJbaV0gPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIGZvcihpbnQgaT0wOyBpPEJNQVg7IGkrKyl7dVtpXT0wO31cclxuXHRcdFx0dS5zZXQoYy5zdWJhcnJheSgwLCBCTUFYKSwgMCk7XHJcblx0XHRcdC8vIGZvcihpbnQgaT0wOyBpPEJNQVgrMTsgaSsrKXt4W2ldPTA7fVxyXG5cdFx0XHR4LnNldChjLnN1YmFycmF5KDAsIEJNQVggKyAxKSwgMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhhdC5pbmZsYXRlX3RyZWVzX2JpdHMgPSBmdW5jdGlvbihjLCAvLyAxOSBjb2RlIGxlbmd0aHNcclxuXHRcdGJiLCAvLyBiaXRzIHRyZWUgZGVzaXJlZC9hY3R1YWwgZGVwdGhcclxuXHRcdHRiLCAvLyBiaXRzIHRyZWUgcmVzdWx0XHJcblx0XHRocCwgLy8gc3BhY2UgZm9yIHRyZWVzXHJcblx0XHR6IC8vIGZvciBtZXNzYWdlc1xyXG5cdFx0KSB7XHJcblx0XHRcdHZhciByZXN1bHQ7XHJcblx0XHRcdGluaXRXb3JrQXJlYSgxOSk7XHJcblx0XHRcdGhuWzBdID0gMDtcclxuXHRcdFx0cmVzdWx0ID0gaHVmdF9idWlsZChjLCAwLCAxOSwgMTksIG51bGwsIG51bGwsIHRiLCBiYiwgaHAsIGhuLCB2KTtcclxuXHJcblx0XHRcdGlmIChyZXN1bHQgPT0gWl9EQVRBX0VSUk9SKSB7XHJcblx0XHRcdFx0ei5tc2cgPSBcIm92ZXJzdWJzY3JpYmVkIGR5bmFtaWMgYml0IGxlbmd0aHMgdHJlZVwiO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBaX0JVRl9FUlJPUiB8fCBiYlswXSA9PT0gMCkge1xyXG5cdFx0XHRcdHoubXNnID0gXCJpbmNvbXBsZXRlIGR5bmFtaWMgYml0IGxlbmd0aHMgdHJlZVwiO1xyXG5cdFx0XHRcdHJlc3VsdCA9IFpfREFUQV9FUlJPUjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmluZmxhdGVfdHJlZXNfZHluYW1pYyA9IGZ1bmN0aW9uKG5sLCAvLyBudW1iZXIgb2YgbGl0ZXJhbC9sZW5ndGggY29kZXNcclxuXHRcdG5kLCAvLyBudW1iZXIgb2YgZGlzdGFuY2UgY29kZXNcclxuXHRcdGMsIC8vIHRoYXQgbWFueSAodG90YWwpIGNvZGUgbGVuZ3Roc1xyXG5cdFx0YmwsIC8vIGxpdGVyYWwgZGVzaXJlZC9hY3R1YWwgYml0IGRlcHRoXHJcblx0XHRiZCwgLy8gZGlzdGFuY2UgZGVzaXJlZC9hY3R1YWwgYml0IGRlcHRoXHJcblx0XHR0bCwgLy8gbGl0ZXJhbC9sZW5ndGggdHJlZSByZXN1bHRcclxuXHRcdHRkLCAvLyBkaXN0YW5jZSB0cmVlIHJlc3VsdFxyXG5cdFx0aHAsIC8vIHNwYWNlIGZvciB0cmVlc1xyXG5cdFx0eiAvLyBmb3IgbWVzc2FnZXNcclxuXHRcdCkge1xyXG5cdFx0XHR2YXIgcmVzdWx0O1xyXG5cclxuXHRcdFx0Ly8gYnVpbGQgbGl0ZXJhbC9sZW5ndGggdHJlZVxyXG5cdFx0XHRpbml0V29ya0FyZWEoMjg4KTtcclxuXHRcdFx0aG5bMF0gPSAwO1xyXG5cdFx0XHRyZXN1bHQgPSBodWZ0X2J1aWxkKGMsIDAsIG5sLCAyNTcsIGNwbGVucywgY3BsZXh0LCB0bCwgYmwsIGhwLCBobiwgdik7XHJcblx0XHRcdGlmIChyZXN1bHQgIT0gWl9PSyB8fCBibFswXSA9PT0gMCkge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT0gWl9EQVRBX0VSUk9SKSB7XHJcblx0XHRcdFx0XHR6Lm1zZyA9IFwib3ZlcnN1YnNjcmliZWQgbGl0ZXJhbC9sZW5ndGggdHJlZVwiO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ICE9IFpfTUVNX0VSUk9SKSB7XHJcblx0XHRcdFx0XHR6Lm1zZyA9IFwiaW5jb21wbGV0ZSBsaXRlcmFsL2xlbmd0aCB0cmVlXCI7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBaX0RBVEFfRVJST1I7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGJ1aWxkIGRpc3RhbmNlIHRyZWVcclxuXHRcdFx0aW5pdFdvcmtBcmVhKDI4OCk7XHJcblx0XHRcdHJlc3VsdCA9IGh1ZnRfYnVpbGQoYywgbmwsIG5kLCAwLCBjcGRpc3QsIGNwZGV4dCwgdGQsIGJkLCBocCwgaG4sIHYpO1xyXG5cclxuXHRcdFx0aWYgKHJlc3VsdCAhPSBaX09LIHx8IChiZFswXSA9PT0gMCAmJiBubCA+IDI1NykpIHtcclxuXHRcdFx0XHRpZiAocmVzdWx0ID09IFpfREFUQV9FUlJPUikge1xyXG5cdFx0XHRcdFx0ei5tc2cgPSBcIm92ZXJzdWJzY3JpYmVkIGRpc3RhbmNlIHRyZWVcIjtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHJlc3VsdCA9PSBaX0JVRl9FUlJPUikge1xyXG5cdFx0XHRcdFx0ei5tc2cgPSBcImluY29tcGxldGUgZGlzdGFuY2UgdHJlZVwiO1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gWl9EQVRBX0VSUk9SO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzdWx0ICE9IFpfTUVNX0VSUk9SKSB7XHJcblx0XHRcdFx0XHR6Lm1zZyA9IFwiZW1wdHkgZGlzdGFuY2UgdHJlZSB3aXRoIGxlbmd0aHNcIjtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IFpfREFUQV9FUlJPUjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdEluZlRyZWUuaW5mbGF0ZV90cmVlc19maXhlZCA9IGZ1bmN0aW9uKGJsLCAvLyBsaXRlcmFsIGRlc2lyZWQvYWN0dWFsIGJpdCBkZXB0aFxyXG5cdGJkLCAvLyBkaXN0YW5jZSBkZXNpcmVkL2FjdHVhbCBiaXQgZGVwdGhcclxuXHR0bCwvLyBsaXRlcmFsL2xlbmd0aCB0cmVlIHJlc3VsdFxyXG5cdHRkLy8gZGlzdGFuY2UgdHJlZSByZXN1bHRcclxuXHQpIHtcclxuXHRcdGJsWzBdID0gZml4ZWRfYmw7XHJcblx0XHRiZFswXSA9IGZpeGVkX2JkO1xyXG5cdFx0dGxbMF0gPSBmaXhlZF90bDtcclxuXHRcdHRkWzBdID0gZml4ZWRfdGQ7XHJcblx0XHRyZXR1cm4gWl9PSztcclxuXHR9O1xyXG5cclxuXHQvLyBJbmZDb2Rlc1xyXG5cclxuXHQvLyB3YWl0aW5nIGZvciBcImk6XCI9aW5wdXQsXHJcblx0Ly8gXCJvOlwiPW91dHB1dCxcclxuXHQvLyBcIng6XCI9bm90aGluZ1xyXG5cdHZhciBTVEFSVCA9IDA7IC8vIHg6IHNldCB1cCBmb3IgTEVOXHJcblx0dmFyIExFTiA9IDE7IC8vIGk6IGdldCBsZW5ndGgvbGl0ZXJhbC9lb2IgbmV4dFxyXG5cdHZhciBMRU5FWFQgPSAyOyAvLyBpOiBnZXR0aW5nIGxlbmd0aCBleHRyYSAoaGF2ZSBiYXNlKVxyXG5cdHZhciBESVNUID0gMzsgLy8gaTogZ2V0IGRpc3RhbmNlIG5leHRcclxuXHR2YXIgRElTVEVYVCA9IDQ7Ly8gaTogZ2V0dGluZyBkaXN0YW5jZSBleHRyYVxyXG5cdHZhciBDT1BZID0gNTsgLy8gbzogY29weWluZyBieXRlcyBpbiB3aW5kb3csIHdhaXRpbmdcclxuXHQvLyBmb3Igc3BhY2VcclxuXHR2YXIgTElUID0gNjsgLy8gbzogZ290IGxpdGVyYWwsIHdhaXRpbmcgZm9yIG91dHB1dFxyXG5cdC8vIHNwYWNlXHJcblx0dmFyIFdBU0ggPSA3OyAvLyBvOiBnb3QgZW9iLCBwb3NzaWJseSBzdGlsbCBvdXRwdXRcclxuXHQvLyB3YWl0aW5nXHJcblx0dmFyIEVORCA9IDg7IC8vIHg6IGdvdCBlb2IgYW5kIGFsbCBkYXRhIGZsdXNoZWRcclxuXHR2YXIgQkFEQ09ERSA9IDk7Ly8geDogZ290IGVycm9yXHJcblxyXG5cdGZ1bmN0aW9uIEluZkNvZGVzKCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdHZhciBtb2RlOyAvLyBjdXJyZW50IGluZmxhdGVfY29kZXMgbW9kZVxyXG5cclxuXHRcdC8vIG1vZGUgZGVwZW5kZW50IGluZm9ybWF0aW9uXHJcblx0XHR2YXIgbGVuID0gMDtcclxuXHJcblx0XHR2YXIgdHJlZTsgLy8gcG9pbnRlciBpbnRvIHRyZWVcclxuXHRcdHZhciB0cmVlX2luZGV4ID0gMDtcclxuXHRcdHZhciBuZWVkID0gMDsgLy8gYml0cyBuZWVkZWRcclxuXHJcblx0XHR2YXIgbGl0ID0gMDtcclxuXHJcblx0XHQvLyBpZiBFWFQgb3IgQ09QWSwgd2hlcmUgYW5kIGhvdyBtdWNoXHJcblx0XHR2YXIgZ2V0ID0gMDsgLy8gYml0cyB0byBnZXQgZm9yIGV4dHJhXHJcblx0XHR2YXIgZGlzdCA9IDA7IC8vIGRpc3RhbmNlIGJhY2sgdG8gY29weSBmcm9tXHJcblxyXG5cdFx0dmFyIGxiaXRzID0gMDsgLy8gbHRyZWUgYml0cyBkZWNvZGVkIHBlciBicmFuY2hcclxuXHRcdHZhciBkYml0cyA9IDA7IC8vIGR0cmVlIGJpdHMgZGVjb2RlciBwZXIgYnJhbmNoXHJcblx0XHR2YXIgbHRyZWU7IC8vIGxpdGVyYWwvbGVuZ3RoL2VvYiB0cmVlXHJcblx0XHR2YXIgbHRyZWVfaW5kZXggPSAwOyAvLyBsaXRlcmFsL2xlbmd0aC9lb2IgdHJlZVxyXG5cdFx0dmFyIGR0cmVlOyAvLyBkaXN0YW5jZSB0cmVlXHJcblx0XHR2YXIgZHRyZWVfaW5kZXggPSAwOyAvLyBkaXN0YW5jZSB0cmVlXHJcblxyXG5cdFx0Ly8gQ2FsbGVkIHdpdGggbnVtYmVyIG9mIGJ5dGVzIGxlZnQgdG8gd3JpdGUgaW4gd2luZG93IGF0IGxlYXN0IDI1OFxyXG5cdFx0Ly8gKHRoZSBtYXhpbXVtIHN0cmluZyBsZW5ndGgpIGFuZCBudW1iZXIgb2YgaW5wdXQgYnl0ZXMgYXZhaWxhYmxlXHJcblx0XHQvLyBhdCBsZWFzdCB0ZW4uIFRoZSB0ZW4gYnl0ZXMgYXJlIHNpeCBieXRlcyBmb3IgdGhlIGxvbmdlc3QgbGVuZ3RoL1xyXG5cdFx0Ly8gZGlzdGFuY2UgcGFpciBwbHVzIGZvdXIgYnl0ZXMgZm9yIG92ZXJsb2FkaW5nIHRoZSBiaXQgYnVmZmVyLlxyXG5cclxuXHRcdGZ1bmN0aW9uIGluZmxhdGVfZmFzdChibCwgYmQsIHRsLCB0bF9pbmRleCwgdGQsIHRkX2luZGV4LCBzLCB6KSB7XHJcblx0XHRcdHZhciB0OyAvLyB0ZW1wb3JhcnkgcG9pbnRlclxyXG5cdFx0XHR2YXIgdHA7IC8vIHRlbXBvcmFyeSBwb2ludGVyXHJcblx0XHRcdHZhciB0cF9pbmRleDsgLy8gdGVtcG9yYXJ5IHBvaW50ZXJcclxuXHRcdFx0dmFyIGU7IC8vIGV4dHJhIGJpdHMgb3Igb3BlcmF0aW9uXHJcblx0XHRcdHZhciBiOyAvLyBiaXQgYnVmZmVyXHJcblx0XHRcdHZhciBrOyAvLyBiaXRzIGluIGJpdCBidWZmZXJcclxuXHRcdFx0dmFyIHA7IC8vIGlucHV0IGRhdGEgcG9pbnRlclxyXG5cdFx0XHR2YXIgbjsgLy8gYnl0ZXMgYXZhaWxhYmxlIHRoZXJlXHJcblx0XHRcdHZhciBxOyAvLyBvdXRwdXQgd2luZG93IHdyaXRlIHBvaW50ZXJcclxuXHRcdFx0dmFyIG07IC8vIGJ5dGVzIHRvIGVuZCBvZiB3aW5kb3cgb3IgcmVhZCBwb2ludGVyXHJcblx0XHRcdHZhciBtbDsgLy8gbWFzayBmb3IgbGl0ZXJhbC9sZW5ndGggdHJlZVxyXG5cdFx0XHR2YXIgbWQ7IC8vIG1hc2sgZm9yIGRpc3RhbmNlIHRyZWVcclxuXHRcdFx0dmFyIGM7IC8vIGJ5dGVzIHRvIGNvcHlcclxuXHRcdFx0dmFyIGQ7IC8vIGRpc3RhbmNlIGJhY2sgdG8gY29weSBmcm9tXHJcblx0XHRcdHZhciByOyAvLyBjb3B5IHNvdXJjZSBwb2ludGVyXHJcblxyXG5cdFx0XHR2YXIgdHBfaW5kZXhfdF8zOyAvLyAodHBfaW5kZXgrdCkqM1xyXG5cclxuXHRcdFx0Ly8gbG9hZCBpbnB1dCwgb3V0cHV0LCBiaXQgdmFsdWVzXHJcblx0XHRcdHAgPSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdG4gPSB6LmF2YWlsX2luO1xyXG5cdFx0XHRiID0gcy5iaXRiO1xyXG5cdFx0XHRrID0gcy5iaXRrO1xyXG5cdFx0XHRxID0gcy53cml0ZTtcclxuXHRcdFx0bSA9IHEgPCBzLnJlYWQgPyBzLnJlYWQgLSBxIC0gMSA6IHMuZW5kIC0gcTtcclxuXHJcblx0XHRcdC8vIGluaXRpYWxpemUgbWFza3NcclxuXHRcdFx0bWwgPSBpbmZsYXRlX21hc2tbYmxdO1xyXG5cdFx0XHRtZCA9IGluZmxhdGVfbWFza1tiZF07XHJcblxyXG5cdFx0XHQvLyBkbyB1bnRpbCBub3QgZW5vdWdoIGlucHV0IG9yIG91dHB1dCBzcGFjZSBmb3IgZmFzdCBsb29wXHJcblx0XHRcdGRvIHsgLy8gYXNzdW1lIGNhbGxlZCB3aXRoIG0gPj0gMjU4ICYmIG4gPj0gMTBcclxuXHRcdFx0XHQvLyBnZXQgbGl0ZXJhbC9sZW5ndGggY29kZVxyXG5cdFx0XHRcdHdoaWxlIChrIDwgKDIwKSkgeyAvLyBtYXggYml0cyBmb3IgbGl0ZXJhbC9sZW5ndGggY29kZVxyXG5cdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0YiB8PSAoei5yZWFkX2J5dGUocCsrKSAmIDB4ZmYpIDw8IGs7XHJcblx0XHRcdFx0XHRrICs9IDg7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0ID0gYiAmIG1sO1xyXG5cdFx0XHRcdHRwID0gdGw7XHJcblx0XHRcdFx0dHBfaW5kZXggPSB0bF9pbmRleDtcclxuXHRcdFx0XHR0cF9pbmRleF90XzMgPSAodHBfaW5kZXggKyB0KSAqIDM7XHJcblx0XHRcdFx0aWYgKChlID0gdHBbdHBfaW5kZXhfdF8zXSkgPT09IDApIHtcclxuXHRcdFx0XHRcdGIgPj49ICh0cFt0cF9pbmRleF90XzMgKyAxXSk7XHJcblx0XHRcdFx0XHRrIC09ICh0cFt0cF9pbmRleF90XzMgKyAxXSk7XHJcblxyXG5cdFx0XHRcdFx0cy53aW5kb3dbcSsrXSA9IC8qIChieXRlKSAqL3RwW3RwX2luZGV4X3RfMyArIDJdO1xyXG5cdFx0XHRcdFx0bS0tO1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRvIHtcclxuXHJcblx0XHRcdFx0XHRiID4+PSAodHBbdHBfaW5kZXhfdF8zICsgMV0pO1xyXG5cdFx0XHRcdFx0ayAtPSAodHBbdHBfaW5kZXhfdF8zICsgMV0pO1xyXG5cclxuXHRcdFx0XHRcdGlmICgoZSAmIDE2KSAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRlICY9IDE1O1xyXG5cdFx0XHRcdFx0XHRjID0gdHBbdHBfaW5kZXhfdF8zICsgMl0gKyAoLyogKGludCkgKi9iICYgaW5mbGF0ZV9tYXNrW2VdKTtcclxuXHJcblx0XHRcdFx0XHRcdGIgPj49IGU7XHJcblx0XHRcdFx0XHRcdGsgLT0gZTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIGRlY29kZSBkaXN0YW5jZSBiYXNlIG9mIGJsb2NrIHRvIGNvcHlcclxuXHRcdFx0XHRcdFx0d2hpbGUgKGsgPCAoMTUpKSB7IC8vIG1heCBiaXRzIGZvciBkaXN0YW5jZSBjb2RlXHJcblx0XHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRcdGIgfD0gKHoucmVhZF9ieXRlKHArKykgJiAweGZmKSA8PCBrO1xyXG5cdFx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0dCA9IGIgJiBtZDtcclxuXHRcdFx0XHRcdFx0dHAgPSB0ZDtcclxuXHRcdFx0XHRcdFx0dHBfaW5kZXggPSB0ZF9pbmRleDtcclxuXHRcdFx0XHRcdFx0dHBfaW5kZXhfdF8zID0gKHRwX2luZGV4ICsgdCkgKiAzO1xyXG5cdFx0XHRcdFx0XHRlID0gdHBbdHBfaW5kZXhfdF8zXTtcclxuXHJcblx0XHRcdFx0XHRcdGRvIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0YiA+Pj0gKHRwW3RwX2luZGV4X3RfMyArIDFdKTtcclxuXHRcdFx0XHRcdFx0XHRrIC09ICh0cFt0cF9pbmRleF90XzMgKyAxXSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICgoZSAmIDE2KSAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGV4dHJhIGJpdHMgdG8gYWRkIHRvIGRpc3RhbmNlIGJhc2VcclxuXHRcdFx0XHRcdFx0XHRcdGUgJj0gMTU7XHJcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoayA8IChlKSkgeyAvLyBnZXQgZXh0cmEgYml0cyAodXAgdG8gMTMpXHJcblx0XHRcdFx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YiB8PSAoei5yZWFkX2J5dGUocCsrKSAmIDB4ZmYpIDw8IGs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRkID0gdHBbdHBfaW5kZXhfdF8zICsgMl0gKyAoYiAmIGluZmxhdGVfbWFza1tlXSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0YiA+Pj0gKGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0ayAtPSAoZSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZG8gdGhlIGNvcHlcclxuXHRcdFx0XHRcdFx0XHRcdG0gLT0gYztcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChxID49IGQpIHsgLy8gb2Zmc2V0IGJlZm9yZSBkZXN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGp1c3QgY29weVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyID0gcSAtIGQ7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChxIC0gciA+IDAgJiYgMiA+IChxIC0gcikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzLndpbmRvd1txKytdID0gcy53aW5kb3dbcisrXTsgLy8gbWluaW11bVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNvdW50IGlzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gdGhyZWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cy53aW5kb3dbcSsrXSA9IHMud2luZG93W3IrK107IC8vIHNvIHVucm9sbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGxvb3AgYVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGxpdHRsZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGMgLT0gMjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzLndpbmRvdy5zZXQocy53aW5kb3cuc3ViYXJyYXkociwgciArIDIpLCBxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRxICs9IDI7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ciArPSAyO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGMgLT0gMjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHsgLy8gZWxzZSBvZmZzZXQgYWZ0ZXIgZGVzdGluYXRpb25cclxuXHRcdFx0XHRcdFx0XHRcdFx0ciA9IHEgLSBkO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkbyB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ciArPSBzLmVuZDsgLy8gZm9yY2UgcG9pbnRlciBpbiB3aW5kb3dcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSB3aGlsZSAociA8IDApOyAvLyBjb3ZlcnMgaW52YWxpZCBkaXN0YW5jZXNcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZSA9IHMuZW5kIC0gcjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGMgPiBlKSB7IC8vIGlmIHNvdXJjZSBjcm9zc2VzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGMgLT0gZTsgLy8gd3JhcHBlZCBjb3B5XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHEgLSByID4gMCAmJiBlID4gKHEgLSByKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZG8ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzLndpbmRvd1txKytdID0gcy53aW5kb3dbcisrXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gd2hpbGUgKC0tZSAhPT0gMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHMud2luZG93LnNldChzLndpbmRvdy5zdWJhcnJheShyLCByICsgZSksIHEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cSArPSBlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ciArPSBlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHIgPSAwOyAvLyBjb3B5IHJlc3QgZnJvbSBzdGFydCBvZiB3aW5kb3dcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjb3B5IGFsbCBvciB3aGF0J3MgbGVmdFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHEgLSByID4gMCAmJiBjID4gKHEgLSByKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkbyB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cy53aW5kb3dbcSsrXSA9IHMud2luZG93W3IrK107XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gd2hpbGUgKC0tYyAhPT0gMCk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRzLndpbmRvdy5zZXQocy53aW5kb3cuc3ViYXJyYXkociwgciArIGMpLCBxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cSArPSBjO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyICs9IGM7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGMgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICgoZSAmIDY0KSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dCArPSB0cFt0cF9pbmRleF90XzMgKyAyXTtcclxuXHRcdFx0XHRcdFx0XHRcdHQgKz0gKGIgJiBpbmZsYXRlX21hc2tbZV0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0dHBfaW5kZXhfdF8zID0gKHRwX2luZGV4ICsgdCkgKiAzO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZSA9IHRwW3RwX2luZGV4X3RfM107XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHoubXNnID0gXCJpbnZhbGlkIGRpc3RhbmNlIGNvZGVcIjtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRjID0gei5hdmFpbF9pbiAtIG47XHJcblx0XHRcdFx0XHRcdFx0XHRjID0gKGsgPj4gMykgPCBjID8gayA+PiAzIDogYztcclxuXHRcdFx0XHRcdFx0XHRcdG4gKz0gYztcclxuXHRcdFx0XHRcdFx0XHRcdHAgLT0gYztcclxuXHRcdFx0XHRcdFx0XHRcdGsgLT0gYyA8PCAzO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFpfREFUQV9FUlJPUjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gd2hpbGUgKHRydWUpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoKGUgJiA2NCkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0dCArPSB0cFt0cF9pbmRleF90XzMgKyAyXTtcclxuXHRcdFx0XHRcdFx0dCArPSAoYiAmIGluZmxhdGVfbWFza1tlXSk7XHJcblx0XHRcdFx0XHRcdHRwX2luZGV4X3RfMyA9ICh0cF9pbmRleCArIHQpICogMztcclxuXHRcdFx0XHRcdFx0aWYgKChlID0gdHBbdHBfaW5kZXhfdF8zXSkgPT09IDApIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0YiA+Pj0gKHRwW3RwX2luZGV4X3RfMyArIDFdKTtcclxuXHRcdFx0XHRcdFx0XHRrIC09ICh0cFt0cF9pbmRleF90XzMgKyAxXSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHMud2luZG93W3ErK10gPSAvKiAoYnl0ZSkgKi90cFt0cF9pbmRleF90XzMgKyAyXTtcclxuXHRcdFx0XHRcdFx0XHRtLS07XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoKGUgJiAzMikgIT09IDApIHtcclxuXHJcblx0XHRcdFx0XHRcdGMgPSB6LmF2YWlsX2luIC0gbjtcclxuXHRcdFx0XHRcdFx0YyA9IChrID4+IDMpIDwgYyA/IGsgPj4gMyA6IGM7XHJcblx0XHRcdFx0XHRcdG4gKz0gYztcclxuXHRcdFx0XHRcdFx0cCAtPSBjO1xyXG5cdFx0XHRcdFx0XHRrIC09IGMgPDwgMztcclxuXHJcblx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VORDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHoubXNnID0gXCJpbnZhbGlkIGxpdGVyYWwvbGVuZ3RoIGNvZGVcIjtcclxuXHJcblx0XHRcdFx0XHRcdGMgPSB6LmF2YWlsX2luIC0gbjtcclxuXHRcdFx0XHRcdFx0YyA9IChrID4+IDMpIDwgYyA/IGsgPj4gMyA6IGM7XHJcblx0XHRcdFx0XHRcdG4gKz0gYztcclxuXHRcdFx0XHRcdFx0cCAtPSBjO1xyXG5cdFx0XHRcdFx0XHRrIC09IGMgPDwgMztcclxuXHJcblx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIFpfREFUQV9FUlJPUjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IHdoaWxlICh0cnVlKTtcclxuXHRcdFx0fSB3aGlsZSAobSA+PSAyNTggJiYgbiA+PSAxMCk7XHJcblxyXG5cdFx0XHQvLyBub3QgZW5vdWdoIGlucHV0IG9yIG91dHB1dC0tcmVzdG9yZSBwb2ludGVycyBhbmQgcmV0dXJuXHJcblx0XHRcdGMgPSB6LmF2YWlsX2luIC0gbjtcclxuXHRcdFx0YyA9IChrID4+IDMpIDwgYyA/IGsgPj4gMyA6IGM7XHJcblx0XHRcdG4gKz0gYztcclxuXHRcdFx0cCAtPSBjO1xyXG5cdFx0XHRrIC09IGMgPDwgMztcclxuXHJcblx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdHMud3JpdGUgPSBxO1xyXG5cclxuXHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhhdC5pbml0ID0gZnVuY3Rpb24oYmwsIGJkLCB0bCwgdGxfaW5kZXgsIHRkLCB0ZF9pbmRleCkge1xyXG5cdFx0XHRtb2RlID0gU1RBUlQ7XHJcblx0XHRcdGxiaXRzID0gLyogKGJ5dGUpICovYmw7XHJcblx0XHRcdGRiaXRzID0gLyogKGJ5dGUpICovYmQ7XHJcblx0XHRcdGx0cmVlID0gdGw7XHJcblx0XHRcdGx0cmVlX2luZGV4ID0gdGxfaW5kZXg7XHJcblx0XHRcdGR0cmVlID0gdGQ7XHJcblx0XHRcdGR0cmVlX2luZGV4ID0gdGRfaW5kZXg7XHJcblx0XHRcdHRyZWUgPSBudWxsO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LnByb2MgPSBmdW5jdGlvbihzLCB6LCByKSB7XHJcblx0XHRcdHZhciBqOyAvLyB0ZW1wb3Jhcnkgc3RvcmFnZVxyXG5cdFx0XHR2YXIgdGluZGV4OyAvLyB0ZW1wb3JhcnkgcG9pbnRlclxyXG5cdFx0XHR2YXIgZTsgLy8gZXh0cmEgYml0cyBvciBvcGVyYXRpb25cclxuXHRcdFx0dmFyIGIgPSAwOyAvLyBiaXQgYnVmZmVyXHJcblx0XHRcdHZhciBrID0gMDsgLy8gYml0cyBpbiBiaXQgYnVmZmVyXHJcblx0XHRcdHZhciBwID0gMDsgLy8gaW5wdXQgZGF0YSBwb2ludGVyXHJcblx0XHRcdHZhciBuOyAvLyBieXRlcyBhdmFpbGFibGUgdGhlcmVcclxuXHRcdFx0dmFyIHE7IC8vIG91dHB1dCB3aW5kb3cgd3JpdGUgcG9pbnRlclxyXG5cdFx0XHR2YXIgbTsgLy8gYnl0ZXMgdG8gZW5kIG9mIHdpbmRvdyBvciByZWFkIHBvaW50ZXJcclxuXHRcdFx0dmFyIGY7IC8vIHBvaW50ZXIgdG8gY29weSBzdHJpbmdzIGZyb21cclxuXHJcblx0XHRcdC8vIGNvcHkgaW5wdXQvb3V0cHV0IGluZm9ybWF0aW9uIHRvIGxvY2FscyAoVVBEQVRFIG1hY3JvIHJlc3RvcmVzKVxyXG5cdFx0XHRwID0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRuID0gei5hdmFpbF9pbjtcclxuXHRcdFx0YiA9IHMuYml0YjtcclxuXHRcdFx0ayA9IHMuYml0aztcclxuXHRcdFx0cSA9IHMud3JpdGU7XHJcblx0XHRcdG0gPSBxIDwgcy5yZWFkID8gcy5yZWFkIC0gcSAtIDEgOiBzLmVuZCAtIHE7XHJcblxyXG5cdFx0XHQvLyBwcm9jZXNzIGlucHV0IGFuZCBvdXRwdXQgYmFzZWQgb24gY3VycmVudCBzdGF0ZVxyXG5cdFx0XHR3aGlsZSAodHJ1ZSkge1xyXG5cdFx0XHRcdHN3aXRjaCAobW9kZSkge1xyXG5cdFx0XHRcdC8vIHdhaXRpbmcgZm9yIFwiaTpcIj1pbnB1dCwgXCJvOlwiPW91dHB1dCwgXCJ4OlwiPW5vdGhpbmdcclxuXHRcdFx0XHRjYXNlIFNUQVJUOiAvLyB4OiBzZXQgdXAgZm9yIExFTlxyXG5cdFx0XHRcdFx0aWYgKG0gPj0gMjU4ICYmIG4gPj0gMTApIHtcclxuXHJcblx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRyID0gaW5mbGF0ZV9mYXN0KGxiaXRzLCBkYml0cywgbHRyZWUsIGx0cmVlX2luZGV4LCBkdHJlZSwgZHRyZWVfaW5kZXgsIHMsIHopO1xyXG5cclxuXHRcdFx0XHRcdFx0cCA9IHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0biA9IHouYXZhaWxfaW47XHJcblx0XHRcdFx0XHRcdGIgPSBzLmJpdGI7XHJcblx0XHRcdFx0XHRcdGsgPSBzLmJpdGs7XHJcblx0XHRcdFx0XHRcdHEgPSBzLndyaXRlO1xyXG5cdFx0XHRcdFx0XHRtID0gcSA8IHMucmVhZCA/IHMucmVhZCAtIHEgLSAxIDogcy5lbmQgLSBxO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHIgIT0gWl9PSykge1xyXG5cdFx0XHRcdFx0XHRcdG1vZGUgPSByID09IFpfU1RSRUFNX0VORCA/IFdBU0ggOiBCQURDT0RFO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZWVkID0gbGJpdHM7XHJcblx0XHRcdFx0XHR0cmVlID0gbHRyZWU7XHJcblx0XHRcdFx0XHR0cmVlX2luZGV4ID0gbHRyZWVfaW5kZXg7XHJcblxyXG5cdFx0XHRcdFx0bW9kZSA9IExFTjtcclxuXHRcdFx0XHRjYXNlIExFTjogLy8gaTogZ2V0IGxlbmd0aC9saXRlcmFsL2VvYiBuZXh0XHJcblx0XHRcdFx0XHRqID0gbmVlZDtcclxuXHJcblx0XHRcdFx0XHR3aGlsZSAoayA8IChqKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAobiAhPT0gMClcclxuXHRcdFx0XHRcdFx0XHRyID0gWl9PSztcclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0YiB8PSAoei5yZWFkX2J5dGUocCsrKSAmIDB4ZmYpIDw8IGs7XHJcblx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR0aW5kZXggPSAodHJlZV9pbmRleCArIChiICYgaW5mbGF0ZV9tYXNrW2pdKSkgKiAzO1xyXG5cclxuXHRcdFx0XHRcdGIgPj4+PSAodHJlZVt0aW5kZXggKyAxXSk7XHJcblx0XHRcdFx0XHRrIC09ICh0cmVlW3RpbmRleCArIDFdKTtcclxuXHJcblx0XHRcdFx0XHRlID0gdHJlZVt0aW5kZXhdO1xyXG5cclxuXHRcdFx0XHRcdGlmIChlID09PSAwKSB7IC8vIGxpdGVyYWxcclxuXHRcdFx0XHRcdFx0bGl0ID0gdHJlZVt0aW5kZXggKyAyXTtcclxuXHRcdFx0XHRcdFx0bW9kZSA9IExJVDtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoKGUgJiAxNikgIT09IDApIHsgLy8gbGVuZ3RoXHJcblx0XHRcdFx0XHRcdGdldCA9IGUgJiAxNTtcclxuXHRcdFx0XHRcdFx0bGVuID0gdHJlZVt0aW5kZXggKyAyXTtcclxuXHRcdFx0XHRcdFx0bW9kZSA9IExFTkVYVDtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoKGUgJiA2NCkgPT09IDApIHsgLy8gbmV4dCB0YWJsZVxyXG5cdFx0XHRcdFx0XHRuZWVkID0gZTtcclxuXHRcdFx0XHRcdFx0dHJlZV9pbmRleCA9IHRpbmRleCAvIDMgKyB0cmVlW3RpbmRleCArIDJdO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICgoZSAmIDMyKSAhPT0gMCkgeyAvLyBlbmQgb2YgYmxvY2tcclxuXHRcdFx0XHRcdFx0bW9kZSA9IFdBU0g7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bW9kZSA9IEJBRENPREU7IC8vIGludmFsaWQgY29kZVxyXG5cdFx0XHRcdFx0ei5tc2cgPSBcImludmFsaWQgbGl0ZXJhbC9sZW5ndGggY29kZVwiO1xyXG5cdFx0XHRcdFx0ciA9IFpfREFUQV9FUlJPUjtcclxuXHJcblx0XHRcdFx0XHRzLmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHJcblx0XHRcdFx0Y2FzZSBMRU5FWFQ6IC8vIGk6IGdldHRpbmcgbGVuZ3RoIGV4dHJhIChoYXZlIGJhc2UpXHJcblx0XHRcdFx0XHRqID0gZ2V0O1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChrIDwgKGopKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuICE9PSAwKVxyXG5cdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0ayArPSA4O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxlbiArPSAoYiAmIGluZmxhdGVfbWFza1tqXSk7XHJcblxyXG5cdFx0XHRcdFx0YiA+Pj0gajtcclxuXHRcdFx0XHRcdGsgLT0gajtcclxuXHJcblx0XHRcdFx0XHRuZWVkID0gZGJpdHM7XHJcblx0XHRcdFx0XHR0cmVlID0gZHRyZWU7XHJcblx0XHRcdFx0XHR0cmVlX2luZGV4ID0gZHRyZWVfaW5kZXg7XHJcblx0XHRcdFx0XHRtb2RlID0gRElTVDtcclxuXHRcdFx0XHRjYXNlIERJU1Q6IC8vIGk6IGdldCBkaXN0YW5jZSBuZXh0XHJcblx0XHRcdFx0XHRqID0gbmVlZDtcclxuXHJcblx0XHRcdFx0XHR3aGlsZSAoayA8IChqKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAobiAhPT0gMClcclxuXHRcdFx0XHRcdFx0XHRyID0gWl9PSztcclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0YiB8PSAoei5yZWFkX2J5dGUocCsrKSAmIDB4ZmYpIDw8IGs7XHJcblx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR0aW5kZXggPSAodHJlZV9pbmRleCArIChiICYgaW5mbGF0ZV9tYXNrW2pdKSkgKiAzO1xyXG5cclxuXHRcdFx0XHRcdGIgPj49IHRyZWVbdGluZGV4ICsgMV07XHJcblx0XHRcdFx0XHRrIC09IHRyZWVbdGluZGV4ICsgMV07XHJcblxyXG5cdFx0XHRcdFx0ZSA9ICh0cmVlW3RpbmRleF0pO1xyXG5cdFx0XHRcdFx0aWYgKChlICYgMTYpICE9PSAwKSB7IC8vIGRpc3RhbmNlXHJcblx0XHRcdFx0XHRcdGdldCA9IGUgJiAxNTtcclxuXHRcdFx0XHRcdFx0ZGlzdCA9IHRyZWVbdGluZGV4ICsgMl07XHJcblx0XHRcdFx0XHRcdG1vZGUgPSBESVNURVhUO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICgoZSAmIDY0KSA9PT0gMCkgeyAvLyBuZXh0IHRhYmxlXHJcblx0XHRcdFx0XHRcdG5lZWQgPSBlO1xyXG5cdFx0XHRcdFx0XHR0cmVlX2luZGV4ID0gdGluZGV4IC8gMyArIHRyZWVbdGluZGV4ICsgMl07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bW9kZSA9IEJBRENPREU7IC8vIGludmFsaWQgY29kZVxyXG5cdFx0XHRcdFx0ei5tc2cgPSBcImludmFsaWQgZGlzdGFuY2UgY29kZVwiO1xyXG5cdFx0XHRcdFx0ciA9IFpfREFUQV9FUlJPUjtcclxuXHJcblx0XHRcdFx0XHRzLmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHJcblx0XHRcdFx0Y2FzZSBESVNURVhUOiAvLyBpOiBnZXR0aW5nIGRpc3RhbmNlIGV4dHJhXHJcblx0XHRcdFx0XHRqID0gZ2V0O1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChrIDwgKGopKSB7XHJcblx0XHRcdFx0XHRcdGlmIChuICE9PSAwKVxyXG5cdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bi0tO1xyXG5cdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0ayArPSA4O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGRpc3QgKz0gKGIgJiBpbmZsYXRlX21hc2tbal0pO1xyXG5cclxuXHRcdFx0XHRcdGIgPj49IGo7XHJcblx0XHRcdFx0XHRrIC09IGo7XHJcblxyXG5cdFx0XHRcdFx0bW9kZSA9IENPUFk7XHJcblx0XHRcdFx0Y2FzZSBDT1BZOiAvLyBvOiBjb3B5aW5nIGJ5dGVzIGluIHdpbmRvdywgd2FpdGluZyBmb3Igc3BhY2VcclxuXHRcdFx0XHRcdGYgPSBxIC0gZGlzdDtcclxuXHRcdFx0XHRcdHdoaWxlIChmIDwgMCkgeyAvLyBtb2R1bG8gd2luZG93IHNpemUtXCJ3aGlsZVwiIGluc3RlYWRcclxuXHRcdFx0XHRcdFx0ZiArPSBzLmVuZDsgLy8gb2YgXCJpZlwiIGhhbmRsZXMgaW52YWxpZCBkaXN0YW5jZXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHdoaWxlIChsZW4gIT09IDApIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChtID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHEgPT0gcy5lbmQgJiYgcy5yZWFkICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRxID0gMDtcclxuXHRcdFx0XHRcdFx0XHRcdG0gPSBxIDwgcy5yZWFkID8gcy5yZWFkIC0gcSAtIDEgOiBzLmVuZCAtIHE7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmIChtID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdFx0XHRxID0gcy53cml0ZTtcclxuXHRcdFx0XHRcdFx0XHRcdG0gPSBxIDwgcy5yZWFkID8gcy5yZWFkIC0gcSAtIDEgOiBzLmVuZCAtIHE7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHEgPT0gcy5lbmQgJiYgcy5yZWFkICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHEgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtID0gcSA8IHMucmVhZCA/IHMucmVhZCAtIHEgLSAxIDogcy5lbmQgLSBxO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmIChtID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0cy53aW5kb3dbcSsrXSA9IHMud2luZG93W2YrK107XHJcblx0XHRcdFx0XHRcdG0tLTtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChmID09IHMuZW5kKVxyXG5cdFx0XHRcdFx0XHRcdGYgPSAwO1xyXG5cdFx0XHRcdFx0XHRsZW4tLTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG1vZGUgPSBTVEFSVDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgTElUOiAvLyBvOiBnb3QgbGl0ZXJhbCwgd2FpdGluZyBmb3Igb3V0cHV0IHNwYWNlXHJcblx0XHRcdFx0XHRpZiAobSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRpZiAocSA9PSBzLmVuZCAmJiBzLnJlYWQgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRxID0gMDtcclxuXHRcdFx0XHRcdFx0XHRtID0gcSA8IHMucmVhZCA/IHMucmVhZCAtIHEgLSAxIDogcy5lbmQgLSBxO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChtID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0ciA9IHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0XHRxID0gcy53cml0ZTtcclxuXHRcdFx0XHRcdFx0XHRtID0gcSA8IHMucmVhZCA/IHMucmVhZCAtIHEgLSAxIDogcy5lbmQgLSBxO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAocSA9PSBzLmVuZCAmJiBzLnJlYWQgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHEgPSAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0bSA9IHEgPCBzLnJlYWQgPyBzLnJlYWQgLSBxIC0gMSA6IHMuZW5kIC0gcTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKG0gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHMuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ciA9IFpfT0s7XHJcblxyXG5cdFx0XHRcdFx0cy53aW5kb3dbcSsrXSA9IC8qIChieXRlKSAqL2xpdDtcclxuXHRcdFx0XHRcdG0tLTtcclxuXHJcblx0XHRcdFx0XHRtb2RlID0gU1RBUlQ7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFdBU0g6IC8vIG86IGdvdCBlb2IsIHBvc3NpYmx5IG1vcmUgb3V0cHV0XHJcblx0XHRcdFx0XHRpZiAoayA+IDcpIHsgLy8gcmV0dXJuIHVudXNlZCBieXRlLCBpZiBhbnlcclxuXHRcdFx0XHRcdFx0ayAtPSA4O1xyXG5cdFx0XHRcdFx0XHRuKys7XHJcblx0XHRcdFx0XHRcdHAtLTsgLy8gY2FuIGFsd2F5cyByZXR1cm4gb25lXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0cy53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRyID0gcy5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0cSA9IHMud3JpdGU7XHJcblx0XHRcdFx0XHRtID0gcSA8IHMucmVhZCA/IHMucmVhZCAtIHEgLSAxIDogcy5lbmQgLSBxO1xyXG5cclxuXHRcdFx0XHRcdGlmIChzLnJlYWQgIT0gcy53cml0ZSkge1xyXG5cdFx0XHRcdFx0XHRzLmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHRzLmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG1vZGUgPSBFTkQ7XHJcblx0XHRcdFx0Y2FzZSBFTkQ6XHJcblx0XHRcdFx0XHRyID0gWl9TVFJFQU1fRU5EO1xyXG5cdFx0XHRcdFx0cy5iaXRiID0gYjtcclxuXHRcdFx0XHRcdHMuYml0ayA9IGs7XHJcblx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRzLndyaXRlID0gcTtcclxuXHRcdFx0XHRcdHJldHVybiBzLmluZmxhdGVfZmx1c2goeiwgcik7XHJcblxyXG5cdFx0XHRcdGNhc2UgQkFEQ09ERTogLy8geDogZ290IGVycm9yXHJcblxyXG5cdFx0XHRcdFx0ciA9IFpfREFUQV9FUlJPUjtcclxuXHJcblx0XHRcdFx0XHRzLmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHIgPSBaX1NUUkVBTV9FUlJPUjtcclxuXHJcblx0XHRcdFx0XHRzLmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0cy5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHMud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHMuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5mcmVlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIFpGUkVFKHosIGMpO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBJbmZCbG9ja3NcclxuXHJcblx0Ly8gVGFibGUgZm9yIGRlZmxhdGUgZnJvbSBQS1pJUCdzIGFwcG5vdGUudHh0LlxyXG5cdHZhciBib3JkZXIgPSBbIC8vIE9yZGVyIG9mIHRoZSBiaXQgbGVuZ3RoIGNvZGUgbGVuZ3Roc1xyXG5cdDE2LCAxNywgMTgsIDAsIDgsIDcsIDksIDYsIDEwLCA1LCAxMSwgNCwgMTIsIDMsIDEzLCAyLCAxNCwgMSwgMTUgXTtcclxuXHJcblx0dmFyIFRZUEUgPSAwOyAvLyBnZXQgdHlwZSBiaXRzICgzLCBpbmNsdWRpbmcgZW5kIGJpdClcclxuXHR2YXIgTEVOUyA9IDE7IC8vIGdldCBsZW5ndGhzIGZvciBzdG9yZWRcclxuXHR2YXIgU1RPUkVEID0gMjsvLyBwcm9jZXNzaW5nIHN0b3JlZCBibG9ja1xyXG5cdHZhciBUQUJMRSA9IDM7IC8vIGdldCB0YWJsZSBsZW5ndGhzXHJcblx0dmFyIEJUUkVFID0gNDsgLy8gZ2V0IGJpdCBsZW5ndGhzIHRyZWUgZm9yIGEgZHluYW1pY1xyXG5cdC8vIGJsb2NrXHJcblx0dmFyIERUUkVFID0gNTsgLy8gZ2V0IGxlbmd0aCwgZGlzdGFuY2UgdHJlZXMgZm9yIGFcclxuXHQvLyBkeW5hbWljIGJsb2NrXHJcblx0dmFyIENPREVTID0gNjsgLy8gcHJvY2Vzc2luZyBmaXhlZCBvciBkeW5hbWljIGJsb2NrXHJcblx0dmFyIERSWSA9IDc7IC8vIG91dHB1dCByZW1haW5pbmcgd2luZG93IGJ5dGVzXHJcblx0dmFyIERPTkVMT0NLUyA9IDg7IC8vIGZpbmlzaGVkIGxhc3QgYmxvY2ssIGRvbmVcclxuXHR2YXIgQkFEQkxPQ0tTID0gOTsgLy8gb3QgYSBkYXRhIGVycm9yLS1zdHVjayBoZXJlXHJcblxyXG5cdGZ1bmN0aW9uIEluZkJsb2Nrcyh6LCB3KSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIG1vZGUgPSBUWVBFOyAvLyBjdXJyZW50IGluZmxhdGVfYmxvY2sgbW9kZVxyXG5cclxuXHRcdHZhciBsZWZ0ID0gMDsgLy8gaWYgU1RPUkVELCBieXRlcyBsZWZ0IHRvIGNvcHlcclxuXHJcblx0XHR2YXIgdGFibGUgPSAwOyAvLyB0YWJsZSBsZW5ndGhzICgxNCBiaXRzKVxyXG5cdFx0dmFyIGluZGV4ID0gMDsgLy8gaW5kZXggaW50byBibGVucyAob3IgYm9yZGVyKVxyXG5cdFx0dmFyIGJsZW5zOyAvLyBiaXQgbGVuZ3RocyBvZiBjb2Rlc1xyXG5cdFx0dmFyIGJiID0gWyAwIF07IC8vIGJpdCBsZW5ndGggdHJlZSBkZXB0aFxyXG5cdFx0dmFyIHRiID0gWyAwIF07IC8vIGJpdCBsZW5ndGggZGVjb2RpbmcgdHJlZVxyXG5cclxuXHRcdHZhciBjb2RlcyA9IG5ldyBJbmZDb2RlcygpOyAvLyBpZiBDT0RFUywgY3VycmVudCBzdGF0ZVxyXG5cclxuXHRcdHZhciBsYXN0ID0gMDsgLy8gdHJ1ZSBpZiB0aGlzIGJsb2NrIGlzIHRoZSBsYXN0IGJsb2NrXHJcblxyXG5cdFx0dmFyIGh1ZnRzID0gbmV3IEludDMyQXJyYXkoTUFOWSAqIDMpOyAvLyBzaW5nbGUgbWFsbG9jIGZvciB0cmVlIHNwYWNlXHJcblx0XHR2YXIgY2hlY2sgPSAwOyAvLyBjaGVjayBvbiBvdXRwdXRcclxuXHRcdHZhciBpbmZ0cmVlID0gbmV3IEluZlRyZWUoKTtcclxuXHJcblx0XHR0aGF0LmJpdGsgPSAwOyAvLyBiaXRzIGluIGJpdCBidWZmZXJcclxuXHRcdHRoYXQuYml0YiA9IDA7IC8vIGJpdCBidWZmZXJcclxuXHRcdHRoYXQud2luZG93ID0gbmV3IFVpbnQ4QXJyYXkodyk7IC8vIHNsaWRpbmcgd2luZG93XHJcblx0XHR0aGF0LmVuZCA9IHc7IC8vIG9uZSBieXRlIGFmdGVyIHNsaWRpbmcgd2luZG93XHJcblx0XHR0aGF0LnJlYWQgPSAwOyAvLyB3aW5kb3cgcmVhZCBwb2ludGVyXHJcblx0XHR0aGF0LndyaXRlID0gMDsgLy8gd2luZG93IHdyaXRlIHBvaW50ZXJcclxuXHJcblx0XHR0aGF0LnJlc2V0ID0gZnVuY3Rpb24oeiwgYykge1xyXG5cdFx0XHRpZiAoYylcclxuXHRcdFx0XHRjWzBdID0gY2hlY2s7XHJcblx0XHRcdC8vIGlmIChtb2RlID09IEJUUkVFIHx8IG1vZGUgPT0gRFRSRUUpIHtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHRpZiAobW9kZSA9PSBDT0RFUykge1xyXG5cdFx0XHRcdGNvZGVzLmZyZWUoeik7XHJcblx0XHRcdH1cclxuXHRcdFx0bW9kZSA9IFRZUEU7XHJcblx0XHRcdHRoYXQuYml0ayA9IDA7XHJcblx0XHRcdHRoYXQuYml0YiA9IDA7XHJcblx0XHRcdHRoYXQucmVhZCA9IHRoYXQud3JpdGUgPSAwO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LnJlc2V0KHosIG51bGwpO1xyXG5cclxuXHRcdC8vIGNvcHkgYXMgbXVjaCBhcyBwb3NzaWJsZSBmcm9tIHRoZSBzbGlkaW5nIHdpbmRvdyB0byB0aGUgb3V0cHV0IGFyZWFcclxuXHRcdHRoYXQuaW5mbGF0ZV9mbHVzaCA9IGZ1bmN0aW9uKHosIHIpIHtcclxuXHRcdFx0dmFyIG47XHJcblx0XHRcdHZhciBwO1xyXG5cdFx0XHR2YXIgcTtcclxuXHJcblx0XHRcdC8vIGxvY2FsIGNvcGllcyBvZiBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIHBvaW50ZXJzXHJcblx0XHRcdHAgPSB6Lm5leHRfb3V0X2luZGV4O1xyXG5cdFx0XHRxID0gdGhhdC5yZWFkO1xyXG5cclxuXHRcdFx0Ly8gY29tcHV0ZSBudW1iZXIgb2YgYnl0ZXMgdG8gY29weSBhcyBmYXIgYXMgZW5kIG9mIHdpbmRvd1xyXG5cdFx0XHRuID0gLyogKGludCkgKi8oKHEgPD0gdGhhdC53cml0ZSA/IHRoYXQud3JpdGUgOiB0aGF0LmVuZCkgLSBxKTtcclxuXHRcdFx0aWYgKG4gPiB6LmF2YWlsX291dClcclxuXHRcdFx0XHRuID0gei5hdmFpbF9vdXQ7XHJcblx0XHRcdGlmIChuICE9PSAwICYmIHIgPT0gWl9CVUZfRVJST1IpXHJcblx0XHRcdFx0ciA9IFpfT0s7XHJcblxyXG5cdFx0XHQvLyB1cGRhdGUgY291bnRlcnNcclxuXHRcdFx0ei5hdmFpbF9vdXQgLT0gbjtcclxuXHRcdFx0ei50b3RhbF9vdXQgKz0gbjtcclxuXHJcblx0XHRcdC8vIGNvcHkgYXMgZmFyIGFzIGVuZCBvZiB3aW5kb3dcclxuXHRcdFx0ei5uZXh0X291dC5zZXQodGhhdC53aW5kb3cuc3ViYXJyYXkocSwgcSArIG4pLCBwKTtcclxuXHRcdFx0cCArPSBuO1xyXG5cdFx0XHRxICs9IG47XHJcblxyXG5cdFx0XHQvLyBzZWUgaWYgbW9yZSB0byBjb3B5IGF0IGJlZ2lubmluZyBvZiB3aW5kb3dcclxuXHRcdFx0aWYgKHEgPT0gdGhhdC5lbmQpIHtcclxuXHRcdFx0XHQvLyB3cmFwIHBvaW50ZXJzXHJcblx0XHRcdFx0cSA9IDA7XHJcblx0XHRcdFx0aWYgKHRoYXQud3JpdGUgPT0gdGhhdC5lbmQpXHJcblx0XHRcdFx0XHR0aGF0LndyaXRlID0gMDtcclxuXHJcblx0XHRcdFx0Ly8gY29tcHV0ZSBieXRlcyB0byBjb3B5XHJcblx0XHRcdFx0biA9IHRoYXQud3JpdGUgLSBxO1xyXG5cdFx0XHRcdGlmIChuID4gei5hdmFpbF9vdXQpXHJcblx0XHRcdFx0XHRuID0gei5hdmFpbF9vdXQ7XHJcblx0XHRcdFx0aWYgKG4gIT09IDAgJiYgciA9PSBaX0JVRl9FUlJPUilcclxuXHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cclxuXHRcdFx0XHQvLyB1cGRhdGUgY291bnRlcnNcclxuXHRcdFx0XHR6LmF2YWlsX291dCAtPSBuO1xyXG5cdFx0XHRcdHoudG90YWxfb3V0ICs9IG47XHJcblxyXG5cdFx0XHRcdC8vIGNvcHlcclxuXHRcdFx0XHR6Lm5leHRfb3V0LnNldCh0aGF0LndpbmRvdy5zdWJhcnJheShxLCBxICsgbiksIHApO1xyXG5cdFx0XHRcdHAgKz0gbjtcclxuXHRcdFx0XHRxICs9IG47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIHVwZGF0ZSBwb2ludGVyc1xyXG5cdFx0XHR6Lm5leHRfb3V0X2luZGV4ID0gcDtcclxuXHRcdFx0dGhhdC5yZWFkID0gcTtcclxuXHJcblx0XHRcdC8vIGRvbmVcclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQucHJvYyA9IGZ1bmN0aW9uKHosIHIpIHtcclxuXHRcdFx0dmFyIHQ7IC8vIHRlbXBvcmFyeSBzdG9yYWdlXHJcblx0XHRcdHZhciBiOyAvLyBiaXQgYnVmZmVyXHJcblx0XHRcdHZhciBrOyAvLyBiaXRzIGluIGJpdCBidWZmZXJcclxuXHRcdFx0dmFyIHA7IC8vIGlucHV0IGRhdGEgcG9pbnRlclxyXG5cdFx0XHR2YXIgbjsgLy8gYnl0ZXMgYXZhaWxhYmxlIHRoZXJlXHJcblx0XHRcdHZhciBxOyAvLyBvdXRwdXQgd2luZG93IHdyaXRlIHBvaW50ZXJcclxuXHRcdFx0dmFyIG07IC8vIGJ5dGVzIHRvIGVuZCBvZiB3aW5kb3cgb3IgcmVhZCBwb2ludGVyXHJcblxyXG5cdFx0XHR2YXIgaTtcclxuXHJcblx0XHRcdC8vIGNvcHkgaW5wdXQvb3V0cHV0IGluZm9ybWF0aW9uIHRvIGxvY2FscyAoVVBEQVRFIG1hY3JvIHJlc3RvcmVzKVxyXG5cdFx0XHQvLyB7XHJcblx0XHRcdHAgPSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdG4gPSB6LmF2YWlsX2luO1xyXG5cdFx0XHRiID0gdGhhdC5iaXRiO1xyXG5cdFx0XHRrID0gdGhhdC5iaXRrO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIHtcclxuXHRcdFx0cSA9IHRoYXQud3JpdGU7XHJcblx0XHRcdG0gPSAvKiAoaW50KSAqLyhxIDwgdGhhdC5yZWFkID8gdGhhdC5yZWFkIC0gcSAtIDEgOiB0aGF0LmVuZCAtIHEpO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHQvLyBwcm9jZXNzIGlucHV0IGJhc2VkIG9uIGN1cnJlbnQgc3RhdGVcclxuXHRcdFx0Ly8gREVCVUcgZHRyZWVcclxuXHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKG1vZGUpIHtcclxuXHRcdFx0XHRjYXNlIFRZUEU6XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKGsgPCAoMykpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG4gIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRyID0gWl9PSztcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRuLS07XHJcblx0XHRcdFx0XHRcdGIgfD0gKHoucmVhZF9ieXRlKHArKykgJiAweGZmKSA8PCBrO1xyXG5cdFx0XHRcdFx0XHRrICs9IDg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ID0gLyogKGludCkgKi8oYiAmIDcpO1xyXG5cdFx0XHRcdFx0bGFzdCA9IHQgJiAxO1xyXG5cclxuXHRcdFx0XHRcdHN3aXRjaCAodCA+Pj4gMSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAwOiAvLyBzdG9yZWRcclxuXHRcdFx0XHRcdFx0Ly8ge1xyXG5cdFx0XHRcdFx0XHRiID4+Pj0gKDMpO1xyXG5cdFx0XHRcdFx0XHRrIC09ICgzKTtcclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHR0ID0gayAmIDc7IC8vIGdvIHRvIGJ5dGUgYm91bmRhcnlcclxuXHJcblx0XHRcdFx0XHRcdC8vIHtcclxuXHRcdFx0XHRcdFx0YiA+Pj49ICh0KTtcclxuXHRcdFx0XHRcdFx0ayAtPSAodCk7XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0bW9kZSA9IExFTlM7IC8vIGdldCBsZW5ndGggb2Ygc3RvcmVkIGJsb2NrXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAxOiAvLyBmaXhlZFxyXG5cdFx0XHRcdFx0XHQvLyB7XHJcblx0XHRcdFx0XHRcdHZhciBibCA9IFtdOyAvLyBuZXcgQXJyYXkoMSk7XHJcblx0XHRcdFx0XHRcdHZhciBiZCA9IFtdOyAvLyBuZXcgQXJyYXkoMSk7XHJcblx0XHRcdFx0XHRcdHZhciB0bCA9IFsgW10gXTsgLy8gbmV3IEFycmF5KDEpO1xyXG5cdFx0XHRcdFx0XHR2YXIgdGQgPSBbIFtdIF07IC8vIG5ldyBBcnJheSgxKTtcclxuXHJcblx0XHRcdFx0XHRcdEluZlRyZWUuaW5mbGF0ZV90cmVlc19maXhlZChibCwgYmQsIHRsLCB0ZCk7XHJcblx0XHRcdFx0XHRcdGNvZGVzLmluaXQoYmxbMF0sIGJkWzBdLCB0bFswXSwgMCwgdGRbMF0sIDApO1xyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyB7XHJcblx0XHRcdFx0XHRcdGIgPj4+PSAoMyk7XHJcblx0XHRcdFx0XHRcdGsgLT0gKDMpO1xyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRtb2RlID0gQ09ERVM7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAyOiAvLyBkeW5hbWljXHJcblxyXG5cdFx0XHRcdFx0XHQvLyB7XHJcblx0XHRcdFx0XHRcdGIgPj4+PSAoMyk7XHJcblx0XHRcdFx0XHRcdGsgLT0gKDMpO1xyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRtb2RlID0gVEFCTEU7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzOiAvLyBpbGxlZ2FsXHJcblxyXG5cdFx0XHRcdFx0XHQvLyB7XHJcblx0XHRcdFx0XHRcdGIgPj4+PSAoMyk7XHJcblx0XHRcdFx0XHRcdGsgLT0gKDMpO1xyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdG1vZGUgPSBCQURCTE9DS1M7XHJcblx0XHRcdFx0XHRcdHoubXNnID0gXCJpbnZhbGlkIGJsb2NrIHR5cGVcIjtcclxuXHRcdFx0XHRcdFx0ciA9IFpfREFUQV9FUlJPUjtcclxuXHJcblx0XHRcdFx0XHRcdHRoYXQuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBMRU5TOlxyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChrIDwgKDMyKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAobiAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0YiB8PSAoei5yZWFkX2J5dGUocCsrKSAmIDB4ZmYpIDw8IGs7XHJcblx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoKCgofmIpID4+PiAxNikgJiAweGZmZmYpICE9IChiICYgMHhmZmZmKSkge1xyXG5cdFx0XHRcdFx0XHRtb2RlID0gQkFEQkxPQ0tTO1xyXG5cdFx0XHRcdFx0XHR6Lm1zZyA9IFwiaW52YWxpZCBzdG9yZWQgYmxvY2sgbGVuZ3Roc1wiO1xyXG5cdFx0XHRcdFx0XHRyID0gWl9EQVRBX0VSUk9SO1xyXG5cclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZWZ0ID0gKGIgJiAweGZmZmYpO1xyXG5cdFx0XHRcdFx0YiA9IGsgPSAwOyAvLyBkdW1wIGJpdHNcclxuXHRcdFx0XHRcdG1vZGUgPSBsZWZ0ICE9PSAwID8gU1RPUkVEIDogKGxhc3QgIT09IDAgPyBEUlkgOiBUWVBFKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU1RPUkVEOlxyXG5cdFx0XHRcdFx0aWYgKG4gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKG0gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0aWYgKHEgPT0gdGhhdC5lbmQgJiYgdGhhdC5yZWFkICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0cSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0bSA9IC8qIChpbnQpICovKHEgPCB0aGF0LnJlYWQgPyB0aGF0LnJlYWQgLSBxIC0gMSA6IHRoYXQuZW5kIC0gcSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKG0gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRyID0gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHRcdHEgPSB0aGF0LndyaXRlO1xyXG5cdFx0XHRcdFx0XHRcdG0gPSAvKiAoaW50KSAqLyhxIDwgdGhhdC5yZWFkID8gdGhhdC5yZWFkIC0gcSAtIDEgOiB0aGF0LmVuZCAtIHEpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChxID09IHRoYXQuZW5kICYmIHRoYXQucmVhZCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cSA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRtID0gLyogKGludCkgKi8ocSA8IHRoYXQucmVhZCA/IHRoYXQucmVhZCAtIHEgLSAxIDogdGhhdC5lbmQgLSBxKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYgKG0gPT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGF0LmJpdGsgPSBrO1xyXG5cdFx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0XHR6Lm5leHRfaW5faW5kZXggPSBwO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ciA9IFpfT0s7XHJcblxyXG5cdFx0XHRcdFx0dCA9IGxlZnQ7XHJcblx0XHRcdFx0XHRpZiAodCA+IG4pXHJcblx0XHRcdFx0XHRcdHQgPSBuO1xyXG5cdFx0XHRcdFx0aWYgKHQgPiBtKVxyXG5cdFx0XHRcdFx0XHR0ID0gbTtcclxuXHRcdFx0XHRcdHRoYXQud2luZG93LnNldCh6LnJlYWRfYnVmKHAsIHQpLCBxKTtcclxuXHRcdFx0XHRcdHAgKz0gdDtcclxuXHRcdFx0XHRcdG4gLT0gdDtcclxuXHRcdFx0XHRcdHEgKz0gdDtcclxuXHRcdFx0XHRcdG0gLT0gdDtcclxuXHRcdFx0XHRcdGlmICgobGVmdCAtPSB0KSAhPT0gMClcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRtb2RlID0gbGFzdCAhPT0gMCA/IERSWSA6IFRZUEU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFRBQkxFOlxyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChrIDwgKDE0KSkge1xyXG5cdFx0XHRcdFx0XHRpZiAobiAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRuLS07XHJcblx0XHRcdFx0XHRcdGIgfD0gKHoucmVhZF9ieXRlKHArKykgJiAweGZmKSA8PCBrO1xyXG5cdFx0XHRcdFx0XHRrICs9IDg7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGFibGUgPSB0ID0gKGIgJiAweDNmZmYpO1xyXG5cdFx0XHRcdFx0aWYgKCh0ICYgMHgxZikgPiAyOSB8fCAoKHQgPj4gNSkgJiAweDFmKSA+IDI5KSB7XHJcblx0XHRcdFx0XHRcdG1vZGUgPSBCQURCTE9DS1M7XHJcblx0XHRcdFx0XHRcdHoubXNnID0gXCJ0b28gbWFueSBsZW5ndGggb3IgZGlzdGFuY2Ugc3ltYm9sc1wiO1xyXG5cdFx0XHRcdFx0XHRyID0gWl9EQVRBX0VSUk9SO1xyXG5cclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ID0gMjU4ICsgKHQgJiAweDFmKSArICgodCA+PiA1KSAmIDB4MWYpO1xyXG5cdFx0XHRcdFx0aWYgKCFibGVucyB8fCBibGVucy5sZW5ndGggPCB0KSB7XHJcblx0XHRcdFx0XHRcdGJsZW5zID0gW107IC8vIG5ldyBBcnJheSh0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCB0OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRibGVuc1tpXSA9IDA7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyB7XHJcblx0XHRcdFx0XHRiID4+Pj0gKDE0KTtcclxuXHRcdFx0XHRcdGsgLT0gKDE0KTtcclxuXHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRpbmRleCA9IDA7XHJcblx0XHRcdFx0XHRtb2RlID0gQlRSRUU7XHJcblx0XHRcdFx0Y2FzZSBCVFJFRTpcclxuXHRcdFx0XHRcdHdoaWxlIChpbmRleCA8IDQgKyAodGFibGUgPj4+IDEwKSkge1xyXG5cdFx0XHRcdFx0XHR3aGlsZSAoayA8ICgzKSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChuICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyID0gWl9PSztcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0XHRrICs9IDg7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGJsZW5zW2JvcmRlcltpbmRleCsrXV0gPSBiICYgNztcclxuXHJcblx0XHRcdFx0XHRcdC8vIHtcclxuXHRcdFx0XHRcdFx0YiA+Pj49ICgzKTtcclxuXHRcdFx0XHRcdFx0ayAtPSAoMyk7XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR3aGlsZSAoaW5kZXggPCAxOSkge1xyXG5cdFx0XHRcdFx0XHRibGVuc1tib3JkZXJbaW5kZXgrK11dID0gMDtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRiYlswXSA9IDc7XHJcblx0XHRcdFx0XHR0ID0gaW5mdHJlZS5pbmZsYXRlX3RyZWVzX2JpdHMoYmxlbnMsIGJiLCB0YiwgaHVmdHMsIHopO1xyXG5cdFx0XHRcdFx0aWYgKHQgIT0gWl9PSykge1xyXG5cdFx0XHRcdFx0XHRyID0gdDtcclxuXHRcdFx0XHRcdFx0aWYgKHIgPT0gWl9EQVRBX0VSUk9SKSB7XHJcblx0XHRcdFx0XHRcdFx0YmxlbnMgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdG1vZGUgPSBCQURCTE9DS1M7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHRoYXQuYml0YiA9IGI7XHJcblx0XHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHR6LnRvdGFsX2luICs9IHAgLSB6Lm5leHRfaW5faW5kZXg7XHJcblx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhhdC5pbmZsYXRlX2ZsdXNoKHosIHIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGluZGV4ID0gMDtcclxuXHRcdFx0XHRcdG1vZGUgPSBEVFJFRTtcclxuXHRcdFx0XHRjYXNlIERUUkVFOlxyXG5cdFx0XHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHRcdFx0dCA9IHRhYmxlO1xyXG5cdFx0XHRcdFx0XHRpZiAoIShpbmRleCA8IDI1OCArICh0ICYgMHgxZikgKyAoKHQgPj4gNSkgJiAweDFmKSkpIHtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0dmFyIGosIGM7XHJcblxyXG5cdFx0XHRcdFx0XHR0ID0gYmJbMF07XHJcblxyXG5cdFx0XHRcdFx0XHR3aGlsZSAoayA8ICh0KSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChuICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyID0gWl9PSztcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0XHRrICs9IDg7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIGlmICh0YlswXSA9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHQvLyBTeXN0ZW0uZXJyLnByaW50bG4oXCJudWxsLi4uXCIpO1xyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHR0ID0gaHVmdHNbKHRiWzBdICsgKGIgJiBpbmZsYXRlX21hc2tbdF0pKSAqIDMgKyAxXTtcclxuXHRcdFx0XHRcdFx0YyA9IGh1ZnRzWyh0YlswXSArIChiICYgaW5mbGF0ZV9tYXNrW3RdKSkgKiAzICsgMl07XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoYyA8IDE2KSB7XHJcblx0XHRcdFx0XHRcdFx0YiA+Pj49ICh0KTtcclxuXHRcdFx0XHRcdFx0XHRrIC09ICh0KTtcclxuXHRcdFx0XHRcdFx0XHRibGVuc1tpbmRleCsrXSA9IGM7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7IC8vIGMgPT0gMTYuLjE4XHJcblx0XHRcdFx0XHRcdFx0aSA9IGMgPT0gMTggPyA3IDogYyAtIDE0O1xyXG5cdFx0XHRcdFx0XHRcdGogPSBjID09IDE4ID8gMTEgOiAzO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR3aGlsZSAoayA8ICh0ICsgaSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChuICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRuLS07XHJcblx0XHRcdFx0XHRcdFx0XHRiIHw9ICh6LnJlYWRfYnl0ZShwKyspICYgMHhmZikgPDwgaztcclxuXHRcdFx0XHRcdFx0XHRcdGsgKz0gODtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGIgPj4+PSAodCk7XHJcblx0XHRcdFx0XHRcdFx0ayAtPSAodCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGogKz0gKGIgJiBpbmZsYXRlX21hc2tbaV0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRiID4+Pj0gKGkpO1xyXG5cdFx0XHRcdFx0XHRcdGsgLT0gKGkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpID0gaW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0dCA9IHRhYmxlO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChpICsgaiA+IDI1OCArICh0ICYgMHgxZikgKyAoKHQgPj4gNSkgJiAweDFmKSB8fCAoYyA9PSAxNiAmJiBpIDwgMSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGJsZW5zID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdG1vZGUgPSBCQURCTE9DS1M7XHJcblx0XHRcdFx0XHRcdFx0XHR6Lm1zZyA9IFwiaW52YWxpZCBiaXQgbGVuZ3RoIHJlcGVhdFwiO1xyXG5cdFx0XHRcdFx0XHRcdFx0ciA9IFpfREFUQV9FUlJPUjtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGMgPSBjID09IDE2ID8gYmxlbnNbaSAtIDFdIDogMDtcclxuXHRcdFx0XHRcdFx0XHRkbyB7XHJcblx0XHRcdFx0XHRcdFx0XHRibGVuc1tpKytdID0gYztcclxuXHRcdFx0XHRcdFx0XHR9IHdoaWxlICgtLWogIT09IDApO1xyXG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRiWzBdID0gLTE7XHJcblx0XHRcdFx0XHQvLyB7XHJcblx0XHRcdFx0XHR2YXIgYmxfID0gW107IC8vIG5ldyBBcnJheSgxKTtcclxuXHRcdFx0XHRcdHZhciBiZF8gPSBbXTsgLy8gbmV3IEFycmF5KDEpO1xyXG5cdFx0XHRcdFx0dmFyIHRsXyA9IFtdOyAvLyBuZXcgQXJyYXkoMSk7XHJcblx0XHRcdFx0XHR2YXIgdGRfID0gW107IC8vIG5ldyBBcnJheSgxKTtcclxuXHRcdFx0XHRcdGJsX1swXSA9IDk7IC8vIG11c3QgYmUgPD0gOSBmb3IgbG9va2FoZWFkIGFzc3VtcHRpb25zXHJcblx0XHRcdFx0XHRiZF9bMF0gPSA2OyAvLyBtdXN0IGJlIDw9IDkgZm9yIGxvb2thaGVhZCBhc3N1bXB0aW9uc1xyXG5cclxuXHRcdFx0XHRcdHQgPSB0YWJsZTtcclxuXHRcdFx0XHRcdHQgPSBpbmZ0cmVlLmluZmxhdGVfdHJlZXNfZHluYW1pYygyNTcgKyAodCAmIDB4MWYpLCAxICsgKCh0ID4+IDUpICYgMHgxZiksIGJsZW5zLCBibF8sIGJkXywgdGxfLCB0ZF8sIGh1ZnRzLCB6KTtcclxuXHJcblx0XHRcdFx0XHRpZiAodCAhPSBaX09LKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0ID09IFpfREFUQV9FUlJPUikge1xyXG5cdFx0XHRcdFx0XHRcdGJsZW5zID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRtb2RlID0gQkFEQkxPQ0tTO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHIgPSB0O1xyXG5cclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb2Rlcy5pbml0KGJsX1swXSwgYmRfWzBdLCBodWZ0cywgdGxfWzBdLCBodWZ0cywgdGRfWzBdKTtcclxuXHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdG1vZGUgPSBDT0RFUztcclxuXHRcdFx0XHRjYXNlIENPREVTOlxyXG5cdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHJcblx0XHRcdFx0XHRpZiAoKHIgPSBjb2Rlcy5wcm9jKHRoYXQsIHosIHIpKSAhPSBaX1NUUkVBTV9FTkQpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHIgPSBaX09LO1xyXG5cdFx0XHRcdFx0Y29kZXMuZnJlZSh6KTtcclxuXHJcblx0XHRcdFx0XHRwID0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0biA9IHouYXZhaWxfaW47XHJcblx0XHRcdFx0XHRiID0gdGhhdC5iaXRiO1xyXG5cdFx0XHRcdFx0ayA9IHRoYXQuYml0aztcclxuXHRcdFx0XHRcdHEgPSB0aGF0LndyaXRlO1xyXG5cdFx0XHRcdFx0bSA9IC8qIChpbnQpICovKHEgPCB0aGF0LnJlYWQgPyB0aGF0LnJlYWQgLSBxIC0gMSA6IHRoYXQuZW5kIC0gcSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGxhc3QgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0bW9kZSA9IFRZUEU7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bW9kZSA9IERSWTtcclxuXHRcdFx0XHRjYXNlIERSWTpcclxuXHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0ciA9IHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRcdHEgPSB0aGF0LndyaXRlO1xyXG5cdFx0XHRcdFx0bSA9IC8qIChpbnQpICovKHEgPCB0aGF0LnJlYWQgPyB0aGF0LnJlYWQgLSBxIC0gMSA6IHRoYXQuZW5kIC0gcSk7XHJcblx0XHRcdFx0XHRpZiAodGhhdC5yZWFkICE9IHRoYXQud3JpdGUpIHtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdFx0dGhhdC53cml0ZSA9IHE7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRtb2RlID0gRE9ORUxPQ0tTO1xyXG5cdFx0XHRcdGNhc2UgRE9ORUxPQ0tTOlxyXG5cdFx0XHRcdFx0ciA9IFpfU1RSRUFNX0VORDtcclxuXHJcblx0XHRcdFx0XHR0aGF0LmJpdGIgPSBiO1xyXG5cdFx0XHRcdFx0dGhhdC5iaXRrID0gaztcclxuXHRcdFx0XHRcdHouYXZhaWxfaW4gPSBuO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbiArPSBwIC0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0XHRcdHRoYXQud3JpdGUgPSBxO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoYXQuaW5mbGF0ZV9mbHVzaCh6LCByKTtcclxuXHRcdFx0XHRjYXNlIEJBREJMT0NLUzpcclxuXHRcdFx0XHRcdHIgPSBaX0RBVEFfRVJST1I7XHJcblxyXG5cdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblxyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRyID0gWl9TVFJFQU1fRVJST1I7XHJcblxyXG5cdFx0XHRcdFx0dGhhdC5iaXRiID0gYjtcclxuXHRcdFx0XHRcdHRoYXQuYml0ayA9IGs7XHJcblx0XHRcdFx0XHR6LmF2YWlsX2luID0gbjtcclxuXHRcdFx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHRcdHoubmV4dF9pbl9pbmRleCA9IHA7XHJcblx0XHRcdFx0XHR0aGF0LndyaXRlID0gcTtcclxuXHRcdFx0XHRcdHJldHVybiB0aGF0LmluZmxhdGVfZmx1c2goeiwgcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuZnJlZSA9IGZ1bmN0aW9uKHopIHtcclxuXHRcdFx0dGhhdC5yZXNldCh6LCBudWxsKTtcclxuXHRcdFx0dGhhdC53aW5kb3cgPSBudWxsO1xyXG5cdFx0XHRodWZ0cyA9IG51bGw7XHJcblx0XHRcdC8vIFpGUkVFKHosIHMpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LnNldF9kaWN0aW9uYXJ5ID0gZnVuY3Rpb24oZCwgc3RhcnQsIG4pIHtcclxuXHRcdFx0dGhhdC53aW5kb3cuc2V0KGQuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbiksIDApO1xyXG5cdFx0XHR0aGF0LnJlYWQgPSB0aGF0LndyaXRlID0gbjtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gUmV0dXJucyB0cnVlIGlmIGluZmxhdGUgaXMgY3VycmVudGx5IGF0IHRoZSBlbmQgb2YgYSBibG9jayBnZW5lcmF0ZWRcclxuXHRcdC8vIGJ5IFpfU1lOQ19GTFVTSCBvciBaX0ZVTExfRkxVU0guXHJcblx0XHR0aGF0LnN5bmNfcG9pbnQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIG1vZGUgPT0gTEVOUyA/IDEgOiAwO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHQvLyBJbmZsYXRlXHJcblxyXG5cdC8vIHByZXNldCBkaWN0aW9uYXJ5IGZsYWcgaW4gemxpYiBoZWFkZXJcclxuXHR2YXIgUFJFU0VUX0RJQ1QgPSAweDIwO1xyXG5cclxuXHR2YXIgWl9ERUZMQVRFRCA9IDg7XHJcblxyXG5cdHZhciBNRVRIT0QgPSAwOyAvLyB3YWl0aW5nIGZvciBtZXRob2QgYnl0ZVxyXG5cdHZhciBGTEFHID0gMTsgLy8gd2FpdGluZyBmb3IgZmxhZyBieXRlXHJcblx0dmFyIERJQ1Q0ID0gMjsgLy8gZm91ciBkaWN0aW9uYXJ5IGNoZWNrIGJ5dGVzIHRvIGdvXHJcblx0dmFyIERJQ1QzID0gMzsgLy8gdGhyZWUgZGljdGlvbmFyeSBjaGVjayBieXRlcyB0byBnb1xyXG5cdHZhciBESUNUMiA9IDQ7IC8vIHR3byBkaWN0aW9uYXJ5IGNoZWNrIGJ5dGVzIHRvIGdvXHJcblx0dmFyIERJQ1QxID0gNTsgLy8gb25lIGRpY3Rpb25hcnkgY2hlY2sgYnl0ZSB0byBnb1xyXG5cdHZhciBESUNUMCA9IDY7IC8vIHdhaXRpbmcgZm9yIGluZmxhdGVTZXREaWN0aW9uYXJ5XHJcblx0dmFyIEJMT0NLUyA9IDc7IC8vIGRlY29tcHJlc3NpbmcgYmxvY2tzXHJcblx0dmFyIERPTkUgPSAxMjsgLy8gZmluaXNoZWQgY2hlY2ssIGRvbmVcclxuXHR2YXIgQkFEID0gMTM7IC8vIGdvdCBhbiBlcnJvci0tc3RheSBoZXJlXHJcblxyXG5cdHZhciBtYXJrID0gWyAwLCAwLCAweGZmLCAweGZmIF07XHJcblxyXG5cdGZ1bmN0aW9uIEluZmxhdGUoKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0dGhhdC5tb2RlID0gMDsgLy8gY3VycmVudCBpbmZsYXRlIG1vZGVcclxuXHJcblx0XHQvLyBtb2RlIGRlcGVuZGVudCBpbmZvcm1hdGlvblxyXG5cdFx0dGhhdC5tZXRob2QgPSAwOyAvLyBpZiBGTEFHUywgbWV0aG9kIGJ5dGVcclxuXHJcblx0XHQvLyBpZiBDSEVDSywgY2hlY2sgdmFsdWVzIHRvIGNvbXBhcmVcclxuXHRcdHRoYXQud2FzID0gWyAwIF07IC8vIG5ldyBBcnJheSgxKTsgLy8gY29tcHV0ZWQgY2hlY2sgdmFsdWVcclxuXHRcdHRoYXQubmVlZCA9IDA7IC8vIHN0cmVhbSBjaGVjayB2YWx1ZVxyXG5cclxuXHRcdC8vIGlmIEJBRCwgaW5mbGF0ZVN5bmMncyBtYXJrZXIgYnl0ZXMgY291bnRcclxuXHRcdHRoYXQubWFya2VyID0gMDtcclxuXHJcblx0XHQvLyBtb2RlIGluZGVwZW5kZW50IGluZm9ybWF0aW9uXHJcblx0XHR0aGF0LndiaXRzID0gMDsgLy8gbG9nMih3aW5kb3cgc2l6ZSkgKDguLjE1LCBkZWZhdWx0cyB0byAxNSlcclxuXHJcblx0XHQvLyB0aGlzLmJsb2NrczsgLy8gY3VycmVudCBpbmZsYXRlX2Jsb2NrcyBzdGF0ZVxyXG5cclxuXHRcdGZ1bmN0aW9uIGluZmxhdGVSZXNldCh6KSB7XHJcblx0XHRcdGlmICgheiB8fCAhei5pc3RhdGUpXHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cclxuXHRcdFx0ei50b3RhbF9pbiA9IHoudG90YWxfb3V0ID0gMDtcclxuXHRcdFx0ei5tc2cgPSBudWxsO1xyXG5cdFx0XHR6LmlzdGF0ZS5tb2RlID0gQkxPQ0tTO1xyXG5cdFx0XHR6LmlzdGF0ZS5ibG9ja3MucmVzZXQoeiwgbnVsbCk7XHJcblx0XHRcdHJldHVybiBaX09LO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoYXQuaW5mbGF0ZUVuZCA9IGZ1bmN0aW9uKHopIHtcclxuXHRcdFx0aWYgKHRoYXQuYmxvY2tzKVxyXG5cdFx0XHRcdHRoYXQuYmxvY2tzLmZyZWUoeik7XHJcblx0XHRcdHRoYXQuYmxvY2tzID0gbnVsbDtcclxuXHRcdFx0Ly8gWkZSRUUoeiwgei0+c3RhdGUpO1xyXG5cdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5pbmZsYXRlSW5pdCA9IGZ1bmN0aW9uKHosIHcpIHtcclxuXHRcdFx0ei5tc2cgPSBudWxsO1xyXG5cdFx0XHR0aGF0LmJsb2NrcyA9IG51bGw7XHJcblxyXG5cdFx0XHQvLyBzZXQgd2luZG93IHNpemVcclxuXHRcdFx0aWYgKHcgPCA4IHx8IHcgPiAxNSkge1xyXG5cdFx0XHRcdHRoYXQuaW5mbGF0ZUVuZCh6KTtcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhhdC53Yml0cyA9IHc7XHJcblxyXG5cdFx0XHR6LmlzdGF0ZS5ibG9ja3MgPSBuZXcgSW5mQmxvY2tzKHosIDEgPDwgdyk7XHJcblxyXG5cdFx0XHQvLyByZXNldCBzdGF0ZVxyXG5cdFx0XHRpbmZsYXRlUmVzZXQoeik7XHJcblx0XHRcdHJldHVybiBaX09LO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmluZmxhdGUgPSBmdW5jdGlvbih6LCBmKSB7XHJcblx0XHRcdHZhciByO1xyXG5cdFx0XHR2YXIgYjtcclxuXHJcblx0XHRcdGlmICgheiB8fCAhei5pc3RhdGUgfHwgIXoubmV4dF9pbilcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdGYgPSBmID09IFpfRklOSVNIID8gWl9CVUZfRVJST1IgOiBaX09LO1xyXG5cdFx0XHRyID0gWl9CVUZfRVJST1I7XHJcblx0XHRcdHdoaWxlICh0cnVlKSB7XHJcblx0XHRcdFx0Ly8gU3lzdGVtLm91dC5wcmludGxuKFwibW9kZTogXCIrei5pc3RhdGUubW9kZSk7XHJcblx0XHRcdFx0c3dpdGNoICh6LmlzdGF0ZS5tb2RlKSB7XHJcblx0XHRcdFx0Y2FzZSBNRVRIT0Q6XHJcblxyXG5cdFx0XHRcdFx0aWYgKHouYXZhaWxfaW4gPT09IDApXHJcblx0XHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdFx0ciA9IGY7XHJcblxyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbi0tO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbisrO1xyXG5cdFx0XHRcdFx0aWYgKCgoei5pc3RhdGUubWV0aG9kID0gei5yZWFkX2J5dGUoei5uZXh0X2luX2luZGV4KyspKSAmIDB4ZikgIT0gWl9ERUZMQVRFRCkge1xyXG5cdFx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gQkFEO1xyXG5cdFx0XHRcdFx0XHR6Lm1zZyA9IFwidW5rbm93biBjb21wcmVzc2lvbiBtZXRob2RcIjtcclxuXHRcdFx0XHRcdFx0ei5pc3RhdGUubWFya2VyID0gNTsgLy8gY2FuJ3QgdHJ5IGluZmxhdGVTeW5jXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCh6LmlzdGF0ZS5tZXRob2QgPj4gNCkgKyA4ID4gei5pc3RhdGUud2JpdHMpIHtcclxuXHRcdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IEJBRDtcclxuXHRcdFx0XHRcdFx0ei5tc2cgPSBcImludmFsaWQgd2luZG93IHNpemVcIjtcclxuXHRcdFx0XHRcdFx0ei5pc3RhdGUubWFya2VyID0gNTsgLy8gY2FuJ3QgdHJ5IGluZmxhdGVTeW5jXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IEZMQUc7XHJcblx0XHRcdFx0Y2FzZSBGTEFHOlxyXG5cclxuXHRcdFx0XHRcdGlmICh6LmF2YWlsX2luID09PSAwKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0XHRcdHIgPSBmO1xyXG5cclxuXHRcdFx0XHRcdHouYXZhaWxfaW4tLTtcclxuXHRcdFx0XHRcdHoudG90YWxfaW4rKztcclxuXHRcdFx0XHRcdGIgPSAoei5yZWFkX2J5dGUoei5uZXh0X2luX2luZGV4KyspKSAmIDB4ZmY7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCgoKHouaXN0YXRlLm1ldGhvZCA8PCA4KSArIGIpICUgMzEpICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdHouaXN0YXRlLm1vZGUgPSBCQUQ7XHJcblx0XHRcdFx0XHRcdHoubXNnID0gXCJpbmNvcnJlY3QgaGVhZGVyIGNoZWNrXCI7XHJcblx0XHRcdFx0XHRcdHouaXN0YXRlLm1hcmtlciA9IDU7IC8vIGNhbid0IHRyeSBpbmZsYXRlU3luY1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoKGIgJiBQUkVTRVRfRElDVCkgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IEJMT0NLUztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gRElDVDQ7XHJcblx0XHRcdFx0Y2FzZSBESUNUNDpcclxuXHJcblx0XHRcdFx0XHRpZiAoei5hdmFpbF9pbiA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHI7XHJcblx0XHRcdFx0XHRyID0gZjtcclxuXHJcblx0XHRcdFx0XHR6LmF2YWlsX2luLS07XHJcblx0XHRcdFx0XHR6LnRvdGFsX2luKys7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5uZWVkID0gKCh6LnJlYWRfYnl0ZSh6Lm5leHRfaW5faW5kZXgrKykgJiAweGZmKSA8PCAyNCkgJiAweGZmMDAwMDAwO1xyXG5cdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IERJQ1QzO1xyXG5cdFx0XHRcdGNhc2UgRElDVDM6XHJcblxyXG5cdFx0XHRcdFx0aWYgKHouYXZhaWxfaW4gPT09IDApXHJcblx0XHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdFx0ciA9IGY7XHJcblxyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbi0tO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbisrO1xyXG5cdFx0XHRcdFx0ei5pc3RhdGUubmVlZCArPSAoKHoucmVhZF9ieXRlKHoubmV4dF9pbl9pbmRleCsrKSAmIDB4ZmYpIDw8IDE2KSAmIDB4ZmYwMDAwO1xyXG5cdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IERJQ1QyO1xyXG5cdFx0XHRcdGNhc2UgRElDVDI6XHJcblxyXG5cdFx0XHRcdFx0aWYgKHouYXZhaWxfaW4gPT09IDApXHJcblx0XHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdFx0ciA9IGY7XHJcblxyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbi0tO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbisrO1xyXG5cdFx0XHRcdFx0ei5pc3RhdGUubmVlZCArPSAoKHoucmVhZF9ieXRlKHoubmV4dF9pbl9pbmRleCsrKSAmIDB4ZmYpIDw8IDgpICYgMHhmZjAwO1xyXG5cdFx0XHRcdFx0ei5pc3RhdGUubW9kZSA9IERJQ1QxO1xyXG5cdFx0XHRcdGNhc2UgRElDVDE6XHJcblxyXG5cdFx0XHRcdFx0aWYgKHouYXZhaWxfaW4gPT09IDApXHJcblx0XHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdFx0ciA9IGY7XHJcblxyXG5cdFx0XHRcdFx0ei5hdmFpbF9pbi0tO1xyXG5cdFx0XHRcdFx0ei50b3RhbF9pbisrO1xyXG5cdFx0XHRcdFx0ei5pc3RhdGUubmVlZCArPSAoei5yZWFkX2J5dGUoei5uZXh0X2luX2luZGV4KyspICYgMHhmZik7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gRElDVDA7XHJcblx0XHRcdFx0XHRyZXR1cm4gWl9ORUVEX0RJQ1Q7XHJcblx0XHRcdFx0Y2FzZSBESUNUMDpcclxuXHRcdFx0XHRcdHouaXN0YXRlLm1vZGUgPSBCQUQ7XHJcblx0XHRcdFx0XHR6Lm1zZyA9IFwibmVlZCBkaWN0aW9uYXJ5XCI7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5tYXJrZXIgPSAwOyAvLyBjYW4gdHJ5IGluZmxhdGVTeW5jXHJcblx0XHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdFx0Y2FzZSBCTE9DS1M6XHJcblxyXG5cdFx0XHRcdFx0ciA9IHouaXN0YXRlLmJsb2Nrcy5wcm9jKHosIHIpO1xyXG5cdFx0XHRcdFx0aWYgKHIgPT0gWl9EQVRBX0VSUk9SKSB7XHJcblx0XHRcdFx0XHRcdHouaXN0YXRlLm1vZGUgPSBCQUQ7XHJcblx0XHRcdFx0XHRcdHouaXN0YXRlLm1hcmtlciA9IDA7IC8vIGNhbiB0cnkgaW5mbGF0ZVN5bmNcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAociA9PSBaX09LKSB7XHJcblx0XHRcdFx0XHRcdHIgPSBmO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHIgIT0gWl9TVFJFQU1fRU5EKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ciA9IGY7XHJcblx0XHRcdFx0XHR6LmlzdGF0ZS5ibG9ja3MucmVzZXQoeiwgei5pc3RhdGUud2FzKTtcclxuXHRcdFx0XHRcdHouaXN0YXRlLm1vZGUgPSBET05FO1xyXG5cdFx0XHRcdGNhc2UgRE9ORTpcclxuXHRcdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FTkQ7XHJcblx0XHRcdFx0Y2FzZSBCQUQ6XHJcblx0XHRcdFx0XHRyZXR1cm4gWl9EQVRBX0VSUk9SO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuaW5mbGF0ZVNldERpY3Rpb25hcnkgPSBmdW5jdGlvbih6LCBkaWN0aW9uYXJ5LCBkaWN0TGVuZ3RoKSB7XHJcblx0XHRcdHZhciBpbmRleCA9IDA7XHJcblx0XHRcdHZhciBsZW5ndGggPSBkaWN0TGVuZ3RoO1xyXG5cdFx0XHRpZiAoIXogfHwgIXouaXN0YXRlIHx8IHouaXN0YXRlLm1vZGUgIT0gRElDVDApXHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cclxuXHRcdFx0aWYgKGxlbmd0aCA+PSAoMSA8PCB6LmlzdGF0ZS53Yml0cykpIHtcclxuXHRcdFx0XHRsZW5ndGggPSAoMSA8PCB6LmlzdGF0ZS53Yml0cykgLSAxO1xyXG5cdFx0XHRcdGluZGV4ID0gZGljdExlbmd0aCAtIGxlbmd0aDtcclxuXHRcdFx0fVxyXG5cdFx0XHR6LmlzdGF0ZS5ibG9ja3Muc2V0X2RpY3Rpb25hcnkoZGljdGlvbmFyeSwgaW5kZXgsIGxlbmd0aCk7XHJcblx0XHRcdHouaXN0YXRlLm1vZGUgPSBCTE9DS1M7XHJcblx0XHRcdHJldHVybiBaX09LO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmluZmxhdGVTeW5jID0gZnVuY3Rpb24oeikge1xyXG5cdFx0XHR2YXIgbjsgLy8gbnVtYmVyIG9mIGJ5dGVzIHRvIGxvb2sgYXRcclxuXHRcdFx0dmFyIHA7IC8vIHBvaW50ZXIgdG8gYnl0ZXNcclxuXHRcdFx0dmFyIG07IC8vIG51bWJlciBvZiBtYXJrZXIgYnl0ZXMgZm91bmQgaW4gYSByb3dcclxuXHRcdFx0dmFyIHIsIHc7IC8vIHRlbXBvcmFyaWVzIHRvIHNhdmUgdG90YWxfaW4gYW5kIHRvdGFsX291dFxyXG5cclxuXHRcdFx0Ly8gc2V0IHVwXHJcblx0XHRcdGlmICgheiB8fCAhei5pc3RhdGUpXHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cdFx0XHRpZiAoei5pc3RhdGUubW9kZSAhPSBCQUQpIHtcclxuXHRcdFx0XHR6LmlzdGF0ZS5tb2RlID0gQkFEO1xyXG5cdFx0XHRcdHouaXN0YXRlLm1hcmtlciA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKChuID0gei5hdmFpbF9pbikgPT09IDApXHJcblx0XHRcdFx0cmV0dXJuIFpfQlVGX0VSUk9SO1xyXG5cdFx0XHRwID0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRtID0gei5pc3RhdGUubWFya2VyO1xyXG5cclxuXHRcdFx0Ly8gc2VhcmNoXHJcblx0XHRcdHdoaWxlIChuICE9PSAwICYmIG0gPCA0KSB7XHJcblx0XHRcdFx0aWYgKHoucmVhZF9ieXRlKHApID09IG1hcmtbbV0pIHtcclxuXHRcdFx0XHRcdG0rKztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHoucmVhZF9ieXRlKHApICE9PSAwKSB7XHJcblx0XHRcdFx0XHRtID0gMDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bSA9IDQgLSBtO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRwKys7XHJcblx0XHRcdFx0bi0tO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyByZXN0b3JlXHJcblx0XHRcdHoudG90YWxfaW4gKz0gcCAtIHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0ei5uZXh0X2luX2luZGV4ID0gcDtcclxuXHRcdFx0ei5hdmFpbF9pbiA9IG47XHJcblx0XHRcdHouaXN0YXRlLm1hcmtlciA9IG07XHJcblxyXG5cdFx0XHQvLyByZXR1cm4gbm8gam95IG9yIHNldCB1cCB0byByZXN0YXJ0IG9uIGEgbmV3IGJsb2NrXHJcblx0XHRcdGlmIChtICE9IDQpIHtcclxuXHRcdFx0XHRyZXR1cm4gWl9EQVRBX0VSUk9SO1xyXG5cdFx0XHR9XHJcblx0XHRcdHIgPSB6LnRvdGFsX2luO1xyXG5cdFx0XHR3ID0gei50b3RhbF9vdXQ7XHJcblx0XHRcdGluZmxhdGVSZXNldCh6KTtcclxuXHRcdFx0ei50b3RhbF9pbiA9IHI7XHJcblx0XHRcdHoudG90YWxfb3V0ID0gdztcclxuXHRcdFx0ei5pc3RhdGUubW9kZSA9IEJMT0NLUztcclxuXHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIFJldHVybnMgdHJ1ZSBpZiBpbmZsYXRlIGlzIGN1cnJlbnRseSBhdCB0aGUgZW5kIG9mIGEgYmxvY2sgZ2VuZXJhdGVkXHJcblx0XHQvLyBieSBaX1NZTkNfRkxVU0ggb3IgWl9GVUxMX0ZMVVNILiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgYnkgb25lIFBQUFxyXG5cdFx0Ly8gaW1wbGVtZW50YXRpb24gdG8gcHJvdmlkZSBhbiBhZGRpdGlvbmFsIHNhZmV0eSBjaGVjay4gUFBQIHVzZXNcclxuXHRcdC8vIFpfU1lOQ19GTFVTSFxyXG5cdFx0Ly8gYnV0IHJlbW92ZXMgdGhlIGxlbmd0aCBieXRlcyBvZiB0aGUgcmVzdWx0aW5nIGVtcHR5IHN0b3JlZCBibG9jay4gV2hlblxyXG5cdFx0Ly8gZGVjb21wcmVzc2luZywgUFBQIGNoZWNrcyB0aGF0IGF0IHRoZSBlbmQgb2YgaW5wdXQgcGFja2V0LCBpbmZsYXRlIGlzXHJcblx0XHQvLyB3YWl0aW5nIGZvciB0aGVzZSBsZW5ndGggYnl0ZXMuXHJcblx0XHR0aGF0LmluZmxhdGVTeW5jUG9pbnQgPSBmdW5jdGlvbih6KSB7XHJcblx0XHRcdGlmICgheiB8fCAhei5pc3RhdGUgfHwgIXouaXN0YXRlLmJsb2NrcylcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdHJldHVybiB6LmlzdGF0ZS5ibG9ja3Muc3luY19wb2ludCgpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8vIFpTdHJlYW1cclxuXHJcblx0ZnVuY3Rpb24gWlN0cmVhbSgpIHtcclxuXHR9XHJcblxyXG5cdFpTdHJlYW0ucHJvdG90eXBlID0ge1xyXG5cdFx0aW5mbGF0ZUluaXQgOiBmdW5jdGlvbihiaXRzKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0dGhhdC5pc3RhdGUgPSBuZXcgSW5mbGF0ZSgpO1xyXG5cdFx0XHRpZiAoIWJpdHMpXHJcblx0XHRcdFx0Yml0cyA9IE1BWF9CSVRTO1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5pc3RhdGUuaW5mbGF0ZUluaXQodGhhdCwgYml0cyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGluZmxhdGUgOiBmdW5jdGlvbihmKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0aWYgKCF0aGF0LmlzdGF0ZSlcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdHJldHVybiB0aGF0LmlzdGF0ZS5pbmZsYXRlKHRoYXQsIGYpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRpbmZsYXRlRW5kIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0aWYgKCF0aGF0LmlzdGF0ZSlcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdHZhciByZXQgPSB0aGF0LmlzdGF0ZS5pbmZsYXRlRW5kKHRoYXQpO1xyXG5cdFx0XHR0aGF0LmlzdGF0ZSA9IG51bGw7XHJcblx0XHRcdHJldHVybiByZXQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGluZmxhdGVTeW5jIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0aWYgKCF0aGF0LmlzdGF0ZSlcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdHJldHVybiB0aGF0LmlzdGF0ZS5pbmZsYXRlU3luYyh0aGF0KTtcclxuXHRcdH0sXHJcblx0XHRpbmZsYXRlU2V0RGljdGlvbmFyeSA6IGZ1bmN0aW9uKGRpY3Rpb25hcnksIGRpY3RMZW5ndGgpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRpZiAoIXRoYXQuaXN0YXRlKVxyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0cmV0dXJuIHRoYXQuaXN0YXRlLmluZmxhdGVTZXREaWN0aW9uYXJ5KHRoYXQsIGRpY3Rpb25hcnksIGRpY3RMZW5ndGgpO1xyXG5cdFx0fSxcclxuXHRcdHJlYWRfYnl0ZSA6IGZ1bmN0aW9uKHN0YXJ0KSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0cmV0dXJuIHRoYXQubmV4dF9pbi5zdWJhcnJheShzdGFydCwgc3RhcnQgKyAxKVswXTtcclxuXHRcdH0sXHJcblx0XHRyZWFkX2J1ZiA6IGZ1bmN0aW9uKHN0YXJ0LCBzaXplKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0cmV0dXJuIHRoYXQubmV4dF9pbi5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBzaXplKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBJbmZsYXRlclxyXG5cclxuXHRmdW5jdGlvbiBJbmZsYXRlcigpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdHZhciB6ID0gbmV3IFpTdHJlYW0oKTtcclxuXHRcdHZhciBidWZzaXplID0gNTEyO1xyXG5cdFx0dmFyIGZsdXNoID0gWl9OT19GTFVTSDtcclxuXHRcdHZhciBidWYgPSBuZXcgVWludDhBcnJheShidWZzaXplKTtcclxuXHRcdHZhciBub21vcmVpbnB1dCA9IGZhbHNlO1xyXG5cclxuXHRcdHouaW5mbGF0ZUluaXQoKTtcclxuXHRcdHoubmV4dF9vdXQgPSBidWY7XHJcblxyXG5cdFx0dGhhdC5hcHBlbmQgPSBmdW5jdGlvbihkYXRhLCBvbnByb2dyZXNzKSB7XHJcblx0XHRcdHZhciBlcnIsIGJ1ZmZlcnMgPSBbXSwgbGFzdEluZGV4ID0gMCwgYnVmZmVySW5kZXggPSAwLCBidWZmZXJTaXplID0gMCwgYXJyYXk7XHJcblx0XHRcdGlmIChkYXRhLmxlbmd0aCA9PT0gMClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdHoubmV4dF9pbl9pbmRleCA9IDA7XHJcblx0XHRcdHoubmV4dF9pbiA9IGRhdGE7XHJcblx0XHRcdHouYXZhaWxfaW4gPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdHoubmV4dF9vdXRfaW5kZXggPSAwO1xyXG5cdFx0XHRcdHouYXZhaWxfb3V0ID0gYnVmc2l6ZTtcclxuXHRcdFx0XHRpZiAoKHouYXZhaWxfaW4gPT09IDApICYmICghbm9tb3JlaW5wdXQpKSB7IC8vIGlmIGJ1ZmZlciBpcyBlbXB0eSBhbmQgbW9yZSBpbnB1dCBpcyBhdmFpbGFibGUsIHJlZmlsbCBpdFxyXG5cdFx0XHRcdFx0ei5uZXh0X2luX2luZGV4ID0gMDtcclxuXHRcdFx0XHRcdG5vbW9yZWlucHV0ID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXJyID0gei5pbmZsYXRlKGZsdXNoKTtcclxuXHRcdFx0XHRpZiAobm9tb3JlaW5wdXQgJiYgKGVyciA9PSBaX0JVRl9FUlJPUikpXHJcblx0XHRcdFx0XHRyZXR1cm4gLTE7XHJcblx0XHRcdFx0aWYgKGVyciAhPSBaX09LICYmIGVyciAhPSBaX1NUUkVBTV9FTkQpXHJcblx0XHRcdFx0XHR0aHJvdyBcImluZmxhdGluZzogXCIgKyB6Lm1zZztcclxuXHRcdFx0XHRpZiAoKG5vbW9yZWlucHV0IHx8IGVyciA9PSBaX1NUUkVBTV9FTkQpICYmICh6LmF2YWlsX2luID09IGRhdGEubGVuZ3RoKSlcclxuXHRcdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0XHRpZiAoei5uZXh0X291dF9pbmRleClcclxuXHRcdFx0XHRcdGlmICh6Lm5leHRfb3V0X2luZGV4ID09IGJ1ZnNpemUpXHJcblx0XHRcdFx0XHRcdGJ1ZmZlcnMucHVzaChuZXcgVWludDhBcnJheShidWYpKTtcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0YnVmZmVycy5wdXNoKG5ldyBVaW50OEFycmF5KGJ1Zi5zdWJhcnJheSgwLCB6Lm5leHRfb3V0X2luZGV4KSkpO1xyXG5cdFx0XHRcdGJ1ZmZlclNpemUgKz0gei5uZXh0X291dF9pbmRleDtcclxuXHRcdFx0XHRpZiAob25wcm9ncmVzcyAmJiB6Lm5leHRfaW5faW5kZXggPiAwICYmIHoubmV4dF9pbl9pbmRleCAhPSBsYXN0SW5kZXgpIHtcclxuXHRcdFx0XHRcdG9ucHJvZ3Jlc3Moei5uZXh0X2luX2luZGV4KTtcclxuXHRcdFx0XHRcdGxhc3RJbmRleCA9IHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gd2hpbGUgKHouYXZhaWxfaW4gPiAwIHx8IHouYXZhaWxfb3V0ID09PSAwKTtcclxuXHRcdFx0YXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJTaXplKTtcclxuXHRcdFx0YnVmZmVycy5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rKSB7XHJcblx0XHRcdFx0YXJyYXkuc2V0KGNodW5rLCBidWZmZXJJbmRleCk7XHJcblx0XHRcdFx0YnVmZmVySW5kZXggKz0gY2h1bmsubGVuZ3RoO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIGFycmF5O1xyXG5cdFx0fTtcclxuXHRcdHRoYXQuZmx1c2ggPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0ei5pbmZsYXRlRW5kKCk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dmFyIGluZmxhdGVyO1xyXG5cclxuXHRpZiAob2JqLnppcClcclxuXHRcdG9iai56aXAuSW5mbGF0ZXIgPSBJbmZsYXRlcjtcclxuXHRlbHNlIHtcclxuXHRcdGluZmxhdGVyID0gbmV3IEluZmxhdGVyKCk7XHJcblx0XHRvYmouYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0dmFyIG1lc3NhZ2UgPSBldmVudC5kYXRhO1xyXG5cclxuXHRcdFx0aWYgKG1lc3NhZ2UuYXBwZW5kKVxyXG5cdFx0XHRcdG9iai5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdFx0XHRvbmFwcGVuZCA6IHRydWUsXHJcblx0XHRcdFx0XHRkYXRhIDogaW5mbGF0ZXIuYXBwZW5kKG1lc3NhZ2UuZGF0YSwgZnVuY3Rpb24oY3VycmVudCkge1xyXG5cdFx0XHRcdFx0XHRvYmoucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0XHRcdHByb2dyZXNzIDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRjdXJyZW50IDogY3VycmVudFxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdGlmIChtZXNzYWdlLmZsdXNoKSB7XHJcblx0XHRcdFx0aW5mbGF0ZXIuZmx1c2goKTtcclxuXHRcdFx0XHRvYmoucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0b25mbHVzaCA6IHRydWVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSwgZmFsc2UpO1xyXG5cdH1cclxuXHJcbn0pKHNlbGYpO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHJpbmctcmVwbGFjZS13ZWJwYWNrLXBsdWdpbi9sb2FkZXIuanM/aWQ9YW43cW40Zm0wdGshLi9ub2RlX21vZHVsZXMvc3RyaW5nLXJlcGxhY2Utd2VicGFjay1wbHVnaW4vbG9hZGVyLmpzP2lkPWszeHc3Y3ptY2whLi9ub2RlX21vZHVsZXMvdGVycmlhanMvYnVpbGRwcm9jZXNzL3JlbW92ZUNlc2l1bURlYnVnUHJhZ21hcy5qcyEuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL1RoaXJkUGFydHkvV29ya2Vycy9pbmZsYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=