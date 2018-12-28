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
	var D_CODES = 30;
	var BL_CODES = 19;

	var LENGTH_CODES = 29;
	var LITERALS = 256;
	var L_CODES = (LITERALS + 1 + LENGTH_CODES);
	var HEAP_SIZE = (2 * L_CODES + 1);

	var END_BLOCK = 256;

	// Bit length codes must not exceed MAX_BL_BITS bits
	var MAX_BL_BITS = 7;

	// repeat previous bit length 3-6 times (2 bits of repeat count)
	var REP_3_6 = 16;

	// repeat a zero length 3-10 times (3 bits of repeat count)
	var REPZ_3_10 = 17;

	// repeat a zero length 11-138 times (7 bits of repeat count)
	var REPZ_11_138 = 18;

	// The lengths of the bit length codes are sent in order of decreasing
	// probability, to avoid transmitting the lengths for unused bit
	// length codes.

	var Buf_size = 8 * 2;

	// JZlib version : "1.0.2"
	var Z_DEFAULT_COMPRESSION = -1;

	// compression strategy
	var Z_FILTERED = 1;
	var Z_HUFFMAN_ONLY = 2;
	var Z_DEFAULT_STRATEGY = 0;

	var Z_NO_FLUSH = 0;
	var Z_PARTIAL_FLUSH = 1;
	var Z_FULL_FLUSH = 3;
	var Z_FINISH = 4;

	var Z_OK = 0;
	var Z_STREAM_END = 1;
	var Z_NEED_DICT = 2;
	var Z_STREAM_ERROR = -2;
	var Z_DATA_ERROR = -3;
	var Z_BUF_ERROR = -5;

	// Tree

	// see definition of array dist_code below
	var _dist_code = [ 0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
			10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
			12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
			13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
			14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
			14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
			15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19,
			20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
			26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
			27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
			28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29,
			29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
			29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29 ];

	function Tree() {
		var that = this;

		// dyn_tree; // the dynamic tree
		// max_code; // largest code with non zero frequency
		// stat_desc; // the corresponding static tree

		// Compute the optimal bit lengths for a tree and update the total bit
		// length
		// for the current block.
		// IN assertion: the fields freq and dad are set, heap[heap_max] and
		// above are the tree nodes sorted by increasing frequency.
		// OUT assertions: the field len is set to the optimal bit length, the
		// array bl_count contains the frequencies for each bit length.
		// The length opt_len is updated; static_len is also updated if stree is
		// not null.
		function gen_bitlen(s) {
			var tree = that.dyn_tree;
			var stree = that.stat_desc.static_tree;
			var extra = that.stat_desc.extra_bits;
			var base = that.stat_desc.extra_base;
			var max_length = that.stat_desc.max_length;
			var h; // heap index
			var n, m; // iterate over the tree elements
			var bits; // bit length
			var xbits; // extra bits
			var f; // frequency
			var overflow = 0; // number of elements with bit length too large

			for (bits = 0; bits <= MAX_BITS; bits++)
				s.bl_count[bits] = 0;

			// In a first pass, compute the optimal bit lengths (which may
			// overflow in the case of the bit length tree).
			tree[s.heap[s.heap_max] * 2 + 1] = 0; // root of the heap

			for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
				n = s.heap[h];
				bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
				if (bits > max_length) {
					bits = max_length;
					overflow++;
				}
				tree[n * 2 + 1] = bits;
				// We overwrite tree[n*2+1] which is no longer needed

				if (n > that.max_code)
					continue; // not a leaf node

				s.bl_count[bits]++;
				xbits = 0;
				if (n >= base)
					xbits = extra[n - base];
				f = tree[n * 2];
				s.opt_len += f * (bits + xbits);
				if (stree)
					s.static_len += f * (stree[n * 2 + 1] + xbits);
			}
			if (overflow === 0)
				return;

			// This happens for example on obj2 and pic of the Calgary corpus
			// Find the first bit length which could increase:
			do {
				bits = max_length - 1;
				while (s.bl_count[bits] === 0)
					bits--;
				s.bl_count[bits]--; // move one leaf down the tree
				s.bl_count[bits + 1] += 2; // move one overflow item as its brother
				s.bl_count[max_length]--;
				// The brother of the overflow item also moves one step up,
				// but this does not affect bl_count[max_length]
				overflow -= 2;
			} while (overflow > 0);

			for (bits = max_length; bits !== 0; bits--) {
				n = s.bl_count[bits];
				while (n !== 0) {
					m = s.heap[--h];
					if (m > that.max_code)
						continue;
					if (tree[m * 2 + 1] != bits) {
						s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
						tree[m * 2 + 1] = bits;
					}
					n--;
				}
			}
		}

		// Reverse the first len bits of a code, using straightforward code (a
		// faster
		// method would use a table)
		// IN assertion: 1 <= len <= 15
		function bi_reverse(code, // the value to invert
		len // its bit length
		) {
			var res = 0;
			do {
				res |= code & 1;
				code >>>= 1;
				res <<= 1;
			} while (--len > 0);
			return res >>> 1;
		}

		// Generate the codes for a given tree and bit counts (which need not be
		// optimal).
		// IN assertion: the array bl_count contains the bit length statistics for
		// the given tree and the field len is set for all tree elements.
		// OUT assertion: the field code is set for all tree elements of non
		// zero code length.
		function gen_codes(tree, // the tree to decorate
		max_code, // largest code with non zero frequency
		bl_count // number of codes at each bit length
		) {
			var next_code = []; // next code value for each
			// bit length
			var code = 0; // running code value
			var bits; // bit index
			var n; // code index
			var len;

			// The distribution counts are first used to generate the code values
			// without bit reversal.
			for (bits = 1; bits <= MAX_BITS; bits++) {
				next_code[bits] = code = ((code + bl_count[bits - 1]) << 1);
			}

			// Check that the bit counts in bl_count are consistent. The last code
			// must be all ones.
			// Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
			// "inconsistent bit counts");
			// Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

			for (n = 0; n <= max_code; n++) {
				len = tree[n * 2 + 1];
				if (len === 0)
					continue;
				// Now reverse the bits
				tree[n * 2] = bi_reverse(next_code[len]++, len);
			}
		}

		// Construct one Huffman tree and assigns the code bit strings and lengths.
		// Update the total bit length for the current block.
		// IN assertion: the field freq is set for all tree elements.
		// OUT assertions: the fields len and code are set to the optimal bit length
		// and corresponding code. The length opt_len is updated; static_len is
		// also updated if stree is not null. The field max_code is set.
		that.build_tree = function(s) {
			var tree = that.dyn_tree;
			var stree = that.stat_desc.static_tree;
			var elems = that.stat_desc.elems;
			var n, m; // iterate over heap elements
			var max_code = -1; // largest code with non zero frequency
			var node; // new node being created

			// Construct the initial heap, with least frequent element in
			// heap[1]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
			// heap[0] is not used.
			s.heap_len = 0;
			s.heap_max = HEAP_SIZE;

			for (n = 0; n < elems; n++) {
				if (tree[n * 2] !== 0) {
					s.heap[++s.heap_len] = max_code = n;
					s.depth[n] = 0;
				} else {
					tree[n * 2 + 1] = 0;
				}
			}

			// The pkzip format requires that at least one distance code exists,
			// and that at least one bit should be sent even if there is only one
			// possible code. So to avoid special checks later on we force at least
			// two codes of non zero frequency.
			while (s.heap_len < 2) {
				node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
				tree[node * 2] = 1;
				s.depth[node] = 0;
				s.opt_len--;
				if (stree)
					s.static_len -= stree[node * 2 + 1];
				// node is 0 or 1 so it does not have extra bits
			}
			that.max_code = max_code;

			// The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
			// establish sub-heaps of increasing lengths:

			for (n = Math.floor(s.heap_len / 2); n >= 1; n--)
				s.pqdownheap(tree, n);

			// Construct the Huffman tree by repeatedly combining the least two
			// frequent nodes.

			node = elems; // next internal node of the tree
			do {
				// n = node of least frequency
				n = s.heap[1];
				s.heap[1] = s.heap[s.heap_len--];
				s.pqdownheap(tree, 1);
				m = s.heap[1]; // m = node of next least frequency

				s.heap[--s.heap_max] = n; // keep the nodes sorted by frequency
				s.heap[--s.heap_max] = m;

				// Create a new node father of n and m
				tree[node * 2] = (tree[n * 2] + tree[m * 2]);
				s.depth[node] = Math.max(s.depth[n], s.depth[m]) + 1;
				tree[n * 2 + 1] = tree[m * 2 + 1] = node;

				// and insert the new node in the heap
				s.heap[1] = node++;
				s.pqdownheap(tree, 1);
			} while (s.heap_len >= 2);

			s.heap[--s.heap_max] = s.heap[1];

			// At this point, the fields freq and dad are set. We can now
			// generate the bit lengths.

			gen_bitlen(s);

			// The field len is now set, we can generate the bit codes
			gen_codes(tree, that.max_code, s.bl_count);
		};

	}

	Tree._length_code = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16,
			16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20,
			20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
			22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
			25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
			26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28 ];

	Tree.base_length = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0 ];

	Tree.base_dist = [ 0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384,
			24576 ];

	// Mapping from a distance to a distance code. dist is the distance - 1 and
	// must not have side effects. _dist_code[256] and _dist_code[257] are never
	// used.
	Tree.d_code = function(dist) {
		return ((dist) < 256 ? _dist_code[dist] : _dist_code[256 + ((dist) >>> 7)]);
	};

	// extra bits for each length code
	Tree.extra_lbits = [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0 ];

	// extra bits for each distance code
	Tree.extra_dbits = [ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 ];

	// extra bits for each bit length code
	Tree.extra_blbits = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7 ];

	Tree.bl_order = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];

	// StaticTree

	function StaticTree(static_tree, extra_bits, extra_base, elems, max_length) {
		var that = this;
		that.static_tree = static_tree;
		that.extra_bits = extra_bits;
		that.extra_base = extra_base;
		that.elems = elems;
		that.max_length = max_length;
	}

	StaticTree.static_ltree = [ 12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8,
			130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42,
			8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8,
			22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8,
			222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113,
			8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8,
			69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8,
			173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9,
			51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9,
			427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379,
			9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23,
			9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9,
			399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9,
			223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7,
			40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8,
			99, 8, 227, 8 ];

	StaticTree.static_dtree = [ 0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5,
			25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5 ];

	StaticTree.static_l_desc = new StaticTree(StaticTree.static_ltree, Tree.extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);

	StaticTree.static_d_desc = new StaticTree(StaticTree.static_dtree, Tree.extra_dbits, 0, D_CODES, MAX_BITS);

	StaticTree.static_bl_desc = new StaticTree(null, Tree.extra_blbits, 0, BL_CODES, MAX_BL_BITS);

	// Deflate

	var MAX_MEM_LEVEL = 9;
	var DEF_MEM_LEVEL = 8;

	function Config(good_length, max_lazy, nice_length, max_chain, func) {
		var that = this;
		that.good_length = good_length;
		that.max_lazy = max_lazy;
		that.nice_length = nice_length;
		that.max_chain = max_chain;
		that.func = func;
	}

	var STORED = 0;
	var FAST = 1;
	var SLOW = 2;
	var config_table = [ new Config(0, 0, 0, 0, STORED), new Config(4, 4, 8, 4, FAST), new Config(4, 5, 16, 8, FAST), new Config(4, 6, 32, 32, FAST),
			new Config(4, 4, 16, 16, SLOW), new Config(8, 16, 32, 32, SLOW), new Config(8, 16, 128, 128, SLOW), new Config(8, 32, 128, 256, SLOW),
			new Config(32, 128, 258, 1024, SLOW), new Config(32, 258, 258, 4096, SLOW) ];

	var z_errmsg = [ "need dictionary", // Z_NEED_DICT
	// 2
	"stream end", // Z_STREAM_END 1
	"", // Z_OK 0
	"", // Z_ERRNO (-1)
	"stream error", // Z_STREAM_ERROR (-2)
	"data error", // Z_DATA_ERROR (-3)
	"", // Z_MEM_ERROR (-4)
	"buffer error", // Z_BUF_ERROR (-5)
	"",// Z_VERSION_ERROR (-6)
	"" ];

	// block not completed, need more input or more output
	var NeedMore = 0;

	// block flush performed
	var BlockDone = 1;

	// finish started, need only more output at next deflate
	var FinishStarted = 2;

	// finish done, accept no more input or output
	var FinishDone = 3;

	// preset dictionary flag in zlib header
	var PRESET_DICT = 0x20;

	var INIT_STATE = 42;
	var BUSY_STATE = 113;
	var FINISH_STATE = 666;

	// The deflate compression method
	var Z_DEFLATED = 8;

	var STORED_BLOCK = 0;
	var STATIC_TREES = 1;
	var DYN_TREES = 2;

	var MIN_MATCH = 3;
	var MAX_MATCH = 258;
	var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

	function smaller(tree, n, m, depth) {
		var tn2 = tree[n * 2];
		var tm2 = tree[m * 2];
		return (tn2 < tm2 || (tn2 == tm2 && depth[n] <= depth[m]));
	}

	function Deflate() {

		var that = this;
		var strm; // pointer back to this zlib stream
		var status; // as the name implies
		// pending_buf; // output still pending
		var pending_buf_size; // size of pending_buf
		// pending_out; // next pending byte to output to the stream
		// pending; // nb of bytes in the pending buffer
		var method; // STORED (for zip only) or DEFLATED
		var last_flush; // value of flush param for previous deflate call

		var w_size; // LZ77 window size (32K by default)
		var w_bits; // log2(w_size) (8..16)
		var w_mask; // w_size - 1

		var window;
		// Sliding window. Input bytes are read into the second half of the window,
		// and move to the first half later to keep a dictionary of at least wSize
		// bytes. With this organization, matches are limited to a distance of
		// wSize-MAX_MATCH bytes, but this ensures that IO is always
		// performed with a length multiple of the block size. Also, it limits
		// the window size to 64K, which is quite useful on MSDOS.
		// To do: use the user input buffer as sliding window.

		var window_size;
		// Actual size of window: 2*wSize, except when the user input buffer
		// is directly used as sliding window.

		var prev;
		// Link to older string with same hash index. To limit the size of this
		// array to 64K, this link is maintained only for the last 32K strings.
		// An index in this array is thus a window index modulo 32K.

		var head; // Heads of the hash chains or NIL.

		var ins_h; // hash index of string to be inserted
		var hash_size; // number of elements in hash table
		var hash_bits; // log2(hash_size)
		var hash_mask; // hash_size-1

		// Number of bits by which ins_h must be shifted at each input
		// step. It must be such that after MIN_MATCH steps, the oldest
		// byte no longer takes part in the hash key, that is:
		// hash_shift * MIN_MATCH >= hash_bits
		var hash_shift;

		// Window position at the beginning of the current output block. Gets
		// negative when the window is moved backwards.

		var block_start;

		var match_length; // length of best match
		var prev_match; // previous match
		var match_available; // set if previous match exists
		var strstart; // start of string to insert
		var match_start; // start of matching string
		var lookahead; // number of valid bytes ahead in window

		// Length of the best match at previous step. Matches not greater than this
		// are discarded. This is used in the lazy match evaluation.
		var prev_length;

		// To speed up deflation, hash chains are never searched beyond this
		// length. A higher limit improves compression ratio but degrades the speed.
		var max_chain_length;

		// Attempt to find a better match only when the current match is strictly
		// smaller than this value. This mechanism is used only for compression
		// levels >= 4.
		var max_lazy_match;

		// Insert new strings in the hash table only if the match length is not
		// greater than this length. This saves time but degrades compression.
		// max_insert_length is used only for compression levels <= 3.

		var level; // compression level (1..9)
		var strategy; // favor or force Huffman coding

		// Use a faster search when the previous match is longer than this
		var good_match;

		// Stop searching when current match exceeds this
		var nice_match;

		var dyn_ltree; // literal and length tree
		var dyn_dtree; // distance tree
		var bl_tree; // Huffman tree for bit lengths

		var l_desc = new Tree(); // desc for literal tree
		var d_desc = new Tree(); // desc for distance tree
		var bl_desc = new Tree(); // desc for bit length tree

		// that.heap_len; // number of elements in the heap
		// that.heap_max; // element of largest frequency
		// The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
		// The same heap array is used to build all trees.

		// Depth of each subtree used as tie breaker for trees of equal frequency
		that.depth = [];

		var l_buf; // index for literals or lengths */

		// Size of match buffer for literals/lengths. There are 4 reasons for
		// limiting lit_bufsize to 64K:
		// - frequencies can be kept in 16 bit counters
		// - if compression is not successful for the first block, all input
		// data is still in the window so we can still emit a stored block even
		// when input comes from standard input. (This can also be done for
		// all blocks if lit_bufsize is not greater than 32K.)
		// - if compression is not successful for a file smaller than 64K, we can
		// even emit a stored file instead of a stored block (saving 5 bytes).
		// This is applicable only for zip (not gzip or zlib).
		// - creating new Huffman trees less frequently may not provide fast
		// adaptation to changes in the input data statistics. (Take for
		// example a binary file with poorly compressible code followed by
		// a highly compressible string table.) Smaller buffer sizes give
		// fast adaptation but have of course the overhead of transmitting
		// trees more frequently.
		// - I can't count above 4
		var lit_bufsize;

		var last_lit; // running index in l_buf

		// Buffer for distances. To simplify the code, d_buf and l_buf have
		// the same number of elements. To use different lengths, an extra flag
		// array would be necessary.

		var d_buf; // index of pendig_buf

		// that.opt_len; // bit length of current block with optimal trees
		// that.static_len; // bit length of current block with static trees
		var matches; // number of string matches in current block
		var last_eob_len; // bit length of EOB code for last block

		// Output buffer. bits are inserted starting at the bottom (least
		// significant bits).
		var bi_buf;

		// Number of valid bits in bi_buf. All bits above the last valid bit
		// are always zero.
		var bi_valid;

		// number of codes at each bit length for an optimal tree
		that.bl_count = [];

		// heap used to build the Huffman trees
		that.heap = [];

		dyn_ltree = [];
		dyn_dtree = [];
		bl_tree = [];

		function lm_init() {
			var i;
			window_size = 2 * w_size;

			head[hash_size - 1] = 0;
			for (i = 0; i < hash_size - 1; i++) {
				head[i] = 0;
			}

			// Set the default configuration parameters:
			max_lazy_match = config_table[level].max_lazy;
			good_match = config_table[level].good_length;
			nice_match = config_table[level].nice_length;
			max_chain_length = config_table[level].max_chain;

			strstart = 0;
			block_start = 0;
			lookahead = 0;
			match_length = prev_length = MIN_MATCH - 1;
			match_available = 0;
			ins_h = 0;
		}

		function init_block() {
			var i;
			// Initialize the trees.
			for (i = 0; i < L_CODES; i++)
				dyn_ltree[i * 2] = 0;
			for (i = 0; i < D_CODES; i++)
				dyn_dtree[i * 2] = 0;
			for (i = 0; i < BL_CODES; i++)
				bl_tree[i * 2] = 0;

			dyn_ltree[END_BLOCK * 2] = 1;
			that.opt_len = that.static_len = 0;
			last_lit = matches = 0;
		}

		// Initialize the tree data structures for a new zlib stream.
		function tr_init() {

			l_desc.dyn_tree = dyn_ltree;
			l_desc.stat_desc = StaticTree.static_l_desc;

			d_desc.dyn_tree = dyn_dtree;
			d_desc.stat_desc = StaticTree.static_d_desc;

			bl_desc.dyn_tree = bl_tree;
			bl_desc.stat_desc = StaticTree.static_bl_desc;

			bi_buf = 0;
			bi_valid = 0;
			last_eob_len = 8; // enough lookahead for inflate

			// Initialize the first block of the first file:
			init_block();
		}

		// Restore the heap property by moving down the tree starting at node k,
		// exchanging a node with the smallest of its two sons if necessary,
		// stopping
		// when the heap property is re-established (each father smaller than its
		// two sons).
		that.pqdownheap = function(tree, // the tree to restore
		k // node to move down
		) {
			var heap = that.heap;
			var v = heap[k];
			var j = k << 1; // left son of k
			while (j <= that.heap_len) {
				// Set j to the smallest of the two sons:
				if (j < that.heap_len && smaller(tree, heap[j + 1], heap[j], that.depth)) {
					j++;
				}
				// Exit if v is smaller than both sons
				if (smaller(tree, v, heap[j], that.depth))
					break;

				// Exchange v with the smallest son
				heap[k] = heap[j];
				k = j;
				// And continue down the tree, setting j to the left son of k
				j <<= 1;
			}
			heap[k] = v;
		};

		// Scan a literal or distance tree to determine the frequencies of the codes
		// in the bit length tree.
		function scan_tree(tree,// the tree to be scanned
		max_code // and its largest code of non zero frequency
		) {
			var n; // iterates over all tree elements
			var prevlen = -1; // last emitted length
			var curlen; // length of current code
			var nextlen = tree[0 * 2 + 1]; // length of next code
			var count = 0; // repeat count of the current code
			var max_count = 7; // max repeat count
			var min_count = 4; // min repeat count

			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			}
			tree[(max_code + 1) * 2 + 1] = 0xffff; // guard

			for (n = 0; n <= max_code; n++) {
				curlen = nextlen;
				nextlen = tree[(n + 1) * 2 + 1];
				if (++count < max_count && curlen == nextlen) {
					continue;
				} else if (count < min_count) {
					bl_tree[curlen * 2] += count;
				} else if (curlen !== 0) {
					if (curlen != prevlen)
						bl_tree[curlen * 2]++;
					bl_tree[REP_3_6 * 2]++;
				} else if (count <= 10) {
					bl_tree[REPZ_3_10 * 2]++;
				} else {
					bl_tree[REPZ_11_138 * 2]++;
				}
				count = 0;
				prevlen = curlen;
				if (nextlen === 0) {
					max_count = 138;
					min_count = 3;
				} else if (curlen == nextlen) {
					max_count = 6;
					min_count = 3;
				} else {
					max_count = 7;
					min_count = 4;
				}
			}
		}

		// Construct the Huffman tree for the bit lengths and return the index in
		// bl_order of the last bit length code to send.
		function build_bl_tree() {
			var max_blindex; // index of last bit length code of non zero freq

			// Determine the bit length frequencies for literal and distance trees
			scan_tree(dyn_ltree, l_desc.max_code);
			scan_tree(dyn_dtree, d_desc.max_code);

			// Build the bit length tree:
			bl_desc.build_tree(that);
			// opt_len now includes the length of the tree representations, except
			// the lengths of the bit lengths codes and the 5+5+4 bits for the
			// counts.

			// Determine the number of bit length codes to send. The pkzip format
			// requires that at least 4 bit length codes be sent. (appnote.txt says
			// 3 but the actual value used is 4.)
			for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
				if (bl_tree[Tree.bl_order[max_blindex] * 2 + 1] !== 0)
					break;
			}
			// Update opt_len to include the bit length tree and counts
			that.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;

			return max_blindex;
		}

		// Output a byte on the stream.
		// IN assertion: there is enough room in pending_buf.
		function put_byte(p) {
			that.pending_buf[that.pending++] = p;
		}

		function put_short(w) {
			put_byte(w & 0xff);
			put_byte((w >>> 8) & 0xff);
		}

		function putShortMSB(b) {
			put_byte((b >> 8) & 0xff);
			put_byte((b & 0xff) & 0xff);
		}

		function send_bits(value, length) {
			var val, len = length;
			if (bi_valid > Buf_size - len) {
				val = value;
				// bi_buf |= (val << bi_valid);
				bi_buf |= ((val << bi_valid) & 0xffff);
				put_short(bi_buf);
				bi_buf = val >>> (Buf_size - bi_valid);
				bi_valid += len - Buf_size;
			} else {
				// bi_buf |= (value) << bi_valid;
				bi_buf |= (((value) << bi_valid) & 0xffff);
				bi_valid += len;
			}
		}

		function send_code(c, tree) {
			var c2 = c * 2;
			send_bits(tree[c2] & 0xffff, tree[c2 + 1] & 0xffff);
		}

		// Send a literal or distance tree in compressed form, using the codes in
		// bl_tree.
		function send_tree(tree,// the tree to be sent
		max_code // and its largest code of non zero frequency
		) {
			var n; // iterates over all tree elements
			var prevlen = -1; // last emitted length
			var curlen; // length of current code
			var nextlen = tree[0 * 2 + 1]; // length of next code
			var count = 0; // repeat count of the current code
			var max_count = 7; // max repeat count
			var min_count = 4; // min repeat count

			if (nextlen === 0) {
				max_count = 138;
				min_count = 3;
			}

			for (n = 0; n <= max_code; n++) {
				curlen = nextlen;
				nextlen = tree[(n + 1) * 2 + 1];
				if (++count < max_count && curlen == nextlen) {
					continue;
				} else if (count < min_count) {
					do {
						send_code(curlen, bl_tree);
					} while (--count !== 0);
				} else if (curlen !== 0) {
					if (curlen != prevlen) {
						send_code(curlen, bl_tree);
						count--;
					}
					send_code(REP_3_6, bl_tree);
					send_bits(count - 3, 2);
				} else if (count <= 10) {
					send_code(REPZ_3_10, bl_tree);
					send_bits(count - 3, 3);
				} else {
					send_code(REPZ_11_138, bl_tree);
					send_bits(count - 11, 7);
				}
				count = 0;
				prevlen = curlen;
				if (nextlen === 0) {
					max_count = 138;
					min_count = 3;
				} else if (curlen == nextlen) {
					max_count = 6;
					min_count = 3;
				} else {
					max_count = 7;
					min_count = 4;
				}
			}
		}

		// Send the header for a block using dynamic Huffman trees: the counts, the
		// lengths of the bit length codes, the literal tree and the distance tree.
		// IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
		function send_all_trees(lcodes, dcodes, blcodes) {
			var rank; // index in bl_order

			send_bits(lcodes - 257, 5); // not +255 as stated in appnote.txt
			send_bits(dcodes - 1, 5);
			send_bits(blcodes - 4, 4); // not -3 as stated in appnote.txt
			for (rank = 0; rank < blcodes; rank++) {
				send_bits(bl_tree[Tree.bl_order[rank] * 2 + 1], 3);
			}
			send_tree(dyn_ltree, lcodes - 1); // literal tree
			send_tree(dyn_dtree, dcodes - 1); // distance tree
		}

		// Flush the bit buffer, keeping at most 7 bits in it.
		function bi_flush() {
			if (bi_valid == 16) {
				put_short(bi_buf);
				bi_buf = 0;
				bi_valid = 0;
			} else if (bi_valid >= 8) {
				put_byte(bi_buf & 0xff);
				bi_buf >>>= 8;
				bi_valid -= 8;
			}
		}

		// Send one empty static block to give enough lookahead for inflate.
		// This takes 10 bits, of which 7 may remain in the bit buffer.
		// The current inflate code requires 9 bits of lookahead. If the
		// last two codes for the previous block (real code plus EOB) were coded
		// on 5 bits or less, inflate may have only 5+3 bits of lookahead to decode
		// the last real code. In this case we send two empty static blocks instead
		// of one. (There are no problems if the previous block is stored or fixed.)
		// To simplify the code, we assume the worst case of last real code encoded
		// on one bit only.
		function _tr_align() {
			send_bits(STATIC_TREES << 1, 3);
			send_code(END_BLOCK, StaticTree.static_ltree);

			bi_flush();

			// Of the 10 bits for the empty block, we have already sent
			// (10 - bi_valid) bits. The lookahead for the last real code (before
			// the EOB of the previous block) was thus at least one plus the length
			// of the EOB plus what we have just sent of the empty static block.
			if (1 + last_eob_len + 10 - bi_valid < 9) {
				send_bits(STATIC_TREES << 1, 3);
				send_code(END_BLOCK, StaticTree.static_ltree);
				bi_flush();
			}
			last_eob_len = 7;
		}

		// Save the match info and tally the frequency counts. Return true if
		// the current block must be flushed.
		function _tr_tally(dist, // distance of matched string
		lc // match length-MIN_MATCH or unmatched char (if dist==0)
		) {
			var out_length, in_length, dcode;
			that.pending_buf[d_buf + last_lit * 2] = (dist >>> 8) & 0xff;
			that.pending_buf[d_buf + last_lit * 2 + 1] = dist & 0xff;

			that.pending_buf[l_buf + last_lit] = lc & 0xff;
			last_lit++;

			if (dist === 0) {
				// lc is the unmatched char
				dyn_ltree[lc * 2]++;
			} else {
				matches++;
				// Here, lc is the match length - MIN_MATCH
				dist--; // dist = match distance - 1
				dyn_ltree[(Tree._length_code[lc] + LITERALS + 1) * 2]++;
				dyn_dtree[Tree.d_code(dist) * 2]++;
			}

			if ((last_lit & 0x1fff) === 0 && level > 2) {
				// Compute an upper bound for the compressed length
				out_length = last_lit * 8;
				in_length = strstart - block_start;
				for (dcode = 0; dcode < D_CODES; dcode++) {
					out_length += dyn_dtree[dcode * 2] * (5 + Tree.extra_dbits[dcode]);
				}
				out_length >>>= 3;
				if ((matches < Math.floor(last_lit / 2)) && out_length < Math.floor(in_length / 2))
					return true;
			}

			return (last_lit == lit_bufsize - 1);
			// We avoid equality with lit_bufsize because of wraparound at 64K
			// on 16 bit machines and because stored blocks are restricted to
			// 64K-1 bytes.
		}

		// Send the block data compressed using the given Huffman trees
		function compress_block(ltree, dtree) {
			var dist; // distance of matched string
			var lc; // match length or unmatched char (if dist === 0)
			var lx = 0; // running index in l_buf
			var code; // the code to send
			var extra; // number of extra bits to send

			if (last_lit !== 0) {
				do {
					dist = ((that.pending_buf[d_buf + lx * 2] << 8) & 0xff00) | (that.pending_buf[d_buf + lx * 2 + 1] & 0xff);
					lc = (that.pending_buf[l_buf + lx]) & 0xff;
					lx++;

					if (dist === 0) {
						send_code(lc, ltree); // send a literal byte
					} else {
						// Here, lc is the match length - MIN_MATCH
						code = Tree._length_code[lc];

						send_code(code + LITERALS + 1, ltree); // send the length
						// code
						extra = Tree.extra_lbits[code];
						if (extra !== 0) {
							lc -= Tree.base_length[code];
							send_bits(lc, extra); // send the extra length bits
						}
						dist--; // dist is now the match distance - 1
						code = Tree.d_code(dist);

						send_code(code, dtree); // send the distance code
						extra = Tree.extra_dbits[code];
						if (extra !== 0) {
							dist -= Tree.base_dist[code];
							send_bits(dist, extra); // send the extra distance bits
						}
					} // literal or match pair ?

					// Check that the overlay between pending_buf and d_buf+l_buf is
					// ok:
				} while (lx < last_lit);
			}

			send_code(END_BLOCK, ltree);
			last_eob_len = ltree[END_BLOCK * 2 + 1];
		}

		// Flush the bit buffer and align the output on a byte boundary
		function bi_windup() {
			if (bi_valid > 8) {
				put_short(bi_buf);
			} else if (bi_valid > 0) {
				put_byte(bi_buf & 0xff);
			}
			bi_buf = 0;
			bi_valid = 0;
		}

		// Copy a stored block, storing first the length and its
		// one's complement if requested.
		function copy_block(buf, // the input data
		len, // its length
		header // true if block header must be written
		) {
			bi_windup(); // align on byte boundary
			last_eob_len = 8; // enough lookahead for inflate

			if (header) {
				put_short(len);
				put_short(~len);
			}

			that.pending_buf.set(window.subarray(buf, buf + len), that.pending);
			that.pending += len;
		}

		// Send a stored block
		function _tr_stored_block(buf, // input block
		stored_len, // length of input block
		eof // true if this is the last block for a file
		) {
			send_bits((STORED_BLOCK << 1) + (eof ? 1 : 0), 3); // send block type
			copy_block(buf, stored_len, true); // with header
		}

		// Determine the best encoding for the current block: dynamic trees, static
		// trees or store, and output the encoded block to the zip file.
		function _tr_flush_block(buf, // input block, or NULL if too old
		stored_len, // length of input block
		eof // true if this is the last block for a file
		) {
			var opt_lenb, static_lenb;// opt_len and static_len in bytes
			var max_blindex = 0; // index of last bit length code of non zero freq

			// Build the Huffman trees unless a stored block is forced
			if (level > 0) {
				// Construct the literal and distance trees
				l_desc.build_tree(that);

				d_desc.build_tree(that);

				// At this point, opt_len and static_len are the total bit lengths
				// of
				// the compressed block data, excluding the tree representations.

				// Build the bit length tree for the above two trees, and get the
				// index
				// in bl_order of the last bit length code to send.
				max_blindex = build_bl_tree();

				// Determine the best encoding. Compute first the block length in
				// bytes
				opt_lenb = (that.opt_len + 3 + 7) >>> 3;
				static_lenb = (that.static_len + 3 + 7) >>> 3;

				if (static_lenb <= opt_lenb)
					opt_lenb = static_lenb;
			} else {
				opt_lenb = static_lenb = stored_len + 5; // force a stored block
			}

			if ((stored_len + 4 <= opt_lenb) && buf != -1) {
				// 4: two words for the lengths
				// The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
				// Otherwise we can't have processed more than WSIZE input bytes
				// since
				// the last block flush, because compression would have been
				// successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
				// transform a block into a stored block.
				_tr_stored_block(buf, stored_len, eof);
			} else if (static_lenb == opt_lenb) {
				send_bits((STATIC_TREES << 1) + (eof ? 1 : 0), 3);
				compress_block(StaticTree.static_ltree, StaticTree.static_dtree);
			} else {
				send_bits((DYN_TREES << 1) + (eof ? 1 : 0), 3);
				send_all_trees(l_desc.max_code + 1, d_desc.max_code + 1, max_blindex + 1);
				compress_block(dyn_ltree, dyn_dtree);
			}

			// The above check is made mod 2^32, for files larger than 512 MB
			// and uLong implemented on 32 bits.

			init_block();

			if (eof) {
				bi_windup();
			}
		}

		function flush_block_only(eof) {
			_tr_flush_block(block_start >= 0 ? block_start : -1, strstart - block_start, eof);
			block_start = strstart;
			strm.flush_pending();
		}

		// Fill the window when the lookahead becomes insufficient.
		// Updates strstart and lookahead.
		//
		// IN assertion: lookahead < MIN_LOOKAHEAD
		// OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
		// At least one byte has been read, or avail_in === 0; reads are
		// performed for at least two bytes (required for the zip translate_eol
		// option -- not supported here).
		function fill_window() {
			var n, m;
			var p;
			var more; // Amount of free space at the end of the window.

			do {
				more = (window_size - lookahead - strstart);

				// Deal with !@#$% 64K limit:
				if (more === 0 && strstart === 0 && lookahead === 0) {
					more = w_size;
				} else if (more == -1) {
					// Very unlikely, but possible on 16 bit machine if strstart ==
					// 0
					// and lookahead == 1 (input done one byte at time)
					more--;

					// If the window is almost full and there is insufficient
					// lookahead,
					// move the upper half to the lower one to make room in the
					// upper half.
				} else if (strstart >= w_size + w_size - MIN_LOOKAHEAD) {
					window.set(window.subarray(w_size, w_size + w_size), 0);

					match_start -= w_size;
					strstart -= w_size; // we now have strstart >= MAX_DIST
					block_start -= w_size;

					// Slide the hash table (could be avoided with 32 bit values
					// at the expense of memory usage). We slide even when level ==
					// 0
					// to keep the hash table consistent if we switch back to level
					// > 0
					// later. (Using level 0 permanently is not an optimal usage of
					// zlib, so we don't care about this pathological case.)

					n = hash_size;
					p = n;
					do {
						m = (head[--p] & 0xffff);
						head[p] = (m >= w_size ? m - w_size : 0);
					} while (--n !== 0);

					n = w_size;
					p = n;
					do {
						m = (prev[--p] & 0xffff);
						prev[p] = (m >= w_size ? m - w_size : 0);
						// If n is not on any hash chain, prev[n] is garbage but
						// its value will never be used.
					} while (--n !== 0);
					more += w_size;
				}

				if (strm.avail_in === 0)
					return;

				// If there was no sliding:
				// strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
				// more == window_size - lookahead - strstart
				// => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
				// => more >= window_size - 2*WSIZE + 2
				// In the BIG_MEM or MMAP case (not yet supported),
				// window_size == input_size + MIN_LOOKAHEAD &&
				// strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
				// Otherwise, window_size == 2*WSIZE so more >= 2.
				// If there was sliding, more >= WSIZE. So in all cases, more >= 2.

				n = strm.read_buf(window, strstart + lookahead, more);
				lookahead += n;

				// Initialize the hash value now that we have some input:
				if (lookahead >= MIN_MATCH) {
					ins_h = window[strstart] & 0xff;
					ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
				}
				// If the whole input has less than MIN_MATCH bytes, ins_h is
				// garbage,
				// but this is not important since only literal bytes will be
				// emitted.
			} while (lookahead < MIN_LOOKAHEAD && strm.avail_in !== 0);
		}

		// Copy without compression as much as possible from the input stream,
		// return
		// the current block state.
		// This function does not insert new strings in the dictionary since
		// uncompressible data is probably not useful. This function is used
		// only for the level=0 compression option.
		// NOTE: this function should be optimized to avoid extra copying from
		// window to pending_buf.
		function deflate_stored(flush) {
			// Stored blocks are limited to 0xffff bytes, pending_buf is limited
			// to pending_buf_size, and each stored block has a 5 byte header:

			var max_block_size = 0xffff;
			var max_start;

			if (max_block_size > pending_buf_size - 5) {
				max_block_size = pending_buf_size - 5;
			}

			// Copy as much as possible from input to output:
			while (true) {
				// Fill the window as much as possible:
				if (lookahead <= 1) {
					fill_window();
					if (lookahead === 0 && flush == Z_NO_FLUSH)
						return NeedMore;
					if (lookahead === 0)
						break; // flush the current block
				}

				strstart += lookahead;
				lookahead = 0;

				// Emit a stored block if pending_buf will be full:
				max_start = block_start + max_block_size;
				if (strstart === 0 || strstart >= max_start) {
					// strstart === 0 is possible when wraparound on 16-bit machine
					lookahead = (strstart - max_start);
					strstart = max_start;

					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;

				}

				// Flush if we may have to slide, otherwise block_start may become
				// negative and the data will be gone:
				if (strstart - block_start >= w_size - MIN_LOOKAHEAD) {
					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;
				}
			}

			flush_block_only(flush == Z_FINISH);
			if (strm.avail_out === 0)
				return (flush == Z_FINISH) ? FinishStarted : NeedMore;

			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		function longest_match(cur_match) {
			var chain_length = max_chain_length; // max hash chain length
			var scan = strstart; // current string
			var match; // matched string
			var len; // length of current match
			var best_len = prev_length; // best match length so far
			var limit = strstart > (w_size - MIN_LOOKAHEAD) ? strstart - (w_size - MIN_LOOKAHEAD) : 0;
			var _nice_match = nice_match;

			// Stop when cur_match becomes <= limit. To simplify the code,
			// we prevent matches with the string of window index 0.

			var wmask = w_mask;

			var strend = strstart + MAX_MATCH;
			var scan_end1 = window[scan + best_len - 1];
			var scan_end = window[scan + best_len];

			// The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of
			// 16.
			// It is easy to get rid of this optimization if necessary.

			// Do not waste too much time if we already have a good match:
			if (prev_length >= good_match) {
				chain_length >>= 2;
			}

			// Do not look for matches beyond the end of the input. This is
			// necessary
			// to make deflate deterministic.
			if (_nice_match > lookahead)
				_nice_match = lookahead;

			do {
				match = cur_match;

				// Skip to next match if the match length cannot increase
				// or if the match length is less than 2:
				if (window[match + best_len] != scan_end || window[match + best_len - 1] != scan_end1 || window[match] != window[scan]
						|| window[++match] != window[scan + 1])
					continue;

				// The check at best_len-1 can be removed because it will be made
				// again later. (This heuristic is not always a win.)
				// It is not necessary to compare scan[2] and match[2] since they
				// are always equal when the other bytes match, given that
				// the hash keys are equal and that HASH_BITS >= 8.
				scan += 2;
				match++;

				// We check for insufficient lookahead only every 8th comparison;
				// the 256th check will be made at strstart+258.
				do {
				} while (window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
						&& window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
						&& window[++scan] == window[++match] && window[++scan] == window[++match] && scan < strend);

				len = MAX_MATCH - (strend - scan);
				scan = strend - MAX_MATCH;

				if (len > best_len) {
					match_start = cur_match;
					best_len = len;
					if (len >= _nice_match)
						break;
					scan_end1 = window[scan + best_len - 1];
					scan_end = window[scan + best_len];
				}

			} while ((cur_match = (prev[cur_match & wmask] & 0xffff)) > limit && --chain_length !== 0);

			if (best_len <= lookahead)
				return best_len;
			return lookahead;
		}

		// Compress as much as possible from the input stream, return the current
		// block state.
		// This function does not perform lazy evaluation of matches and inserts
		// new strings in the dictionary only for unmatched strings or for short
		// matches. It is used only for the fast compression options.
		function deflate_fast(flush) {
			// short hash_head = 0; // head of the hash chain
			var hash_head = 0; // head of the hash chain
			var bflush; // set if current block must be flushed

			while (true) {
				// Make sure that we always have enough lookahead, except
				// at the end of the input file. We need MAX_MATCH bytes
				// for the next match, plus MIN_MATCH bytes to insert the
				// string following the next match.
				if (lookahead < MIN_LOOKAHEAD) {
					fill_window();
					if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
						return NeedMore;
					}
					if (lookahead === 0)
						break; // flush the current block
				}

				// Insert the string window[strstart .. strstart+2] in the
				// dictionary, and set hash_head to the head of the hash chain:
				if (lookahead >= MIN_MATCH) {
					ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;

					// prev[strstart&w_mask]=hash_head=head[ins_h];
					hash_head = (head[ins_h] & 0xffff);
					prev[strstart & w_mask] = head[ins_h];
					head[ins_h] = strstart;
				}

				// Find the longest match, discarding those <= prev_length.
				// At this point we have always match_length < MIN_MATCH

				if (hash_head !== 0 && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
					// To simplify the code, we prevent matches with the string
					// of window index 0 (in particular we have to avoid a match
					// of the string with itself at the start of the input file).
					if (strategy != Z_HUFFMAN_ONLY) {
						match_length = longest_match(hash_head);
					}
					// longest_match() sets match_start
				}
				if (match_length >= MIN_MATCH) {
					// check_match(strstart, match_start, match_length);

					bflush = _tr_tally(strstart - match_start, match_length - MIN_MATCH);

					lookahead -= match_length;

					// Insert new strings in the hash table only if the match length
					// is not too large. This saves time but degrades compression.
					if (match_length <= max_lazy_match && lookahead >= MIN_MATCH) {
						match_length--; // string at strstart already in hash table
						do {
							strstart++;

							ins_h = ((ins_h << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
							// prev[strstart&w_mask]=hash_head=head[ins_h];
							hash_head = (head[ins_h] & 0xffff);
							prev[strstart & w_mask] = head[ins_h];
							head[ins_h] = strstart;

							// strstart never exceeds WSIZE-MAX_MATCH, so there are
							// always MIN_MATCH bytes ahead.
						} while (--match_length !== 0);
						strstart++;
					} else {
						strstart += match_length;
						match_length = 0;
						ins_h = window[strstart] & 0xff;

						ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
						// If lookahead < MIN_MATCH, ins_h is garbage, but it does
						// not
						// matter since it will be recomputed at next deflate call.
					}
				} else {
					// No match, output a literal byte

					bflush = _tr_tally(0, window[strstart] & 0xff);
					lookahead--;
					strstart++;
				}
				if (bflush) {

					flush_block_only(false);
					if (strm.avail_out === 0)
						return NeedMore;
				}
			}

			flush_block_only(flush == Z_FINISH);
			if (strm.avail_out === 0) {
				if (flush == Z_FINISH)
					return FinishStarted;
				else
					return NeedMore;
			}
			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		// Same as above, but achieves better compression. We use a lazy
		// evaluation for matches: a match is finally adopted only if there is
		// no better match at the next window position.
		function deflate_slow(flush) {
			// short hash_head = 0; // head of hash chain
			var hash_head = 0; // head of hash chain
			var bflush; // set if current block must be flushed
			var max_insert;

			// Process the input block.
			while (true) {
				// Make sure that we always have enough lookahead, except
				// at the end of the input file. We need MAX_MATCH bytes
				// for the next match, plus MIN_MATCH bytes to insert the
				// string following the next match.

				if (lookahead < MIN_LOOKAHEAD) {
					fill_window();
					if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
						return NeedMore;
					}
					if (lookahead === 0)
						break; // flush the current block
				}

				// Insert the string window[strstart .. strstart+2] in the
				// dictionary, and set hash_head to the head of the hash chain:

				if (lookahead >= MIN_MATCH) {
					ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
					// prev[strstart&w_mask]=hash_head=head[ins_h];
					hash_head = (head[ins_h] & 0xffff);
					prev[strstart & w_mask] = head[ins_h];
					head[ins_h] = strstart;
				}

				// Find the longest match, discarding those <= prev_length.
				prev_length = match_length;
				prev_match = match_start;
				match_length = MIN_MATCH - 1;

				if (hash_head !== 0 && prev_length < max_lazy_match && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
					// To simplify the code, we prevent matches with the string
					// of window index 0 (in particular we have to avoid a match
					// of the string with itself at the start of the input file).

					if (strategy != Z_HUFFMAN_ONLY) {
						match_length = longest_match(hash_head);
					}
					// longest_match() sets match_start

					if (match_length <= 5 && (strategy == Z_FILTERED || (match_length == MIN_MATCH && strstart - match_start > 4096))) {

						// If prev_match is also MIN_MATCH, match_start is garbage
						// but we will ignore the current match anyway.
						match_length = MIN_MATCH - 1;
					}
				}

				// If there was a match at the previous step and the current
				// match is not better, output the previous match:
				if (prev_length >= MIN_MATCH && match_length <= prev_length) {
					max_insert = strstart + lookahead - MIN_MATCH;
					// Do not insert strings in hash table beyond this.

					// check_match(strstart-1, prev_match, prev_length);

					bflush = _tr_tally(strstart - 1 - prev_match, prev_length - MIN_MATCH);

					// Insert in hash table all strings up to the end of the match.
					// strstart-1 and strstart are already inserted. If there is not
					// enough lookahead, the last two strings are not inserted in
					// the hash table.
					lookahead -= prev_length - 1;
					prev_length -= 2;
					do {
						if (++strstart <= max_insert) {
							ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
							// prev[strstart&w_mask]=hash_head=head[ins_h];
							hash_head = (head[ins_h] & 0xffff);
							prev[strstart & w_mask] = head[ins_h];
							head[ins_h] = strstart;
						}
					} while (--prev_length !== 0);
					match_available = 0;
					match_length = MIN_MATCH - 1;
					strstart++;

					if (bflush) {
						flush_block_only(false);
						if (strm.avail_out === 0)
							return NeedMore;
					}
				} else if (match_available !== 0) {

					// If there was no match at the previous position, output a
					// single literal. If there was a match but the current match
					// is longer, truncate the previous match to a single literal.

					bflush = _tr_tally(0, window[strstart - 1] & 0xff);

					if (bflush) {
						flush_block_only(false);
					}
					strstart++;
					lookahead--;
					if (strm.avail_out === 0)
						return NeedMore;
				} else {
					// There is no previous match to compare with, wait for
					// the next step to decide.

					match_available = 1;
					strstart++;
					lookahead--;
				}
			}

			if (match_available !== 0) {
				bflush = _tr_tally(0, window[strstart - 1] & 0xff);
				match_available = 0;
			}
			flush_block_only(flush == Z_FINISH);

			if (strm.avail_out === 0) {
				if (flush == Z_FINISH)
					return FinishStarted;
				else
					return NeedMore;
			}

			return flush == Z_FINISH ? FinishDone : BlockDone;
		}

		function deflateReset(strm) {
			strm.total_in = strm.total_out = 0;
			strm.msg = null; //
			
			that.pending = 0;
			that.pending_out = 0;

			status = BUSY_STATE;

			last_flush = Z_NO_FLUSH;

			tr_init();
			lm_init();
			return Z_OK;
		}

		that.deflateInit = function(strm, _level, bits, _method, memLevel, _strategy) {
			if (!_method)
				_method = Z_DEFLATED;
			if (!memLevel)
				memLevel = DEF_MEM_LEVEL;
			if (!_strategy)
				_strategy = Z_DEFAULT_STRATEGY;

			// byte[] my_version=ZLIB_VERSION;

			//
			// if (!version || version[0] != my_version[0]
			// || stream_size != sizeof(z_stream)) {
			// return Z_VERSION_ERROR;
			// }

			strm.msg = null;

			if (_level == Z_DEFAULT_COMPRESSION)
				_level = 6;

			if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || _method != Z_DEFLATED || bits < 9 || bits > 15 || _level < 0 || _level > 9 || _strategy < 0
					|| _strategy > Z_HUFFMAN_ONLY) {
				return Z_STREAM_ERROR;
			}

			strm.dstate = that;

			w_bits = bits;
			w_size = 1 << w_bits;
			w_mask = w_size - 1;

			hash_bits = memLevel + 7;
			hash_size = 1 << hash_bits;
			hash_mask = hash_size - 1;
			hash_shift = Math.floor((hash_bits + MIN_MATCH - 1) / MIN_MATCH);

			window = new Uint8Array(w_size * 2);
			prev = [];
			head = [];

			lit_bufsize = 1 << (memLevel + 6); // 16K elements by default

			// We overlay pending_buf and d_buf+l_buf. This works since the average
			// output size for (length,distance) codes is <= 24 bits.
			that.pending_buf = new Uint8Array(lit_bufsize * 4);
			pending_buf_size = lit_bufsize * 4;

			d_buf = Math.floor(lit_bufsize / 2);
			l_buf = (1 + 2) * lit_bufsize;

			level = _level;

			strategy = _strategy;
			method = _method & 0xff;

			return deflateReset(strm);
		};

		that.deflateEnd = function() {
			if (status != INIT_STATE && status != BUSY_STATE && status != FINISH_STATE) {
				return Z_STREAM_ERROR;
			}
			// Deallocate in reverse order of allocations:
			that.pending_buf = null;
			head = null;
			prev = null;
			window = null;
			// free
			that.dstate = null;
			return status == BUSY_STATE ? Z_DATA_ERROR : Z_OK;
		};

		that.deflateParams = function(strm, _level, _strategy) {
			var err = Z_OK;

			if (_level == Z_DEFAULT_COMPRESSION) {
				_level = 6;
			}
			if (_level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
				return Z_STREAM_ERROR;
			}

			if (config_table[level].func != config_table[_level].func && strm.total_in !== 0) {
				// Flush the last buffer:
				err = strm.deflate(Z_PARTIAL_FLUSH);
			}

			if (level != _level) {
				level = _level;
				max_lazy_match = config_table[level].max_lazy;
				good_match = config_table[level].good_length;
				nice_match = config_table[level].nice_length;
				max_chain_length = config_table[level].max_chain;
			}
			strategy = _strategy;
			return err;
		};

		that.deflateSetDictionary = function(strm, dictionary, dictLength) {
			var length = dictLength;
			var n, index = 0;

			if (!dictionary || status != INIT_STATE)
				return Z_STREAM_ERROR;

			if (length < MIN_MATCH)
				return Z_OK;
			if (length > w_size - MIN_LOOKAHEAD) {
				length = w_size - MIN_LOOKAHEAD;
				index = dictLength - length; // use the tail of the dictionary
			}
			window.set(dictionary.subarray(index, index + length), 0);

			strstart = length;
			block_start = length;

			// Insert all strings in the hash table (except for the last two bytes).
			// s->lookahead stays null, so s->ins_h will be recomputed at the next
			// call of fill_window.

			ins_h = window[0] & 0xff;
			ins_h = (((ins_h) << hash_shift) ^ (window[1] & 0xff)) & hash_mask;

			for (n = 0; n <= length - MIN_MATCH; n++) {
				ins_h = (((ins_h) << hash_shift) ^ (window[(n) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
				prev[n & w_mask] = head[ins_h];
				head[ins_h] = n;
			}
			return Z_OK;
		};

		that.deflate = function(_strm, flush) {
			var i, header, level_flags, old_flush, bstate;

			if (flush > Z_FINISH || flush < 0) {
				return Z_STREAM_ERROR;
			}

			if (!_strm.next_out || (!_strm.next_in && _strm.avail_in !== 0) || (status == FINISH_STATE && flush != Z_FINISH)) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_STREAM_ERROR)];
				return Z_STREAM_ERROR;
			}
			if (_strm.avail_out === 0) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			strm = _strm; // just in case
			old_flush = last_flush;
			last_flush = flush;

			// Write the zlib header
			if (status == INIT_STATE) {
				header = (Z_DEFLATED + ((w_bits - 8) << 4)) << 8;
				level_flags = ((level - 1) & 0xff) >> 1;

				if (level_flags > 3)
					level_flags = 3;
				header |= (level_flags << 6);
				if (strstart !== 0)
					header |= PRESET_DICT;
				header += 31 - (header % 31);

				status = BUSY_STATE;
				putShortMSB(header);
			}

			// Flush as much pending output as possible
			if (that.pending !== 0) {
				strm.flush_pending();
				if (strm.avail_out === 0) {
					// console.log(" avail_out==0");
					// Since avail_out is 0, deflate will be called again with
					// more output space, but possibly with both pending and
					// avail_in equal to zero. There won't be anything to do,
					// but this is not an error situation so make sure we
					// return OK instead of BUF_ERROR at next call of deflate:
					last_flush = -1;
					return Z_OK;
				}

				// Make sure there is something to do and avoid duplicate
				// consecutive
				// flushes. For repeated and useless calls with Z_FINISH, we keep
				// returning Z_STREAM_END instead of Z_BUFF_ERROR.
			} else if (strm.avail_in === 0 && flush <= old_flush && flush != Z_FINISH) {
				strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			// User must not provide more input after the first FINISH:
			if (status == FINISH_STATE && strm.avail_in !== 0) {
				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
				return Z_BUF_ERROR;
			}

			// Start a new block or continue the current one.
			if (strm.avail_in !== 0 || lookahead !== 0 || (flush != Z_NO_FLUSH && status != FINISH_STATE)) {
				bstate = -1;
				switch (config_table[level].func) {
				case STORED:
					bstate = deflate_stored(flush);
					break;
				case FAST:
					bstate = deflate_fast(flush);
					break;
				case SLOW:
					bstate = deflate_slow(flush);
					break;
				default:
				}

				if (bstate == FinishStarted || bstate == FinishDone) {
					status = FINISH_STATE;
				}
				if (bstate == NeedMore || bstate == FinishStarted) {
					if (strm.avail_out === 0) {
						last_flush = -1; // avoid BUF_ERROR next call, see above
					}
					return Z_OK;
					// If flush != Z_NO_FLUSH && avail_out === 0, the next call
					// of deflate should use the same flush parameter to make sure
					// that the flush is complete. So we don't have to output an
					// empty block here, this will be done at next call. This also
					// ensures that for a very small output buffer, we emit at most
					// one empty block.
				}

				if (bstate == BlockDone) {
					if (flush == Z_PARTIAL_FLUSH) {
						_tr_align();
					} else { // FULL_FLUSH or SYNC_FLUSH
						_tr_stored_block(0, 0, false);
						// For a full flush, this empty block will be recognized
						// as a special marker by inflate_sync().
						if (flush == Z_FULL_FLUSH) {
							// state.head[s.hash_size-1]=0;
							for (i = 0; i < hash_size/*-1*/; i++)
								// forget history
								head[i] = 0;
						}
					}
					strm.flush_pending();
					if (strm.avail_out === 0) {
						last_flush = -1; // avoid BUF_ERROR at next call, see above
						return Z_OK;
					}
				}
			}

			if (flush != Z_FINISH)
				return Z_OK;
			return Z_STREAM_END;
		};
	}

	// ZStream

	function ZStream() {
		var that = this;
		that.next_in_index = 0;
		that.next_out_index = 0;
		// that.next_in; // next input byte
		that.avail_in = 0; // number of bytes available at next_in
		that.total_in = 0; // total nb of input bytes read so far
		// that.next_out; // next output byte should be put there
		that.avail_out = 0; // remaining free space at next_out
		that.total_out = 0; // total nb of bytes output so far
		// that.msg;
		// that.dstate;
	}

	ZStream.prototype = {
		deflateInit : function(level, bits) {
			var that = this;
			that.dstate = new Deflate();
			if (!bits)
				bits = MAX_BITS;
			return that.dstate.deflateInit(that, level, bits);
		},

		deflate : function(flush) {
			var that = this;
			if (!that.dstate) {
				return Z_STREAM_ERROR;
			}
			return that.dstate.deflate(that, flush);
		},

		deflateEnd : function() {
			var that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			var ret = that.dstate.deflateEnd();
			that.dstate = null;
			return ret;
		},

		deflateParams : function(level, strategy) {
			var that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			return that.dstate.deflateParams(that, level, strategy);
		},

		deflateSetDictionary : function(dictionary, dictLength) {
			var that = this;
			if (!that.dstate)
				return Z_STREAM_ERROR;
			return that.dstate.deflateSetDictionary(that, dictionary, dictLength);
		},

		// Read a new buffer from the current input stream, update the
		// total number of bytes read. All deflate() input goes through
		// this function so some applications may wish to modify it to avoid
		// allocating a large strm->next_in buffer and copying from it.
		// (See also flush_pending()).
		read_buf : function(buf, start, size) {
			var that = this;
			var len = that.avail_in;
			if (len > size)
				len = size;
			if (len === 0)
				return 0;
			that.avail_in -= len;
			buf.set(that.next_in.subarray(that.next_in_index, that.next_in_index + len), start);
			that.next_in_index += len;
			that.total_in += len;
			return len;
		},

		// Flush as much pending output as possible. All deflate() output goes
		// through this function so some applications may wish to modify it
		// to avoid allocating a large strm->next_out buffer and copying into it.
		// (See also read_buf()).
		flush_pending : function() {
			var that = this;
			var len = that.dstate.pending;

			if (len > that.avail_out)
				len = that.avail_out;
			if (len === 0)
				return;

			// if (that.dstate.pending_buf.length <= that.dstate.pending_out || that.next_out.length <= that.next_out_index
			// || that.dstate.pending_buf.length < (that.dstate.pending_out + len) || that.next_out.length < (that.next_out_index +
			// len)) {
			// console.log(that.dstate.pending_buf.length + ", " + that.dstate.pending_out + ", " + that.next_out.length + ", " +
			// that.next_out_index + ", " + len);
			// console.log("avail_out=" + that.avail_out);
			// }

			that.next_out.set(that.dstate.pending_buf.subarray(that.dstate.pending_out, that.dstate.pending_out + len), that.next_out_index);

			that.next_out_index += len;
			that.dstate.pending_out += len;
			that.total_out += len;
			that.avail_out -= len;
			that.dstate.pending -= len;
			if (that.dstate.pending === 0) {
				that.dstate.pending_out = 0;
			}
		}
	};

	// Deflater

	function Deflater(level) {
		var that = this;
		var z = new ZStream();
		var bufsize = 512;
		var flush = Z_NO_FLUSH;
		var buf = new Uint8Array(bufsize);

		if (typeof level == "undefined")
			level = Z_DEFAULT_COMPRESSION;
		z.deflateInit(level);
		z.next_out = buf;

		that.append = function(data, onprogress) {
			var err, buffers = [], lastIndex = 0, bufferIndex = 0, bufferSize = 0, array;
			if (!data.length)
				return;
			z.next_in_index = 0;
			z.next_in = data;
			z.avail_in = data.length;
			do {
				z.next_out_index = 0;
				z.avail_out = bufsize;
				err = z.deflate(flush);
				if (err != Z_OK)
					throw "deflating: " + z.msg;
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
			var err, buffers = [], bufferIndex = 0, bufferSize = 0, array;
			do {
				z.next_out_index = 0;
				z.avail_out = bufsize;
				err = z.deflate(Z_FINISH);
				if (err != Z_STREAM_END && err != Z_OK)
					throw "deflating: " + z.msg;
				if (bufsize - z.avail_out > 0)
					buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
				bufferSize += z.next_out_index;
			} while (z.avail_in > 0 || z.avail_out === 0);
			z.deflateEnd();
			array = new Uint8Array(bufferSize);
			buffers.forEach(function(chunk) {
				array.set(chunk, bufferIndex);
				bufferIndex += chunk.length;
			});
			return array;
		};
	}

	var deflater;

	if (obj.zip)
		obj.zip.Deflater = Deflater;
	else {
		deflater = new Deflater();
		obj.addEventListener("message", function(event) {
			var message = event.data;
			if (message.init) {
				deflater = new Deflater(message.level);
				obj.postMessage({
					oninit : true
				});
			}
			if (message.append)
				obj.postMessage({
					onappend : true,
					data : deflater.append(message.data, function(current) {
						obj.postMessage({
							progress : true,
							current : current
						});
					})
				});
			if (message.flush)
				obj.postMessage({
					onflush : true,
					data : deflater.flush()
				});
		}, false);
	}

})(self);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjhjN2I2ZmJiMTljY2M5OTYyNWUud29ya2VyLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDI4YzdiNmZiYjE5Y2NjOTk2MjVlIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL1RoaXJkUGFydHkvV29ya2Vycy9kZWZsYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImRpc3QvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMjhjN2I2ZmJiMTljY2M5OTYyNWUiLCIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzIEdpbGRhcyBMb3JtZWF1LiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5cclxuIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxyXG4gbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcblxyXG4gMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxyXG4gdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuXHJcbiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBcclxuIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiBcclxuIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG5cclxuIDMuIFRoZSBuYW1lcyBvZiB0aGUgYXV0aG9ycyBtYXkgbm90IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzXHJcbiBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuXHJcbiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIGBgQVMgSVMnJyBBTkQgQU5ZIEVYUFJFU1NFRCBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsXHJcbiBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgSkNSQUZULFxyXG4gSU5DLiBPUiBBTlkgQ09OVFJJQlVUT1JTIFRPIFRISVMgU09GVFdBUkUgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCxcclxuIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcclxuIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLFxyXG4gT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSxcclxuIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcbiAqL1xyXG5cclxuLypcclxuICogVGhpcyBwcm9ncmFtIGlzIGJhc2VkIG9uIEpabGliIDEuMC4yIHltbmssIEpDcmFmdCxJbmMuXHJcbiAqIEpabGliIGlzIGJhc2VkIG9uIHpsaWItMS4xLjMsIHNvIGFsbCBjcmVkaXQgc2hvdWxkIGdvIGF1dGhvcnNcclxuICogSmVhbi1sb3VwIEdhaWxseShqbG91cEBnemlwLm9yZykgYW5kIE1hcmsgQWRsZXIobWFkbGVyQGFsdW1uaS5jYWx0ZWNoLmVkdSlcclxuICogYW5kIGNvbnRyaWJ1dG9ycyBvZiB6bGliLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbihvYmopIHtcclxuXHJcblx0Ly8gR2xvYmFsXHJcblxyXG5cdHZhciBNQVhfQklUUyA9IDE1O1xyXG5cdHZhciBEX0NPREVTID0gMzA7XHJcblx0dmFyIEJMX0NPREVTID0gMTk7XHJcblxyXG5cdHZhciBMRU5HVEhfQ09ERVMgPSAyOTtcclxuXHR2YXIgTElURVJBTFMgPSAyNTY7XHJcblx0dmFyIExfQ09ERVMgPSAoTElURVJBTFMgKyAxICsgTEVOR1RIX0NPREVTKTtcclxuXHR2YXIgSEVBUF9TSVpFID0gKDIgKiBMX0NPREVTICsgMSk7XHJcblxyXG5cdHZhciBFTkRfQkxPQ0sgPSAyNTY7XHJcblxyXG5cdC8vIEJpdCBsZW5ndGggY29kZXMgbXVzdCBub3QgZXhjZWVkIE1BWF9CTF9CSVRTIGJpdHNcclxuXHR2YXIgTUFYX0JMX0JJVFMgPSA3O1xyXG5cclxuXHQvLyByZXBlYXQgcHJldmlvdXMgYml0IGxlbmd0aCAzLTYgdGltZXMgKDIgYml0cyBvZiByZXBlYXQgY291bnQpXHJcblx0dmFyIFJFUF8zXzYgPSAxNjtcclxuXHJcblx0Ly8gcmVwZWF0IGEgemVybyBsZW5ndGggMy0xMCB0aW1lcyAoMyBiaXRzIG9mIHJlcGVhdCBjb3VudClcclxuXHR2YXIgUkVQWl8zXzEwID0gMTc7XHJcblxyXG5cdC8vIHJlcGVhdCBhIHplcm8gbGVuZ3RoIDExLTEzOCB0aW1lcyAoNyBiaXRzIG9mIHJlcGVhdCBjb3VudClcclxuXHR2YXIgUkVQWl8xMV8xMzggPSAxODtcclxuXHJcblx0Ly8gVGhlIGxlbmd0aHMgb2YgdGhlIGJpdCBsZW5ndGggY29kZXMgYXJlIHNlbnQgaW4gb3JkZXIgb2YgZGVjcmVhc2luZ1xyXG5cdC8vIHByb2JhYmlsaXR5LCB0byBhdm9pZCB0cmFuc21pdHRpbmcgdGhlIGxlbmd0aHMgZm9yIHVudXNlZCBiaXRcclxuXHQvLyBsZW5ndGggY29kZXMuXHJcblxyXG5cdHZhciBCdWZfc2l6ZSA9IDggKiAyO1xyXG5cclxuXHQvLyBKWmxpYiB2ZXJzaW9uIDogXCIxLjAuMlwiXHJcblx0dmFyIFpfREVGQVVMVF9DT01QUkVTU0lPTiA9IC0xO1xyXG5cclxuXHQvLyBjb21wcmVzc2lvbiBzdHJhdGVneVxyXG5cdHZhciBaX0ZJTFRFUkVEID0gMTtcclxuXHR2YXIgWl9IVUZGTUFOX09OTFkgPSAyO1xyXG5cdHZhciBaX0RFRkFVTFRfU1RSQVRFR1kgPSAwO1xyXG5cclxuXHR2YXIgWl9OT19GTFVTSCA9IDA7XHJcblx0dmFyIFpfUEFSVElBTF9GTFVTSCA9IDE7XHJcblx0dmFyIFpfRlVMTF9GTFVTSCA9IDM7XHJcblx0dmFyIFpfRklOSVNIID0gNDtcclxuXHJcblx0dmFyIFpfT0sgPSAwO1xyXG5cdHZhciBaX1NUUkVBTV9FTkQgPSAxO1xyXG5cdHZhciBaX05FRURfRElDVCA9IDI7XHJcblx0dmFyIFpfU1RSRUFNX0VSUk9SID0gLTI7XHJcblx0dmFyIFpfREFUQV9FUlJPUiA9IC0zO1xyXG5cdHZhciBaX0JVRl9FUlJPUiA9IC01O1xyXG5cclxuXHQvLyBUcmVlXHJcblxyXG5cdC8vIHNlZSBkZWZpbml0aW9uIG9mIGFycmF5IGRpc3RfY29kZSBiZWxvd1xyXG5cdHZhciBfZGlzdF9jb2RlID0gWyAwLCAxLCAyLCAzLCA0LCA0LCA1LCA1LCA2LCA2LCA2LCA2LCA3LCA3LCA3LCA3LCA4LCA4LCA4LCA4LCA4LCA4LCA4LCA4LCA5LCA5LCA5LCA5LCA5LCA5LCA5LCA5LCAxMCwgMTAsIDEwLCAxMCwgMTAsIDEwLCAxMCwgMTAsIDEwLCAxMCxcclxuXHRcdFx0MTAsIDEwLCAxMCwgMTAsIDEwLCAxMCwgMTEsIDExLCAxMSwgMTEsIDExLCAxMSwgMTEsIDExLCAxMSwgMTEsIDExLCAxMSwgMTEsIDExLCAxMSwgMTEsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsXHJcblx0XHRcdDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLFxyXG5cdFx0XHQxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCxcclxuXHRcdFx0MTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsXHJcblx0XHRcdDE0LCAxNCwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LFxyXG5cdFx0XHQxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDAsIDAsIDE2LCAxNywgMTgsIDE4LCAxOSwgMTksXHJcblx0XHRcdDIwLCAyMCwgMjAsIDIwLCAyMSwgMjEsIDIxLCAyMSwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LFxyXG5cdFx0XHQyNCwgMjQsIDI0LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNixcclxuXHRcdFx0MjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsXHJcblx0XHRcdDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LFxyXG5cdFx0XHQyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOSxcclxuXHRcdFx0MjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksXHJcblx0XHRcdDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSBdO1xyXG5cclxuXHRmdW5jdGlvbiBUcmVlKCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdC8vIGR5bl90cmVlOyAvLyB0aGUgZHluYW1pYyB0cmVlXHJcblx0XHQvLyBtYXhfY29kZTsgLy8gbGFyZ2VzdCBjb2RlIHdpdGggbm9uIHplcm8gZnJlcXVlbmN5XHJcblx0XHQvLyBzdGF0X2Rlc2M7IC8vIHRoZSBjb3JyZXNwb25kaW5nIHN0YXRpYyB0cmVlXHJcblxyXG5cdFx0Ly8gQ29tcHV0ZSB0aGUgb3B0aW1hbCBiaXQgbGVuZ3RocyBmb3IgYSB0cmVlIGFuZCB1cGRhdGUgdGhlIHRvdGFsIGJpdFxyXG5cdFx0Ly8gbGVuZ3RoXHJcblx0XHQvLyBmb3IgdGhlIGN1cnJlbnQgYmxvY2suXHJcblx0XHQvLyBJTiBhc3NlcnRpb246IHRoZSBmaWVsZHMgZnJlcSBhbmQgZGFkIGFyZSBzZXQsIGhlYXBbaGVhcF9tYXhdIGFuZFxyXG5cdFx0Ly8gYWJvdmUgYXJlIHRoZSB0cmVlIG5vZGVzIHNvcnRlZCBieSBpbmNyZWFzaW5nIGZyZXF1ZW5jeS5cclxuXHRcdC8vIE9VVCBhc3NlcnRpb25zOiB0aGUgZmllbGQgbGVuIGlzIHNldCB0byB0aGUgb3B0aW1hbCBiaXQgbGVuZ3RoLCB0aGVcclxuXHRcdC8vIGFycmF5IGJsX2NvdW50IGNvbnRhaW5zIHRoZSBmcmVxdWVuY2llcyBmb3IgZWFjaCBiaXQgbGVuZ3RoLlxyXG5cdFx0Ly8gVGhlIGxlbmd0aCBvcHRfbGVuIGlzIHVwZGF0ZWQ7IHN0YXRpY19sZW4gaXMgYWxzbyB1cGRhdGVkIGlmIHN0cmVlIGlzXHJcblx0XHQvLyBub3QgbnVsbC5cclxuXHRcdGZ1bmN0aW9uIGdlbl9iaXRsZW4ocykge1xyXG5cdFx0XHR2YXIgdHJlZSA9IHRoYXQuZHluX3RyZWU7XHJcblx0XHRcdHZhciBzdHJlZSA9IHRoYXQuc3RhdF9kZXNjLnN0YXRpY190cmVlO1xyXG5cdFx0XHR2YXIgZXh0cmEgPSB0aGF0LnN0YXRfZGVzYy5leHRyYV9iaXRzO1xyXG5cdFx0XHR2YXIgYmFzZSA9IHRoYXQuc3RhdF9kZXNjLmV4dHJhX2Jhc2U7XHJcblx0XHRcdHZhciBtYXhfbGVuZ3RoID0gdGhhdC5zdGF0X2Rlc2MubWF4X2xlbmd0aDtcclxuXHRcdFx0dmFyIGg7IC8vIGhlYXAgaW5kZXhcclxuXHRcdFx0dmFyIG4sIG07IC8vIGl0ZXJhdGUgb3ZlciB0aGUgdHJlZSBlbGVtZW50c1xyXG5cdFx0XHR2YXIgYml0czsgLy8gYml0IGxlbmd0aFxyXG5cdFx0XHR2YXIgeGJpdHM7IC8vIGV4dHJhIGJpdHNcclxuXHRcdFx0dmFyIGY7IC8vIGZyZXF1ZW5jeVxyXG5cdFx0XHR2YXIgb3ZlcmZsb3cgPSAwOyAvLyBudW1iZXIgb2YgZWxlbWVudHMgd2l0aCBiaXQgbGVuZ3RoIHRvbyBsYXJnZVxyXG5cclxuXHRcdFx0Zm9yIChiaXRzID0gMDsgYml0cyA8PSBNQVhfQklUUzsgYml0cysrKVxyXG5cdFx0XHRcdHMuYmxfY291bnRbYml0c10gPSAwO1xyXG5cclxuXHRcdFx0Ly8gSW4gYSBmaXJzdCBwYXNzLCBjb21wdXRlIHRoZSBvcHRpbWFsIGJpdCBsZW5ndGhzICh3aGljaCBtYXlcclxuXHRcdFx0Ly8gb3ZlcmZsb3cgaW4gdGhlIGNhc2Ugb2YgdGhlIGJpdCBsZW5ndGggdHJlZSkuXHJcblx0XHRcdHRyZWVbcy5oZWFwW3MuaGVhcF9tYXhdICogMiArIDFdID0gMDsgLy8gcm9vdCBvZiB0aGUgaGVhcFxyXG5cclxuXHRcdFx0Zm9yIChoID0gcy5oZWFwX21heCArIDE7IGggPCBIRUFQX1NJWkU7IGgrKykge1xyXG5cdFx0XHRcdG4gPSBzLmhlYXBbaF07XHJcblx0XHRcdFx0Yml0cyA9IHRyZWVbdHJlZVtuICogMiArIDFdICogMiArIDFdICsgMTtcclxuXHRcdFx0XHRpZiAoYml0cyA+IG1heF9sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGJpdHMgPSBtYXhfbGVuZ3RoO1xyXG5cdFx0XHRcdFx0b3ZlcmZsb3crKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dHJlZVtuICogMiArIDFdID0gYml0cztcclxuXHRcdFx0XHQvLyBXZSBvdmVyd3JpdGUgdHJlZVtuKjIrMV0gd2hpY2ggaXMgbm8gbG9uZ2VyIG5lZWRlZFxyXG5cclxuXHRcdFx0XHRpZiAobiA+IHRoYXQubWF4X2NvZGUpXHJcblx0XHRcdFx0XHRjb250aW51ZTsgLy8gbm90IGEgbGVhZiBub2RlXHJcblxyXG5cdFx0XHRcdHMuYmxfY291bnRbYml0c10rKztcclxuXHRcdFx0XHR4Yml0cyA9IDA7XHJcblx0XHRcdFx0aWYgKG4gPj0gYmFzZSlcclxuXHRcdFx0XHRcdHhiaXRzID0gZXh0cmFbbiAtIGJhc2VdO1xyXG5cdFx0XHRcdGYgPSB0cmVlW24gKiAyXTtcclxuXHRcdFx0XHRzLm9wdF9sZW4gKz0gZiAqIChiaXRzICsgeGJpdHMpO1xyXG5cdFx0XHRcdGlmIChzdHJlZSlcclxuXHRcdFx0XHRcdHMuc3RhdGljX2xlbiArPSBmICogKHN0cmVlW24gKiAyICsgMV0gKyB4Yml0cyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG92ZXJmbG93ID09PSAwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdC8vIFRoaXMgaGFwcGVucyBmb3IgZXhhbXBsZSBvbiBvYmoyIGFuZCBwaWMgb2YgdGhlIENhbGdhcnkgY29ycHVzXHJcblx0XHRcdC8vIEZpbmQgdGhlIGZpcnN0IGJpdCBsZW5ndGggd2hpY2ggY291bGQgaW5jcmVhc2U6XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRiaXRzID0gbWF4X2xlbmd0aCAtIDE7XHJcblx0XHRcdFx0d2hpbGUgKHMuYmxfY291bnRbYml0c10gPT09IDApXHJcblx0XHRcdFx0XHRiaXRzLS07XHJcblx0XHRcdFx0cy5ibF9jb3VudFtiaXRzXS0tOyAvLyBtb3ZlIG9uZSBsZWFmIGRvd24gdGhlIHRyZWVcclxuXHRcdFx0XHRzLmJsX2NvdW50W2JpdHMgKyAxXSArPSAyOyAvLyBtb3ZlIG9uZSBvdmVyZmxvdyBpdGVtIGFzIGl0cyBicm90aGVyXHJcblx0XHRcdFx0cy5ibF9jb3VudFttYXhfbGVuZ3RoXS0tO1xyXG5cdFx0XHRcdC8vIFRoZSBicm90aGVyIG9mIHRoZSBvdmVyZmxvdyBpdGVtIGFsc28gbW92ZXMgb25lIHN0ZXAgdXAsXHJcblx0XHRcdFx0Ly8gYnV0IHRoaXMgZG9lcyBub3QgYWZmZWN0IGJsX2NvdW50W21heF9sZW5ndGhdXHJcblx0XHRcdFx0b3ZlcmZsb3cgLT0gMjtcclxuXHRcdFx0fSB3aGlsZSAob3ZlcmZsb3cgPiAwKTtcclxuXHJcblx0XHRcdGZvciAoYml0cyA9IG1heF9sZW5ndGg7IGJpdHMgIT09IDA7IGJpdHMtLSkge1xyXG5cdFx0XHRcdG4gPSBzLmJsX2NvdW50W2JpdHNdO1xyXG5cdFx0XHRcdHdoaWxlIChuICE9PSAwKSB7XHJcblx0XHRcdFx0XHRtID0gcy5oZWFwWy0taF07XHJcblx0XHRcdFx0XHRpZiAobSA+IHRoYXQubWF4X2NvZGUpXHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0aWYgKHRyZWVbbSAqIDIgKyAxXSAhPSBiaXRzKSB7XHJcblx0XHRcdFx0XHRcdHMub3B0X2xlbiArPSAoYml0cyAtIHRyZWVbbSAqIDIgKyAxXSkgKiB0cmVlW20gKiAyXTtcclxuXHRcdFx0XHRcdFx0dHJlZVttICogMiArIDFdID0gYml0cztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG4tLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZXZlcnNlIHRoZSBmaXJzdCBsZW4gYml0cyBvZiBhIGNvZGUsIHVzaW5nIHN0cmFpZ2h0Zm9yd2FyZCBjb2RlIChhXHJcblx0XHQvLyBmYXN0ZXJcclxuXHRcdC8vIG1ldGhvZCB3b3VsZCB1c2UgYSB0YWJsZSlcclxuXHRcdC8vIElOIGFzc2VydGlvbjogMSA8PSBsZW4gPD0gMTVcclxuXHRcdGZ1bmN0aW9uIGJpX3JldmVyc2UoY29kZSwgLy8gdGhlIHZhbHVlIHRvIGludmVydFxyXG5cdFx0bGVuIC8vIGl0cyBiaXQgbGVuZ3RoXHJcblx0XHQpIHtcclxuXHRcdFx0dmFyIHJlcyA9IDA7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRyZXMgfD0gY29kZSAmIDE7XHJcblx0XHRcdFx0Y29kZSA+Pj49IDE7XHJcblx0XHRcdFx0cmVzIDw8PSAxO1xyXG5cdFx0XHR9IHdoaWxlICgtLWxlbiA+IDApO1xyXG5cdFx0XHRyZXR1cm4gcmVzID4+PiAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEdlbmVyYXRlIHRoZSBjb2RlcyBmb3IgYSBnaXZlbiB0cmVlIGFuZCBiaXQgY291bnRzICh3aGljaCBuZWVkIG5vdCBiZVxyXG5cdFx0Ly8gb3B0aW1hbCkuXHJcblx0XHQvLyBJTiBhc3NlcnRpb246IHRoZSBhcnJheSBibF9jb3VudCBjb250YWlucyB0aGUgYml0IGxlbmd0aCBzdGF0aXN0aWNzIGZvclxyXG5cdFx0Ly8gdGhlIGdpdmVuIHRyZWUgYW5kIHRoZSBmaWVsZCBsZW4gaXMgc2V0IGZvciBhbGwgdHJlZSBlbGVtZW50cy5cclxuXHRcdC8vIE9VVCBhc3NlcnRpb246IHRoZSBmaWVsZCBjb2RlIGlzIHNldCBmb3IgYWxsIHRyZWUgZWxlbWVudHMgb2Ygbm9uXHJcblx0XHQvLyB6ZXJvIGNvZGUgbGVuZ3RoLlxyXG5cdFx0ZnVuY3Rpb24gZ2VuX2NvZGVzKHRyZWUsIC8vIHRoZSB0cmVlIHRvIGRlY29yYXRlXHJcblx0XHRtYXhfY29kZSwgLy8gbGFyZ2VzdCBjb2RlIHdpdGggbm9uIHplcm8gZnJlcXVlbmN5XHJcblx0XHRibF9jb3VudCAvLyBudW1iZXIgb2YgY29kZXMgYXQgZWFjaCBiaXQgbGVuZ3RoXHJcblx0XHQpIHtcclxuXHRcdFx0dmFyIG5leHRfY29kZSA9IFtdOyAvLyBuZXh0IGNvZGUgdmFsdWUgZm9yIGVhY2hcclxuXHRcdFx0Ly8gYml0IGxlbmd0aFxyXG5cdFx0XHR2YXIgY29kZSA9IDA7IC8vIHJ1bm5pbmcgY29kZSB2YWx1ZVxyXG5cdFx0XHR2YXIgYml0czsgLy8gYml0IGluZGV4XHJcblx0XHRcdHZhciBuOyAvLyBjb2RlIGluZGV4XHJcblx0XHRcdHZhciBsZW47XHJcblxyXG5cdFx0XHQvLyBUaGUgZGlzdHJpYnV0aW9uIGNvdW50cyBhcmUgZmlyc3QgdXNlZCB0byBnZW5lcmF0ZSB0aGUgY29kZSB2YWx1ZXNcclxuXHRcdFx0Ly8gd2l0aG91dCBiaXQgcmV2ZXJzYWwuXHJcblx0XHRcdGZvciAoYml0cyA9IDE7IGJpdHMgPD0gTUFYX0JJVFM7IGJpdHMrKykge1xyXG5cdFx0XHRcdG5leHRfY29kZVtiaXRzXSA9IGNvZGUgPSAoKGNvZGUgKyBibF9jb3VudFtiaXRzIC0gMV0pIDw8IDEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayB0aGF0IHRoZSBiaXQgY291bnRzIGluIGJsX2NvdW50IGFyZSBjb25zaXN0ZW50LiBUaGUgbGFzdCBjb2RlXHJcblx0XHRcdC8vIG11c3QgYmUgYWxsIG9uZXMuXHJcblx0XHRcdC8vIEFzc2VydCAoY29kZSArIGJsX2NvdW50W01BWF9CSVRTXS0xID09ICgxPDxNQVhfQklUUyktMSxcclxuXHRcdFx0Ly8gXCJpbmNvbnNpc3RlbnQgYml0IGNvdW50c1wiKTtcclxuXHRcdFx0Ly8gVHJhY2V2KChzdGRlcnIsXCJcXG5nZW5fY29kZXM6IG1heF9jb2RlICVkIFwiLCBtYXhfY29kZSkpO1xyXG5cclxuXHRcdFx0Zm9yIChuID0gMDsgbiA8PSBtYXhfY29kZTsgbisrKSB7XHJcblx0XHRcdFx0bGVuID0gdHJlZVtuICogMiArIDFdO1xyXG5cdFx0XHRcdGlmIChsZW4gPT09IDApXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHQvLyBOb3cgcmV2ZXJzZSB0aGUgYml0c1xyXG5cdFx0XHRcdHRyZWVbbiAqIDJdID0gYmlfcmV2ZXJzZShuZXh0X2NvZGVbbGVuXSsrLCBsZW4pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ29uc3RydWN0IG9uZSBIdWZmbWFuIHRyZWUgYW5kIGFzc2lnbnMgdGhlIGNvZGUgYml0IHN0cmluZ3MgYW5kIGxlbmd0aHMuXHJcblx0XHQvLyBVcGRhdGUgdGhlIHRvdGFsIGJpdCBsZW5ndGggZm9yIHRoZSBjdXJyZW50IGJsb2NrLlxyXG5cdFx0Ly8gSU4gYXNzZXJ0aW9uOiB0aGUgZmllbGQgZnJlcSBpcyBzZXQgZm9yIGFsbCB0cmVlIGVsZW1lbnRzLlxyXG5cdFx0Ly8gT1VUIGFzc2VydGlvbnM6IHRoZSBmaWVsZHMgbGVuIGFuZCBjb2RlIGFyZSBzZXQgdG8gdGhlIG9wdGltYWwgYml0IGxlbmd0aFxyXG5cdFx0Ly8gYW5kIGNvcnJlc3BvbmRpbmcgY29kZS4gVGhlIGxlbmd0aCBvcHRfbGVuIGlzIHVwZGF0ZWQ7IHN0YXRpY19sZW4gaXNcclxuXHRcdC8vIGFsc28gdXBkYXRlZCBpZiBzdHJlZSBpcyBub3QgbnVsbC4gVGhlIGZpZWxkIG1heF9jb2RlIGlzIHNldC5cclxuXHRcdHRoYXQuYnVpbGRfdHJlZSA9IGZ1bmN0aW9uKHMpIHtcclxuXHRcdFx0dmFyIHRyZWUgPSB0aGF0LmR5bl90cmVlO1xyXG5cdFx0XHR2YXIgc3RyZWUgPSB0aGF0LnN0YXRfZGVzYy5zdGF0aWNfdHJlZTtcclxuXHRcdFx0dmFyIGVsZW1zID0gdGhhdC5zdGF0X2Rlc2MuZWxlbXM7XHJcblx0XHRcdHZhciBuLCBtOyAvLyBpdGVyYXRlIG92ZXIgaGVhcCBlbGVtZW50c1xyXG5cdFx0XHR2YXIgbWF4X2NvZGUgPSAtMTsgLy8gbGFyZ2VzdCBjb2RlIHdpdGggbm9uIHplcm8gZnJlcXVlbmN5XHJcblx0XHRcdHZhciBub2RlOyAvLyBuZXcgbm9kZSBiZWluZyBjcmVhdGVkXHJcblxyXG5cdFx0XHQvLyBDb25zdHJ1Y3QgdGhlIGluaXRpYWwgaGVhcCwgd2l0aCBsZWFzdCBmcmVxdWVudCBlbGVtZW50IGluXHJcblx0XHRcdC8vIGhlYXBbMV0uIFRoZSBzb25zIG9mIGhlYXBbbl0gYXJlIGhlYXBbMipuXSBhbmQgaGVhcFsyKm4rMV0uXHJcblx0XHRcdC8vIGhlYXBbMF0gaXMgbm90IHVzZWQuXHJcblx0XHRcdHMuaGVhcF9sZW4gPSAwO1xyXG5cdFx0XHRzLmhlYXBfbWF4ID0gSEVBUF9TSVpFO1xyXG5cclxuXHRcdFx0Zm9yIChuID0gMDsgbiA8IGVsZW1zOyBuKyspIHtcclxuXHRcdFx0XHRpZiAodHJlZVtuICogMl0gIT09IDApIHtcclxuXHRcdFx0XHRcdHMuaGVhcFsrK3MuaGVhcF9sZW5dID0gbWF4X2NvZGUgPSBuO1xyXG5cdFx0XHRcdFx0cy5kZXB0aFtuXSA9IDA7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRyZWVbbiAqIDIgKyAxXSA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBUaGUgcGt6aXAgZm9ybWF0IHJlcXVpcmVzIHRoYXQgYXQgbGVhc3Qgb25lIGRpc3RhbmNlIGNvZGUgZXhpc3RzLFxyXG5cdFx0XHQvLyBhbmQgdGhhdCBhdCBsZWFzdCBvbmUgYml0IHNob3VsZCBiZSBzZW50IGV2ZW4gaWYgdGhlcmUgaXMgb25seSBvbmVcclxuXHRcdFx0Ly8gcG9zc2libGUgY29kZS4gU28gdG8gYXZvaWQgc3BlY2lhbCBjaGVja3MgbGF0ZXIgb24gd2UgZm9yY2UgYXQgbGVhc3RcclxuXHRcdFx0Ly8gdHdvIGNvZGVzIG9mIG5vbiB6ZXJvIGZyZXF1ZW5jeS5cclxuXHRcdFx0d2hpbGUgKHMuaGVhcF9sZW4gPCAyKSB7XHJcblx0XHRcdFx0bm9kZSA9IHMuaGVhcFsrK3MuaGVhcF9sZW5dID0gbWF4X2NvZGUgPCAyID8gKyttYXhfY29kZSA6IDA7XHJcblx0XHRcdFx0dHJlZVtub2RlICogMl0gPSAxO1xyXG5cdFx0XHRcdHMuZGVwdGhbbm9kZV0gPSAwO1xyXG5cdFx0XHRcdHMub3B0X2xlbi0tO1xyXG5cdFx0XHRcdGlmIChzdHJlZSlcclxuXHRcdFx0XHRcdHMuc3RhdGljX2xlbiAtPSBzdHJlZVtub2RlICogMiArIDFdO1xyXG5cdFx0XHRcdC8vIG5vZGUgaXMgMCBvciAxIHNvIGl0IGRvZXMgbm90IGhhdmUgZXh0cmEgYml0c1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoYXQubWF4X2NvZGUgPSBtYXhfY29kZTtcclxuXHJcblx0XHRcdC8vIFRoZSBlbGVtZW50cyBoZWFwW2hlYXBfbGVuLzIrMSAuLiBoZWFwX2xlbl0gYXJlIGxlYXZlcyBvZiB0aGUgdHJlZSxcclxuXHRcdFx0Ly8gZXN0YWJsaXNoIHN1Yi1oZWFwcyBvZiBpbmNyZWFzaW5nIGxlbmd0aHM6XHJcblxyXG5cdFx0XHRmb3IgKG4gPSBNYXRoLmZsb29yKHMuaGVhcF9sZW4gLyAyKTsgbiA+PSAxOyBuLS0pXHJcblx0XHRcdFx0cy5wcWRvd25oZWFwKHRyZWUsIG4pO1xyXG5cclxuXHRcdFx0Ly8gQ29uc3RydWN0IHRoZSBIdWZmbWFuIHRyZWUgYnkgcmVwZWF0ZWRseSBjb21iaW5pbmcgdGhlIGxlYXN0IHR3b1xyXG5cdFx0XHQvLyBmcmVxdWVudCBub2Rlcy5cclxuXHJcblx0XHRcdG5vZGUgPSBlbGVtczsgLy8gbmV4dCBpbnRlcm5hbCBub2RlIG9mIHRoZSB0cmVlXHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHQvLyBuID0gbm9kZSBvZiBsZWFzdCBmcmVxdWVuY3lcclxuXHRcdFx0XHRuID0gcy5oZWFwWzFdO1xyXG5cdFx0XHRcdHMuaGVhcFsxXSA9IHMuaGVhcFtzLmhlYXBfbGVuLS1dO1xyXG5cdFx0XHRcdHMucHFkb3duaGVhcCh0cmVlLCAxKTtcclxuXHRcdFx0XHRtID0gcy5oZWFwWzFdOyAvLyBtID0gbm9kZSBvZiBuZXh0IGxlYXN0IGZyZXF1ZW5jeVxyXG5cclxuXHRcdFx0XHRzLmhlYXBbLS1zLmhlYXBfbWF4XSA9IG47IC8vIGtlZXAgdGhlIG5vZGVzIHNvcnRlZCBieSBmcmVxdWVuY3lcclxuXHRcdFx0XHRzLmhlYXBbLS1zLmhlYXBfbWF4XSA9IG07XHJcblxyXG5cdFx0XHRcdC8vIENyZWF0ZSBhIG5ldyBub2RlIGZhdGhlciBvZiBuIGFuZCBtXHJcblx0XHRcdFx0dHJlZVtub2RlICogMl0gPSAodHJlZVtuICogMl0gKyB0cmVlW20gKiAyXSk7XHJcblx0XHRcdFx0cy5kZXB0aFtub2RlXSA9IE1hdGgubWF4KHMuZGVwdGhbbl0sIHMuZGVwdGhbbV0pICsgMTtcclxuXHRcdFx0XHR0cmVlW24gKiAyICsgMV0gPSB0cmVlW20gKiAyICsgMV0gPSBub2RlO1xyXG5cclxuXHRcdFx0XHQvLyBhbmQgaW5zZXJ0IHRoZSBuZXcgbm9kZSBpbiB0aGUgaGVhcFxyXG5cdFx0XHRcdHMuaGVhcFsxXSA9IG5vZGUrKztcclxuXHRcdFx0XHRzLnBxZG93bmhlYXAodHJlZSwgMSk7XHJcblx0XHRcdH0gd2hpbGUgKHMuaGVhcF9sZW4gPj0gMik7XHJcblxyXG5cdFx0XHRzLmhlYXBbLS1zLmhlYXBfbWF4XSA9IHMuaGVhcFsxXTtcclxuXHJcblx0XHRcdC8vIEF0IHRoaXMgcG9pbnQsIHRoZSBmaWVsZHMgZnJlcSBhbmQgZGFkIGFyZSBzZXQuIFdlIGNhbiBub3dcclxuXHRcdFx0Ly8gZ2VuZXJhdGUgdGhlIGJpdCBsZW5ndGhzLlxyXG5cclxuXHRcdFx0Z2VuX2JpdGxlbihzKTtcclxuXHJcblx0XHRcdC8vIFRoZSBmaWVsZCBsZW4gaXMgbm93IHNldCwgd2UgY2FuIGdlbmVyYXRlIHRoZSBiaXQgY29kZXNcclxuXHRcdFx0Z2VuX2NvZGVzKHRyZWUsIHRoYXQubWF4X2NvZGUsIHMuYmxfY291bnQpO1xyXG5cdFx0fTtcclxuXHJcblx0fVxyXG5cclxuXHRUcmVlLl9sZW5ndGhfY29kZSA9IFsgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOCwgOSwgOSwgMTAsIDEwLCAxMSwgMTEsIDEyLCAxMiwgMTIsIDEyLCAxMywgMTMsIDEzLCAxMywgMTQsIDE0LCAxNCwgMTQsIDE1LCAxNSwgMTUsIDE1LCAxNiwgMTYsIDE2LCAxNixcclxuXHRcdFx0MTYsIDE2LCAxNiwgMTYsIDE3LCAxNywgMTcsIDE3LCAxNywgMTcsIDE3LCAxNywgMTgsIDE4LCAxOCwgMTgsIDE4LCAxOCwgMTgsIDE4LCAxOSwgMTksIDE5LCAxOSwgMTksIDE5LCAxOSwgMTksIDIwLCAyMCwgMjAsIDIwLCAyMCwgMjAsIDIwLCAyMCwgMjAsXHJcblx0XHRcdDIwLCAyMCwgMjAsIDIwLCAyMCwgMjAsIDIwLCAyMSwgMjEsIDIxLCAyMSwgMjEsIDIxLCAyMSwgMjEsIDIxLCAyMSwgMjEsIDIxLCAyMSwgMjEsIDIxLCAyMSwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjIsIDIyLFxyXG5cdFx0XHQyMiwgMjIsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCxcclxuXHRcdFx0MjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsXHJcblx0XHRcdDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LFxyXG5cdFx0XHQyNiwgMjYsIDI2LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjggXTtcclxuXHJcblx0VHJlZS5iYXNlX2xlbmd0aCA9IFsgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgMTAsIDEyLCAxNCwgMTYsIDIwLCAyNCwgMjgsIDMyLCA0MCwgNDgsIDU2LCA2NCwgODAsIDk2LCAxMTIsIDEyOCwgMTYwLCAxOTIsIDIyNCwgMCBdO1xyXG5cclxuXHRUcmVlLmJhc2VfZGlzdCA9IFsgMCwgMSwgMiwgMywgNCwgNiwgOCwgMTIsIDE2LCAyNCwgMzIsIDQ4LCA2NCwgOTYsIDEyOCwgMTkyLCAyNTYsIDM4NCwgNTEyLCA3NjgsIDEwMjQsIDE1MzYsIDIwNDgsIDMwNzIsIDQwOTYsIDYxNDQsIDgxOTIsIDEyMjg4LCAxNjM4NCxcclxuXHRcdFx0MjQ1NzYgXTtcclxuXHJcblx0Ly8gTWFwcGluZyBmcm9tIGEgZGlzdGFuY2UgdG8gYSBkaXN0YW5jZSBjb2RlLiBkaXN0IGlzIHRoZSBkaXN0YW5jZSAtIDEgYW5kXHJcblx0Ly8gbXVzdCBub3QgaGF2ZSBzaWRlIGVmZmVjdHMuIF9kaXN0X2NvZGVbMjU2XSBhbmQgX2Rpc3RfY29kZVsyNTddIGFyZSBuZXZlclxyXG5cdC8vIHVzZWQuXHJcblx0VHJlZS5kX2NvZGUgPSBmdW5jdGlvbihkaXN0KSB7XHJcblx0XHRyZXR1cm4gKChkaXN0KSA8IDI1NiA/IF9kaXN0X2NvZGVbZGlzdF0gOiBfZGlzdF9jb2RlWzI1NiArICgoZGlzdCkgPj4+IDcpXSk7XHJcblx0fTtcclxuXHJcblx0Ly8gZXh0cmEgYml0cyBmb3IgZWFjaCBsZW5ndGggY29kZVxyXG5cdFRyZWUuZXh0cmFfbGJpdHMgPSBbIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDIsIDIsIDIsIDIsIDMsIDMsIDMsIDMsIDQsIDQsIDQsIDQsIDUsIDUsIDUsIDUsIDAgXTtcclxuXHJcblx0Ly8gZXh0cmEgYml0cyBmb3IgZWFjaCBkaXN0YW5jZSBjb2RlXHJcblx0VHJlZS5leHRyYV9kYml0cyA9IFsgMCwgMCwgMCwgMCwgMSwgMSwgMiwgMiwgMywgMywgNCwgNCwgNSwgNSwgNiwgNiwgNywgNywgOCwgOCwgOSwgOSwgMTAsIDEwLCAxMSwgMTEsIDEyLCAxMiwgMTMsIDEzIF07XHJcblxyXG5cdC8vIGV4dHJhIGJpdHMgZm9yIGVhY2ggYml0IGxlbmd0aCBjb2RlXHJcblx0VHJlZS5leHRyYV9ibGJpdHMgPSBbIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDIsIDMsIDcgXTtcclxuXHJcblx0VHJlZS5ibF9vcmRlciA9IFsgMTYsIDE3LCAxOCwgMCwgOCwgNywgOSwgNiwgMTAsIDUsIDExLCA0LCAxMiwgMywgMTMsIDIsIDE0LCAxLCAxNSBdO1xyXG5cclxuXHQvLyBTdGF0aWNUcmVlXHJcblxyXG5cdGZ1bmN0aW9uIFN0YXRpY1RyZWUoc3RhdGljX3RyZWUsIGV4dHJhX2JpdHMsIGV4dHJhX2Jhc2UsIGVsZW1zLCBtYXhfbGVuZ3RoKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHR0aGF0LnN0YXRpY190cmVlID0gc3RhdGljX3RyZWU7XHJcblx0XHR0aGF0LmV4dHJhX2JpdHMgPSBleHRyYV9iaXRzO1xyXG5cdFx0dGhhdC5leHRyYV9iYXNlID0gZXh0cmFfYmFzZTtcclxuXHRcdHRoYXQuZWxlbXMgPSBlbGVtcztcclxuXHRcdHRoYXQubWF4X2xlbmd0aCA9IG1heF9sZW5ndGg7XHJcblx0fVxyXG5cclxuXHRTdGF0aWNUcmVlLnN0YXRpY19sdHJlZSA9IFsgMTIsIDgsIDE0MCwgOCwgNzYsIDgsIDIwNCwgOCwgNDQsIDgsIDE3MiwgOCwgMTA4LCA4LCAyMzYsIDgsIDI4LCA4LCAxNTYsIDgsIDkyLCA4LCAyMjAsIDgsIDYwLCA4LCAxODgsIDgsIDEyNCwgOCwgMjUyLCA4LCAyLCA4LFxyXG5cdFx0XHQxMzAsIDgsIDY2LCA4LCAxOTQsIDgsIDM0LCA4LCAxNjIsIDgsIDk4LCA4LCAyMjYsIDgsIDE4LCA4LCAxNDYsIDgsIDgyLCA4LCAyMTAsIDgsIDUwLCA4LCAxNzgsIDgsIDExNCwgOCwgMjQyLCA4LCAxMCwgOCwgMTM4LCA4LCA3NCwgOCwgMjAyLCA4LCA0MixcclxuXHRcdFx0OCwgMTcwLCA4LCAxMDYsIDgsIDIzNCwgOCwgMjYsIDgsIDE1NCwgOCwgOTAsIDgsIDIxOCwgOCwgNTgsIDgsIDE4NiwgOCwgMTIyLCA4LCAyNTAsIDgsIDYsIDgsIDEzNCwgOCwgNzAsIDgsIDE5OCwgOCwgMzgsIDgsIDE2NiwgOCwgMTAyLCA4LCAyMzAsIDgsXHJcblx0XHRcdDIyLCA4LCAxNTAsIDgsIDg2LCA4LCAyMTQsIDgsIDU0LCA4LCAxODIsIDgsIDExOCwgOCwgMjQ2LCA4LCAxNCwgOCwgMTQyLCA4LCA3OCwgOCwgMjA2LCA4LCA0NiwgOCwgMTc0LCA4LCAxMTAsIDgsIDIzOCwgOCwgMzAsIDgsIDE1OCwgOCwgOTQsIDgsXHJcblx0XHRcdDIyMiwgOCwgNjIsIDgsIDE5MCwgOCwgMTI2LCA4LCAyNTQsIDgsIDEsIDgsIDEyOSwgOCwgNjUsIDgsIDE5MywgOCwgMzMsIDgsIDE2MSwgOCwgOTcsIDgsIDIyNSwgOCwgMTcsIDgsIDE0NSwgOCwgODEsIDgsIDIwOSwgOCwgNDksIDgsIDE3NywgOCwgMTEzLFxyXG5cdFx0XHQ4LCAyNDEsIDgsIDksIDgsIDEzNywgOCwgNzMsIDgsIDIwMSwgOCwgNDEsIDgsIDE2OSwgOCwgMTA1LCA4LCAyMzMsIDgsIDI1LCA4LCAxNTMsIDgsIDg5LCA4LCAyMTcsIDgsIDU3LCA4LCAxODUsIDgsIDEyMSwgOCwgMjQ5LCA4LCA1LCA4LCAxMzMsIDgsXHJcblx0XHRcdDY5LCA4LCAxOTcsIDgsIDM3LCA4LCAxNjUsIDgsIDEwMSwgOCwgMjI5LCA4LCAyMSwgOCwgMTQ5LCA4LCA4NSwgOCwgMjEzLCA4LCA1MywgOCwgMTgxLCA4LCAxMTcsIDgsIDI0NSwgOCwgMTMsIDgsIDE0MSwgOCwgNzcsIDgsIDIwNSwgOCwgNDUsIDgsXHJcblx0XHRcdDE3MywgOCwgMTA5LCA4LCAyMzcsIDgsIDI5LCA4LCAxNTcsIDgsIDkzLCA4LCAyMjEsIDgsIDYxLCA4LCAxODksIDgsIDEyNSwgOCwgMjUzLCA4LCAxOSwgOSwgMjc1LCA5LCAxNDcsIDksIDQwMywgOSwgODMsIDksIDMzOSwgOSwgMjExLCA5LCA0NjcsIDksXHJcblx0XHRcdDUxLCA5LCAzMDcsIDksIDE3OSwgOSwgNDM1LCA5LCAxMTUsIDksIDM3MSwgOSwgMjQzLCA5LCA0OTksIDksIDExLCA5LCAyNjcsIDksIDEzOSwgOSwgMzk1LCA5LCA3NSwgOSwgMzMxLCA5LCAyMDMsIDksIDQ1OSwgOSwgNDMsIDksIDI5OSwgOSwgMTcxLCA5LFxyXG5cdFx0XHQ0MjcsIDksIDEwNywgOSwgMzYzLCA5LCAyMzUsIDksIDQ5MSwgOSwgMjcsIDksIDI4MywgOSwgMTU1LCA5LCA0MTEsIDksIDkxLCA5LCAzNDcsIDksIDIxOSwgOSwgNDc1LCA5LCA1OSwgOSwgMzE1LCA5LCAxODcsIDksIDQ0MywgOSwgMTIzLCA5LCAzNzksXHJcblx0XHRcdDksIDI1MSwgOSwgNTA3LCA5LCA3LCA5LCAyNjMsIDksIDEzNSwgOSwgMzkxLCA5LCA3MSwgOSwgMzI3LCA5LCAxOTksIDksIDQ1NSwgOSwgMzksIDksIDI5NSwgOSwgMTY3LCA5LCA0MjMsIDksIDEwMywgOSwgMzU5LCA5LCAyMzEsIDksIDQ4NywgOSwgMjMsXHJcblx0XHRcdDksIDI3OSwgOSwgMTUxLCA5LCA0MDcsIDksIDg3LCA5LCAzNDMsIDksIDIxNSwgOSwgNDcxLCA5LCA1NSwgOSwgMzExLCA5LCAxODMsIDksIDQzOSwgOSwgMTE5LCA5LCAzNzUsIDksIDI0NywgOSwgNTAzLCA5LCAxNSwgOSwgMjcxLCA5LCAxNDMsIDksXHJcblx0XHRcdDM5OSwgOSwgNzksIDksIDMzNSwgOSwgMjA3LCA5LCA0NjMsIDksIDQ3LCA5LCAzMDMsIDksIDE3NSwgOSwgNDMxLCA5LCAxMTEsIDksIDM2NywgOSwgMjM5LCA5LCA0OTUsIDksIDMxLCA5LCAyODcsIDksIDE1OSwgOSwgNDE1LCA5LCA5NSwgOSwgMzUxLCA5LFxyXG5cdFx0XHQyMjMsIDksIDQ3OSwgOSwgNjMsIDksIDMxOSwgOSwgMTkxLCA5LCA0NDcsIDksIDEyNywgOSwgMzgzLCA5LCAyNTUsIDksIDUxMSwgOSwgMCwgNywgNjQsIDcsIDMyLCA3LCA5NiwgNywgMTYsIDcsIDgwLCA3LCA0OCwgNywgMTEyLCA3LCA4LCA3LCA3MiwgNyxcclxuXHRcdFx0NDAsIDcsIDEwNCwgNywgMjQsIDcsIDg4LCA3LCA1NiwgNywgMTIwLCA3LCA0LCA3LCA2OCwgNywgMzYsIDcsIDEwMCwgNywgMjAsIDcsIDg0LCA3LCA1MiwgNywgMTE2LCA3LCAzLCA4LCAxMzEsIDgsIDY3LCA4LCAxOTUsIDgsIDM1LCA4LCAxNjMsIDgsXHJcblx0XHRcdDk5LCA4LCAyMjcsIDggXTtcclxuXHJcblx0U3RhdGljVHJlZS5zdGF0aWNfZHRyZWUgPSBbIDAsIDUsIDE2LCA1LCA4LCA1LCAyNCwgNSwgNCwgNSwgMjAsIDUsIDEyLCA1LCAyOCwgNSwgMiwgNSwgMTgsIDUsIDEwLCA1LCAyNiwgNSwgNiwgNSwgMjIsIDUsIDE0LCA1LCAzMCwgNSwgMSwgNSwgMTcsIDUsIDksIDUsXHJcblx0XHRcdDI1LCA1LCA1LCA1LCAyMSwgNSwgMTMsIDUsIDI5LCA1LCAzLCA1LCAxOSwgNSwgMTEsIDUsIDI3LCA1LCA3LCA1LCAyMywgNSBdO1xyXG5cclxuXHRTdGF0aWNUcmVlLnN0YXRpY19sX2Rlc2MgPSBuZXcgU3RhdGljVHJlZShTdGF0aWNUcmVlLnN0YXRpY19sdHJlZSwgVHJlZS5leHRyYV9sYml0cywgTElURVJBTFMgKyAxLCBMX0NPREVTLCBNQVhfQklUUyk7XHJcblxyXG5cdFN0YXRpY1RyZWUuc3RhdGljX2RfZGVzYyA9IG5ldyBTdGF0aWNUcmVlKFN0YXRpY1RyZWUuc3RhdGljX2R0cmVlLCBUcmVlLmV4dHJhX2RiaXRzLCAwLCBEX0NPREVTLCBNQVhfQklUUyk7XHJcblxyXG5cdFN0YXRpY1RyZWUuc3RhdGljX2JsX2Rlc2MgPSBuZXcgU3RhdGljVHJlZShudWxsLCBUcmVlLmV4dHJhX2JsYml0cywgMCwgQkxfQ09ERVMsIE1BWF9CTF9CSVRTKTtcclxuXHJcblx0Ly8gRGVmbGF0ZVxyXG5cclxuXHR2YXIgTUFYX01FTV9MRVZFTCA9IDk7XHJcblx0dmFyIERFRl9NRU1fTEVWRUwgPSA4O1xyXG5cclxuXHRmdW5jdGlvbiBDb25maWcoZ29vZF9sZW5ndGgsIG1heF9sYXp5LCBuaWNlX2xlbmd0aCwgbWF4X2NoYWluLCBmdW5jKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHR0aGF0Lmdvb2RfbGVuZ3RoID0gZ29vZF9sZW5ndGg7XHJcblx0XHR0aGF0Lm1heF9sYXp5ID0gbWF4X2xhenk7XHJcblx0XHR0aGF0Lm5pY2VfbGVuZ3RoID0gbmljZV9sZW5ndGg7XHJcblx0XHR0aGF0Lm1heF9jaGFpbiA9IG1heF9jaGFpbjtcclxuXHRcdHRoYXQuZnVuYyA9IGZ1bmM7XHJcblx0fVxyXG5cclxuXHR2YXIgU1RPUkVEID0gMDtcclxuXHR2YXIgRkFTVCA9IDE7XHJcblx0dmFyIFNMT1cgPSAyO1xyXG5cdHZhciBjb25maWdfdGFibGUgPSBbIG5ldyBDb25maWcoMCwgMCwgMCwgMCwgU1RPUkVEKSwgbmV3IENvbmZpZyg0LCA0LCA4LCA0LCBGQVNUKSwgbmV3IENvbmZpZyg0LCA1LCAxNiwgOCwgRkFTVCksIG5ldyBDb25maWcoNCwgNiwgMzIsIDMyLCBGQVNUKSxcclxuXHRcdFx0bmV3IENvbmZpZyg0LCA0LCAxNiwgMTYsIFNMT1cpLCBuZXcgQ29uZmlnKDgsIDE2LCAzMiwgMzIsIFNMT1cpLCBuZXcgQ29uZmlnKDgsIDE2LCAxMjgsIDEyOCwgU0xPVyksIG5ldyBDb25maWcoOCwgMzIsIDEyOCwgMjU2LCBTTE9XKSxcclxuXHRcdFx0bmV3IENvbmZpZygzMiwgMTI4LCAyNTgsIDEwMjQsIFNMT1cpLCBuZXcgQ29uZmlnKDMyLCAyNTgsIDI1OCwgNDA5NiwgU0xPVykgXTtcclxuXHJcblx0dmFyIHpfZXJybXNnID0gWyBcIm5lZWQgZGljdGlvbmFyeVwiLCAvLyBaX05FRURfRElDVFxyXG5cdC8vIDJcclxuXHRcInN0cmVhbSBlbmRcIiwgLy8gWl9TVFJFQU1fRU5EIDFcclxuXHRcIlwiLCAvLyBaX09LIDBcclxuXHRcIlwiLCAvLyBaX0VSUk5PICgtMSlcclxuXHRcInN0cmVhbSBlcnJvclwiLCAvLyBaX1NUUkVBTV9FUlJPUiAoLTIpXHJcblx0XCJkYXRhIGVycm9yXCIsIC8vIFpfREFUQV9FUlJPUiAoLTMpXHJcblx0XCJcIiwgLy8gWl9NRU1fRVJST1IgKC00KVxyXG5cdFwiYnVmZmVyIGVycm9yXCIsIC8vIFpfQlVGX0VSUk9SICgtNSlcclxuXHRcIlwiLC8vIFpfVkVSU0lPTl9FUlJPUiAoLTYpXHJcblx0XCJcIiBdO1xyXG5cclxuXHQvLyBibG9jayBub3QgY29tcGxldGVkLCBuZWVkIG1vcmUgaW5wdXQgb3IgbW9yZSBvdXRwdXRcclxuXHR2YXIgTmVlZE1vcmUgPSAwO1xyXG5cclxuXHQvLyBibG9jayBmbHVzaCBwZXJmb3JtZWRcclxuXHR2YXIgQmxvY2tEb25lID0gMTtcclxuXHJcblx0Ly8gZmluaXNoIHN0YXJ0ZWQsIG5lZWQgb25seSBtb3JlIG91dHB1dCBhdCBuZXh0IGRlZmxhdGVcclxuXHR2YXIgRmluaXNoU3RhcnRlZCA9IDI7XHJcblxyXG5cdC8vIGZpbmlzaCBkb25lLCBhY2NlcHQgbm8gbW9yZSBpbnB1dCBvciBvdXRwdXRcclxuXHR2YXIgRmluaXNoRG9uZSA9IDM7XHJcblxyXG5cdC8vIHByZXNldCBkaWN0aW9uYXJ5IGZsYWcgaW4gemxpYiBoZWFkZXJcclxuXHR2YXIgUFJFU0VUX0RJQ1QgPSAweDIwO1xyXG5cclxuXHR2YXIgSU5JVF9TVEFURSA9IDQyO1xyXG5cdHZhciBCVVNZX1NUQVRFID0gMTEzO1xyXG5cdHZhciBGSU5JU0hfU1RBVEUgPSA2NjY7XHJcblxyXG5cdC8vIFRoZSBkZWZsYXRlIGNvbXByZXNzaW9uIG1ldGhvZFxyXG5cdHZhciBaX0RFRkxBVEVEID0gODtcclxuXHJcblx0dmFyIFNUT1JFRF9CTE9DSyA9IDA7XHJcblx0dmFyIFNUQVRJQ19UUkVFUyA9IDE7XHJcblx0dmFyIERZTl9UUkVFUyA9IDI7XHJcblxyXG5cdHZhciBNSU5fTUFUQ0ggPSAzO1xyXG5cdHZhciBNQVhfTUFUQ0ggPSAyNTg7XHJcblx0dmFyIE1JTl9MT09LQUhFQUQgPSAoTUFYX01BVENIICsgTUlOX01BVENIICsgMSk7XHJcblxyXG5cdGZ1bmN0aW9uIHNtYWxsZXIodHJlZSwgbiwgbSwgZGVwdGgpIHtcclxuXHRcdHZhciB0bjIgPSB0cmVlW24gKiAyXTtcclxuXHRcdHZhciB0bTIgPSB0cmVlW20gKiAyXTtcclxuXHRcdHJldHVybiAodG4yIDwgdG0yIHx8ICh0bjIgPT0gdG0yICYmIGRlcHRoW25dIDw9IGRlcHRoW21dKSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBEZWZsYXRlKCkge1xyXG5cclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdHZhciBzdHJtOyAvLyBwb2ludGVyIGJhY2sgdG8gdGhpcyB6bGliIHN0cmVhbVxyXG5cdFx0dmFyIHN0YXR1czsgLy8gYXMgdGhlIG5hbWUgaW1wbGllc1xyXG5cdFx0Ly8gcGVuZGluZ19idWY7IC8vIG91dHB1dCBzdGlsbCBwZW5kaW5nXHJcblx0XHR2YXIgcGVuZGluZ19idWZfc2l6ZTsgLy8gc2l6ZSBvZiBwZW5kaW5nX2J1ZlxyXG5cdFx0Ly8gcGVuZGluZ19vdXQ7IC8vIG5leHQgcGVuZGluZyBieXRlIHRvIG91dHB1dCB0byB0aGUgc3RyZWFtXHJcblx0XHQvLyBwZW5kaW5nOyAvLyBuYiBvZiBieXRlcyBpbiB0aGUgcGVuZGluZyBidWZmZXJcclxuXHRcdHZhciBtZXRob2Q7IC8vIFNUT1JFRCAoZm9yIHppcCBvbmx5KSBvciBERUZMQVRFRFxyXG5cdFx0dmFyIGxhc3RfZmx1c2g7IC8vIHZhbHVlIG9mIGZsdXNoIHBhcmFtIGZvciBwcmV2aW91cyBkZWZsYXRlIGNhbGxcclxuXHJcblx0XHR2YXIgd19zaXplOyAvLyBMWjc3IHdpbmRvdyBzaXplICgzMksgYnkgZGVmYXVsdClcclxuXHRcdHZhciB3X2JpdHM7IC8vIGxvZzIod19zaXplKSAoOC4uMTYpXHJcblx0XHR2YXIgd19tYXNrOyAvLyB3X3NpemUgLSAxXHJcblxyXG5cdFx0dmFyIHdpbmRvdztcclxuXHRcdC8vIFNsaWRpbmcgd2luZG93LiBJbnB1dCBieXRlcyBhcmUgcmVhZCBpbnRvIHRoZSBzZWNvbmQgaGFsZiBvZiB0aGUgd2luZG93LFxyXG5cdFx0Ly8gYW5kIG1vdmUgdG8gdGhlIGZpcnN0IGhhbGYgbGF0ZXIgdG8ga2VlcCBhIGRpY3Rpb25hcnkgb2YgYXQgbGVhc3Qgd1NpemVcclxuXHRcdC8vIGJ5dGVzLiBXaXRoIHRoaXMgb3JnYW5pemF0aW9uLCBtYXRjaGVzIGFyZSBsaW1pdGVkIHRvIGEgZGlzdGFuY2Ugb2ZcclxuXHRcdC8vIHdTaXplLU1BWF9NQVRDSCBieXRlcywgYnV0IHRoaXMgZW5zdXJlcyB0aGF0IElPIGlzIGFsd2F5c1xyXG5cdFx0Ly8gcGVyZm9ybWVkIHdpdGggYSBsZW5ndGggbXVsdGlwbGUgb2YgdGhlIGJsb2NrIHNpemUuIEFsc28sIGl0IGxpbWl0c1xyXG5cdFx0Ly8gdGhlIHdpbmRvdyBzaXplIHRvIDY0Sywgd2hpY2ggaXMgcXVpdGUgdXNlZnVsIG9uIE1TRE9TLlxyXG5cdFx0Ly8gVG8gZG86IHVzZSB0aGUgdXNlciBpbnB1dCBidWZmZXIgYXMgc2xpZGluZyB3aW5kb3cuXHJcblxyXG5cdFx0dmFyIHdpbmRvd19zaXplO1xyXG5cdFx0Ly8gQWN0dWFsIHNpemUgb2Ygd2luZG93OiAyKndTaXplLCBleGNlcHQgd2hlbiB0aGUgdXNlciBpbnB1dCBidWZmZXJcclxuXHRcdC8vIGlzIGRpcmVjdGx5IHVzZWQgYXMgc2xpZGluZyB3aW5kb3cuXHJcblxyXG5cdFx0dmFyIHByZXY7XHJcblx0XHQvLyBMaW5rIHRvIG9sZGVyIHN0cmluZyB3aXRoIHNhbWUgaGFzaCBpbmRleC4gVG8gbGltaXQgdGhlIHNpemUgb2YgdGhpc1xyXG5cdFx0Ly8gYXJyYXkgdG8gNjRLLCB0aGlzIGxpbmsgaXMgbWFpbnRhaW5lZCBvbmx5IGZvciB0aGUgbGFzdCAzMksgc3RyaW5ncy5cclxuXHRcdC8vIEFuIGluZGV4IGluIHRoaXMgYXJyYXkgaXMgdGh1cyBhIHdpbmRvdyBpbmRleCBtb2R1bG8gMzJLLlxyXG5cclxuXHRcdHZhciBoZWFkOyAvLyBIZWFkcyBvZiB0aGUgaGFzaCBjaGFpbnMgb3IgTklMLlxyXG5cclxuXHRcdHZhciBpbnNfaDsgLy8gaGFzaCBpbmRleCBvZiBzdHJpbmcgdG8gYmUgaW5zZXJ0ZWRcclxuXHRcdHZhciBoYXNoX3NpemU7IC8vIG51bWJlciBvZiBlbGVtZW50cyBpbiBoYXNoIHRhYmxlXHJcblx0XHR2YXIgaGFzaF9iaXRzOyAvLyBsb2cyKGhhc2hfc2l6ZSlcclxuXHRcdHZhciBoYXNoX21hc2s7IC8vIGhhc2hfc2l6ZS0xXHJcblxyXG5cdFx0Ly8gTnVtYmVyIG9mIGJpdHMgYnkgd2hpY2ggaW5zX2ggbXVzdCBiZSBzaGlmdGVkIGF0IGVhY2ggaW5wdXRcclxuXHRcdC8vIHN0ZXAuIEl0IG11c3QgYmUgc3VjaCB0aGF0IGFmdGVyIE1JTl9NQVRDSCBzdGVwcywgdGhlIG9sZGVzdFxyXG5cdFx0Ly8gYnl0ZSBubyBsb25nZXIgdGFrZXMgcGFydCBpbiB0aGUgaGFzaCBrZXksIHRoYXQgaXM6XHJcblx0XHQvLyBoYXNoX3NoaWZ0ICogTUlOX01BVENIID49IGhhc2hfYml0c1xyXG5cdFx0dmFyIGhhc2hfc2hpZnQ7XHJcblxyXG5cdFx0Ly8gV2luZG93IHBvc2l0aW9uIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGN1cnJlbnQgb3V0cHV0IGJsb2NrLiBHZXRzXHJcblx0XHQvLyBuZWdhdGl2ZSB3aGVuIHRoZSB3aW5kb3cgaXMgbW92ZWQgYmFja3dhcmRzLlxyXG5cclxuXHRcdHZhciBibG9ja19zdGFydDtcclxuXHJcblx0XHR2YXIgbWF0Y2hfbGVuZ3RoOyAvLyBsZW5ndGggb2YgYmVzdCBtYXRjaFxyXG5cdFx0dmFyIHByZXZfbWF0Y2g7IC8vIHByZXZpb3VzIG1hdGNoXHJcblx0XHR2YXIgbWF0Y2hfYXZhaWxhYmxlOyAvLyBzZXQgaWYgcHJldmlvdXMgbWF0Y2ggZXhpc3RzXHJcblx0XHR2YXIgc3Ryc3RhcnQ7IC8vIHN0YXJ0IG9mIHN0cmluZyB0byBpbnNlcnRcclxuXHRcdHZhciBtYXRjaF9zdGFydDsgLy8gc3RhcnQgb2YgbWF0Y2hpbmcgc3RyaW5nXHJcblx0XHR2YXIgbG9va2FoZWFkOyAvLyBudW1iZXIgb2YgdmFsaWQgYnl0ZXMgYWhlYWQgaW4gd2luZG93XHJcblxyXG5cdFx0Ly8gTGVuZ3RoIG9mIHRoZSBiZXN0IG1hdGNoIGF0IHByZXZpb3VzIHN0ZXAuIE1hdGNoZXMgbm90IGdyZWF0ZXIgdGhhbiB0aGlzXHJcblx0XHQvLyBhcmUgZGlzY2FyZGVkLiBUaGlzIGlzIHVzZWQgaW4gdGhlIGxhenkgbWF0Y2ggZXZhbHVhdGlvbi5cclxuXHRcdHZhciBwcmV2X2xlbmd0aDtcclxuXHJcblx0XHQvLyBUbyBzcGVlZCB1cCBkZWZsYXRpb24sIGhhc2ggY2hhaW5zIGFyZSBuZXZlciBzZWFyY2hlZCBiZXlvbmQgdGhpc1xyXG5cdFx0Ly8gbGVuZ3RoLiBBIGhpZ2hlciBsaW1pdCBpbXByb3ZlcyBjb21wcmVzc2lvbiByYXRpbyBidXQgZGVncmFkZXMgdGhlIHNwZWVkLlxyXG5cdFx0dmFyIG1heF9jaGFpbl9sZW5ndGg7XHJcblxyXG5cdFx0Ly8gQXR0ZW1wdCB0byBmaW5kIGEgYmV0dGVyIG1hdGNoIG9ubHkgd2hlbiB0aGUgY3VycmVudCBtYXRjaCBpcyBzdHJpY3RseVxyXG5cdFx0Ly8gc21hbGxlciB0aGFuIHRoaXMgdmFsdWUuIFRoaXMgbWVjaGFuaXNtIGlzIHVzZWQgb25seSBmb3IgY29tcHJlc3Npb25cclxuXHRcdC8vIGxldmVscyA+PSA0LlxyXG5cdFx0dmFyIG1heF9sYXp5X21hdGNoO1xyXG5cclxuXHRcdC8vIEluc2VydCBuZXcgc3RyaW5ncyBpbiB0aGUgaGFzaCB0YWJsZSBvbmx5IGlmIHRoZSBtYXRjaCBsZW5ndGggaXMgbm90XHJcblx0XHQvLyBncmVhdGVyIHRoYW4gdGhpcyBsZW5ndGguIFRoaXMgc2F2ZXMgdGltZSBidXQgZGVncmFkZXMgY29tcHJlc3Npb24uXHJcblx0XHQvLyBtYXhfaW5zZXJ0X2xlbmd0aCBpcyB1c2VkIG9ubHkgZm9yIGNvbXByZXNzaW9uIGxldmVscyA8PSAzLlxyXG5cclxuXHRcdHZhciBsZXZlbDsgLy8gY29tcHJlc3Npb24gbGV2ZWwgKDEuLjkpXHJcblx0XHR2YXIgc3RyYXRlZ3k7IC8vIGZhdm9yIG9yIGZvcmNlIEh1ZmZtYW4gY29kaW5nXHJcblxyXG5cdFx0Ly8gVXNlIGEgZmFzdGVyIHNlYXJjaCB3aGVuIHRoZSBwcmV2aW91cyBtYXRjaCBpcyBsb25nZXIgdGhhbiB0aGlzXHJcblx0XHR2YXIgZ29vZF9tYXRjaDtcclxuXHJcblx0XHQvLyBTdG9wIHNlYXJjaGluZyB3aGVuIGN1cnJlbnQgbWF0Y2ggZXhjZWVkcyB0aGlzXHJcblx0XHR2YXIgbmljZV9tYXRjaDtcclxuXHJcblx0XHR2YXIgZHluX2x0cmVlOyAvLyBsaXRlcmFsIGFuZCBsZW5ndGggdHJlZVxyXG5cdFx0dmFyIGR5bl9kdHJlZTsgLy8gZGlzdGFuY2UgdHJlZVxyXG5cdFx0dmFyIGJsX3RyZWU7IC8vIEh1ZmZtYW4gdHJlZSBmb3IgYml0IGxlbmd0aHNcclxuXHJcblx0XHR2YXIgbF9kZXNjID0gbmV3IFRyZWUoKTsgLy8gZGVzYyBmb3IgbGl0ZXJhbCB0cmVlXHJcblx0XHR2YXIgZF9kZXNjID0gbmV3IFRyZWUoKTsgLy8gZGVzYyBmb3IgZGlzdGFuY2UgdHJlZVxyXG5cdFx0dmFyIGJsX2Rlc2MgPSBuZXcgVHJlZSgpOyAvLyBkZXNjIGZvciBiaXQgbGVuZ3RoIHRyZWVcclxuXHJcblx0XHQvLyB0aGF0LmhlYXBfbGVuOyAvLyBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGhlYXBcclxuXHRcdC8vIHRoYXQuaGVhcF9tYXg7IC8vIGVsZW1lbnQgb2YgbGFyZ2VzdCBmcmVxdWVuY3lcclxuXHRcdC8vIFRoZSBzb25zIG9mIGhlYXBbbl0gYXJlIGhlYXBbMipuXSBhbmQgaGVhcFsyKm4rMV0uIGhlYXBbMF0gaXMgbm90IHVzZWQuXHJcblx0XHQvLyBUaGUgc2FtZSBoZWFwIGFycmF5IGlzIHVzZWQgdG8gYnVpbGQgYWxsIHRyZWVzLlxyXG5cclxuXHRcdC8vIERlcHRoIG9mIGVhY2ggc3VidHJlZSB1c2VkIGFzIHRpZSBicmVha2VyIGZvciB0cmVlcyBvZiBlcXVhbCBmcmVxdWVuY3lcclxuXHRcdHRoYXQuZGVwdGggPSBbXTtcclxuXHJcblx0XHR2YXIgbF9idWY7IC8vIGluZGV4IGZvciBsaXRlcmFscyBvciBsZW5ndGhzICovXHJcblxyXG5cdFx0Ly8gU2l6ZSBvZiBtYXRjaCBidWZmZXIgZm9yIGxpdGVyYWxzL2xlbmd0aHMuIFRoZXJlIGFyZSA0IHJlYXNvbnMgZm9yXHJcblx0XHQvLyBsaW1pdGluZyBsaXRfYnVmc2l6ZSB0byA2NEs6XHJcblx0XHQvLyAtIGZyZXF1ZW5jaWVzIGNhbiBiZSBrZXB0IGluIDE2IGJpdCBjb3VudGVyc1xyXG5cdFx0Ly8gLSBpZiBjb21wcmVzc2lvbiBpcyBub3Qgc3VjY2Vzc2Z1bCBmb3IgdGhlIGZpcnN0IGJsb2NrLCBhbGwgaW5wdXRcclxuXHRcdC8vIGRhdGEgaXMgc3RpbGwgaW4gdGhlIHdpbmRvdyBzbyB3ZSBjYW4gc3RpbGwgZW1pdCBhIHN0b3JlZCBibG9jayBldmVuXHJcblx0XHQvLyB3aGVuIGlucHV0IGNvbWVzIGZyb20gc3RhbmRhcmQgaW5wdXQuIChUaGlzIGNhbiBhbHNvIGJlIGRvbmUgZm9yXHJcblx0XHQvLyBhbGwgYmxvY2tzIGlmIGxpdF9idWZzaXplIGlzIG5vdCBncmVhdGVyIHRoYW4gMzJLLilcclxuXHRcdC8vIC0gaWYgY29tcHJlc3Npb24gaXMgbm90IHN1Y2Nlc3NmdWwgZm9yIGEgZmlsZSBzbWFsbGVyIHRoYW4gNjRLLCB3ZSBjYW5cclxuXHRcdC8vIGV2ZW4gZW1pdCBhIHN0b3JlZCBmaWxlIGluc3RlYWQgb2YgYSBzdG9yZWQgYmxvY2sgKHNhdmluZyA1IGJ5dGVzKS5cclxuXHRcdC8vIFRoaXMgaXMgYXBwbGljYWJsZSBvbmx5IGZvciB6aXAgKG5vdCBnemlwIG9yIHpsaWIpLlxyXG5cdFx0Ly8gLSBjcmVhdGluZyBuZXcgSHVmZm1hbiB0cmVlcyBsZXNzIGZyZXF1ZW50bHkgbWF5IG5vdCBwcm92aWRlIGZhc3RcclxuXHRcdC8vIGFkYXB0YXRpb24gdG8gY2hhbmdlcyBpbiB0aGUgaW5wdXQgZGF0YSBzdGF0aXN0aWNzLiAoVGFrZSBmb3JcclxuXHRcdC8vIGV4YW1wbGUgYSBiaW5hcnkgZmlsZSB3aXRoIHBvb3JseSBjb21wcmVzc2libGUgY29kZSBmb2xsb3dlZCBieVxyXG5cdFx0Ly8gYSBoaWdobHkgY29tcHJlc3NpYmxlIHN0cmluZyB0YWJsZS4pIFNtYWxsZXIgYnVmZmVyIHNpemVzIGdpdmVcclxuXHRcdC8vIGZhc3QgYWRhcHRhdGlvbiBidXQgaGF2ZSBvZiBjb3Vyc2UgdGhlIG92ZXJoZWFkIG9mIHRyYW5zbWl0dGluZ1xyXG5cdFx0Ly8gdHJlZXMgbW9yZSBmcmVxdWVudGx5LlxyXG5cdFx0Ly8gLSBJIGNhbid0IGNvdW50IGFib3ZlIDRcclxuXHRcdHZhciBsaXRfYnVmc2l6ZTtcclxuXHJcblx0XHR2YXIgbGFzdF9saXQ7IC8vIHJ1bm5pbmcgaW5kZXggaW4gbF9idWZcclxuXHJcblx0XHQvLyBCdWZmZXIgZm9yIGRpc3RhbmNlcy4gVG8gc2ltcGxpZnkgdGhlIGNvZGUsIGRfYnVmIGFuZCBsX2J1ZiBoYXZlXHJcblx0XHQvLyB0aGUgc2FtZSBudW1iZXIgb2YgZWxlbWVudHMuIFRvIHVzZSBkaWZmZXJlbnQgbGVuZ3RocywgYW4gZXh0cmEgZmxhZ1xyXG5cdFx0Ly8gYXJyYXkgd291bGQgYmUgbmVjZXNzYXJ5LlxyXG5cclxuXHRcdHZhciBkX2J1ZjsgLy8gaW5kZXggb2YgcGVuZGlnX2J1ZlxyXG5cclxuXHRcdC8vIHRoYXQub3B0X2xlbjsgLy8gYml0IGxlbmd0aCBvZiBjdXJyZW50IGJsb2NrIHdpdGggb3B0aW1hbCB0cmVlc1xyXG5cdFx0Ly8gdGhhdC5zdGF0aWNfbGVuOyAvLyBiaXQgbGVuZ3RoIG9mIGN1cnJlbnQgYmxvY2sgd2l0aCBzdGF0aWMgdHJlZXNcclxuXHRcdHZhciBtYXRjaGVzOyAvLyBudW1iZXIgb2Ygc3RyaW5nIG1hdGNoZXMgaW4gY3VycmVudCBibG9ja1xyXG5cdFx0dmFyIGxhc3RfZW9iX2xlbjsgLy8gYml0IGxlbmd0aCBvZiBFT0IgY29kZSBmb3IgbGFzdCBibG9ja1xyXG5cclxuXHRcdC8vIE91dHB1dCBidWZmZXIuIGJpdHMgYXJlIGluc2VydGVkIHN0YXJ0aW5nIGF0IHRoZSBib3R0b20gKGxlYXN0XHJcblx0XHQvLyBzaWduaWZpY2FudCBiaXRzKS5cclxuXHRcdHZhciBiaV9idWY7XHJcblxyXG5cdFx0Ly8gTnVtYmVyIG9mIHZhbGlkIGJpdHMgaW4gYmlfYnVmLiBBbGwgYml0cyBhYm92ZSB0aGUgbGFzdCB2YWxpZCBiaXRcclxuXHRcdC8vIGFyZSBhbHdheXMgemVyby5cclxuXHRcdHZhciBiaV92YWxpZDtcclxuXHJcblx0XHQvLyBudW1iZXIgb2YgY29kZXMgYXQgZWFjaCBiaXQgbGVuZ3RoIGZvciBhbiBvcHRpbWFsIHRyZWVcclxuXHRcdHRoYXQuYmxfY291bnQgPSBbXTtcclxuXHJcblx0XHQvLyBoZWFwIHVzZWQgdG8gYnVpbGQgdGhlIEh1ZmZtYW4gdHJlZXNcclxuXHRcdHRoYXQuaGVhcCA9IFtdO1xyXG5cclxuXHRcdGR5bl9sdHJlZSA9IFtdO1xyXG5cdFx0ZHluX2R0cmVlID0gW107XHJcblx0XHRibF90cmVlID0gW107XHJcblxyXG5cdFx0ZnVuY3Rpb24gbG1faW5pdCgpIHtcclxuXHRcdFx0dmFyIGk7XHJcblx0XHRcdHdpbmRvd19zaXplID0gMiAqIHdfc2l6ZTtcclxuXHJcblx0XHRcdGhlYWRbaGFzaF9zaXplIC0gMV0gPSAwO1xyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgaGFzaF9zaXplIC0gMTsgaSsrKSB7XHJcblx0XHRcdFx0aGVhZFtpXSA9IDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNldCB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnM6XHJcblx0XHRcdG1heF9sYXp5X21hdGNoID0gY29uZmlnX3RhYmxlW2xldmVsXS5tYXhfbGF6eTtcclxuXHRcdFx0Z29vZF9tYXRjaCA9IGNvbmZpZ190YWJsZVtsZXZlbF0uZ29vZF9sZW5ndGg7XHJcblx0XHRcdG5pY2VfbWF0Y2ggPSBjb25maWdfdGFibGVbbGV2ZWxdLm5pY2VfbGVuZ3RoO1xyXG5cdFx0XHRtYXhfY2hhaW5fbGVuZ3RoID0gY29uZmlnX3RhYmxlW2xldmVsXS5tYXhfY2hhaW47XHJcblxyXG5cdFx0XHRzdHJzdGFydCA9IDA7XHJcblx0XHRcdGJsb2NrX3N0YXJ0ID0gMDtcclxuXHRcdFx0bG9va2FoZWFkID0gMDtcclxuXHRcdFx0bWF0Y2hfbGVuZ3RoID0gcHJldl9sZW5ndGggPSBNSU5fTUFUQ0ggLSAxO1xyXG5cdFx0XHRtYXRjaF9hdmFpbGFibGUgPSAwO1xyXG5cdFx0XHRpbnNfaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gaW5pdF9ibG9jaygpIHtcclxuXHRcdFx0dmFyIGk7XHJcblx0XHRcdC8vIEluaXRpYWxpemUgdGhlIHRyZWVzLlxyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgTF9DT0RFUzsgaSsrKVxyXG5cdFx0XHRcdGR5bl9sdHJlZVtpICogMl0gPSAwO1xyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgRF9DT0RFUzsgaSsrKVxyXG5cdFx0XHRcdGR5bl9kdHJlZVtpICogMl0gPSAwO1xyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgQkxfQ09ERVM7IGkrKylcclxuXHRcdFx0XHRibF90cmVlW2kgKiAyXSA9IDA7XHJcblxyXG5cdFx0XHRkeW5fbHRyZWVbRU5EX0JMT0NLICogMl0gPSAxO1xyXG5cdFx0XHR0aGF0Lm9wdF9sZW4gPSB0aGF0LnN0YXRpY19sZW4gPSAwO1xyXG5cdFx0XHRsYXN0X2xpdCA9IG1hdGNoZXMgPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHRyZWUgZGF0YSBzdHJ1Y3R1cmVzIGZvciBhIG5ldyB6bGliIHN0cmVhbS5cclxuXHRcdGZ1bmN0aW9uIHRyX2luaXQoKSB7XHJcblxyXG5cdFx0XHRsX2Rlc2MuZHluX3RyZWUgPSBkeW5fbHRyZWU7XHJcblx0XHRcdGxfZGVzYy5zdGF0X2Rlc2MgPSBTdGF0aWNUcmVlLnN0YXRpY19sX2Rlc2M7XHJcblxyXG5cdFx0XHRkX2Rlc2MuZHluX3RyZWUgPSBkeW5fZHRyZWU7XHJcblx0XHRcdGRfZGVzYy5zdGF0X2Rlc2MgPSBTdGF0aWNUcmVlLnN0YXRpY19kX2Rlc2M7XHJcblxyXG5cdFx0XHRibF9kZXNjLmR5bl90cmVlID0gYmxfdHJlZTtcclxuXHRcdFx0YmxfZGVzYy5zdGF0X2Rlc2MgPSBTdGF0aWNUcmVlLnN0YXRpY19ibF9kZXNjO1xyXG5cclxuXHRcdFx0YmlfYnVmID0gMDtcclxuXHRcdFx0YmlfdmFsaWQgPSAwO1xyXG5cdFx0XHRsYXN0X2VvYl9sZW4gPSA4OyAvLyBlbm91Z2ggbG9va2FoZWFkIGZvciBpbmZsYXRlXHJcblxyXG5cdFx0XHQvLyBJbml0aWFsaXplIHRoZSBmaXJzdCBibG9jayBvZiB0aGUgZmlyc3QgZmlsZTpcclxuXHRcdFx0aW5pdF9ibG9jaygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlc3RvcmUgdGhlIGhlYXAgcHJvcGVydHkgYnkgbW92aW5nIGRvd24gdGhlIHRyZWUgc3RhcnRpbmcgYXQgbm9kZSBrLFxyXG5cdFx0Ly8gZXhjaGFuZ2luZyBhIG5vZGUgd2l0aCB0aGUgc21hbGxlc3Qgb2YgaXRzIHR3byBzb25zIGlmIG5lY2Vzc2FyeSxcclxuXHRcdC8vIHN0b3BwaW5nXHJcblx0XHQvLyB3aGVuIHRoZSBoZWFwIHByb3BlcnR5IGlzIHJlLWVzdGFibGlzaGVkIChlYWNoIGZhdGhlciBzbWFsbGVyIHRoYW4gaXRzXHJcblx0XHQvLyB0d28gc29ucykuXHJcblx0XHR0aGF0LnBxZG93bmhlYXAgPSBmdW5jdGlvbih0cmVlLCAvLyB0aGUgdHJlZSB0byByZXN0b3JlXHJcblx0XHRrIC8vIG5vZGUgdG8gbW92ZSBkb3duXHJcblx0XHQpIHtcclxuXHRcdFx0dmFyIGhlYXAgPSB0aGF0LmhlYXA7XHJcblx0XHRcdHZhciB2ID0gaGVhcFtrXTtcclxuXHRcdFx0dmFyIGogPSBrIDw8IDE7IC8vIGxlZnQgc29uIG9mIGtcclxuXHRcdFx0d2hpbGUgKGogPD0gdGhhdC5oZWFwX2xlbikge1xyXG5cdFx0XHRcdC8vIFNldCBqIHRvIHRoZSBzbWFsbGVzdCBvZiB0aGUgdHdvIHNvbnM6XHJcblx0XHRcdFx0aWYgKGogPCB0aGF0LmhlYXBfbGVuICYmIHNtYWxsZXIodHJlZSwgaGVhcFtqICsgMV0sIGhlYXBbal0sIHRoYXQuZGVwdGgpKSB7XHJcblx0XHRcdFx0XHRqKys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIEV4aXQgaWYgdiBpcyBzbWFsbGVyIHRoYW4gYm90aCBzb25zXHJcblx0XHRcdFx0aWYgKHNtYWxsZXIodHJlZSwgdiwgaGVhcFtqXSwgdGhhdC5kZXB0aCkpXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Ly8gRXhjaGFuZ2UgdiB3aXRoIHRoZSBzbWFsbGVzdCBzb25cclxuXHRcdFx0XHRoZWFwW2tdID0gaGVhcFtqXTtcclxuXHRcdFx0XHRrID0gajtcclxuXHRcdFx0XHQvLyBBbmQgY29udGludWUgZG93biB0aGUgdHJlZSwgc2V0dGluZyBqIHRvIHRoZSBsZWZ0IHNvbiBvZiBrXHJcblx0XHRcdFx0aiA8PD0gMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRoZWFwW2tdID0gdjtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gU2NhbiBhIGxpdGVyYWwgb3IgZGlzdGFuY2UgdHJlZSB0byBkZXRlcm1pbmUgdGhlIGZyZXF1ZW5jaWVzIG9mIHRoZSBjb2Rlc1xyXG5cdFx0Ly8gaW4gdGhlIGJpdCBsZW5ndGggdHJlZS5cclxuXHRcdGZ1bmN0aW9uIHNjYW5fdHJlZSh0cmVlLC8vIHRoZSB0cmVlIHRvIGJlIHNjYW5uZWRcclxuXHRcdG1heF9jb2RlIC8vIGFuZCBpdHMgbGFyZ2VzdCBjb2RlIG9mIG5vbiB6ZXJvIGZyZXF1ZW5jeVxyXG5cdFx0KSB7XHJcblx0XHRcdHZhciBuOyAvLyBpdGVyYXRlcyBvdmVyIGFsbCB0cmVlIGVsZW1lbnRzXHJcblx0XHRcdHZhciBwcmV2bGVuID0gLTE7IC8vIGxhc3QgZW1pdHRlZCBsZW5ndGhcclxuXHRcdFx0dmFyIGN1cmxlbjsgLy8gbGVuZ3RoIG9mIGN1cnJlbnQgY29kZVxyXG5cdFx0XHR2YXIgbmV4dGxlbiA9IHRyZWVbMCAqIDIgKyAxXTsgLy8gbGVuZ3RoIG9mIG5leHQgY29kZVxyXG5cdFx0XHR2YXIgY291bnQgPSAwOyAvLyByZXBlYXQgY291bnQgb2YgdGhlIGN1cnJlbnQgY29kZVxyXG5cdFx0XHR2YXIgbWF4X2NvdW50ID0gNzsgLy8gbWF4IHJlcGVhdCBjb3VudFxyXG5cdFx0XHR2YXIgbWluX2NvdW50ID0gNDsgLy8gbWluIHJlcGVhdCBjb3VudFxyXG5cclxuXHRcdFx0aWYgKG5leHRsZW4gPT09IDApIHtcclxuXHRcdFx0XHRtYXhfY291bnQgPSAxMzg7XHJcblx0XHRcdFx0bWluX2NvdW50ID0gMztcclxuXHRcdFx0fVxyXG5cdFx0XHR0cmVlWyhtYXhfY29kZSArIDEpICogMiArIDFdID0gMHhmZmZmOyAvLyBndWFyZFxyXG5cclxuXHRcdFx0Zm9yIChuID0gMDsgbiA8PSBtYXhfY29kZTsgbisrKSB7XHJcblx0XHRcdFx0Y3VybGVuID0gbmV4dGxlbjtcclxuXHRcdFx0XHRuZXh0bGVuID0gdHJlZVsobiArIDEpICogMiArIDFdO1xyXG5cdFx0XHRcdGlmICgrK2NvdW50IDwgbWF4X2NvdW50ICYmIGN1cmxlbiA9PSBuZXh0bGVuKSB7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGNvdW50IDwgbWluX2NvdW50KSB7XHJcblx0XHRcdFx0XHRibF90cmVlW2N1cmxlbiAqIDJdICs9IGNvdW50O1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoY3VybGVuICE9PSAwKSB7XHJcblx0XHRcdFx0XHRpZiAoY3VybGVuICE9IHByZXZsZW4pXHJcblx0XHRcdFx0XHRcdGJsX3RyZWVbY3VybGVuICogMl0rKztcclxuXHRcdFx0XHRcdGJsX3RyZWVbUkVQXzNfNiAqIDJdKys7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChjb3VudCA8PSAxMCkge1xyXG5cdFx0XHRcdFx0YmxfdHJlZVtSRVBaXzNfMTAgKiAyXSsrO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRibF90cmVlW1JFUFpfMTFfMTM4ICogMl0rKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y291bnQgPSAwO1xyXG5cdFx0XHRcdHByZXZsZW4gPSBjdXJsZW47XHJcblx0XHRcdFx0aWYgKG5leHRsZW4gPT09IDApIHtcclxuXHRcdFx0XHRcdG1heF9jb3VudCA9IDEzODtcclxuXHRcdFx0XHRcdG1pbl9jb3VudCA9IDM7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChjdXJsZW4gPT0gbmV4dGxlbikge1xyXG5cdFx0XHRcdFx0bWF4X2NvdW50ID0gNjtcclxuXHRcdFx0XHRcdG1pbl9jb3VudCA9IDM7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1heF9jb3VudCA9IDc7XHJcblx0XHRcdFx0XHRtaW5fY291bnQgPSA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENvbnN0cnVjdCB0aGUgSHVmZm1hbiB0cmVlIGZvciB0aGUgYml0IGxlbmd0aHMgYW5kIHJldHVybiB0aGUgaW5kZXggaW5cclxuXHRcdC8vIGJsX29yZGVyIG9mIHRoZSBsYXN0IGJpdCBsZW5ndGggY29kZSB0byBzZW5kLlxyXG5cdFx0ZnVuY3Rpb24gYnVpbGRfYmxfdHJlZSgpIHtcclxuXHRcdFx0dmFyIG1heF9ibGluZGV4OyAvLyBpbmRleCBvZiBsYXN0IGJpdCBsZW5ndGggY29kZSBvZiBub24gemVybyBmcmVxXHJcblxyXG5cdFx0XHQvLyBEZXRlcm1pbmUgdGhlIGJpdCBsZW5ndGggZnJlcXVlbmNpZXMgZm9yIGxpdGVyYWwgYW5kIGRpc3RhbmNlIHRyZWVzXHJcblx0XHRcdHNjYW5fdHJlZShkeW5fbHRyZWUsIGxfZGVzYy5tYXhfY29kZSk7XHJcblx0XHRcdHNjYW5fdHJlZShkeW5fZHRyZWUsIGRfZGVzYy5tYXhfY29kZSk7XHJcblxyXG5cdFx0XHQvLyBCdWlsZCB0aGUgYml0IGxlbmd0aCB0cmVlOlxyXG5cdFx0XHRibF9kZXNjLmJ1aWxkX3RyZWUodGhhdCk7XHJcblx0XHRcdC8vIG9wdF9sZW4gbm93IGluY2x1ZGVzIHRoZSBsZW5ndGggb2YgdGhlIHRyZWUgcmVwcmVzZW50YXRpb25zLCBleGNlcHRcclxuXHRcdFx0Ly8gdGhlIGxlbmd0aHMgb2YgdGhlIGJpdCBsZW5ndGhzIGNvZGVzIGFuZCB0aGUgNSs1KzQgYml0cyBmb3IgdGhlXHJcblx0XHRcdC8vIGNvdW50cy5cclxuXHJcblx0XHRcdC8vIERldGVybWluZSB0aGUgbnVtYmVyIG9mIGJpdCBsZW5ndGggY29kZXMgdG8gc2VuZC4gVGhlIHBremlwIGZvcm1hdFxyXG5cdFx0XHQvLyByZXF1aXJlcyB0aGF0IGF0IGxlYXN0IDQgYml0IGxlbmd0aCBjb2RlcyBiZSBzZW50LiAoYXBwbm90ZS50eHQgc2F5c1xyXG5cdFx0XHQvLyAzIGJ1dCB0aGUgYWN0dWFsIHZhbHVlIHVzZWQgaXMgNC4pXHJcblx0XHRcdGZvciAobWF4X2JsaW5kZXggPSBCTF9DT0RFUyAtIDE7IG1heF9ibGluZGV4ID49IDM7IG1heF9ibGluZGV4LS0pIHtcclxuXHRcdFx0XHRpZiAoYmxfdHJlZVtUcmVlLmJsX29yZGVyW21heF9ibGluZGV4XSAqIDIgKyAxXSAhPT0gMClcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFVwZGF0ZSBvcHRfbGVuIHRvIGluY2x1ZGUgdGhlIGJpdCBsZW5ndGggdHJlZSBhbmQgY291bnRzXHJcblx0XHRcdHRoYXQub3B0X2xlbiArPSAzICogKG1heF9ibGluZGV4ICsgMSkgKyA1ICsgNSArIDQ7XHJcblxyXG5cdFx0XHRyZXR1cm4gbWF4X2JsaW5kZXg7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT3V0cHV0IGEgYnl0ZSBvbiB0aGUgc3RyZWFtLlxyXG5cdFx0Ly8gSU4gYXNzZXJ0aW9uOiB0aGVyZSBpcyBlbm91Z2ggcm9vbSBpbiBwZW5kaW5nX2J1Zi5cclxuXHRcdGZ1bmN0aW9uIHB1dF9ieXRlKHApIHtcclxuXHRcdFx0dGhhdC5wZW5kaW5nX2J1Zlt0aGF0LnBlbmRpbmcrK10gPSBwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHB1dF9zaG9ydCh3KSB7XHJcblx0XHRcdHB1dF9ieXRlKHcgJiAweGZmKTtcclxuXHRcdFx0cHV0X2J5dGUoKHcgPj4+IDgpICYgMHhmZik7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gcHV0U2hvcnRNU0IoYikge1xyXG5cdFx0XHRwdXRfYnl0ZSgoYiA+PiA4KSAmIDB4ZmYpO1xyXG5cdFx0XHRwdXRfYnl0ZSgoYiAmIDB4ZmYpICYgMHhmZik7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2VuZF9iaXRzKHZhbHVlLCBsZW5ndGgpIHtcclxuXHRcdFx0dmFyIHZhbCwgbGVuID0gbGVuZ3RoO1xyXG5cdFx0XHRpZiAoYmlfdmFsaWQgPiBCdWZfc2l6ZSAtIGxlbikge1xyXG5cdFx0XHRcdHZhbCA9IHZhbHVlO1xyXG5cdFx0XHRcdC8vIGJpX2J1ZiB8PSAodmFsIDw8IGJpX3ZhbGlkKTtcclxuXHRcdFx0XHRiaV9idWYgfD0gKCh2YWwgPDwgYmlfdmFsaWQpICYgMHhmZmZmKTtcclxuXHRcdFx0XHRwdXRfc2hvcnQoYmlfYnVmKTtcclxuXHRcdFx0XHRiaV9idWYgPSB2YWwgPj4+IChCdWZfc2l6ZSAtIGJpX3ZhbGlkKTtcclxuXHRcdFx0XHRiaV92YWxpZCArPSBsZW4gLSBCdWZfc2l6ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBiaV9idWYgfD0gKHZhbHVlKSA8PCBiaV92YWxpZDtcclxuXHRcdFx0XHRiaV9idWYgfD0gKCgodmFsdWUpIDw8IGJpX3ZhbGlkKSAmIDB4ZmZmZik7XHJcblx0XHRcdFx0YmlfdmFsaWQgKz0gbGVuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2VuZF9jb2RlKGMsIHRyZWUpIHtcclxuXHRcdFx0dmFyIGMyID0gYyAqIDI7XHJcblx0XHRcdHNlbmRfYml0cyh0cmVlW2MyXSAmIDB4ZmZmZiwgdHJlZVtjMiArIDFdICYgMHhmZmZmKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZW5kIGEgbGl0ZXJhbCBvciBkaXN0YW5jZSB0cmVlIGluIGNvbXByZXNzZWQgZm9ybSwgdXNpbmcgdGhlIGNvZGVzIGluXHJcblx0XHQvLyBibF90cmVlLlxyXG5cdFx0ZnVuY3Rpb24gc2VuZF90cmVlKHRyZWUsLy8gdGhlIHRyZWUgdG8gYmUgc2VudFxyXG5cdFx0bWF4X2NvZGUgLy8gYW5kIGl0cyBsYXJnZXN0IGNvZGUgb2Ygbm9uIHplcm8gZnJlcXVlbmN5XHJcblx0XHQpIHtcclxuXHRcdFx0dmFyIG47IC8vIGl0ZXJhdGVzIG92ZXIgYWxsIHRyZWUgZWxlbWVudHNcclxuXHRcdFx0dmFyIHByZXZsZW4gPSAtMTsgLy8gbGFzdCBlbWl0dGVkIGxlbmd0aFxyXG5cdFx0XHR2YXIgY3VybGVuOyAvLyBsZW5ndGggb2YgY3VycmVudCBjb2RlXHJcblx0XHRcdHZhciBuZXh0bGVuID0gdHJlZVswICogMiArIDFdOyAvLyBsZW5ndGggb2YgbmV4dCBjb2RlXHJcblx0XHRcdHZhciBjb3VudCA9IDA7IC8vIHJlcGVhdCBjb3VudCBvZiB0aGUgY3VycmVudCBjb2RlXHJcblx0XHRcdHZhciBtYXhfY291bnQgPSA3OyAvLyBtYXggcmVwZWF0IGNvdW50XHJcblx0XHRcdHZhciBtaW5fY291bnQgPSA0OyAvLyBtaW4gcmVwZWF0IGNvdW50XHJcblxyXG5cdFx0XHRpZiAobmV4dGxlbiA9PT0gMCkge1xyXG5cdFx0XHRcdG1heF9jb3VudCA9IDEzODtcclxuXHRcdFx0XHRtaW5fY291bnQgPSAzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmb3IgKG4gPSAwOyBuIDw9IG1heF9jb2RlOyBuKyspIHtcclxuXHRcdFx0XHRjdXJsZW4gPSBuZXh0bGVuO1xyXG5cdFx0XHRcdG5leHRsZW4gPSB0cmVlWyhuICsgMSkgKiAyICsgMV07XHJcblx0XHRcdFx0aWYgKCsrY291bnQgPCBtYXhfY291bnQgJiYgY3VybGVuID09IG5leHRsZW4pIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoY291bnQgPCBtaW5fY291bnQpIHtcclxuXHRcdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdFx0c2VuZF9jb2RlKGN1cmxlbiwgYmxfdHJlZSk7XHJcblx0XHRcdFx0XHR9IHdoaWxlICgtLWNvdW50ICE9PSAwKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGN1cmxlbiAhPT0gMCkge1xyXG5cdFx0XHRcdFx0aWYgKGN1cmxlbiAhPSBwcmV2bGVuKSB7XHJcblx0XHRcdFx0XHRcdHNlbmRfY29kZShjdXJsZW4sIGJsX3RyZWUpO1xyXG5cdFx0XHRcdFx0XHRjb3VudC0tO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c2VuZF9jb2RlKFJFUF8zXzYsIGJsX3RyZWUpO1xyXG5cdFx0XHRcdFx0c2VuZF9iaXRzKGNvdW50IC0gMywgMik7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChjb3VudCA8PSAxMCkge1xyXG5cdFx0XHRcdFx0c2VuZF9jb2RlKFJFUFpfM18xMCwgYmxfdHJlZSk7XHJcblx0XHRcdFx0XHRzZW5kX2JpdHMoY291bnQgLSAzLCAzKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2VuZF9jb2RlKFJFUFpfMTFfMTM4LCBibF90cmVlKTtcclxuXHRcdFx0XHRcdHNlbmRfYml0cyhjb3VudCAtIDExLCA3KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y291bnQgPSAwO1xyXG5cdFx0XHRcdHByZXZsZW4gPSBjdXJsZW47XHJcblx0XHRcdFx0aWYgKG5leHRsZW4gPT09IDApIHtcclxuXHRcdFx0XHRcdG1heF9jb3VudCA9IDEzODtcclxuXHRcdFx0XHRcdG1pbl9jb3VudCA9IDM7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChjdXJsZW4gPT0gbmV4dGxlbikge1xyXG5cdFx0XHRcdFx0bWF4X2NvdW50ID0gNjtcclxuXHRcdFx0XHRcdG1pbl9jb3VudCA9IDM7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1heF9jb3VudCA9IDc7XHJcblx0XHRcdFx0XHRtaW5fY291bnQgPSA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNlbmQgdGhlIGhlYWRlciBmb3IgYSBibG9jayB1c2luZyBkeW5hbWljIEh1ZmZtYW4gdHJlZXM6IHRoZSBjb3VudHMsIHRoZVxyXG5cdFx0Ly8gbGVuZ3RocyBvZiB0aGUgYml0IGxlbmd0aCBjb2RlcywgdGhlIGxpdGVyYWwgdHJlZSBhbmQgdGhlIGRpc3RhbmNlIHRyZWUuXHJcblx0XHQvLyBJTiBhc3NlcnRpb246IGxjb2RlcyA+PSAyNTcsIGRjb2RlcyA+PSAxLCBibGNvZGVzID49IDQuXHJcblx0XHRmdW5jdGlvbiBzZW5kX2FsbF90cmVlcyhsY29kZXMsIGRjb2RlcywgYmxjb2Rlcykge1xyXG5cdFx0XHR2YXIgcmFuazsgLy8gaW5kZXggaW4gYmxfb3JkZXJcclxuXHJcblx0XHRcdHNlbmRfYml0cyhsY29kZXMgLSAyNTcsIDUpOyAvLyBub3QgKzI1NSBhcyBzdGF0ZWQgaW4gYXBwbm90ZS50eHRcclxuXHRcdFx0c2VuZF9iaXRzKGRjb2RlcyAtIDEsIDUpO1xyXG5cdFx0XHRzZW5kX2JpdHMoYmxjb2RlcyAtIDQsIDQpOyAvLyBub3QgLTMgYXMgc3RhdGVkIGluIGFwcG5vdGUudHh0XHJcblx0XHRcdGZvciAocmFuayA9IDA7IHJhbmsgPCBibGNvZGVzOyByYW5rKyspIHtcclxuXHRcdFx0XHRzZW5kX2JpdHMoYmxfdHJlZVtUcmVlLmJsX29yZGVyW3JhbmtdICogMiArIDFdLCAzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzZW5kX3RyZWUoZHluX2x0cmVlLCBsY29kZXMgLSAxKTsgLy8gbGl0ZXJhbCB0cmVlXHJcblx0XHRcdHNlbmRfdHJlZShkeW5fZHRyZWUsIGRjb2RlcyAtIDEpOyAvLyBkaXN0YW5jZSB0cmVlXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRmx1c2ggdGhlIGJpdCBidWZmZXIsIGtlZXBpbmcgYXQgbW9zdCA3IGJpdHMgaW4gaXQuXHJcblx0XHRmdW5jdGlvbiBiaV9mbHVzaCgpIHtcclxuXHRcdFx0aWYgKGJpX3ZhbGlkID09IDE2KSB7XHJcblx0XHRcdFx0cHV0X3Nob3J0KGJpX2J1Zik7XHJcblx0XHRcdFx0YmlfYnVmID0gMDtcclxuXHRcdFx0XHRiaV92YWxpZCA9IDA7XHJcblx0XHRcdH0gZWxzZSBpZiAoYmlfdmFsaWQgPj0gOCkge1xyXG5cdFx0XHRcdHB1dF9ieXRlKGJpX2J1ZiAmIDB4ZmYpO1xyXG5cdFx0XHRcdGJpX2J1ZiA+Pj49IDg7XHJcblx0XHRcdFx0YmlfdmFsaWQgLT0gODtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNlbmQgb25lIGVtcHR5IHN0YXRpYyBibG9jayB0byBnaXZlIGVub3VnaCBsb29rYWhlYWQgZm9yIGluZmxhdGUuXHJcblx0XHQvLyBUaGlzIHRha2VzIDEwIGJpdHMsIG9mIHdoaWNoIDcgbWF5IHJlbWFpbiBpbiB0aGUgYml0IGJ1ZmZlci5cclxuXHRcdC8vIFRoZSBjdXJyZW50IGluZmxhdGUgY29kZSByZXF1aXJlcyA5IGJpdHMgb2YgbG9va2FoZWFkLiBJZiB0aGVcclxuXHRcdC8vIGxhc3QgdHdvIGNvZGVzIGZvciB0aGUgcHJldmlvdXMgYmxvY2sgKHJlYWwgY29kZSBwbHVzIEVPQikgd2VyZSBjb2RlZFxyXG5cdFx0Ly8gb24gNSBiaXRzIG9yIGxlc3MsIGluZmxhdGUgbWF5IGhhdmUgb25seSA1KzMgYml0cyBvZiBsb29rYWhlYWQgdG8gZGVjb2RlXHJcblx0XHQvLyB0aGUgbGFzdCByZWFsIGNvZGUuIEluIHRoaXMgY2FzZSB3ZSBzZW5kIHR3byBlbXB0eSBzdGF0aWMgYmxvY2tzIGluc3RlYWRcclxuXHRcdC8vIG9mIG9uZS4gKFRoZXJlIGFyZSBubyBwcm9ibGVtcyBpZiB0aGUgcHJldmlvdXMgYmxvY2sgaXMgc3RvcmVkIG9yIGZpeGVkLilcclxuXHRcdC8vIFRvIHNpbXBsaWZ5IHRoZSBjb2RlLCB3ZSBhc3N1bWUgdGhlIHdvcnN0IGNhc2Ugb2YgbGFzdCByZWFsIGNvZGUgZW5jb2RlZFxyXG5cdFx0Ly8gb24gb25lIGJpdCBvbmx5LlxyXG5cdFx0ZnVuY3Rpb24gX3RyX2FsaWduKCkge1xyXG5cdFx0XHRzZW5kX2JpdHMoU1RBVElDX1RSRUVTIDw8IDEsIDMpO1xyXG5cdFx0XHRzZW5kX2NvZGUoRU5EX0JMT0NLLCBTdGF0aWNUcmVlLnN0YXRpY19sdHJlZSk7XHJcblxyXG5cdFx0XHRiaV9mbHVzaCgpO1xyXG5cclxuXHRcdFx0Ly8gT2YgdGhlIDEwIGJpdHMgZm9yIHRoZSBlbXB0eSBibG9jaywgd2UgaGF2ZSBhbHJlYWR5IHNlbnRcclxuXHRcdFx0Ly8gKDEwIC0gYmlfdmFsaWQpIGJpdHMuIFRoZSBsb29rYWhlYWQgZm9yIHRoZSBsYXN0IHJlYWwgY29kZSAoYmVmb3JlXHJcblx0XHRcdC8vIHRoZSBFT0Igb2YgdGhlIHByZXZpb3VzIGJsb2NrKSB3YXMgdGh1cyBhdCBsZWFzdCBvbmUgcGx1cyB0aGUgbGVuZ3RoXHJcblx0XHRcdC8vIG9mIHRoZSBFT0IgcGx1cyB3aGF0IHdlIGhhdmUganVzdCBzZW50IG9mIHRoZSBlbXB0eSBzdGF0aWMgYmxvY2suXHJcblx0XHRcdGlmICgxICsgbGFzdF9lb2JfbGVuICsgMTAgLSBiaV92YWxpZCA8IDkpIHtcclxuXHRcdFx0XHRzZW5kX2JpdHMoU1RBVElDX1RSRUVTIDw8IDEsIDMpO1xyXG5cdFx0XHRcdHNlbmRfY29kZShFTkRfQkxPQ0ssIFN0YXRpY1RyZWUuc3RhdGljX2x0cmVlKTtcclxuXHRcdFx0XHRiaV9mbHVzaCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxhc3RfZW9iX2xlbiA9IDc7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2F2ZSB0aGUgbWF0Y2ggaW5mbyBhbmQgdGFsbHkgdGhlIGZyZXF1ZW5jeSBjb3VudHMuIFJldHVybiB0cnVlIGlmXHJcblx0XHQvLyB0aGUgY3VycmVudCBibG9jayBtdXN0IGJlIGZsdXNoZWQuXHJcblx0XHRmdW5jdGlvbiBfdHJfdGFsbHkoZGlzdCwgLy8gZGlzdGFuY2Ugb2YgbWF0Y2hlZCBzdHJpbmdcclxuXHRcdGxjIC8vIG1hdGNoIGxlbmd0aC1NSU5fTUFUQ0ggb3IgdW5tYXRjaGVkIGNoYXIgKGlmIGRpc3Q9PTApXHJcblx0XHQpIHtcclxuXHRcdFx0dmFyIG91dF9sZW5ndGgsIGluX2xlbmd0aCwgZGNvZGU7XHJcblx0XHRcdHRoYXQucGVuZGluZ19idWZbZF9idWYgKyBsYXN0X2xpdCAqIDJdID0gKGRpc3QgPj4+IDgpICYgMHhmZjtcclxuXHRcdFx0dGhhdC5wZW5kaW5nX2J1ZltkX2J1ZiArIGxhc3RfbGl0ICogMiArIDFdID0gZGlzdCAmIDB4ZmY7XHJcblxyXG5cdFx0XHR0aGF0LnBlbmRpbmdfYnVmW2xfYnVmICsgbGFzdF9saXRdID0gbGMgJiAweGZmO1xyXG5cdFx0XHRsYXN0X2xpdCsrO1xyXG5cclxuXHRcdFx0aWYgKGRpc3QgPT09IDApIHtcclxuXHRcdFx0XHQvLyBsYyBpcyB0aGUgdW5tYXRjaGVkIGNoYXJcclxuXHRcdFx0XHRkeW5fbHRyZWVbbGMgKiAyXSsrO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1hdGNoZXMrKztcclxuXHRcdFx0XHQvLyBIZXJlLCBsYyBpcyB0aGUgbWF0Y2ggbGVuZ3RoIC0gTUlOX01BVENIXHJcblx0XHRcdFx0ZGlzdC0tOyAvLyBkaXN0ID0gbWF0Y2ggZGlzdGFuY2UgLSAxXHJcblx0XHRcdFx0ZHluX2x0cmVlWyhUcmVlLl9sZW5ndGhfY29kZVtsY10gKyBMSVRFUkFMUyArIDEpICogMl0rKztcclxuXHRcdFx0XHRkeW5fZHRyZWVbVHJlZS5kX2NvZGUoZGlzdCkgKiAyXSsrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoKGxhc3RfbGl0ICYgMHgxZmZmKSA9PT0gMCAmJiBsZXZlbCA+IDIpIHtcclxuXHRcdFx0XHQvLyBDb21wdXRlIGFuIHVwcGVyIGJvdW5kIGZvciB0aGUgY29tcHJlc3NlZCBsZW5ndGhcclxuXHRcdFx0XHRvdXRfbGVuZ3RoID0gbGFzdF9saXQgKiA4O1xyXG5cdFx0XHRcdGluX2xlbmd0aCA9IHN0cnN0YXJ0IC0gYmxvY2tfc3RhcnQ7XHJcblx0XHRcdFx0Zm9yIChkY29kZSA9IDA7IGRjb2RlIDwgRF9DT0RFUzsgZGNvZGUrKykge1xyXG5cdFx0XHRcdFx0b3V0X2xlbmd0aCArPSBkeW5fZHRyZWVbZGNvZGUgKiAyXSAqICg1ICsgVHJlZS5leHRyYV9kYml0c1tkY29kZV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvdXRfbGVuZ3RoID4+Pj0gMztcclxuXHRcdFx0XHRpZiAoKG1hdGNoZXMgPCBNYXRoLmZsb29yKGxhc3RfbGl0IC8gMikpICYmIG91dF9sZW5ndGggPCBNYXRoLmZsb29yKGluX2xlbmd0aCAvIDIpKVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiAobGFzdF9saXQgPT0gbGl0X2J1ZnNpemUgLSAxKTtcclxuXHRcdFx0Ly8gV2UgYXZvaWQgZXF1YWxpdHkgd2l0aCBsaXRfYnVmc2l6ZSBiZWNhdXNlIG9mIHdyYXBhcm91bmQgYXQgNjRLXHJcblx0XHRcdC8vIG9uIDE2IGJpdCBtYWNoaW5lcyBhbmQgYmVjYXVzZSBzdG9yZWQgYmxvY2tzIGFyZSByZXN0cmljdGVkIHRvXHJcblx0XHRcdC8vIDY0Sy0xIGJ5dGVzLlxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNlbmQgdGhlIGJsb2NrIGRhdGEgY29tcHJlc3NlZCB1c2luZyB0aGUgZ2l2ZW4gSHVmZm1hbiB0cmVlc1xyXG5cdFx0ZnVuY3Rpb24gY29tcHJlc3NfYmxvY2sobHRyZWUsIGR0cmVlKSB7XHJcblx0XHRcdHZhciBkaXN0OyAvLyBkaXN0YW5jZSBvZiBtYXRjaGVkIHN0cmluZ1xyXG5cdFx0XHR2YXIgbGM7IC8vIG1hdGNoIGxlbmd0aCBvciB1bm1hdGNoZWQgY2hhciAoaWYgZGlzdCA9PT0gMClcclxuXHRcdFx0dmFyIGx4ID0gMDsgLy8gcnVubmluZyBpbmRleCBpbiBsX2J1ZlxyXG5cdFx0XHR2YXIgY29kZTsgLy8gdGhlIGNvZGUgdG8gc2VuZFxyXG5cdFx0XHR2YXIgZXh0cmE7IC8vIG51bWJlciBvZiBleHRyYSBiaXRzIHRvIHNlbmRcclxuXHJcblx0XHRcdGlmIChsYXN0X2xpdCAhPT0gMCkge1xyXG5cdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdGRpc3QgPSAoKHRoYXQucGVuZGluZ19idWZbZF9idWYgKyBseCAqIDJdIDw8IDgpICYgMHhmZjAwKSB8ICh0aGF0LnBlbmRpbmdfYnVmW2RfYnVmICsgbHggKiAyICsgMV0gJiAweGZmKTtcclxuXHRcdFx0XHRcdGxjID0gKHRoYXQucGVuZGluZ19idWZbbF9idWYgKyBseF0pICYgMHhmZjtcclxuXHRcdFx0XHRcdGx4Kys7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGRpc3QgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0c2VuZF9jb2RlKGxjLCBsdHJlZSk7IC8vIHNlbmQgYSBsaXRlcmFsIGJ5dGVcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIEhlcmUsIGxjIGlzIHRoZSBtYXRjaCBsZW5ndGggLSBNSU5fTUFUQ0hcclxuXHRcdFx0XHRcdFx0Y29kZSA9IFRyZWUuX2xlbmd0aF9jb2RlW2xjXTtcclxuXHJcblx0XHRcdFx0XHRcdHNlbmRfY29kZShjb2RlICsgTElURVJBTFMgKyAxLCBsdHJlZSk7IC8vIHNlbmQgdGhlIGxlbmd0aFxyXG5cdFx0XHRcdFx0XHQvLyBjb2RlXHJcblx0XHRcdFx0XHRcdGV4dHJhID0gVHJlZS5leHRyYV9sYml0c1tjb2RlXTtcclxuXHRcdFx0XHRcdFx0aWYgKGV4dHJhICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0bGMgLT0gVHJlZS5iYXNlX2xlbmd0aFtjb2RlXTtcclxuXHRcdFx0XHRcdFx0XHRzZW5kX2JpdHMobGMsIGV4dHJhKTsgLy8gc2VuZCB0aGUgZXh0cmEgbGVuZ3RoIGJpdHNcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkaXN0LS07IC8vIGRpc3QgaXMgbm93IHRoZSBtYXRjaCBkaXN0YW5jZSAtIDFcclxuXHRcdFx0XHRcdFx0Y29kZSA9IFRyZWUuZF9jb2RlKGRpc3QpO1xyXG5cclxuXHRcdFx0XHRcdFx0c2VuZF9jb2RlKGNvZGUsIGR0cmVlKTsgLy8gc2VuZCB0aGUgZGlzdGFuY2UgY29kZVxyXG5cdFx0XHRcdFx0XHRleHRyYSA9IFRyZWUuZXh0cmFfZGJpdHNbY29kZV07XHJcblx0XHRcdFx0XHRcdGlmIChleHRyYSAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdGRpc3QgLT0gVHJlZS5iYXNlX2Rpc3RbY29kZV07XHJcblx0XHRcdFx0XHRcdFx0c2VuZF9iaXRzKGRpc3QsIGV4dHJhKTsgLy8gc2VuZCB0aGUgZXh0cmEgZGlzdGFuY2UgYml0c1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IC8vIGxpdGVyYWwgb3IgbWF0Y2ggcGFpciA/XHJcblxyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgdGhhdCB0aGUgb3ZlcmxheSBiZXR3ZWVuIHBlbmRpbmdfYnVmIGFuZCBkX2J1ZitsX2J1ZiBpc1xyXG5cdFx0XHRcdFx0Ly8gb2s6XHJcblx0XHRcdFx0fSB3aGlsZSAobHggPCBsYXN0X2xpdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbmRfY29kZShFTkRfQkxPQ0ssIGx0cmVlKTtcclxuXHRcdFx0bGFzdF9lb2JfbGVuID0gbHRyZWVbRU5EX0JMT0NLICogMiArIDFdO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZsdXNoIHRoZSBiaXQgYnVmZmVyIGFuZCBhbGlnbiB0aGUgb3V0cHV0IG9uIGEgYnl0ZSBib3VuZGFyeVxyXG5cdFx0ZnVuY3Rpb24gYmlfd2luZHVwKCkge1xyXG5cdFx0XHRpZiAoYmlfdmFsaWQgPiA4KSB7XHJcblx0XHRcdFx0cHV0X3Nob3J0KGJpX2J1Zik7XHJcblx0XHRcdH0gZWxzZSBpZiAoYmlfdmFsaWQgPiAwKSB7XHJcblx0XHRcdFx0cHV0X2J5dGUoYmlfYnVmICYgMHhmZik7XHJcblx0XHRcdH1cclxuXHRcdFx0YmlfYnVmID0gMDtcclxuXHRcdFx0YmlfdmFsaWQgPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENvcHkgYSBzdG9yZWQgYmxvY2ssIHN0b3JpbmcgZmlyc3QgdGhlIGxlbmd0aCBhbmQgaXRzXHJcblx0XHQvLyBvbmUncyBjb21wbGVtZW50IGlmIHJlcXVlc3RlZC5cclxuXHRcdGZ1bmN0aW9uIGNvcHlfYmxvY2soYnVmLCAvLyB0aGUgaW5wdXQgZGF0YVxyXG5cdFx0bGVuLCAvLyBpdHMgbGVuZ3RoXHJcblx0XHRoZWFkZXIgLy8gdHJ1ZSBpZiBibG9jayBoZWFkZXIgbXVzdCBiZSB3cml0dGVuXHJcblx0XHQpIHtcclxuXHRcdFx0Ymlfd2luZHVwKCk7IC8vIGFsaWduIG9uIGJ5dGUgYm91bmRhcnlcclxuXHRcdFx0bGFzdF9lb2JfbGVuID0gODsgLy8gZW5vdWdoIGxvb2thaGVhZCBmb3IgaW5mbGF0ZVxyXG5cclxuXHRcdFx0aWYgKGhlYWRlcikge1xyXG5cdFx0XHRcdHB1dF9zaG9ydChsZW4pO1xyXG5cdFx0XHRcdHB1dF9zaG9ydCh+bGVuKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhhdC5wZW5kaW5nX2J1Zi5zZXQod2luZG93LnN1YmFycmF5KGJ1ZiwgYnVmICsgbGVuKSwgdGhhdC5wZW5kaW5nKTtcclxuXHRcdFx0dGhhdC5wZW5kaW5nICs9IGxlbjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZW5kIGEgc3RvcmVkIGJsb2NrXHJcblx0XHRmdW5jdGlvbiBfdHJfc3RvcmVkX2Jsb2NrKGJ1ZiwgLy8gaW5wdXQgYmxvY2tcclxuXHRcdHN0b3JlZF9sZW4sIC8vIGxlbmd0aCBvZiBpbnB1dCBibG9ja1xyXG5cdFx0ZW9mIC8vIHRydWUgaWYgdGhpcyBpcyB0aGUgbGFzdCBibG9jayBmb3IgYSBmaWxlXHJcblx0XHQpIHtcclxuXHRcdFx0c2VuZF9iaXRzKChTVE9SRURfQkxPQ0sgPDwgMSkgKyAoZW9mID8gMSA6IDApLCAzKTsgLy8gc2VuZCBibG9jayB0eXBlXHJcblx0XHRcdGNvcHlfYmxvY2soYnVmLCBzdG9yZWRfbGVuLCB0cnVlKTsgLy8gd2l0aCBoZWFkZXJcclxuXHRcdH1cclxuXHJcblx0XHQvLyBEZXRlcm1pbmUgdGhlIGJlc3QgZW5jb2RpbmcgZm9yIHRoZSBjdXJyZW50IGJsb2NrOiBkeW5hbWljIHRyZWVzLCBzdGF0aWNcclxuXHRcdC8vIHRyZWVzIG9yIHN0b3JlLCBhbmQgb3V0cHV0IHRoZSBlbmNvZGVkIGJsb2NrIHRvIHRoZSB6aXAgZmlsZS5cclxuXHRcdGZ1bmN0aW9uIF90cl9mbHVzaF9ibG9jayhidWYsIC8vIGlucHV0IGJsb2NrLCBvciBOVUxMIGlmIHRvbyBvbGRcclxuXHRcdHN0b3JlZF9sZW4sIC8vIGxlbmd0aCBvZiBpbnB1dCBibG9ja1xyXG5cdFx0ZW9mIC8vIHRydWUgaWYgdGhpcyBpcyB0aGUgbGFzdCBibG9jayBmb3IgYSBmaWxlXHJcblx0XHQpIHtcclxuXHRcdFx0dmFyIG9wdF9sZW5iLCBzdGF0aWNfbGVuYjsvLyBvcHRfbGVuIGFuZCBzdGF0aWNfbGVuIGluIGJ5dGVzXHJcblx0XHRcdHZhciBtYXhfYmxpbmRleCA9IDA7IC8vIGluZGV4IG9mIGxhc3QgYml0IGxlbmd0aCBjb2RlIG9mIG5vbiB6ZXJvIGZyZXFcclxuXHJcblx0XHRcdC8vIEJ1aWxkIHRoZSBIdWZmbWFuIHRyZWVzIHVubGVzcyBhIHN0b3JlZCBibG9jayBpcyBmb3JjZWRcclxuXHRcdFx0aWYgKGxldmVsID4gMCkge1xyXG5cdFx0XHRcdC8vIENvbnN0cnVjdCB0aGUgbGl0ZXJhbCBhbmQgZGlzdGFuY2UgdHJlZXNcclxuXHRcdFx0XHRsX2Rlc2MuYnVpbGRfdHJlZSh0aGF0KTtcclxuXHJcblx0XHRcdFx0ZF9kZXNjLmJ1aWxkX3RyZWUodGhhdCk7XHJcblxyXG5cdFx0XHRcdC8vIEF0IHRoaXMgcG9pbnQsIG9wdF9sZW4gYW5kIHN0YXRpY19sZW4gYXJlIHRoZSB0b3RhbCBiaXQgbGVuZ3Roc1xyXG5cdFx0XHRcdC8vIG9mXHJcblx0XHRcdFx0Ly8gdGhlIGNvbXByZXNzZWQgYmxvY2sgZGF0YSwgZXhjbHVkaW5nIHRoZSB0cmVlIHJlcHJlc2VudGF0aW9ucy5cclxuXHJcblx0XHRcdFx0Ly8gQnVpbGQgdGhlIGJpdCBsZW5ndGggdHJlZSBmb3IgdGhlIGFib3ZlIHR3byB0cmVlcywgYW5kIGdldCB0aGVcclxuXHRcdFx0XHQvLyBpbmRleFxyXG5cdFx0XHRcdC8vIGluIGJsX29yZGVyIG9mIHRoZSBsYXN0IGJpdCBsZW5ndGggY29kZSB0byBzZW5kLlxyXG5cdFx0XHRcdG1heF9ibGluZGV4ID0gYnVpbGRfYmxfdHJlZSgpO1xyXG5cclxuXHRcdFx0XHQvLyBEZXRlcm1pbmUgdGhlIGJlc3QgZW5jb2RpbmcuIENvbXB1dGUgZmlyc3QgdGhlIGJsb2NrIGxlbmd0aCBpblxyXG5cdFx0XHRcdC8vIGJ5dGVzXHJcblx0XHRcdFx0b3B0X2xlbmIgPSAodGhhdC5vcHRfbGVuICsgMyArIDcpID4+PiAzO1xyXG5cdFx0XHRcdHN0YXRpY19sZW5iID0gKHRoYXQuc3RhdGljX2xlbiArIDMgKyA3KSA+Pj4gMztcclxuXHJcblx0XHRcdFx0aWYgKHN0YXRpY19sZW5iIDw9IG9wdF9sZW5iKVxyXG5cdFx0XHRcdFx0b3B0X2xlbmIgPSBzdGF0aWNfbGVuYjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvcHRfbGVuYiA9IHN0YXRpY19sZW5iID0gc3RvcmVkX2xlbiArIDU7IC8vIGZvcmNlIGEgc3RvcmVkIGJsb2NrXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICgoc3RvcmVkX2xlbiArIDQgPD0gb3B0X2xlbmIpICYmIGJ1ZiAhPSAtMSkge1xyXG5cdFx0XHRcdC8vIDQ6IHR3byB3b3JkcyBmb3IgdGhlIGxlbmd0aHNcclxuXHRcdFx0XHQvLyBUaGUgdGVzdCBidWYgIT0gTlVMTCBpcyBvbmx5IG5lY2Vzc2FyeSBpZiBMSVRfQlVGU0laRSA+IFdTSVpFLlxyXG5cdFx0XHRcdC8vIE90aGVyd2lzZSB3ZSBjYW4ndCBoYXZlIHByb2Nlc3NlZCBtb3JlIHRoYW4gV1NJWkUgaW5wdXQgYnl0ZXNcclxuXHRcdFx0XHQvLyBzaW5jZVxyXG5cdFx0XHRcdC8vIHRoZSBsYXN0IGJsb2NrIGZsdXNoLCBiZWNhdXNlIGNvbXByZXNzaW9uIHdvdWxkIGhhdmUgYmVlblxyXG5cdFx0XHRcdC8vIHN1Y2Nlc3NmdWwuIElmIExJVF9CVUZTSVpFIDw9IFdTSVpFLCBpdCBpcyBuZXZlciB0b28gbGF0ZSB0b1xyXG5cdFx0XHRcdC8vIHRyYW5zZm9ybSBhIGJsb2NrIGludG8gYSBzdG9yZWQgYmxvY2suXHJcblx0XHRcdFx0X3RyX3N0b3JlZF9ibG9jayhidWYsIHN0b3JlZF9sZW4sIGVvZik7XHJcblx0XHRcdH0gZWxzZSBpZiAoc3RhdGljX2xlbmIgPT0gb3B0X2xlbmIpIHtcclxuXHRcdFx0XHRzZW5kX2JpdHMoKFNUQVRJQ19UUkVFUyA8PCAxKSArIChlb2YgPyAxIDogMCksIDMpO1xyXG5cdFx0XHRcdGNvbXByZXNzX2Jsb2NrKFN0YXRpY1RyZWUuc3RhdGljX2x0cmVlLCBTdGF0aWNUcmVlLnN0YXRpY19kdHJlZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VuZF9iaXRzKChEWU5fVFJFRVMgPDwgMSkgKyAoZW9mID8gMSA6IDApLCAzKTtcclxuXHRcdFx0XHRzZW5kX2FsbF90cmVlcyhsX2Rlc2MubWF4X2NvZGUgKyAxLCBkX2Rlc2MubWF4X2NvZGUgKyAxLCBtYXhfYmxpbmRleCArIDEpO1xyXG5cdFx0XHRcdGNvbXByZXNzX2Jsb2NrKGR5bl9sdHJlZSwgZHluX2R0cmVlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVGhlIGFib3ZlIGNoZWNrIGlzIG1hZGUgbW9kIDJeMzIsIGZvciBmaWxlcyBsYXJnZXIgdGhhbiA1MTIgTUJcclxuXHRcdFx0Ly8gYW5kIHVMb25nIGltcGxlbWVudGVkIG9uIDMyIGJpdHMuXHJcblxyXG5cdFx0XHRpbml0X2Jsb2NrKCk7XHJcblxyXG5cdFx0XHRpZiAoZW9mKSB7XHJcblx0XHRcdFx0Ymlfd2luZHVwKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmbHVzaF9ibG9ja19vbmx5KGVvZikge1xyXG5cdFx0XHRfdHJfZmx1c2hfYmxvY2soYmxvY2tfc3RhcnQgPj0gMCA/IGJsb2NrX3N0YXJ0IDogLTEsIHN0cnN0YXJ0IC0gYmxvY2tfc3RhcnQsIGVvZik7XHJcblx0XHRcdGJsb2NrX3N0YXJ0ID0gc3Ryc3RhcnQ7XHJcblx0XHRcdHN0cm0uZmx1c2hfcGVuZGluZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZpbGwgdGhlIHdpbmRvdyB3aGVuIHRoZSBsb29rYWhlYWQgYmVjb21lcyBpbnN1ZmZpY2llbnQuXHJcblx0XHQvLyBVcGRhdGVzIHN0cnN0YXJ0IGFuZCBsb29rYWhlYWQuXHJcblx0XHQvL1xyXG5cdFx0Ly8gSU4gYXNzZXJ0aW9uOiBsb29rYWhlYWQgPCBNSU5fTE9PS0FIRUFEXHJcblx0XHQvLyBPVVQgYXNzZXJ0aW9uczogc3Ryc3RhcnQgPD0gd2luZG93X3NpemUtTUlOX0xPT0tBSEVBRFxyXG5cdFx0Ly8gQXQgbGVhc3Qgb25lIGJ5dGUgaGFzIGJlZW4gcmVhZCwgb3IgYXZhaWxfaW4gPT09IDA7IHJlYWRzIGFyZVxyXG5cdFx0Ly8gcGVyZm9ybWVkIGZvciBhdCBsZWFzdCB0d28gYnl0ZXMgKHJlcXVpcmVkIGZvciB0aGUgemlwIHRyYW5zbGF0ZV9lb2xcclxuXHRcdC8vIG9wdGlvbiAtLSBub3Qgc3VwcG9ydGVkIGhlcmUpLlxyXG5cdFx0ZnVuY3Rpb24gZmlsbF93aW5kb3coKSB7XHJcblx0XHRcdHZhciBuLCBtO1xyXG5cdFx0XHR2YXIgcDtcclxuXHRcdFx0dmFyIG1vcmU7IC8vIEFtb3VudCBvZiBmcmVlIHNwYWNlIGF0IHRoZSBlbmQgb2YgdGhlIHdpbmRvdy5cclxuXHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRtb3JlID0gKHdpbmRvd19zaXplIC0gbG9va2FoZWFkIC0gc3Ryc3RhcnQpO1xyXG5cclxuXHRcdFx0XHQvLyBEZWFsIHdpdGggIUAjJCUgNjRLIGxpbWl0OlxyXG5cdFx0XHRcdGlmIChtb3JlID09PSAwICYmIHN0cnN0YXJ0ID09PSAwICYmIGxvb2thaGVhZCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0bW9yZSA9IHdfc2l6ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1vcmUgPT0gLTEpIHtcclxuXHRcdFx0XHRcdC8vIFZlcnkgdW5saWtlbHksIGJ1dCBwb3NzaWJsZSBvbiAxNiBiaXQgbWFjaGluZSBpZiBzdHJzdGFydCA9PVxyXG5cdFx0XHRcdFx0Ly8gMFxyXG5cdFx0XHRcdFx0Ly8gYW5kIGxvb2thaGVhZCA9PSAxIChpbnB1dCBkb25lIG9uZSBieXRlIGF0IHRpbWUpXHJcblx0XHRcdFx0XHRtb3JlLS07XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHdpbmRvdyBpcyBhbG1vc3QgZnVsbCBhbmQgdGhlcmUgaXMgaW5zdWZmaWNpZW50XHJcblx0XHRcdFx0XHQvLyBsb29rYWhlYWQsXHJcblx0XHRcdFx0XHQvLyBtb3ZlIHRoZSB1cHBlciBoYWxmIHRvIHRoZSBsb3dlciBvbmUgdG8gbWFrZSByb29tIGluIHRoZVxyXG5cdFx0XHRcdFx0Ly8gdXBwZXIgaGFsZi5cclxuXHRcdFx0XHR9IGVsc2UgaWYgKHN0cnN0YXJ0ID49IHdfc2l6ZSArIHdfc2l6ZSAtIE1JTl9MT09LQUhFQUQpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5zZXQod2luZG93LnN1YmFycmF5KHdfc2l6ZSwgd19zaXplICsgd19zaXplKSwgMCk7XHJcblxyXG5cdFx0XHRcdFx0bWF0Y2hfc3RhcnQgLT0gd19zaXplO1xyXG5cdFx0XHRcdFx0c3Ryc3RhcnQgLT0gd19zaXplOyAvLyB3ZSBub3cgaGF2ZSBzdHJzdGFydCA+PSBNQVhfRElTVFxyXG5cdFx0XHRcdFx0YmxvY2tfc3RhcnQgLT0gd19zaXplO1xyXG5cclxuXHRcdFx0XHRcdC8vIFNsaWRlIHRoZSBoYXNoIHRhYmxlIChjb3VsZCBiZSBhdm9pZGVkIHdpdGggMzIgYml0IHZhbHVlc1xyXG5cdFx0XHRcdFx0Ly8gYXQgdGhlIGV4cGVuc2Ugb2YgbWVtb3J5IHVzYWdlKS4gV2Ugc2xpZGUgZXZlbiB3aGVuIGxldmVsID09XHJcblx0XHRcdFx0XHQvLyAwXHJcblx0XHRcdFx0XHQvLyB0byBrZWVwIHRoZSBoYXNoIHRhYmxlIGNvbnNpc3RlbnQgaWYgd2Ugc3dpdGNoIGJhY2sgdG8gbGV2ZWxcclxuXHRcdFx0XHRcdC8vID4gMFxyXG5cdFx0XHRcdFx0Ly8gbGF0ZXIuIChVc2luZyBsZXZlbCAwIHBlcm1hbmVudGx5IGlzIG5vdCBhbiBvcHRpbWFsIHVzYWdlIG9mXHJcblx0XHRcdFx0XHQvLyB6bGliLCBzbyB3ZSBkb24ndCBjYXJlIGFib3V0IHRoaXMgcGF0aG9sb2dpY2FsIGNhc2UuKVxyXG5cclxuXHRcdFx0XHRcdG4gPSBoYXNoX3NpemU7XHJcblx0XHRcdFx0XHRwID0gbjtcclxuXHRcdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdFx0bSA9IChoZWFkWy0tcF0gJiAweGZmZmYpO1xyXG5cdFx0XHRcdFx0XHRoZWFkW3BdID0gKG0gPj0gd19zaXplID8gbSAtIHdfc2l6ZSA6IDApO1xyXG5cdFx0XHRcdFx0fSB3aGlsZSAoLS1uICE9PSAwKTtcclxuXHJcblx0XHRcdFx0XHRuID0gd19zaXplO1xyXG5cdFx0XHRcdFx0cCA9IG47XHJcblx0XHRcdFx0XHRkbyB7XHJcblx0XHRcdFx0XHRcdG0gPSAocHJldlstLXBdICYgMHhmZmZmKTtcclxuXHRcdFx0XHRcdFx0cHJldltwXSA9IChtID49IHdfc2l6ZSA/IG0gLSB3X3NpemUgOiAwKTtcclxuXHRcdFx0XHRcdFx0Ly8gSWYgbiBpcyBub3Qgb24gYW55IGhhc2ggY2hhaW4sIHByZXZbbl0gaXMgZ2FyYmFnZSBidXRcclxuXHRcdFx0XHRcdFx0Ly8gaXRzIHZhbHVlIHdpbGwgbmV2ZXIgYmUgdXNlZC5cclxuXHRcdFx0XHRcdH0gd2hpbGUgKC0tbiAhPT0gMCk7XHJcblx0XHRcdFx0XHRtb3JlICs9IHdfc2l6ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChzdHJtLmF2YWlsX2luID09PSAwKVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0XHQvLyBJZiB0aGVyZSB3YXMgbm8gc2xpZGluZzpcclxuXHRcdFx0XHQvLyBzdHJzdGFydCA8PSBXU0laRStNQVhfRElTVC0xICYmIGxvb2thaGVhZCA8PSBNSU5fTE9PS0FIRUFEIC0gMSAmJlxyXG5cdFx0XHRcdC8vIG1vcmUgPT0gd2luZG93X3NpemUgLSBsb29rYWhlYWQgLSBzdHJzdGFydFxyXG5cdFx0XHRcdC8vID0+IG1vcmUgPj0gd2luZG93X3NpemUgLSAoTUlOX0xPT0tBSEVBRC0xICsgV1NJWkUgKyBNQVhfRElTVC0xKVxyXG5cdFx0XHRcdC8vID0+IG1vcmUgPj0gd2luZG93X3NpemUgLSAyKldTSVpFICsgMlxyXG5cdFx0XHRcdC8vIEluIHRoZSBCSUdfTUVNIG9yIE1NQVAgY2FzZSAobm90IHlldCBzdXBwb3J0ZWQpLFxyXG5cdFx0XHRcdC8vIHdpbmRvd19zaXplID09IGlucHV0X3NpemUgKyBNSU5fTE9PS0FIRUFEICYmXHJcblx0XHRcdFx0Ly8gc3Ryc3RhcnQgKyBzLT5sb29rYWhlYWQgPD0gaW5wdXRfc2l6ZSA9PiBtb3JlID49IE1JTl9MT09LQUhFQUQuXHJcblx0XHRcdFx0Ly8gT3RoZXJ3aXNlLCB3aW5kb3dfc2l6ZSA9PSAyKldTSVpFIHNvIG1vcmUgPj0gMi5cclxuXHRcdFx0XHQvLyBJZiB0aGVyZSB3YXMgc2xpZGluZywgbW9yZSA+PSBXU0laRS4gU28gaW4gYWxsIGNhc2VzLCBtb3JlID49IDIuXHJcblxyXG5cdFx0XHRcdG4gPSBzdHJtLnJlYWRfYnVmKHdpbmRvdywgc3Ryc3RhcnQgKyBsb29rYWhlYWQsIG1vcmUpO1xyXG5cdFx0XHRcdGxvb2thaGVhZCArPSBuO1xyXG5cclxuXHRcdFx0XHQvLyBJbml0aWFsaXplIHRoZSBoYXNoIHZhbHVlIG5vdyB0aGF0IHdlIGhhdmUgc29tZSBpbnB1dDpcclxuXHRcdFx0XHRpZiAobG9va2FoZWFkID49IE1JTl9NQVRDSCkge1xyXG5cdFx0XHRcdFx0aW5zX2ggPSB3aW5kb3dbc3Ryc3RhcnRdICYgMHhmZjtcclxuXHRcdFx0XHRcdGluc19oID0gKCgoaW5zX2gpIDw8IGhhc2hfc2hpZnQpIF4gKHdpbmRvd1tzdHJzdGFydCArIDFdICYgMHhmZikpICYgaGFzaF9tYXNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBJZiB0aGUgd2hvbGUgaW5wdXQgaGFzIGxlc3MgdGhhbiBNSU5fTUFUQ0ggYnl0ZXMsIGluc19oIGlzXHJcblx0XHRcdFx0Ly8gZ2FyYmFnZSxcclxuXHRcdFx0XHQvLyBidXQgdGhpcyBpcyBub3QgaW1wb3J0YW50IHNpbmNlIG9ubHkgbGl0ZXJhbCBieXRlcyB3aWxsIGJlXHJcblx0XHRcdFx0Ly8gZW1pdHRlZC5cclxuXHRcdFx0fSB3aGlsZSAobG9va2FoZWFkIDwgTUlOX0xPT0tBSEVBRCAmJiBzdHJtLmF2YWlsX2luICE9PSAwKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDb3B5IHdpdGhvdXQgY29tcHJlc3Npb24gYXMgbXVjaCBhcyBwb3NzaWJsZSBmcm9tIHRoZSBpbnB1dCBzdHJlYW0sXHJcblx0XHQvLyByZXR1cm5cclxuXHRcdC8vIHRoZSBjdXJyZW50IGJsb2NrIHN0YXRlLlxyXG5cdFx0Ly8gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCBpbnNlcnQgbmV3IHN0cmluZ3MgaW4gdGhlIGRpY3Rpb25hcnkgc2luY2VcclxuXHRcdC8vIHVuY29tcHJlc3NpYmxlIGRhdGEgaXMgcHJvYmFibHkgbm90IHVzZWZ1bC4gVGhpcyBmdW5jdGlvbiBpcyB1c2VkXHJcblx0XHQvLyBvbmx5IGZvciB0aGUgbGV2ZWw9MCBjb21wcmVzc2lvbiBvcHRpb24uXHJcblx0XHQvLyBOT1RFOiB0aGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBvcHRpbWl6ZWQgdG8gYXZvaWQgZXh0cmEgY29weWluZyBmcm9tXHJcblx0XHQvLyB3aW5kb3cgdG8gcGVuZGluZ19idWYuXHJcblx0XHRmdW5jdGlvbiBkZWZsYXRlX3N0b3JlZChmbHVzaCkge1xyXG5cdFx0XHQvLyBTdG9yZWQgYmxvY2tzIGFyZSBsaW1pdGVkIHRvIDB4ZmZmZiBieXRlcywgcGVuZGluZ19idWYgaXMgbGltaXRlZFxyXG5cdFx0XHQvLyB0byBwZW5kaW5nX2J1Zl9zaXplLCBhbmQgZWFjaCBzdG9yZWQgYmxvY2sgaGFzIGEgNSBieXRlIGhlYWRlcjpcclxuXHJcblx0XHRcdHZhciBtYXhfYmxvY2tfc2l6ZSA9IDB4ZmZmZjtcclxuXHRcdFx0dmFyIG1heF9zdGFydDtcclxuXHJcblx0XHRcdGlmIChtYXhfYmxvY2tfc2l6ZSA+IHBlbmRpbmdfYnVmX3NpemUgLSA1KSB7XHJcblx0XHRcdFx0bWF4X2Jsb2NrX3NpemUgPSBwZW5kaW5nX2J1Zl9zaXplIC0gNTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ29weSBhcyBtdWNoIGFzIHBvc3NpYmxlIGZyb20gaW5wdXQgdG8gb3V0cHV0OlxyXG5cdFx0XHR3aGlsZSAodHJ1ZSkge1xyXG5cdFx0XHRcdC8vIEZpbGwgdGhlIHdpbmRvdyBhcyBtdWNoIGFzIHBvc3NpYmxlOlxyXG5cdFx0XHRcdGlmIChsb29rYWhlYWQgPD0gMSkge1xyXG5cdFx0XHRcdFx0ZmlsbF93aW5kb3coKTtcclxuXHRcdFx0XHRcdGlmIChsb29rYWhlYWQgPT09IDAgJiYgZmx1c2ggPT0gWl9OT19GTFVTSClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIE5lZWRNb3JlO1xyXG5cdFx0XHRcdFx0aWYgKGxvb2thaGVhZCA9PT0gMClcclxuXHRcdFx0XHRcdFx0YnJlYWs7IC8vIGZsdXNoIHRoZSBjdXJyZW50IGJsb2NrXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRzdHJzdGFydCArPSBsb29rYWhlYWQ7XHJcblx0XHRcdFx0bG9va2FoZWFkID0gMDtcclxuXHJcblx0XHRcdFx0Ly8gRW1pdCBhIHN0b3JlZCBibG9jayBpZiBwZW5kaW5nX2J1ZiB3aWxsIGJlIGZ1bGw6XHJcblx0XHRcdFx0bWF4X3N0YXJ0ID0gYmxvY2tfc3RhcnQgKyBtYXhfYmxvY2tfc2l6ZTtcclxuXHRcdFx0XHRpZiAoc3Ryc3RhcnQgPT09IDAgfHwgc3Ryc3RhcnQgPj0gbWF4X3N0YXJ0KSB7XHJcblx0XHRcdFx0XHQvLyBzdHJzdGFydCA9PT0gMCBpcyBwb3NzaWJsZSB3aGVuIHdyYXBhcm91bmQgb24gMTYtYml0IG1hY2hpbmVcclxuXHRcdFx0XHRcdGxvb2thaGVhZCA9IChzdHJzdGFydCAtIG1heF9zdGFydCk7XHJcblx0XHRcdFx0XHRzdHJzdGFydCA9IG1heF9zdGFydDtcclxuXHJcblx0XHRcdFx0XHRmbHVzaF9ibG9ja19vbmx5KGZhbHNlKTtcclxuXHRcdFx0XHRcdGlmIChzdHJtLmF2YWlsX291dCA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIE5lZWRNb3JlO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEZsdXNoIGlmIHdlIG1heSBoYXZlIHRvIHNsaWRlLCBvdGhlcndpc2UgYmxvY2tfc3RhcnQgbWF5IGJlY29tZVxyXG5cdFx0XHRcdC8vIG5lZ2F0aXZlIGFuZCB0aGUgZGF0YSB3aWxsIGJlIGdvbmU6XHJcblx0XHRcdFx0aWYgKHN0cnN0YXJ0IC0gYmxvY2tfc3RhcnQgPj0gd19zaXplIC0gTUlOX0xPT0tBSEVBRCkge1xyXG5cdFx0XHRcdFx0Zmx1c2hfYmxvY2tfb25seShmYWxzZSk7XHJcblx0XHRcdFx0XHRpZiAoc3RybS5hdmFpbF9vdXQgPT09IDApXHJcblx0XHRcdFx0XHRcdHJldHVybiBOZWVkTW9yZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZsdXNoX2Jsb2NrX29ubHkoZmx1c2ggPT0gWl9GSU5JU0gpO1xyXG5cdFx0XHRpZiAoc3RybS5hdmFpbF9vdXQgPT09IDApXHJcblx0XHRcdFx0cmV0dXJuIChmbHVzaCA9PSBaX0ZJTklTSCkgPyBGaW5pc2hTdGFydGVkIDogTmVlZE1vcmU7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmx1c2ggPT0gWl9GSU5JU0ggPyBGaW5pc2hEb25lIDogQmxvY2tEb25lO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGxvbmdlc3RfbWF0Y2goY3VyX21hdGNoKSB7XHJcblx0XHRcdHZhciBjaGFpbl9sZW5ndGggPSBtYXhfY2hhaW5fbGVuZ3RoOyAvLyBtYXggaGFzaCBjaGFpbiBsZW5ndGhcclxuXHRcdFx0dmFyIHNjYW4gPSBzdHJzdGFydDsgLy8gY3VycmVudCBzdHJpbmdcclxuXHRcdFx0dmFyIG1hdGNoOyAvLyBtYXRjaGVkIHN0cmluZ1xyXG5cdFx0XHR2YXIgbGVuOyAvLyBsZW5ndGggb2YgY3VycmVudCBtYXRjaFxyXG5cdFx0XHR2YXIgYmVzdF9sZW4gPSBwcmV2X2xlbmd0aDsgLy8gYmVzdCBtYXRjaCBsZW5ndGggc28gZmFyXHJcblx0XHRcdHZhciBsaW1pdCA9IHN0cnN0YXJ0ID4gKHdfc2l6ZSAtIE1JTl9MT09LQUhFQUQpID8gc3Ryc3RhcnQgLSAod19zaXplIC0gTUlOX0xPT0tBSEVBRCkgOiAwO1xyXG5cdFx0XHR2YXIgX25pY2VfbWF0Y2ggPSBuaWNlX21hdGNoO1xyXG5cclxuXHRcdFx0Ly8gU3RvcCB3aGVuIGN1cl9tYXRjaCBiZWNvbWVzIDw9IGxpbWl0LiBUbyBzaW1wbGlmeSB0aGUgY29kZSxcclxuXHRcdFx0Ly8gd2UgcHJldmVudCBtYXRjaGVzIHdpdGggdGhlIHN0cmluZyBvZiB3aW5kb3cgaW5kZXggMC5cclxuXHJcblx0XHRcdHZhciB3bWFzayA9IHdfbWFzaztcclxuXHJcblx0XHRcdHZhciBzdHJlbmQgPSBzdHJzdGFydCArIE1BWF9NQVRDSDtcclxuXHRcdFx0dmFyIHNjYW5fZW5kMSA9IHdpbmRvd1tzY2FuICsgYmVzdF9sZW4gLSAxXTtcclxuXHRcdFx0dmFyIHNjYW5fZW5kID0gd2luZG93W3NjYW4gKyBiZXN0X2xlbl07XHJcblxyXG5cdFx0XHQvLyBUaGUgY29kZSBpcyBvcHRpbWl6ZWQgZm9yIEhBU0hfQklUUyA+PSA4IGFuZCBNQVhfTUFUQ0gtMiBtdWx0aXBsZSBvZlxyXG5cdFx0XHQvLyAxNi5cclxuXHRcdFx0Ly8gSXQgaXMgZWFzeSB0byBnZXQgcmlkIG9mIHRoaXMgb3B0aW1pemF0aW9uIGlmIG5lY2Vzc2FyeS5cclxuXHJcblx0XHRcdC8vIERvIG5vdCB3YXN0ZSB0b28gbXVjaCB0aW1lIGlmIHdlIGFscmVhZHkgaGF2ZSBhIGdvb2QgbWF0Y2g6XHJcblx0XHRcdGlmIChwcmV2X2xlbmd0aCA+PSBnb29kX21hdGNoKSB7XHJcblx0XHRcdFx0Y2hhaW5fbGVuZ3RoID4+PSAyO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBEbyBub3QgbG9vayBmb3IgbWF0Y2hlcyBiZXlvbmQgdGhlIGVuZCBvZiB0aGUgaW5wdXQuIFRoaXMgaXNcclxuXHRcdFx0Ly8gbmVjZXNzYXJ5XHJcblx0XHRcdC8vIHRvIG1ha2UgZGVmbGF0ZSBkZXRlcm1pbmlzdGljLlxyXG5cdFx0XHRpZiAoX25pY2VfbWF0Y2ggPiBsb29rYWhlYWQpXHJcblx0XHRcdFx0X25pY2VfbWF0Y2ggPSBsb29rYWhlYWQ7XHJcblxyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0bWF0Y2ggPSBjdXJfbWF0Y2g7XHJcblxyXG5cdFx0XHRcdC8vIFNraXAgdG8gbmV4dCBtYXRjaCBpZiB0aGUgbWF0Y2ggbGVuZ3RoIGNhbm5vdCBpbmNyZWFzZVxyXG5cdFx0XHRcdC8vIG9yIGlmIHRoZSBtYXRjaCBsZW5ndGggaXMgbGVzcyB0aGFuIDI6XHJcblx0XHRcdFx0aWYgKHdpbmRvd1ttYXRjaCArIGJlc3RfbGVuXSAhPSBzY2FuX2VuZCB8fCB3aW5kb3dbbWF0Y2ggKyBiZXN0X2xlbiAtIDFdICE9IHNjYW5fZW5kMSB8fCB3aW5kb3dbbWF0Y2hdICE9IHdpbmRvd1tzY2FuXVxyXG5cdFx0XHRcdFx0XHR8fCB3aW5kb3dbKyttYXRjaF0gIT0gd2luZG93W3NjYW4gKyAxXSlcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHQvLyBUaGUgY2hlY2sgYXQgYmVzdF9sZW4tMSBjYW4gYmUgcmVtb3ZlZCBiZWNhdXNlIGl0IHdpbGwgYmUgbWFkZVxyXG5cdFx0XHRcdC8vIGFnYWluIGxhdGVyLiAoVGhpcyBoZXVyaXN0aWMgaXMgbm90IGFsd2F5cyBhIHdpbi4pXHJcblx0XHRcdFx0Ly8gSXQgaXMgbm90IG5lY2Vzc2FyeSB0byBjb21wYXJlIHNjYW5bMl0gYW5kIG1hdGNoWzJdIHNpbmNlIHRoZXlcclxuXHRcdFx0XHQvLyBhcmUgYWx3YXlzIGVxdWFsIHdoZW4gdGhlIG90aGVyIGJ5dGVzIG1hdGNoLCBnaXZlbiB0aGF0XHJcblx0XHRcdFx0Ly8gdGhlIGhhc2gga2V5cyBhcmUgZXF1YWwgYW5kIHRoYXQgSEFTSF9CSVRTID49IDguXHJcblx0XHRcdFx0c2NhbiArPSAyO1xyXG5cdFx0XHRcdG1hdGNoKys7XHJcblxyXG5cdFx0XHRcdC8vIFdlIGNoZWNrIGZvciBpbnN1ZmZpY2llbnQgbG9va2FoZWFkIG9ubHkgZXZlcnkgOHRoIGNvbXBhcmlzb247XHJcblx0XHRcdFx0Ly8gdGhlIDI1NnRoIGNoZWNrIHdpbGwgYmUgbWFkZSBhdCBzdHJzdGFydCsyNTguXHJcblx0XHRcdFx0ZG8ge1xyXG5cdFx0XHRcdH0gd2hpbGUgKHdpbmRvd1srK3NjYW5dID09IHdpbmRvd1srK21hdGNoXSAmJiB3aW5kb3dbKytzY2FuXSA9PSB3aW5kb3dbKyttYXRjaF0gJiYgd2luZG93Wysrc2Nhbl0gPT0gd2luZG93WysrbWF0Y2hdXHJcblx0XHRcdFx0XHRcdCYmIHdpbmRvd1srK3NjYW5dID09IHdpbmRvd1srK21hdGNoXSAmJiB3aW5kb3dbKytzY2FuXSA9PSB3aW5kb3dbKyttYXRjaF0gJiYgd2luZG93Wysrc2Nhbl0gPT0gd2luZG93WysrbWF0Y2hdXHJcblx0XHRcdFx0XHRcdCYmIHdpbmRvd1srK3NjYW5dID09IHdpbmRvd1srK21hdGNoXSAmJiB3aW5kb3dbKytzY2FuXSA9PSB3aW5kb3dbKyttYXRjaF0gJiYgc2NhbiA8IHN0cmVuZCk7XHJcblxyXG5cdFx0XHRcdGxlbiA9IE1BWF9NQVRDSCAtIChzdHJlbmQgLSBzY2FuKTtcclxuXHRcdFx0XHRzY2FuID0gc3RyZW5kIC0gTUFYX01BVENIO1xyXG5cclxuXHRcdFx0XHRpZiAobGVuID4gYmVzdF9sZW4pIHtcclxuXHRcdFx0XHRcdG1hdGNoX3N0YXJ0ID0gY3VyX21hdGNoO1xyXG5cdFx0XHRcdFx0YmVzdF9sZW4gPSBsZW47XHJcblx0XHRcdFx0XHRpZiAobGVuID49IF9uaWNlX21hdGNoKVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdHNjYW5fZW5kMSA9IHdpbmRvd1tzY2FuICsgYmVzdF9sZW4gLSAxXTtcclxuXHRcdFx0XHRcdHNjYW5fZW5kID0gd2luZG93W3NjYW4gKyBiZXN0X2xlbl07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSB3aGlsZSAoKGN1cl9tYXRjaCA9IChwcmV2W2N1cl9tYXRjaCAmIHdtYXNrXSAmIDB4ZmZmZikpID4gbGltaXQgJiYgLS1jaGFpbl9sZW5ndGggIT09IDApO1xyXG5cclxuXHRcdFx0aWYgKGJlc3RfbGVuIDw9IGxvb2thaGVhZClcclxuXHRcdFx0XHRyZXR1cm4gYmVzdF9sZW47XHJcblx0XHRcdHJldHVybiBsb29rYWhlYWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ29tcHJlc3MgYXMgbXVjaCBhcyBwb3NzaWJsZSBmcm9tIHRoZSBpbnB1dCBzdHJlYW0sIHJldHVybiB0aGUgY3VycmVudFxyXG5cdFx0Ly8gYmxvY2sgc3RhdGUuXHJcblx0XHQvLyBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IHBlcmZvcm0gbGF6eSBldmFsdWF0aW9uIG9mIG1hdGNoZXMgYW5kIGluc2VydHNcclxuXHRcdC8vIG5ldyBzdHJpbmdzIGluIHRoZSBkaWN0aW9uYXJ5IG9ubHkgZm9yIHVubWF0Y2hlZCBzdHJpbmdzIG9yIGZvciBzaG9ydFxyXG5cdFx0Ly8gbWF0Y2hlcy4gSXQgaXMgdXNlZCBvbmx5IGZvciB0aGUgZmFzdCBjb21wcmVzc2lvbiBvcHRpb25zLlxyXG5cdFx0ZnVuY3Rpb24gZGVmbGF0ZV9mYXN0KGZsdXNoKSB7XHJcblx0XHRcdC8vIHNob3J0IGhhc2hfaGVhZCA9IDA7IC8vIGhlYWQgb2YgdGhlIGhhc2ggY2hhaW5cclxuXHRcdFx0dmFyIGhhc2hfaGVhZCA9IDA7IC8vIGhlYWQgb2YgdGhlIGhhc2ggY2hhaW5cclxuXHRcdFx0dmFyIGJmbHVzaDsgLy8gc2V0IGlmIGN1cnJlbnQgYmxvY2sgbXVzdCBiZSBmbHVzaGVkXHJcblxyXG5cdFx0XHR3aGlsZSAodHJ1ZSkge1xyXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHdlIGFsd2F5cyBoYXZlIGVub3VnaCBsb29rYWhlYWQsIGV4Y2VwdFxyXG5cdFx0XHRcdC8vIGF0IHRoZSBlbmQgb2YgdGhlIGlucHV0IGZpbGUuIFdlIG5lZWQgTUFYX01BVENIIGJ5dGVzXHJcblx0XHRcdFx0Ly8gZm9yIHRoZSBuZXh0IG1hdGNoLCBwbHVzIE1JTl9NQVRDSCBieXRlcyB0byBpbnNlcnQgdGhlXHJcblx0XHRcdFx0Ly8gc3RyaW5nIGZvbGxvd2luZyB0aGUgbmV4dCBtYXRjaC5cclxuXHRcdFx0XHRpZiAobG9va2FoZWFkIDwgTUlOX0xPT0tBSEVBRCkge1xyXG5cdFx0XHRcdFx0ZmlsbF93aW5kb3coKTtcclxuXHRcdFx0XHRcdGlmIChsb29rYWhlYWQgPCBNSU5fTE9PS0FIRUFEICYmIGZsdXNoID09IFpfTk9fRkxVU0gpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIE5lZWRNb3JlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGxvb2thaGVhZCA9PT0gMClcclxuXHRcdFx0XHRcdFx0YnJlYWs7IC8vIGZsdXNoIHRoZSBjdXJyZW50IGJsb2NrXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBJbnNlcnQgdGhlIHN0cmluZyB3aW5kb3dbc3Ryc3RhcnQgLi4gc3Ryc3RhcnQrMl0gaW4gdGhlXHJcblx0XHRcdFx0Ly8gZGljdGlvbmFyeSwgYW5kIHNldCBoYXNoX2hlYWQgdG8gdGhlIGhlYWQgb2YgdGhlIGhhc2ggY2hhaW46XHJcblx0XHRcdFx0aWYgKGxvb2thaGVhZCA+PSBNSU5fTUFUQ0gpIHtcclxuXHRcdFx0XHRcdGluc19oID0gKCgoaW5zX2gpIDw8IGhhc2hfc2hpZnQpIF4gKHdpbmRvd1soc3Ryc3RhcnQpICsgKE1JTl9NQVRDSCAtIDEpXSAmIDB4ZmYpKSAmIGhhc2hfbWFzaztcclxuXHJcblx0XHRcdFx0XHQvLyBwcmV2W3N0cnN0YXJ0JndfbWFza109aGFzaF9oZWFkPWhlYWRbaW5zX2hdO1xyXG5cdFx0XHRcdFx0aGFzaF9oZWFkID0gKGhlYWRbaW5zX2hdICYgMHhmZmZmKTtcclxuXHRcdFx0XHRcdHByZXZbc3Ryc3RhcnQgJiB3X21hc2tdID0gaGVhZFtpbnNfaF07XHJcblx0XHRcdFx0XHRoZWFkW2luc19oXSA9IHN0cnN0YXJ0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gRmluZCB0aGUgbG9uZ2VzdCBtYXRjaCwgZGlzY2FyZGluZyB0aG9zZSA8PSBwcmV2X2xlbmd0aC5cclxuXHRcdFx0XHQvLyBBdCB0aGlzIHBvaW50IHdlIGhhdmUgYWx3YXlzIG1hdGNoX2xlbmd0aCA8IE1JTl9NQVRDSFxyXG5cclxuXHRcdFx0XHRpZiAoaGFzaF9oZWFkICE9PSAwICYmICgoc3Ryc3RhcnQgLSBoYXNoX2hlYWQpICYgMHhmZmZmKSA8PSB3X3NpemUgLSBNSU5fTE9PS0FIRUFEKSB7XHJcblx0XHRcdFx0XHQvLyBUbyBzaW1wbGlmeSB0aGUgY29kZSwgd2UgcHJldmVudCBtYXRjaGVzIHdpdGggdGhlIHN0cmluZ1xyXG5cdFx0XHRcdFx0Ly8gb2Ygd2luZG93IGluZGV4IDAgKGluIHBhcnRpY3VsYXIgd2UgaGF2ZSB0byBhdm9pZCBhIG1hdGNoXHJcblx0XHRcdFx0XHQvLyBvZiB0aGUgc3RyaW5nIHdpdGggaXRzZWxmIGF0IHRoZSBzdGFydCBvZiB0aGUgaW5wdXQgZmlsZSkuXHJcblx0XHRcdFx0XHRpZiAoc3RyYXRlZ3kgIT0gWl9IVUZGTUFOX09OTFkpIHtcclxuXHRcdFx0XHRcdFx0bWF0Y2hfbGVuZ3RoID0gbG9uZ2VzdF9tYXRjaChoYXNoX2hlYWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gbG9uZ2VzdF9tYXRjaCgpIHNldHMgbWF0Y2hfc3RhcnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoX2xlbmd0aCA+PSBNSU5fTUFUQ0gpIHtcclxuXHRcdFx0XHRcdC8vIGNoZWNrX21hdGNoKHN0cnN0YXJ0LCBtYXRjaF9zdGFydCwgbWF0Y2hfbGVuZ3RoKTtcclxuXHJcblx0XHRcdFx0XHRiZmx1c2ggPSBfdHJfdGFsbHkoc3Ryc3RhcnQgLSBtYXRjaF9zdGFydCwgbWF0Y2hfbGVuZ3RoIC0gTUlOX01BVENIKTtcclxuXHJcblx0XHRcdFx0XHRsb29rYWhlYWQgLT0gbWF0Y2hfbGVuZ3RoO1xyXG5cclxuXHRcdFx0XHRcdC8vIEluc2VydCBuZXcgc3RyaW5ncyBpbiB0aGUgaGFzaCB0YWJsZSBvbmx5IGlmIHRoZSBtYXRjaCBsZW5ndGhcclxuXHRcdFx0XHRcdC8vIGlzIG5vdCB0b28gbGFyZ2UuIFRoaXMgc2F2ZXMgdGltZSBidXQgZGVncmFkZXMgY29tcHJlc3Npb24uXHJcblx0XHRcdFx0XHRpZiAobWF0Y2hfbGVuZ3RoIDw9IG1heF9sYXp5X21hdGNoICYmIGxvb2thaGVhZCA+PSBNSU5fTUFUQ0gpIHtcclxuXHRcdFx0XHRcdFx0bWF0Y2hfbGVuZ3RoLS07IC8vIHN0cmluZyBhdCBzdHJzdGFydCBhbHJlYWR5IGluIGhhc2ggdGFibGVcclxuXHRcdFx0XHRcdFx0ZG8ge1xyXG5cdFx0XHRcdFx0XHRcdHN0cnN0YXJ0Kys7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGluc19oID0gKChpbnNfaCA8PCBoYXNoX3NoaWZ0KSBeICh3aW5kb3dbKHN0cnN0YXJ0KSArIChNSU5fTUFUQ0ggLSAxKV0gJiAweGZmKSkgJiBoYXNoX21hc2s7XHJcblx0XHRcdFx0XHRcdFx0Ly8gcHJldltzdHJzdGFydCZ3X21hc2tdPWhhc2hfaGVhZD1oZWFkW2luc19oXTtcclxuXHRcdFx0XHRcdFx0XHRoYXNoX2hlYWQgPSAoaGVhZFtpbnNfaF0gJiAweGZmZmYpO1xyXG5cdFx0XHRcdFx0XHRcdHByZXZbc3Ryc3RhcnQgJiB3X21hc2tdID0gaGVhZFtpbnNfaF07XHJcblx0XHRcdFx0XHRcdFx0aGVhZFtpbnNfaF0gPSBzdHJzdGFydDtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gc3Ryc3RhcnQgbmV2ZXIgZXhjZWVkcyBXU0laRS1NQVhfTUFUQ0gsIHNvIHRoZXJlIGFyZVxyXG5cdFx0XHRcdFx0XHRcdC8vIGFsd2F5cyBNSU5fTUFUQ0ggYnl0ZXMgYWhlYWQuXHJcblx0XHRcdFx0XHRcdH0gd2hpbGUgKC0tbWF0Y2hfbGVuZ3RoICE9PSAwKTtcclxuXHRcdFx0XHRcdFx0c3Ryc3RhcnQrKztcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHN0cnN0YXJ0ICs9IG1hdGNoX2xlbmd0aDtcclxuXHRcdFx0XHRcdFx0bWF0Y2hfbGVuZ3RoID0gMDtcclxuXHRcdFx0XHRcdFx0aW5zX2ggPSB3aW5kb3dbc3Ryc3RhcnRdICYgMHhmZjtcclxuXHJcblx0XHRcdFx0XHRcdGluc19oID0gKCgoaW5zX2gpIDw8IGhhc2hfc2hpZnQpIF4gKHdpbmRvd1tzdHJzdGFydCArIDFdICYgMHhmZikpICYgaGFzaF9tYXNrO1xyXG5cdFx0XHRcdFx0XHQvLyBJZiBsb29rYWhlYWQgPCBNSU5fTUFUQ0gsIGluc19oIGlzIGdhcmJhZ2UsIGJ1dCBpdCBkb2VzXHJcblx0XHRcdFx0XHRcdC8vIG5vdFxyXG5cdFx0XHRcdFx0XHQvLyBtYXR0ZXIgc2luY2UgaXQgd2lsbCBiZSByZWNvbXB1dGVkIGF0IG5leHQgZGVmbGF0ZSBjYWxsLlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBObyBtYXRjaCwgb3V0cHV0IGEgbGl0ZXJhbCBieXRlXHJcblxyXG5cdFx0XHRcdFx0YmZsdXNoID0gX3RyX3RhbGx5KDAsIHdpbmRvd1tzdHJzdGFydF0gJiAweGZmKTtcclxuXHRcdFx0XHRcdGxvb2thaGVhZC0tO1xyXG5cdFx0XHRcdFx0c3Ryc3RhcnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGJmbHVzaCkge1xyXG5cclxuXHRcdFx0XHRcdGZsdXNoX2Jsb2NrX29ubHkoZmFsc2UpO1xyXG5cdFx0XHRcdFx0aWYgKHN0cm0uYXZhaWxfb3V0ID09PSAwKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gTmVlZE1vcmU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmbHVzaF9ibG9ja19vbmx5KGZsdXNoID09IFpfRklOSVNIKTtcclxuXHRcdFx0aWYgKHN0cm0uYXZhaWxfb3V0ID09PSAwKSB7XHJcblx0XHRcdFx0aWYgKGZsdXNoID09IFpfRklOSVNIKVxyXG5cdFx0XHRcdFx0cmV0dXJuIEZpbmlzaFN0YXJ0ZWQ7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuIE5lZWRNb3JlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmbHVzaCA9PSBaX0ZJTklTSCA/IEZpbmlzaERvbmUgOiBCbG9ja0RvbmU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2FtZSBhcyBhYm92ZSwgYnV0IGFjaGlldmVzIGJldHRlciBjb21wcmVzc2lvbi4gV2UgdXNlIGEgbGF6eVxyXG5cdFx0Ly8gZXZhbHVhdGlvbiBmb3IgbWF0Y2hlczogYSBtYXRjaCBpcyBmaW5hbGx5IGFkb3B0ZWQgb25seSBpZiB0aGVyZSBpc1xyXG5cdFx0Ly8gbm8gYmV0dGVyIG1hdGNoIGF0IHRoZSBuZXh0IHdpbmRvdyBwb3NpdGlvbi5cclxuXHRcdGZ1bmN0aW9uIGRlZmxhdGVfc2xvdyhmbHVzaCkge1xyXG5cdFx0XHQvLyBzaG9ydCBoYXNoX2hlYWQgPSAwOyAvLyBoZWFkIG9mIGhhc2ggY2hhaW5cclxuXHRcdFx0dmFyIGhhc2hfaGVhZCA9IDA7IC8vIGhlYWQgb2YgaGFzaCBjaGFpblxyXG5cdFx0XHR2YXIgYmZsdXNoOyAvLyBzZXQgaWYgY3VycmVudCBibG9jayBtdXN0IGJlIGZsdXNoZWRcclxuXHRcdFx0dmFyIG1heF9pbnNlcnQ7XHJcblxyXG5cdFx0XHQvLyBQcm9jZXNzIHRoZSBpbnB1dCBibG9jay5cclxuXHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSBhbHdheXMgaGF2ZSBlbm91Z2ggbG9va2FoZWFkLCBleGNlcHRcclxuXHRcdFx0XHQvLyBhdCB0aGUgZW5kIG9mIHRoZSBpbnB1dCBmaWxlLiBXZSBuZWVkIE1BWF9NQVRDSCBieXRlc1xyXG5cdFx0XHRcdC8vIGZvciB0aGUgbmV4dCBtYXRjaCwgcGx1cyBNSU5fTUFUQ0ggYnl0ZXMgdG8gaW5zZXJ0IHRoZVxyXG5cdFx0XHRcdC8vIHN0cmluZyBmb2xsb3dpbmcgdGhlIG5leHQgbWF0Y2guXHJcblxyXG5cdFx0XHRcdGlmIChsb29rYWhlYWQgPCBNSU5fTE9PS0FIRUFEKSB7XHJcblx0XHRcdFx0XHRmaWxsX3dpbmRvdygpO1xyXG5cdFx0XHRcdFx0aWYgKGxvb2thaGVhZCA8IE1JTl9MT09LQUhFQUQgJiYgZmx1c2ggPT0gWl9OT19GTFVTSCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gTmVlZE1vcmU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAobG9va2FoZWFkID09PSAwKVxyXG5cdFx0XHRcdFx0XHRicmVhazsgLy8gZmx1c2ggdGhlIGN1cnJlbnQgYmxvY2tcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEluc2VydCB0aGUgc3RyaW5nIHdpbmRvd1tzdHJzdGFydCAuLiBzdHJzdGFydCsyXSBpbiB0aGVcclxuXHRcdFx0XHQvLyBkaWN0aW9uYXJ5LCBhbmQgc2V0IGhhc2hfaGVhZCB0byB0aGUgaGVhZCBvZiB0aGUgaGFzaCBjaGFpbjpcclxuXHJcblx0XHRcdFx0aWYgKGxvb2thaGVhZCA+PSBNSU5fTUFUQ0gpIHtcclxuXHRcdFx0XHRcdGluc19oID0gKCgoaW5zX2gpIDw8IGhhc2hfc2hpZnQpIF4gKHdpbmRvd1soc3Ryc3RhcnQpICsgKE1JTl9NQVRDSCAtIDEpXSAmIDB4ZmYpKSAmIGhhc2hfbWFzaztcclxuXHRcdFx0XHRcdC8vIHByZXZbc3Ryc3RhcnQmd19tYXNrXT1oYXNoX2hlYWQ9aGVhZFtpbnNfaF07XHJcblx0XHRcdFx0XHRoYXNoX2hlYWQgPSAoaGVhZFtpbnNfaF0gJiAweGZmZmYpO1xyXG5cdFx0XHRcdFx0cHJldltzdHJzdGFydCAmIHdfbWFza10gPSBoZWFkW2luc19oXTtcclxuXHRcdFx0XHRcdGhlYWRbaW5zX2hdID0gc3Ryc3RhcnQ7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBGaW5kIHRoZSBsb25nZXN0IG1hdGNoLCBkaXNjYXJkaW5nIHRob3NlIDw9IHByZXZfbGVuZ3RoLlxyXG5cdFx0XHRcdHByZXZfbGVuZ3RoID0gbWF0Y2hfbGVuZ3RoO1xyXG5cdFx0XHRcdHByZXZfbWF0Y2ggPSBtYXRjaF9zdGFydDtcclxuXHRcdFx0XHRtYXRjaF9sZW5ndGggPSBNSU5fTUFUQ0ggLSAxO1xyXG5cclxuXHRcdFx0XHRpZiAoaGFzaF9oZWFkICE9PSAwICYmIHByZXZfbGVuZ3RoIDwgbWF4X2xhenlfbWF0Y2ggJiYgKChzdHJzdGFydCAtIGhhc2hfaGVhZCkgJiAweGZmZmYpIDw9IHdfc2l6ZSAtIE1JTl9MT09LQUhFQUQpIHtcclxuXHRcdFx0XHRcdC8vIFRvIHNpbXBsaWZ5IHRoZSBjb2RlLCB3ZSBwcmV2ZW50IG1hdGNoZXMgd2l0aCB0aGUgc3RyaW5nXHJcblx0XHRcdFx0XHQvLyBvZiB3aW5kb3cgaW5kZXggMCAoaW4gcGFydGljdWxhciB3ZSBoYXZlIHRvIGF2b2lkIGEgbWF0Y2hcclxuXHRcdFx0XHRcdC8vIG9mIHRoZSBzdHJpbmcgd2l0aCBpdHNlbGYgYXQgdGhlIHN0YXJ0IG9mIHRoZSBpbnB1dCBmaWxlKS5cclxuXHJcblx0XHRcdFx0XHRpZiAoc3RyYXRlZ3kgIT0gWl9IVUZGTUFOX09OTFkpIHtcclxuXHRcdFx0XHRcdFx0bWF0Y2hfbGVuZ3RoID0gbG9uZ2VzdF9tYXRjaChoYXNoX2hlYWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gbG9uZ2VzdF9tYXRjaCgpIHNldHMgbWF0Y2hfc3RhcnRcclxuXHJcblx0XHRcdFx0XHRpZiAobWF0Y2hfbGVuZ3RoIDw9IDUgJiYgKHN0cmF0ZWd5ID09IFpfRklMVEVSRUQgfHwgKG1hdGNoX2xlbmd0aCA9PSBNSU5fTUFUQ0ggJiYgc3Ryc3RhcnQgLSBtYXRjaF9zdGFydCA+IDQwOTYpKSkge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gSWYgcHJldl9tYXRjaCBpcyBhbHNvIE1JTl9NQVRDSCwgbWF0Y2hfc3RhcnQgaXMgZ2FyYmFnZVxyXG5cdFx0XHRcdFx0XHQvLyBidXQgd2Ugd2lsbCBpZ25vcmUgdGhlIGN1cnJlbnQgbWF0Y2ggYW55d2F5LlxyXG5cdFx0XHRcdFx0XHRtYXRjaF9sZW5ndGggPSBNSU5fTUFUQ0ggLSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gSWYgdGhlcmUgd2FzIGEgbWF0Y2ggYXQgdGhlIHByZXZpb3VzIHN0ZXAgYW5kIHRoZSBjdXJyZW50XHJcblx0XHRcdFx0Ly8gbWF0Y2ggaXMgbm90IGJldHRlciwgb3V0cHV0IHRoZSBwcmV2aW91cyBtYXRjaDpcclxuXHRcdFx0XHRpZiAocHJldl9sZW5ndGggPj0gTUlOX01BVENIICYmIG1hdGNoX2xlbmd0aCA8PSBwcmV2X2xlbmd0aCkge1xyXG5cdFx0XHRcdFx0bWF4X2luc2VydCA9IHN0cnN0YXJ0ICsgbG9va2FoZWFkIC0gTUlOX01BVENIO1xyXG5cdFx0XHRcdFx0Ly8gRG8gbm90IGluc2VydCBzdHJpbmdzIGluIGhhc2ggdGFibGUgYmV5b25kIHRoaXMuXHJcblxyXG5cdFx0XHRcdFx0Ly8gY2hlY2tfbWF0Y2goc3Ryc3RhcnQtMSwgcHJldl9tYXRjaCwgcHJldl9sZW5ndGgpO1xyXG5cclxuXHRcdFx0XHRcdGJmbHVzaCA9IF90cl90YWxseShzdHJzdGFydCAtIDEgLSBwcmV2X21hdGNoLCBwcmV2X2xlbmd0aCAtIE1JTl9NQVRDSCk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gSW5zZXJ0IGluIGhhc2ggdGFibGUgYWxsIHN0cmluZ3MgdXAgdG8gdGhlIGVuZCBvZiB0aGUgbWF0Y2guXHJcblx0XHRcdFx0XHQvLyBzdHJzdGFydC0xIGFuZCBzdHJzdGFydCBhcmUgYWxyZWFkeSBpbnNlcnRlZC4gSWYgdGhlcmUgaXMgbm90XHJcblx0XHRcdFx0XHQvLyBlbm91Z2ggbG9va2FoZWFkLCB0aGUgbGFzdCB0d28gc3RyaW5ncyBhcmUgbm90IGluc2VydGVkIGluXHJcblx0XHRcdFx0XHQvLyB0aGUgaGFzaCB0YWJsZS5cclxuXHRcdFx0XHRcdGxvb2thaGVhZCAtPSBwcmV2X2xlbmd0aCAtIDE7XHJcblx0XHRcdFx0XHRwcmV2X2xlbmd0aCAtPSAyO1xyXG5cdFx0XHRcdFx0ZG8ge1xyXG5cdFx0XHRcdFx0XHRpZiAoKytzdHJzdGFydCA8PSBtYXhfaW5zZXJ0KSB7XHJcblx0XHRcdFx0XHRcdFx0aW5zX2ggPSAoKChpbnNfaCkgPDwgaGFzaF9zaGlmdCkgXiAod2luZG93WyhzdHJzdGFydCkgKyAoTUlOX01BVENIIC0gMSldICYgMHhmZikpICYgaGFzaF9tYXNrO1xyXG5cdFx0XHRcdFx0XHRcdC8vIHByZXZbc3Ryc3RhcnQmd19tYXNrXT1oYXNoX2hlYWQ9aGVhZFtpbnNfaF07XHJcblx0XHRcdFx0XHRcdFx0aGFzaF9oZWFkID0gKGhlYWRbaW5zX2hdICYgMHhmZmZmKTtcclxuXHRcdFx0XHRcdFx0XHRwcmV2W3N0cnN0YXJ0ICYgd19tYXNrXSA9IGhlYWRbaW5zX2hdO1xyXG5cdFx0XHRcdFx0XHRcdGhlYWRbaW5zX2hdID0gc3Ryc3RhcnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gd2hpbGUgKC0tcHJldl9sZW5ndGggIT09IDApO1xyXG5cdFx0XHRcdFx0bWF0Y2hfYXZhaWxhYmxlID0gMDtcclxuXHRcdFx0XHRcdG1hdGNoX2xlbmd0aCA9IE1JTl9NQVRDSCAtIDE7XHJcblx0XHRcdFx0XHRzdHJzdGFydCsrO1xyXG5cclxuXHRcdFx0XHRcdGlmIChiZmx1c2gpIHtcclxuXHRcdFx0XHRcdFx0Zmx1c2hfYmxvY2tfb25seShmYWxzZSk7XHJcblx0XHRcdFx0XHRcdGlmIChzdHJtLmF2YWlsX291dCA9PT0gMClcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gTmVlZE1vcmU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaF9hdmFpbGFibGUgIT09IDApIHtcclxuXHJcblx0XHRcdFx0XHQvLyBJZiB0aGVyZSB3YXMgbm8gbWF0Y2ggYXQgdGhlIHByZXZpb3VzIHBvc2l0aW9uLCBvdXRwdXQgYVxyXG5cdFx0XHRcdFx0Ly8gc2luZ2xlIGxpdGVyYWwuIElmIHRoZXJlIHdhcyBhIG1hdGNoIGJ1dCB0aGUgY3VycmVudCBtYXRjaFxyXG5cdFx0XHRcdFx0Ly8gaXMgbG9uZ2VyLCB0cnVuY2F0ZSB0aGUgcHJldmlvdXMgbWF0Y2ggdG8gYSBzaW5nbGUgbGl0ZXJhbC5cclxuXHJcblx0XHRcdFx0XHRiZmx1c2ggPSBfdHJfdGFsbHkoMCwgd2luZG93W3N0cnN0YXJ0IC0gMV0gJiAweGZmKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoYmZsdXNoKSB7XHJcblx0XHRcdFx0XHRcdGZsdXNoX2Jsb2NrX29ubHkoZmFsc2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c3Ryc3RhcnQrKztcclxuXHRcdFx0XHRcdGxvb2thaGVhZC0tO1xyXG5cdFx0XHRcdFx0aWYgKHN0cm0uYXZhaWxfb3V0ID09PSAwKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gTmVlZE1vcmU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIFRoZXJlIGlzIG5vIHByZXZpb3VzIG1hdGNoIHRvIGNvbXBhcmUgd2l0aCwgd2FpdCBmb3JcclxuXHRcdFx0XHRcdC8vIHRoZSBuZXh0IHN0ZXAgdG8gZGVjaWRlLlxyXG5cclxuXHRcdFx0XHRcdG1hdGNoX2F2YWlsYWJsZSA9IDE7XHJcblx0XHRcdFx0XHRzdHJzdGFydCsrO1xyXG5cdFx0XHRcdFx0bG9va2FoZWFkLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAobWF0Y2hfYXZhaWxhYmxlICE9PSAwKSB7XHJcblx0XHRcdFx0YmZsdXNoID0gX3RyX3RhbGx5KDAsIHdpbmRvd1tzdHJzdGFydCAtIDFdICYgMHhmZik7XHJcblx0XHRcdFx0bWF0Y2hfYXZhaWxhYmxlID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmbHVzaF9ibG9ja19vbmx5KGZsdXNoID09IFpfRklOSVNIKTtcclxuXHJcblx0XHRcdGlmIChzdHJtLmF2YWlsX291dCA9PT0gMCkge1xyXG5cdFx0XHRcdGlmIChmbHVzaCA9PSBaX0ZJTklTSClcclxuXHRcdFx0XHRcdHJldHVybiBGaW5pc2hTdGFydGVkO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBOZWVkTW9yZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGZsdXNoID09IFpfRklOSVNIID8gRmluaXNoRG9uZSA6IEJsb2NrRG9uZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBkZWZsYXRlUmVzZXQoc3RybSkge1xyXG5cdFx0XHRzdHJtLnRvdGFsX2luID0gc3RybS50b3RhbF9vdXQgPSAwO1xyXG5cdFx0XHRzdHJtLm1zZyA9IG51bGw7IC8vXHJcblx0XHRcdFxyXG5cdFx0XHR0aGF0LnBlbmRpbmcgPSAwO1xyXG5cdFx0XHR0aGF0LnBlbmRpbmdfb3V0ID0gMDtcclxuXHJcblx0XHRcdHN0YXR1cyA9IEJVU1lfU1RBVEU7XHJcblxyXG5cdFx0XHRsYXN0X2ZsdXNoID0gWl9OT19GTFVTSDtcclxuXHJcblx0XHRcdHRyX2luaXQoKTtcclxuXHRcdFx0bG1faW5pdCgpO1xyXG5cdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdH1cclxuXHJcblx0XHR0aGF0LmRlZmxhdGVJbml0ID0gZnVuY3Rpb24oc3RybSwgX2xldmVsLCBiaXRzLCBfbWV0aG9kLCBtZW1MZXZlbCwgX3N0cmF0ZWd5KSB7XHJcblx0XHRcdGlmICghX21ldGhvZClcclxuXHRcdFx0XHRfbWV0aG9kID0gWl9ERUZMQVRFRDtcclxuXHRcdFx0aWYgKCFtZW1MZXZlbClcclxuXHRcdFx0XHRtZW1MZXZlbCA9IERFRl9NRU1fTEVWRUw7XHJcblx0XHRcdGlmICghX3N0cmF0ZWd5KVxyXG5cdFx0XHRcdF9zdHJhdGVneSA9IFpfREVGQVVMVF9TVFJBVEVHWTtcclxuXHJcblx0XHRcdC8vIGJ5dGVbXSBteV92ZXJzaW9uPVpMSUJfVkVSU0lPTjtcclxuXHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIGlmICghdmVyc2lvbiB8fCB2ZXJzaW9uWzBdICE9IG15X3ZlcnNpb25bMF1cclxuXHRcdFx0Ly8gfHwgc3RyZWFtX3NpemUgIT0gc2l6ZW9mKHpfc3RyZWFtKSkge1xyXG5cdFx0XHQvLyByZXR1cm4gWl9WRVJTSU9OX0VSUk9SO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRzdHJtLm1zZyA9IG51bGw7XHJcblxyXG5cdFx0XHRpZiAoX2xldmVsID09IFpfREVGQVVMVF9DT01QUkVTU0lPTilcclxuXHRcdFx0XHRfbGV2ZWwgPSA2O1xyXG5cclxuXHRcdFx0aWYgKG1lbUxldmVsIDwgMSB8fCBtZW1MZXZlbCA+IE1BWF9NRU1fTEVWRUwgfHwgX21ldGhvZCAhPSBaX0RFRkxBVEVEIHx8IGJpdHMgPCA5IHx8IGJpdHMgPiAxNSB8fCBfbGV2ZWwgPCAwIHx8IF9sZXZlbCA+IDkgfHwgX3N0cmF0ZWd5IDwgMFxyXG5cdFx0XHRcdFx0fHwgX3N0cmF0ZWd5ID4gWl9IVUZGTUFOX09OTFkpIHtcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0cm0uZHN0YXRlID0gdGhhdDtcclxuXHJcblx0XHRcdHdfYml0cyA9IGJpdHM7XHJcblx0XHRcdHdfc2l6ZSA9IDEgPDwgd19iaXRzO1xyXG5cdFx0XHR3X21hc2sgPSB3X3NpemUgLSAxO1xyXG5cclxuXHRcdFx0aGFzaF9iaXRzID0gbWVtTGV2ZWwgKyA3O1xyXG5cdFx0XHRoYXNoX3NpemUgPSAxIDw8IGhhc2hfYml0cztcclxuXHRcdFx0aGFzaF9tYXNrID0gaGFzaF9zaXplIC0gMTtcclxuXHRcdFx0aGFzaF9zaGlmdCA9IE1hdGguZmxvb3IoKGhhc2hfYml0cyArIE1JTl9NQVRDSCAtIDEpIC8gTUlOX01BVENIKTtcclxuXHJcblx0XHRcdHdpbmRvdyA9IG5ldyBVaW50OEFycmF5KHdfc2l6ZSAqIDIpO1xyXG5cdFx0XHRwcmV2ID0gW107XHJcblx0XHRcdGhlYWQgPSBbXTtcclxuXHJcblx0XHRcdGxpdF9idWZzaXplID0gMSA8PCAobWVtTGV2ZWwgKyA2KTsgLy8gMTZLIGVsZW1lbnRzIGJ5IGRlZmF1bHRcclxuXHJcblx0XHRcdC8vIFdlIG92ZXJsYXkgcGVuZGluZ19idWYgYW5kIGRfYnVmK2xfYnVmLiBUaGlzIHdvcmtzIHNpbmNlIHRoZSBhdmVyYWdlXHJcblx0XHRcdC8vIG91dHB1dCBzaXplIGZvciAobGVuZ3RoLGRpc3RhbmNlKSBjb2RlcyBpcyA8PSAyNCBiaXRzLlxyXG5cdFx0XHR0aGF0LnBlbmRpbmdfYnVmID0gbmV3IFVpbnQ4QXJyYXkobGl0X2J1ZnNpemUgKiA0KTtcclxuXHRcdFx0cGVuZGluZ19idWZfc2l6ZSA9IGxpdF9idWZzaXplICogNDtcclxuXHJcblx0XHRcdGRfYnVmID0gTWF0aC5mbG9vcihsaXRfYnVmc2l6ZSAvIDIpO1xyXG5cdFx0XHRsX2J1ZiA9ICgxICsgMikgKiBsaXRfYnVmc2l6ZTtcclxuXHJcblx0XHRcdGxldmVsID0gX2xldmVsO1xyXG5cclxuXHRcdFx0c3RyYXRlZ3kgPSBfc3RyYXRlZ3k7XHJcblx0XHRcdG1ldGhvZCA9IF9tZXRob2QgJiAweGZmO1xyXG5cclxuXHRcdFx0cmV0dXJuIGRlZmxhdGVSZXNldChzdHJtKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5kZWZsYXRlRW5kID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChzdGF0dXMgIT0gSU5JVF9TVEFURSAmJiBzdGF0dXMgIT0gQlVTWV9TVEFURSAmJiBzdGF0dXMgIT0gRklOSVNIX1NUQVRFKSB7XHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIERlYWxsb2NhdGUgaW4gcmV2ZXJzZSBvcmRlciBvZiBhbGxvY2F0aW9uczpcclxuXHRcdFx0dGhhdC5wZW5kaW5nX2J1ZiA9IG51bGw7XHJcblx0XHRcdGhlYWQgPSBudWxsO1xyXG5cdFx0XHRwcmV2ID0gbnVsbDtcclxuXHRcdFx0d2luZG93ID0gbnVsbDtcclxuXHRcdFx0Ly8gZnJlZVxyXG5cdFx0XHR0aGF0LmRzdGF0ZSA9IG51bGw7XHJcblx0XHRcdHJldHVybiBzdGF0dXMgPT0gQlVTWV9TVEFURSA/IFpfREFUQV9FUlJPUiA6IFpfT0s7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuZGVmbGF0ZVBhcmFtcyA9IGZ1bmN0aW9uKHN0cm0sIF9sZXZlbCwgX3N0cmF0ZWd5KSB7XHJcblx0XHRcdHZhciBlcnIgPSBaX09LO1xyXG5cclxuXHRcdFx0aWYgKF9sZXZlbCA9PSBaX0RFRkFVTFRfQ09NUFJFU1NJT04pIHtcclxuXHRcdFx0XHRfbGV2ZWwgPSA2O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChfbGV2ZWwgPCAwIHx8IF9sZXZlbCA+IDkgfHwgX3N0cmF0ZWd5IDwgMCB8fCBfc3RyYXRlZ3kgPiBaX0hVRkZNQU5fT05MWSkge1xyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGNvbmZpZ190YWJsZVtsZXZlbF0uZnVuYyAhPSBjb25maWdfdGFibGVbX2xldmVsXS5mdW5jICYmIHN0cm0udG90YWxfaW4gIT09IDApIHtcclxuXHRcdFx0XHQvLyBGbHVzaCB0aGUgbGFzdCBidWZmZXI6XHJcblx0XHRcdFx0ZXJyID0gc3RybS5kZWZsYXRlKFpfUEFSVElBTF9GTFVTSCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChsZXZlbCAhPSBfbGV2ZWwpIHtcclxuXHRcdFx0XHRsZXZlbCA9IF9sZXZlbDtcclxuXHRcdFx0XHRtYXhfbGF6eV9tYXRjaCA9IGNvbmZpZ190YWJsZVtsZXZlbF0ubWF4X2xhenk7XHJcblx0XHRcdFx0Z29vZF9tYXRjaCA9IGNvbmZpZ190YWJsZVtsZXZlbF0uZ29vZF9sZW5ndGg7XHJcblx0XHRcdFx0bmljZV9tYXRjaCA9IGNvbmZpZ190YWJsZVtsZXZlbF0ubmljZV9sZW5ndGg7XHJcblx0XHRcdFx0bWF4X2NoYWluX2xlbmd0aCA9IGNvbmZpZ190YWJsZVtsZXZlbF0ubWF4X2NoYWluO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0cmF0ZWd5ID0gX3N0cmF0ZWd5O1xyXG5cdFx0XHRyZXR1cm4gZXJyO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmRlZmxhdGVTZXREaWN0aW9uYXJ5ID0gZnVuY3Rpb24oc3RybSwgZGljdGlvbmFyeSwgZGljdExlbmd0aCkge1xyXG5cdFx0XHR2YXIgbGVuZ3RoID0gZGljdExlbmd0aDtcclxuXHRcdFx0dmFyIG4sIGluZGV4ID0gMDtcclxuXHJcblx0XHRcdGlmICghZGljdGlvbmFyeSB8fCBzdGF0dXMgIT0gSU5JVF9TVEFURSlcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblxyXG5cdFx0XHRpZiAobGVuZ3RoIDwgTUlOX01BVENIKVxyXG5cdFx0XHRcdHJldHVybiBaX09LO1xyXG5cdFx0XHRpZiAobGVuZ3RoID4gd19zaXplIC0gTUlOX0xPT0tBSEVBRCkge1xyXG5cdFx0XHRcdGxlbmd0aCA9IHdfc2l6ZSAtIE1JTl9MT09LQUhFQUQ7XHJcblx0XHRcdFx0aW5kZXggPSBkaWN0TGVuZ3RoIC0gbGVuZ3RoOyAvLyB1c2UgdGhlIHRhaWwgb2YgdGhlIGRpY3Rpb25hcnlcclxuXHRcdFx0fVxyXG5cdFx0XHR3aW5kb3cuc2V0KGRpY3Rpb25hcnkuc3ViYXJyYXkoaW5kZXgsIGluZGV4ICsgbGVuZ3RoKSwgMCk7XHJcblxyXG5cdFx0XHRzdHJzdGFydCA9IGxlbmd0aDtcclxuXHRcdFx0YmxvY2tfc3RhcnQgPSBsZW5ndGg7XHJcblxyXG5cdFx0XHQvLyBJbnNlcnQgYWxsIHN0cmluZ3MgaW4gdGhlIGhhc2ggdGFibGUgKGV4Y2VwdCBmb3IgdGhlIGxhc3QgdHdvIGJ5dGVzKS5cclxuXHRcdFx0Ly8gcy0+bG9va2FoZWFkIHN0YXlzIG51bGwsIHNvIHMtPmluc19oIHdpbGwgYmUgcmVjb21wdXRlZCBhdCB0aGUgbmV4dFxyXG5cdFx0XHQvLyBjYWxsIG9mIGZpbGxfd2luZG93LlxyXG5cclxuXHRcdFx0aW5zX2ggPSB3aW5kb3dbMF0gJiAweGZmO1xyXG5cdFx0XHRpbnNfaCA9ICgoKGluc19oKSA8PCBoYXNoX3NoaWZ0KSBeICh3aW5kb3dbMV0gJiAweGZmKSkgJiBoYXNoX21hc2s7XHJcblxyXG5cdFx0XHRmb3IgKG4gPSAwOyBuIDw9IGxlbmd0aCAtIE1JTl9NQVRDSDsgbisrKSB7XHJcblx0XHRcdFx0aW5zX2ggPSAoKChpbnNfaCkgPDwgaGFzaF9zaGlmdCkgXiAod2luZG93WyhuKSArIChNSU5fTUFUQ0ggLSAxKV0gJiAweGZmKSkgJiBoYXNoX21hc2s7XHJcblx0XHRcdFx0cHJldltuICYgd19tYXNrXSA9IGhlYWRbaW5zX2hdO1xyXG5cdFx0XHRcdGhlYWRbaW5zX2hdID0gbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5kZWZsYXRlID0gZnVuY3Rpb24oX3N0cm0sIGZsdXNoKSB7XHJcblx0XHRcdHZhciBpLCBoZWFkZXIsIGxldmVsX2ZsYWdzLCBvbGRfZmx1c2gsIGJzdGF0ZTtcclxuXHJcblx0XHRcdGlmIChmbHVzaCA+IFpfRklOSVNIIHx8IGZsdXNoIDwgMCkge1xyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCFfc3RybS5uZXh0X291dCB8fCAoIV9zdHJtLm5leHRfaW4gJiYgX3N0cm0uYXZhaWxfaW4gIT09IDApIHx8IChzdGF0dXMgPT0gRklOSVNIX1NUQVRFICYmIGZsdXNoICE9IFpfRklOSVNIKSkge1xyXG5cdFx0XHRcdF9zdHJtLm1zZyA9IHpfZXJybXNnW1pfTkVFRF9ESUNUIC0gKFpfU1RSRUFNX0VSUk9SKV07XHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChfc3RybS5hdmFpbF9vdXQgPT09IDApIHtcclxuXHRcdFx0XHRfc3RybS5tc2cgPSB6X2Vycm1zZ1taX05FRURfRElDVCAtIChaX0JVRl9FUlJPUildO1xyXG5cdFx0XHRcdHJldHVybiBaX0JVRl9FUlJPUjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RybSA9IF9zdHJtOyAvLyBqdXN0IGluIGNhc2VcclxuXHRcdFx0b2xkX2ZsdXNoID0gbGFzdF9mbHVzaDtcclxuXHRcdFx0bGFzdF9mbHVzaCA9IGZsdXNoO1xyXG5cclxuXHRcdFx0Ly8gV3JpdGUgdGhlIHpsaWIgaGVhZGVyXHJcblx0XHRcdGlmIChzdGF0dXMgPT0gSU5JVF9TVEFURSkge1xyXG5cdFx0XHRcdGhlYWRlciA9IChaX0RFRkxBVEVEICsgKCh3X2JpdHMgLSA4KSA8PCA0KSkgPDwgODtcclxuXHRcdFx0XHRsZXZlbF9mbGFncyA9ICgobGV2ZWwgLSAxKSAmIDB4ZmYpID4+IDE7XHJcblxyXG5cdFx0XHRcdGlmIChsZXZlbF9mbGFncyA+IDMpXHJcblx0XHRcdFx0XHRsZXZlbF9mbGFncyA9IDM7XHJcblx0XHRcdFx0aGVhZGVyIHw9IChsZXZlbF9mbGFncyA8PCA2KTtcclxuXHRcdFx0XHRpZiAoc3Ryc3RhcnQgIT09IDApXHJcblx0XHRcdFx0XHRoZWFkZXIgfD0gUFJFU0VUX0RJQ1Q7XHJcblx0XHRcdFx0aGVhZGVyICs9IDMxIC0gKGhlYWRlciAlIDMxKTtcclxuXHJcblx0XHRcdFx0c3RhdHVzID0gQlVTWV9TVEFURTtcclxuXHRcdFx0XHRwdXRTaG9ydE1TQihoZWFkZXIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBGbHVzaCBhcyBtdWNoIHBlbmRpbmcgb3V0cHV0IGFzIHBvc3NpYmxlXHJcblx0XHRcdGlmICh0aGF0LnBlbmRpbmcgIT09IDApIHtcclxuXHRcdFx0XHRzdHJtLmZsdXNoX3BlbmRpbmcoKTtcclxuXHRcdFx0XHRpZiAoc3RybS5hdmFpbF9vdXQgPT09IDApIHtcclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKFwiIGF2YWlsX291dD09MFwiKTtcclxuXHRcdFx0XHRcdC8vIFNpbmNlIGF2YWlsX291dCBpcyAwLCBkZWZsYXRlIHdpbGwgYmUgY2FsbGVkIGFnYWluIHdpdGhcclxuXHRcdFx0XHRcdC8vIG1vcmUgb3V0cHV0IHNwYWNlLCBidXQgcG9zc2libHkgd2l0aCBib3RoIHBlbmRpbmcgYW5kXHJcblx0XHRcdFx0XHQvLyBhdmFpbF9pbiBlcXVhbCB0byB6ZXJvLiBUaGVyZSB3b24ndCBiZSBhbnl0aGluZyB0byBkbyxcclxuXHRcdFx0XHRcdC8vIGJ1dCB0aGlzIGlzIG5vdCBhbiBlcnJvciBzaXR1YXRpb24gc28gbWFrZSBzdXJlIHdlXHJcblx0XHRcdFx0XHQvLyByZXR1cm4gT0sgaW5zdGVhZCBvZiBCVUZfRVJST1IgYXQgbmV4dCBjYWxsIG9mIGRlZmxhdGU6XHJcblx0XHRcdFx0XHRsYXN0X2ZsdXNoID0gLTE7XHJcblx0XHRcdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGVyZSBpcyBzb21ldGhpbmcgdG8gZG8gYW5kIGF2b2lkIGR1cGxpY2F0ZVxyXG5cdFx0XHRcdC8vIGNvbnNlY3V0aXZlXHJcblx0XHRcdFx0Ly8gZmx1c2hlcy4gRm9yIHJlcGVhdGVkIGFuZCB1c2VsZXNzIGNhbGxzIHdpdGggWl9GSU5JU0gsIHdlIGtlZXBcclxuXHRcdFx0XHQvLyByZXR1cm5pbmcgWl9TVFJFQU1fRU5EIGluc3RlYWQgb2YgWl9CVUZGX0VSUk9SLlxyXG5cdFx0XHR9IGVsc2UgaWYgKHN0cm0uYXZhaWxfaW4gPT09IDAgJiYgZmx1c2ggPD0gb2xkX2ZsdXNoICYmIGZsdXNoICE9IFpfRklOSVNIKSB7XHJcblx0XHRcdFx0c3RybS5tc2cgPSB6X2Vycm1zZ1taX05FRURfRElDVCAtIChaX0JVRl9FUlJPUildO1xyXG5cdFx0XHRcdHJldHVybiBaX0JVRl9FUlJPUjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVXNlciBtdXN0IG5vdCBwcm92aWRlIG1vcmUgaW5wdXQgYWZ0ZXIgdGhlIGZpcnN0IEZJTklTSDpcclxuXHRcdFx0aWYgKHN0YXR1cyA9PSBGSU5JU0hfU1RBVEUgJiYgc3RybS5hdmFpbF9pbiAhPT0gMCkge1xyXG5cdFx0XHRcdF9zdHJtLm1zZyA9IHpfZXJybXNnW1pfTkVFRF9ESUNUIC0gKFpfQlVGX0VSUk9SKV07XHJcblx0XHRcdFx0cmV0dXJuIFpfQlVGX0VSUk9SO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTdGFydCBhIG5ldyBibG9jayBvciBjb250aW51ZSB0aGUgY3VycmVudCBvbmUuXHJcblx0XHRcdGlmIChzdHJtLmF2YWlsX2luICE9PSAwIHx8IGxvb2thaGVhZCAhPT0gMCB8fCAoZmx1c2ggIT0gWl9OT19GTFVTSCAmJiBzdGF0dXMgIT0gRklOSVNIX1NUQVRFKSkge1xyXG5cdFx0XHRcdGJzdGF0ZSA9IC0xO1xyXG5cdFx0XHRcdHN3aXRjaCAoY29uZmlnX3RhYmxlW2xldmVsXS5mdW5jKSB7XHJcblx0XHRcdFx0Y2FzZSBTVE9SRUQ6XHJcblx0XHRcdFx0XHRic3RhdGUgPSBkZWZsYXRlX3N0b3JlZChmbHVzaCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIEZBU1Q6XHJcblx0XHRcdFx0XHRic3RhdGUgPSBkZWZsYXRlX2Zhc3QoZmx1c2gpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBTTE9XOlxyXG5cdFx0XHRcdFx0YnN0YXRlID0gZGVmbGF0ZV9zbG93KGZsdXNoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoYnN0YXRlID09IEZpbmlzaFN0YXJ0ZWQgfHwgYnN0YXRlID09IEZpbmlzaERvbmUpIHtcclxuXHRcdFx0XHRcdHN0YXR1cyA9IEZJTklTSF9TVEFURTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGJzdGF0ZSA9PSBOZWVkTW9yZSB8fCBic3RhdGUgPT0gRmluaXNoU3RhcnRlZCkge1xyXG5cdFx0XHRcdFx0aWYgKHN0cm0uYXZhaWxfb3V0ID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdGxhc3RfZmx1c2ggPSAtMTsgLy8gYXZvaWQgQlVGX0VSUk9SIG5leHQgY2FsbCwgc2VlIGFib3ZlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdFx0XHRcdC8vIElmIGZsdXNoICE9IFpfTk9fRkxVU0ggJiYgYXZhaWxfb3V0ID09PSAwLCB0aGUgbmV4dCBjYWxsXHJcblx0XHRcdFx0XHQvLyBvZiBkZWZsYXRlIHNob3VsZCB1c2UgdGhlIHNhbWUgZmx1c2ggcGFyYW1ldGVyIHRvIG1ha2Ugc3VyZVxyXG5cdFx0XHRcdFx0Ly8gdGhhdCB0aGUgZmx1c2ggaXMgY29tcGxldGUuIFNvIHdlIGRvbid0IGhhdmUgdG8gb3V0cHV0IGFuXHJcblx0XHRcdFx0XHQvLyBlbXB0eSBibG9jayBoZXJlLCB0aGlzIHdpbGwgYmUgZG9uZSBhdCBuZXh0IGNhbGwuIFRoaXMgYWxzb1xyXG5cdFx0XHRcdFx0Ly8gZW5zdXJlcyB0aGF0IGZvciBhIHZlcnkgc21hbGwgb3V0cHV0IGJ1ZmZlciwgd2UgZW1pdCBhdCBtb3N0XHJcblx0XHRcdFx0XHQvLyBvbmUgZW1wdHkgYmxvY2suXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoYnN0YXRlID09IEJsb2NrRG9uZSkge1xyXG5cdFx0XHRcdFx0aWYgKGZsdXNoID09IFpfUEFSVElBTF9GTFVTSCkge1xyXG5cdFx0XHRcdFx0XHRfdHJfYWxpZ24oKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7IC8vIEZVTExfRkxVU0ggb3IgU1lOQ19GTFVTSFxyXG5cdFx0XHRcdFx0XHRfdHJfc3RvcmVkX2Jsb2NrKDAsIDAsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0Ly8gRm9yIGEgZnVsbCBmbHVzaCwgdGhpcyBlbXB0eSBibG9jayB3aWxsIGJlIHJlY29nbml6ZWRcclxuXHRcdFx0XHRcdFx0Ly8gYXMgYSBzcGVjaWFsIG1hcmtlciBieSBpbmZsYXRlX3N5bmMoKS5cclxuXHRcdFx0XHRcdFx0aWYgKGZsdXNoID09IFpfRlVMTF9GTFVTSCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHN0YXRlLmhlYWRbcy5oYXNoX3NpemUtMV09MDtcclxuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgaGFzaF9zaXplLyotMSovOyBpKyspXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBmb3JnZXQgaGlzdG9yeVxyXG5cdFx0XHRcdFx0XHRcdFx0aGVhZFtpXSA9IDA7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0cm0uZmx1c2hfcGVuZGluZygpO1xyXG5cdFx0XHRcdFx0aWYgKHN0cm0uYXZhaWxfb3V0ID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdGxhc3RfZmx1c2ggPSAtMTsgLy8gYXZvaWQgQlVGX0VSUk9SIGF0IG5leHQgY2FsbCwgc2VlIGFib3ZlXHJcblx0XHRcdFx0XHRcdHJldHVybiBaX09LO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGZsdXNoICE9IFpfRklOSVNIKVxyXG5cdFx0XHRcdHJldHVybiBaX09LO1xyXG5cdFx0XHRyZXR1cm4gWl9TVFJFQU1fRU5EO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8vIFpTdHJlYW1cclxuXHJcblx0ZnVuY3Rpb24gWlN0cmVhbSgpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdHRoYXQubmV4dF9pbl9pbmRleCA9IDA7XHJcblx0XHR0aGF0Lm5leHRfb3V0X2luZGV4ID0gMDtcclxuXHRcdC8vIHRoYXQubmV4dF9pbjsgLy8gbmV4dCBpbnB1dCBieXRlXHJcblx0XHR0aGF0LmF2YWlsX2luID0gMDsgLy8gbnVtYmVyIG9mIGJ5dGVzIGF2YWlsYWJsZSBhdCBuZXh0X2luXHJcblx0XHR0aGF0LnRvdGFsX2luID0gMDsgLy8gdG90YWwgbmIgb2YgaW5wdXQgYnl0ZXMgcmVhZCBzbyBmYXJcclxuXHRcdC8vIHRoYXQubmV4dF9vdXQ7IC8vIG5leHQgb3V0cHV0IGJ5dGUgc2hvdWxkIGJlIHB1dCB0aGVyZVxyXG5cdFx0dGhhdC5hdmFpbF9vdXQgPSAwOyAvLyByZW1haW5pbmcgZnJlZSBzcGFjZSBhdCBuZXh0X291dFxyXG5cdFx0dGhhdC50b3RhbF9vdXQgPSAwOyAvLyB0b3RhbCBuYiBvZiBieXRlcyBvdXRwdXQgc28gZmFyXHJcblx0XHQvLyB0aGF0Lm1zZztcclxuXHRcdC8vIHRoYXQuZHN0YXRlO1xyXG5cdH1cclxuXHJcblx0WlN0cmVhbS5wcm90b3R5cGUgPSB7XHJcblx0XHRkZWZsYXRlSW5pdCA6IGZ1bmN0aW9uKGxldmVsLCBiaXRzKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0dGhhdC5kc3RhdGUgPSBuZXcgRGVmbGF0ZSgpO1xyXG5cdFx0XHRpZiAoIWJpdHMpXHJcblx0XHRcdFx0Yml0cyA9IE1BWF9CSVRTO1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5kc3RhdGUuZGVmbGF0ZUluaXQodGhhdCwgbGV2ZWwsIGJpdHMpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRkZWZsYXRlIDogZnVuY3Rpb24oZmx1c2gpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRpZiAoIXRoYXQuZHN0YXRlKSB7XHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGF0LmRzdGF0ZS5kZWZsYXRlKHRoYXQsIGZsdXNoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVmbGF0ZUVuZCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHRcdGlmICghdGhhdC5kc3RhdGUpXHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cdFx0XHR2YXIgcmV0ID0gdGhhdC5kc3RhdGUuZGVmbGF0ZUVuZCgpO1xyXG5cdFx0XHR0aGF0LmRzdGF0ZSA9IG51bGw7XHJcblx0XHRcdHJldHVybiByZXQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlZmxhdGVQYXJhbXMgOiBmdW5jdGlvbihsZXZlbCwgc3RyYXRlZ3kpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRpZiAoIXRoYXQuZHN0YXRlKVxyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0cmV0dXJuIHRoYXQuZHN0YXRlLmRlZmxhdGVQYXJhbXModGhhdCwgbGV2ZWwsIHN0cmF0ZWd5KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVmbGF0ZVNldERpY3Rpb25hcnkgOiBmdW5jdGlvbihkaWN0aW9uYXJ5LCBkaWN0TGVuZ3RoKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0aWYgKCF0aGF0LmRzdGF0ZSlcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdHJldHVybiB0aGF0LmRzdGF0ZS5kZWZsYXRlU2V0RGljdGlvbmFyeSh0aGF0LCBkaWN0aW9uYXJ5LCBkaWN0TGVuZ3RoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gUmVhZCBhIG5ldyBidWZmZXIgZnJvbSB0aGUgY3VycmVudCBpbnB1dCBzdHJlYW0sIHVwZGF0ZSB0aGVcclxuXHRcdC8vIHRvdGFsIG51bWJlciBvZiBieXRlcyByZWFkLiBBbGwgZGVmbGF0ZSgpIGlucHV0IGdvZXMgdGhyb3VnaFxyXG5cdFx0Ly8gdGhpcyBmdW5jdGlvbiBzbyBzb21lIGFwcGxpY2F0aW9ucyBtYXkgd2lzaCB0byBtb2RpZnkgaXQgdG8gYXZvaWRcclxuXHRcdC8vIGFsbG9jYXRpbmcgYSBsYXJnZSBzdHJtLT5uZXh0X2luIGJ1ZmZlciBhbmQgY29weWluZyBmcm9tIGl0LlxyXG5cdFx0Ly8gKFNlZSBhbHNvIGZsdXNoX3BlbmRpbmcoKSkuXHJcblx0XHRyZWFkX2J1ZiA6IGZ1bmN0aW9uKGJ1Ziwgc3RhcnQsIHNpemUpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHR2YXIgbGVuID0gdGhhdC5hdmFpbF9pbjtcclxuXHRcdFx0aWYgKGxlbiA+IHNpemUpXHJcblx0XHRcdFx0bGVuID0gc2l6ZTtcclxuXHRcdFx0aWYgKGxlbiA9PT0gMClcclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0dGhhdC5hdmFpbF9pbiAtPSBsZW47XHJcblx0XHRcdGJ1Zi5zZXQodGhhdC5uZXh0X2luLnN1YmFycmF5KHRoYXQubmV4dF9pbl9pbmRleCwgdGhhdC5uZXh0X2luX2luZGV4ICsgbGVuKSwgc3RhcnQpO1xyXG5cdFx0XHR0aGF0Lm5leHRfaW5faW5kZXggKz0gbGVuO1xyXG5cdFx0XHR0aGF0LnRvdGFsX2luICs9IGxlbjtcclxuXHRcdFx0cmV0dXJuIGxlbjtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gRmx1c2ggYXMgbXVjaCBwZW5kaW5nIG91dHB1dCBhcyBwb3NzaWJsZS4gQWxsIGRlZmxhdGUoKSBvdXRwdXQgZ29lc1xyXG5cdFx0Ly8gdGhyb3VnaCB0aGlzIGZ1bmN0aW9uIHNvIHNvbWUgYXBwbGljYXRpb25zIG1heSB3aXNoIHRvIG1vZGlmeSBpdFxyXG5cdFx0Ly8gdG8gYXZvaWQgYWxsb2NhdGluZyBhIGxhcmdlIHN0cm0tPm5leHRfb3V0IGJ1ZmZlciBhbmQgY29weWluZyBpbnRvIGl0LlxyXG5cdFx0Ly8gKFNlZSBhbHNvIHJlYWRfYnVmKCkpLlxyXG5cdFx0Zmx1c2hfcGVuZGluZyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHRcdHZhciBsZW4gPSB0aGF0LmRzdGF0ZS5wZW5kaW5nO1xyXG5cclxuXHRcdFx0aWYgKGxlbiA+IHRoYXQuYXZhaWxfb3V0KVxyXG5cdFx0XHRcdGxlbiA9IHRoYXQuYXZhaWxfb3V0O1xyXG5cdFx0XHRpZiAobGVuID09PSAwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdC8vIGlmICh0aGF0LmRzdGF0ZS5wZW5kaW5nX2J1Zi5sZW5ndGggPD0gdGhhdC5kc3RhdGUucGVuZGluZ19vdXQgfHwgdGhhdC5uZXh0X291dC5sZW5ndGggPD0gdGhhdC5uZXh0X291dF9pbmRleFxyXG5cdFx0XHQvLyB8fCB0aGF0LmRzdGF0ZS5wZW5kaW5nX2J1Zi5sZW5ndGggPCAodGhhdC5kc3RhdGUucGVuZGluZ19vdXQgKyBsZW4pIHx8IHRoYXQubmV4dF9vdXQubGVuZ3RoIDwgKHRoYXQubmV4dF9vdXRfaW5kZXggK1xyXG5cdFx0XHQvLyBsZW4pKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKHRoYXQuZHN0YXRlLnBlbmRpbmdfYnVmLmxlbmd0aCArIFwiLCBcIiArIHRoYXQuZHN0YXRlLnBlbmRpbmdfb3V0ICsgXCIsIFwiICsgdGhhdC5uZXh0X291dC5sZW5ndGggKyBcIiwgXCIgK1xyXG5cdFx0XHQvLyB0aGF0Lm5leHRfb3V0X2luZGV4ICsgXCIsIFwiICsgbGVuKTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJhdmFpbF9vdXQ9XCIgKyB0aGF0LmF2YWlsX291dCk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdHRoYXQubmV4dF9vdXQuc2V0KHRoYXQuZHN0YXRlLnBlbmRpbmdfYnVmLnN1YmFycmF5KHRoYXQuZHN0YXRlLnBlbmRpbmdfb3V0LCB0aGF0LmRzdGF0ZS5wZW5kaW5nX291dCArIGxlbiksIHRoYXQubmV4dF9vdXRfaW5kZXgpO1xyXG5cclxuXHRcdFx0dGhhdC5uZXh0X291dF9pbmRleCArPSBsZW47XHJcblx0XHRcdHRoYXQuZHN0YXRlLnBlbmRpbmdfb3V0ICs9IGxlbjtcclxuXHRcdFx0dGhhdC50b3RhbF9vdXQgKz0gbGVuO1xyXG5cdFx0XHR0aGF0LmF2YWlsX291dCAtPSBsZW47XHJcblx0XHRcdHRoYXQuZHN0YXRlLnBlbmRpbmcgLT0gbGVuO1xyXG5cdFx0XHRpZiAodGhhdC5kc3RhdGUucGVuZGluZyA9PT0gMCkge1xyXG5cdFx0XHRcdHRoYXQuZHN0YXRlLnBlbmRpbmdfb3V0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIERlZmxhdGVyXHJcblxyXG5cdGZ1bmN0aW9uIERlZmxhdGVyKGxldmVsKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHR2YXIgeiA9IG5ldyBaU3RyZWFtKCk7XHJcblx0XHR2YXIgYnVmc2l6ZSA9IDUxMjtcclxuXHRcdHZhciBmbHVzaCA9IFpfTk9fRkxVU0g7XHJcblx0XHR2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYnVmc2l6ZSk7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBsZXZlbCA9PSBcInVuZGVmaW5lZFwiKVxyXG5cdFx0XHRsZXZlbCA9IFpfREVGQVVMVF9DT01QUkVTU0lPTjtcclxuXHRcdHouZGVmbGF0ZUluaXQobGV2ZWwpO1xyXG5cdFx0ei5uZXh0X291dCA9IGJ1ZjtcclxuXHJcblx0XHR0aGF0LmFwcGVuZCA9IGZ1bmN0aW9uKGRhdGEsIG9ucHJvZ3Jlc3MpIHtcclxuXHRcdFx0dmFyIGVyciwgYnVmZmVycyA9IFtdLCBsYXN0SW5kZXggPSAwLCBidWZmZXJJbmRleCA9IDAsIGJ1ZmZlclNpemUgPSAwLCBhcnJheTtcclxuXHRcdFx0aWYgKCFkYXRhLmxlbmd0aClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdHoubmV4dF9pbl9pbmRleCA9IDA7XHJcblx0XHRcdHoubmV4dF9pbiA9IGRhdGE7XHJcblx0XHRcdHouYXZhaWxfaW4gPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdHoubmV4dF9vdXRfaW5kZXggPSAwO1xyXG5cdFx0XHRcdHouYXZhaWxfb3V0ID0gYnVmc2l6ZTtcclxuXHRcdFx0XHRlcnIgPSB6LmRlZmxhdGUoZmx1c2gpO1xyXG5cdFx0XHRcdGlmIChlcnIgIT0gWl9PSylcclxuXHRcdFx0XHRcdHRocm93IFwiZGVmbGF0aW5nOiBcIiArIHoubXNnO1xyXG5cdFx0XHRcdGlmICh6Lm5leHRfb3V0X2luZGV4KVxyXG5cdFx0XHRcdFx0aWYgKHoubmV4dF9vdXRfaW5kZXggPT0gYnVmc2l6ZSlcclxuXHRcdFx0XHRcdFx0YnVmZmVycy5wdXNoKG5ldyBVaW50OEFycmF5KGJ1ZikpO1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRidWZmZXJzLnB1c2gobmV3IFVpbnQ4QXJyYXkoYnVmLnN1YmFycmF5KDAsIHoubmV4dF9vdXRfaW5kZXgpKSk7XHJcblx0XHRcdFx0YnVmZmVyU2l6ZSArPSB6Lm5leHRfb3V0X2luZGV4O1xyXG5cdFx0XHRcdGlmIChvbnByb2dyZXNzICYmIHoubmV4dF9pbl9pbmRleCA+IDAgJiYgei5uZXh0X2luX2luZGV4ICE9IGxhc3RJbmRleCkge1xyXG5cdFx0XHRcdFx0b25wcm9ncmVzcyh6Lm5leHRfaW5faW5kZXgpO1xyXG5cdFx0XHRcdFx0bGFzdEluZGV4ID0gei5uZXh0X2luX2luZGV4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSB3aGlsZSAoei5hdmFpbF9pbiA+IDAgfHwgei5hdmFpbF9vdXQgPT09IDApO1xyXG5cdFx0XHRhcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlclNpemUpO1xyXG5cdFx0XHRidWZmZXJzLmZvckVhY2goZnVuY3Rpb24oY2h1bmspIHtcclxuXHRcdFx0XHRhcnJheS5zZXQoY2h1bmssIGJ1ZmZlckluZGV4KTtcclxuXHRcdFx0XHRidWZmZXJJbmRleCArPSBjaHVuay5sZW5ndGg7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gYXJyYXk7XHJcblx0XHR9O1xyXG5cdFx0dGhhdC5mbHVzaCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZXJyLCBidWZmZXJzID0gW10sIGJ1ZmZlckluZGV4ID0gMCwgYnVmZmVyU2l6ZSA9IDAsIGFycmF5O1xyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0ei5uZXh0X291dF9pbmRleCA9IDA7XHJcblx0XHRcdFx0ei5hdmFpbF9vdXQgPSBidWZzaXplO1xyXG5cdFx0XHRcdGVyciA9IHouZGVmbGF0ZShaX0ZJTklTSCk7XHJcblx0XHRcdFx0aWYgKGVyciAhPSBaX1NUUkVBTV9FTkQgJiYgZXJyICE9IFpfT0spXHJcblx0XHRcdFx0XHR0aHJvdyBcImRlZmxhdGluZzogXCIgKyB6Lm1zZztcclxuXHRcdFx0XHRpZiAoYnVmc2l6ZSAtIHouYXZhaWxfb3V0ID4gMClcclxuXHRcdFx0XHRcdGJ1ZmZlcnMucHVzaChuZXcgVWludDhBcnJheShidWYuc3ViYXJyYXkoMCwgei5uZXh0X291dF9pbmRleCkpKTtcclxuXHRcdFx0XHRidWZmZXJTaXplICs9IHoubmV4dF9vdXRfaW5kZXg7XHJcblx0XHRcdH0gd2hpbGUgKHouYXZhaWxfaW4gPiAwIHx8IHouYXZhaWxfb3V0ID09PSAwKTtcclxuXHRcdFx0ei5kZWZsYXRlRW5kKCk7XHJcblx0XHRcdGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyU2l6ZSk7XHJcblx0XHRcdGJ1ZmZlcnMuZm9yRWFjaChmdW5jdGlvbihjaHVuaykge1xyXG5cdFx0XHRcdGFycmF5LnNldChjaHVuaywgYnVmZmVySW5kZXgpO1xyXG5cdFx0XHRcdGJ1ZmZlckluZGV4ICs9IGNodW5rLmxlbmd0aDtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBhcnJheTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR2YXIgZGVmbGF0ZXI7XHJcblxyXG5cdGlmIChvYmouemlwKVxyXG5cdFx0b2JqLnppcC5EZWZsYXRlciA9IERlZmxhdGVyO1xyXG5cdGVsc2Uge1xyXG5cdFx0ZGVmbGF0ZXIgPSBuZXcgRGVmbGF0ZXIoKTtcclxuXHRcdG9iai5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHR2YXIgbWVzc2FnZSA9IGV2ZW50LmRhdGE7XHJcblx0XHRcdGlmIChtZXNzYWdlLmluaXQpIHtcclxuXHRcdFx0XHRkZWZsYXRlciA9IG5ldyBEZWZsYXRlcihtZXNzYWdlLmxldmVsKTtcclxuXHRcdFx0XHRvYmoucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0b25pbml0IDogdHJ1ZVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChtZXNzYWdlLmFwcGVuZClcclxuXHRcdFx0XHRvYmoucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0b25hcHBlbmQgOiB0cnVlLFxyXG5cdFx0XHRcdFx0ZGF0YSA6IGRlZmxhdGVyLmFwcGVuZChtZXNzYWdlLmRhdGEsIGZ1bmN0aW9uKGN1cnJlbnQpIHtcclxuXHRcdFx0XHRcdFx0b2JqLnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0XHRcdFx0XHRwcm9ncmVzcyA6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0Y3VycmVudCA6IGN1cnJlbnRcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRpZiAobWVzc2FnZS5mbHVzaClcclxuXHRcdFx0XHRvYmoucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0b25mbHVzaCA6IHRydWUsXHJcblx0XHRcdFx0XHRkYXRhIDogZGVmbGF0ZXIuZmx1c2goKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSwgZmFsc2UpO1xyXG5cdH1cclxuXHJcbn0pKHNlbGYpO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL1RoaXJkUGFydHkvV29ya2Vycy9kZWZsYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=