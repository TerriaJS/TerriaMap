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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYzIxMDdlOGZlMzU5YTExODQ4OTUud29ya2VyLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGMyMTA3ZThmZTM1OWExMTg0ODk1Iiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90ZXJyaWFqcy1jZXNpdW0vU291cmNlL1RoaXJkUGFydHkvV29ya2Vycy9kZWZsYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImJ1aWxkL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGMyMTA3ZThmZTM1OWExMTg0ODk1IiwiLypcclxuIENvcHlyaWdodCAoYykgMjAxMyBHaWxkYXMgTG9ybWVhdS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuXHJcbiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcclxuIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG5cclxuIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcclxuIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcblxyXG4gMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgXHJcbiBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gXHJcbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuXHJcbiAzLiBUaGUgbmFtZXMgb2YgdGhlIGF1dGhvcnMgbWF5IG5vdCBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0c1xyXG4gZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcblxyXG4gVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBgYEFTIElTJycgQU5EIEFOWSBFWFBSRVNTRUQgT1IgSU1QTElFRCBXQVJSQU5USUVTLFxyXG4gSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIEpDUkFGVCxcclxuIElOQy4gT1IgQU5ZIENPTlRSSUJVVE9SUyBUTyBUSElTIFNPRlRXQVJFIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsXHJcbiBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UXHJcbiBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSxcclxuIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0ZcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcbiBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsXHJcbiBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIFRoaXMgcHJvZ3JhbSBpcyBiYXNlZCBvbiBKWmxpYiAxLjAuMiB5bW5rLCBKQ3JhZnQsSW5jLlxyXG4gKiBKWmxpYiBpcyBiYXNlZCBvbiB6bGliLTEuMS4zLCBzbyBhbGwgY3JlZGl0IHNob3VsZCBnbyBhdXRob3JzXHJcbiAqIEplYW4tbG91cCBHYWlsbHkoamxvdXBAZ3ppcC5vcmcpIGFuZCBNYXJrIEFkbGVyKG1hZGxlckBhbHVtbmkuY2FsdGVjaC5lZHUpXHJcbiAqIGFuZCBjb250cmlidXRvcnMgb2YgemxpYi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24ob2JqKSB7XHJcblxyXG5cdC8vIEdsb2JhbFxyXG5cclxuXHR2YXIgTUFYX0JJVFMgPSAxNTtcclxuXHR2YXIgRF9DT0RFUyA9IDMwO1xyXG5cdHZhciBCTF9DT0RFUyA9IDE5O1xyXG5cclxuXHR2YXIgTEVOR1RIX0NPREVTID0gMjk7XHJcblx0dmFyIExJVEVSQUxTID0gMjU2O1xyXG5cdHZhciBMX0NPREVTID0gKExJVEVSQUxTICsgMSArIExFTkdUSF9DT0RFUyk7XHJcblx0dmFyIEhFQVBfU0laRSA9ICgyICogTF9DT0RFUyArIDEpO1xyXG5cclxuXHR2YXIgRU5EX0JMT0NLID0gMjU2O1xyXG5cclxuXHQvLyBCaXQgbGVuZ3RoIGNvZGVzIG11c3Qgbm90IGV4Y2VlZCBNQVhfQkxfQklUUyBiaXRzXHJcblx0dmFyIE1BWF9CTF9CSVRTID0gNztcclxuXHJcblx0Ly8gcmVwZWF0IHByZXZpb3VzIGJpdCBsZW5ndGggMy02IHRpbWVzICgyIGJpdHMgb2YgcmVwZWF0IGNvdW50KVxyXG5cdHZhciBSRVBfM182ID0gMTY7XHJcblxyXG5cdC8vIHJlcGVhdCBhIHplcm8gbGVuZ3RoIDMtMTAgdGltZXMgKDMgYml0cyBvZiByZXBlYXQgY291bnQpXHJcblx0dmFyIFJFUFpfM18xMCA9IDE3O1xyXG5cclxuXHQvLyByZXBlYXQgYSB6ZXJvIGxlbmd0aCAxMS0xMzggdGltZXMgKDcgYml0cyBvZiByZXBlYXQgY291bnQpXHJcblx0dmFyIFJFUFpfMTFfMTM4ID0gMTg7XHJcblxyXG5cdC8vIFRoZSBsZW5ndGhzIG9mIHRoZSBiaXQgbGVuZ3RoIGNvZGVzIGFyZSBzZW50IGluIG9yZGVyIG9mIGRlY3JlYXNpbmdcclxuXHQvLyBwcm9iYWJpbGl0eSwgdG8gYXZvaWQgdHJhbnNtaXR0aW5nIHRoZSBsZW5ndGhzIGZvciB1bnVzZWQgYml0XHJcblx0Ly8gbGVuZ3RoIGNvZGVzLlxyXG5cclxuXHR2YXIgQnVmX3NpemUgPSA4ICogMjtcclxuXHJcblx0Ly8gSlpsaWIgdmVyc2lvbiA6IFwiMS4wLjJcIlxyXG5cdHZhciBaX0RFRkFVTFRfQ09NUFJFU1NJT04gPSAtMTtcclxuXHJcblx0Ly8gY29tcHJlc3Npb24gc3RyYXRlZ3lcclxuXHR2YXIgWl9GSUxURVJFRCA9IDE7XHJcblx0dmFyIFpfSFVGRk1BTl9PTkxZID0gMjtcclxuXHR2YXIgWl9ERUZBVUxUX1NUUkFURUdZID0gMDtcclxuXHJcblx0dmFyIFpfTk9fRkxVU0ggPSAwO1xyXG5cdHZhciBaX1BBUlRJQUxfRkxVU0ggPSAxO1xyXG5cdHZhciBaX0ZVTExfRkxVU0ggPSAzO1xyXG5cdHZhciBaX0ZJTklTSCA9IDQ7XHJcblxyXG5cdHZhciBaX09LID0gMDtcclxuXHR2YXIgWl9TVFJFQU1fRU5EID0gMTtcclxuXHR2YXIgWl9ORUVEX0RJQ1QgPSAyO1xyXG5cdHZhciBaX1NUUkVBTV9FUlJPUiA9IC0yO1xyXG5cdHZhciBaX0RBVEFfRVJST1IgPSAtMztcclxuXHR2YXIgWl9CVUZfRVJST1IgPSAtNTtcclxuXHJcblx0Ly8gVHJlZVxyXG5cclxuXHQvLyBzZWUgZGVmaW5pdGlvbiBvZiBhcnJheSBkaXN0X2NvZGUgYmVsb3dcclxuXHR2YXIgX2Rpc3RfY29kZSA9IFsgMCwgMSwgMiwgMywgNCwgNCwgNSwgNSwgNiwgNiwgNiwgNiwgNywgNywgNywgNywgOCwgOCwgOCwgOCwgOCwgOCwgOCwgOCwgOSwgOSwgOSwgOSwgOSwgOSwgOSwgOSwgMTAsIDEwLCAxMCwgMTAsIDEwLCAxMCwgMTAsIDEwLCAxMCwgMTAsXHJcblx0XHRcdDEwLCAxMCwgMTAsIDEwLCAxMCwgMTAsIDExLCAxMSwgMTEsIDExLCAxMSwgMTEsIDExLCAxMSwgMTEsIDExLCAxMSwgMTEsIDExLCAxMSwgMTEsIDExLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLFxyXG5cdFx0XHQxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEyLCAxMiwgMTIsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMyxcclxuXHRcdFx0MTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTMsIDEzLCAxMywgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsXHJcblx0XHRcdDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LCAxNCwgMTQsIDE0LFxyXG5cdFx0XHQxNCwgMTQsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSxcclxuXHRcdFx0MTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAxNSwgMTUsIDE1LCAwLCAwLCAxNiwgMTcsIDE4LCAxOCwgMTksIDE5LFxyXG5cdFx0XHQyMCwgMjAsIDIwLCAyMCwgMjEsIDIxLCAyMSwgMjEsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCxcclxuXHRcdFx0MjQsIDI0LCAyNCwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsXHJcblx0XHRcdDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LFxyXG5cdFx0XHQyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCxcclxuXHRcdFx0MjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjgsIDI4LCAyOCwgMjksXHJcblx0XHRcdDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LFxyXG5cdFx0XHQyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjksIDI5LCAyOSwgMjkgXTtcclxuXHJcblx0ZnVuY3Rpb24gVHJlZSgpIHtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHQvLyBkeW5fdHJlZTsgLy8gdGhlIGR5bmFtaWMgdHJlZVxyXG5cdFx0Ly8gbWF4X2NvZGU7IC8vIGxhcmdlc3QgY29kZSB3aXRoIG5vbiB6ZXJvIGZyZXF1ZW5jeVxyXG5cdFx0Ly8gc3RhdF9kZXNjOyAvLyB0aGUgY29ycmVzcG9uZGluZyBzdGF0aWMgdHJlZVxyXG5cclxuXHRcdC8vIENvbXB1dGUgdGhlIG9wdGltYWwgYml0IGxlbmd0aHMgZm9yIGEgdHJlZSBhbmQgdXBkYXRlIHRoZSB0b3RhbCBiaXRcclxuXHRcdC8vIGxlbmd0aFxyXG5cdFx0Ly8gZm9yIHRoZSBjdXJyZW50IGJsb2NrLlxyXG5cdFx0Ly8gSU4gYXNzZXJ0aW9uOiB0aGUgZmllbGRzIGZyZXEgYW5kIGRhZCBhcmUgc2V0LCBoZWFwW2hlYXBfbWF4XSBhbmRcclxuXHRcdC8vIGFib3ZlIGFyZSB0aGUgdHJlZSBub2RlcyBzb3J0ZWQgYnkgaW5jcmVhc2luZyBmcmVxdWVuY3kuXHJcblx0XHQvLyBPVVQgYXNzZXJ0aW9uczogdGhlIGZpZWxkIGxlbiBpcyBzZXQgdG8gdGhlIG9wdGltYWwgYml0IGxlbmd0aCwgdGhlXHJcblx0XHQvLyBhcnJheSBibF9jb3VudCBjb250YWlucyB0aGUgZnJlcXVlbmNpZXMgZm9yIGVhY2ggYml0IGxlbmd0aC5cclxuXHRcdC8vIFRoZSBsZW5ndGggb3B0X2xlbiBpcyB1cGRhdGVkOyBzdGF0aWNfbGVuIGlzIGFsc28gdXBkYXRlZCBpZiBzdHJlZSBpc1xyXG5cdFx0Ly8gbm90IG51bGwuXHJcblx0XHRmdW5jdGlvbiBnZW5fYml0bGVuKHMpIHtcclxuXHRcdFx0dmFyIHRyZWUgPSB0aGF0LmR5bl90cmVlO1xyXG5cdFx0XHR2YXIgc3RyZWUgPSB0aGF0LnN0YXRfZGVzYy5zdGF0aWNfdHJlZTtcclxuXHRcdFx0dmFyIGV4dHJhID0gdGhhdC5zdGF0X2Rlc2MuZXh0cmFfYml0cztcclxuXHRcdFx0dmFyIGJhc2UgPSB0aGF0LnN0YXRfZGVzYy5leHRyYV9iYXNlO1xyXG5cdFx0XHR2YXIgbWF4X2xlbmd0aCA9IHRoYXQuc3RhdF9kZXNjLm1heF9sZW5ndGg7XHJcblx0XHRcdHZhciBoOyAvLyBoZWFwIGluZGV4XHJcblx0XHRcdHZhciBuLCBtOyAvLyBpdGVyYXRlIG92ZXIgdGhlIHRyZWUgZWxlbWVudHNcclxuXHRcdFx0dmFyIGJpdHM7IC8vIGJpdCBsZW5ndGhcclxuXHRcdFx0dmFyIHhiaXRzOyAvLyBleHRyYSBiaXRzXHJcblx0XHRcdHZhciBmOyAvLyBmcmVxdWVuY3lcclxuXHRcdFx0dmFyIG92ZXJmbG93ID0gMDsgLy8gbnVtYmVyIG9mIGVsZW1lbnRzIHdpdGggYml0IGxlbmd0aCB0b28gbGFyZ2VcclxuXHJcblx0XHRcdGZvciAoYml0cyA9IDA7IGJpdHMgPD0gTUFYX0JJVFM7IGJpdHMrKylcclxuXHRcdFx0XHRzLmJsX2NvdW50W2JpdHNdID0gMDtcclxuXHJcblx0XHRcdC8vIEluIGEgZmlyc3QgcGFzcywgY29tcHV0ZSB0aGUgb3B0aW1hbCBiaXQgbGVuZ3RocyAod2hpY2ggbWF5XHJcblx0XHRcdC8vIG92ZXJmbG93IGluIHRoZSBjYXNlIG9mIHRoZSBiaXQgbGVuZ3RoIHRyZWUpLlxyXG5cdFx0XHR0cmVlW3MuaGVhcFtzLmhlYXBfbWF4XSAqIDIgKyAxXSA9IDA7IC8vIHJvb3Qgb2YgdGhlIGhlYXBcclxuXHJcblx0XHRcdGZvciAoaCA9IHMuaGVhcF9tYXggKyAxOyBoIDwgSEVBUF9TSVpFOyBoKyspIHtcclxuXHRcdFx0XHRuID0gcy5oZWFwW2hdO1xyXG5cdFx0XHRcdGJpdHMgPSB0cmVlW3RyZWVbbiAqIDIgKyAxXSAqIDIgKyAxXSArIDE7XHJcblx0XHRcdFx0aWYgKGJpdHMgPiBtYXhfbGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRiaXRzID0gbWF4X2xlbmd0aDtcclxuXHRcdFx0XHRcdG92ZXJmbG93Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRyZWVbbiAqIDIgKyAxXSA9IGJpdHM7XHJcblx0XHRcdFx0Ly8gV2Ugb3ZlcndyaXRlIHRyZWVbbioyKzFdIHdoaWNoIGlzIG5vIGxvbmdlciBuZWVkZWRcclxuXHJcblx0XHRcdFx0aWYgKG4gPiB0aGF0Lm1heF9jb2RlKVxyXG5cdFx0XHRcdFx0Y29udGludWU7IC8vIG5vdCBhIGxlYWYgbm9kZVxyXG5cclxuXHRcdFx0XHRzLmJsX2NvdW50W2JpdHNdKys7XHJcblx0XHRcdFx0eGJpdHMgPSAwO1xyXG5cdFx0XHRcdGlmIChuID49IGJhc2UpXHJcblx0XHRcdFx0XHR4Yml0cyA9IGV4dHJhW24gLSBiYXNlXTtcclxuXHRcdFx0XHRmID0gdHJlZVtuICogMl07XHJcblx0XHRcdFx0cy5vcHRfbGVuICs9IGYgKiAoYml0cyArIHhiaXRzKTtcclxuXHRcdFx0XHRpZiAoc3RyZWUpXHJcblx0XHRcdFx0XHRzLnN0YXRpY19sZW4gKz0gZiAqIChzdHJlZVtuICogMiArIDFdICsgeGJpdHMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvdmVyZmxvdyA9PT0gMClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHQvLyBUaGlzIGhhcHBlbnMgZm9yIGV4YW1wbGUgb24gb2JqMiBhbmQgcGljIG9mIHRoZSBDYWxnYXJ5IGNvcnB1c1xyXG5cdFx0XHQvLyBGaW5kIHRoZSBmaXJzdCBiaXQgbGVuZ3RoIHdoaWNoIGNvdWxkIGluY3JlYXNlOlxyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0Yml0cyA9IG1heF9sZW5ndGggLSAxO1xyXG5cdFx0XHRcdHdoaWxlIChzLmJsX2NvdW50W2JpdHNdID09PSAwKVxyXG5cdFx0XHRcdFx0Yml0cy0tO1xyXG5cdFx0XHRcdHMuYmxfY291bnRbYml0c10tLTsgLy8gbW92ZSBvbmUgbGVhZiBkb3duIHRoZSB0cmVlXHJcblx0XHRcdFx0cy5ibF9jb3VudFtiaXRzICsgMV0gKz0gMjsgLy8gbW92ZSBvbmUgb3ZlcmZsb3cgaXRlbSBhcyBpdHMgYnJvdGhlclxyXG5cdFx0XHRcdHMuYmxfY291bnRbbWF4X2xlbmd0aF0tLTtcclxuXHRcdFx0XHQvLyBUaGUgYnJvdGhlciBvZiB0aGUgb3ZlcmZsb3cgaXRlbSBhbHNvIG1vdmVzIG9uZSBzdGVwIHVwLFxyXG5cdFx0XHRcdC8vIGJ1dCB0aGlzIGRvZXMgbm90IGFmZmVjdCBibF9jb3VudFttYXhfbGVuZ3RoXVxyXG5cdFx0XHRcdG92ZXJmbG93IC09IDI7XHJcblx0XHRcdH0gd2hpbGUgKG92ZXJmbG93ID4gMCk7XHJcblxyXG5cdFx0XHRmb3IgKGJpdHMgPSBtYXhfbGVuZ3RoOyBiaXRzICE9PSAwOyBiaXRzLS0pIHtcclxuXHRcdFx0XHRuID0gcy5ibF9jb3VudFtiaXRzXTtcclxuXHRcdFx0XHR3aGlsZSAobiAhPT0gMCkge1xyXG5cdFx0XHRcdFx0bSA9IHMuaGVhcFstLWhdO1xyXG5cdFx0XHRcdFx0aWYgKG0gPiB0aGF0Lm1heF9jb2RlKVxyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdGlmICh0cmVlW20gKiAyICsgMV0gIT0gYml0cykge1xyXG5cdFx0XHRcdFx0XHRzLm9wdF9sZW4gKz0gKGJpdHMgLSB0cmVlW20gKiAyICsgMV0pICogdHJlZVttICogMl07XHJcblx0XHRcdFx0XHRcdHRyZWVbbSAqIDIgKyAxXSA9IGJpdHM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmV2ZXJzZSB0aGUgZmlyc3QgbGVuIGJpdHMgb2YgYSBjb2RlLCB1c2luZyBzdHJhaWdodGZvcndhcmQgY29kZSAoYVxyXG5cdFx0Ly8gZmFzdGVyXHJcblx0XHQvLyBtZXRob2Qgd291bGQgdXNlIGEgdGFibGUpXHJcblx0XHQvLyBJTiBhc3NlcnRpb246IDEgPD0gbGVuIDw9IDE1XHJcblx0XHRmdW5jdGlvbiBiaV9yZXZlcnNlKGNvZGUsIC8vIHRoZSB2YWx1ZSB0byBpbnZlcnRcclxuXHRcdGxlbiAvLyBpdHMgYml0IGxlbmd0aFxyXG5cdFx0KSB7XHJcblx0XHRcdHZhciByZXMgPSAwO1xyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0cmVzIHw9IGNvZGUgJiAxO1xyXG5cdFx0XHRcdGNvZGUgPj4+PSAxO1xyXG5cdFx0XHRcdHJlcyA8PD0gMTtcclxuXHRcdFx0fSB3aGlsZSAoLS1sZW4gPiAwKTtcclxuXHRcdFx0cmV0dXJuIHJlcyA+Pj4gMTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBHZW5lcmF0ZSB0aGUgY29kZXMgZm9yIGEgZ2l2ZW4gdHJlZSBhbmQgYml0IGNvdW50cyAod2hpY2ggbmVlZCBub3QgYmVcclxuXHRcdC8vIG9wdGltYWwpLlxyXG5cdFx0Ly8gSU4gYXNzZXJ0aW9uOiB0aGUgYXJyYXkgYmxfY291bnQgY29udGFpbnMgdGhlIGJpdCBsZW5ndGggc3RhdGlzdGljcyBmb3JcclxuXHRcdC8vIHRoZSBnaXZlbiB0cmVlIGFuZCB0aGUgZmllbGQgbGVuIGlzIHNldCBmb3IgYWxsIHRyZWUgZWxlbWVudHMuXHJcblx0XHQvLyBPVVQgYXNzZXJ0aW9uOiB0aGUgZmllbGQgY29kZSBpcyBzZXQgZm9yIGFsbCB0cmVlIGVsZW1lbnRzIG9mIG5vblxyXG5cdFx0Ly8gemVybyBjb2RlIGxlbmd0aC5cclxuXHRcdGZ1bmN0aW9uIGdlbl9jb2Rlcyh0cmVlLCAvLyB0aGUgdHJlZSB0byBkZWNvcmF0ZVxyXG5cdFx0bWF4X2NvZGUsIC8vIGxhcmdlc3QgY29kZSB3aXRoIG5vbiB6ZXJvIGZyZXF1ZW5jeVxyXG5cdFx0YmxfY291bnQgLy8gbnVtYmVyIG9mIGNvZGVzIGF0IGVhY2ggYml0IGxlbmd0aFxyXG5cdFx0KSB7XHJcblx0XHRcdHZhciBuZXh0X2NvZGUgPSBbXTsgLy8gbmV4dCBjb2RlIHZhbHVlIGZvciBlYWNoXHJcblx0XHRcdC8vIGJpdCBsZW5ndGhcclxuXHRcdFx0dmFyIGNvZGUgPSAwOyAvLyBydW5uaW5nIGNvZGUgdmFsdWVcclxuXHRcdFx0dmFyIGJpdHM7IC8vIGJpdCBpbmRleFxyXG5cdFx0XHR2YXIgbjsgLy8gY29kZSBpbmRleFxyXG5cdFx0XHR2YXIgbGVuO1xyXG5cclxuXHRcdFx0Ly8gVGhlIGRpc3RyaWJ1dGlvbiBjb3VudHMgYXJlIGZpcnN0IHVzZWQgdG8gZ2VuZXJhdGUgdGhlIGNvZGUgdmFsdWVzXHJcblx0XHRcdC8vIHdpdGhvdXQgYml0IHJldmVyc2FsLlxyXG5cdFx0XHRmb3IgKGJpdHMgPSAxOyBiaXRzIDw9IE1BWF9CSVRTOyBiaXRzKyspIHtcclxuXHRcdFx0XHRuZXh0X2NvZGVbYml0c10gPSBjb2RlID0gKChjb2RlICsgYmxfY291bnRbYml0cyAtIDFdKSA8PCAxKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgdGhhdCB0aGUgYml0IGNvdW50cyBpbiBibF9jb3VudCBhcmUgY29uc2lzdGVudC4gVGhlIGxhc3QgY29kZVxyXG5cdFx0XHQvLyBtdXN0IGJlIGFsbCBvbmVzLlxyXG5cdFx0XHQvLyBBc3NlcnQgKGNvZGUgKyBibF9jb3VudFtNQVhfQklUU10tMSA9PSAoMTw8TUFYX0JJVFMpLTEsXHJcblx0XHRcdC8vIFwiaW5jb25zaXN0ZW50IGJpdCBjb3VudHNcIik7XHJcblx0XHRcdC8vIFRyYWNldigoc3RkZXJyLFwiXFxuZ2VuX2NvZGVzOiBtYXhfY29kZSAlZCBcIiwgbWF4X2NvZGUpKTtcclxuXHJcblx0XHRcdGZvciAobiA9IDA7IG4gPD0gbWF4X2NvZGU7IG4rKykge1xyXG5cdFx0XHRcdGxlbiA9IHRyZWVbbiAqIDIgKyAxXTtcclxuXHRcdFx0XHRpZiAobGVuID09PSAwKVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0Ly8gTm93IHJldmVyc2UgdGhlIGJpdHNcclxuXHRcdFx0XHR0cmVlW24gKiAyXSA9IGJpX3JldmVyc2UobmV4dF9jb2RlW2xlbl0rKywgbGVuKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENvbnN0cnVjdCBvbmUgSHVmZm1hbiB0cmVlIGFuZCBhc3NpZ25zIHRoZSBjb2RlIGJpdCBzdHJpbmdzIGFuZCBsZW5ndGhzLlxyXG5cdFx0Ly8gVXBkYXRlIHRoZSB0b3RhbCBiaXQgbGVuZ3RoIGZvciB0aGUgY3VycmVudCBibG9jay5cclxuXHRcdC8vIElOIGFzc2VydGlvbjogdGhlIGZpZWxkIGZyZXEgaXMgc2V0IGZvciBhbGwgdHJlZSBlbGVtZW50cy5cclxuXHRcdC8vIE9VVCBhc3NlcnRpb25zOiB0aGUgZmllbGRzIGxlbiBhbmQgY29kZSBhcmUgc2V0IHRvIHRoZSBvcHRpbWFsIGJpdCBsZW5ndGhcclxuXHRcdC8vIGFuZCBjb3JyZXNwb25kaW5nIGNvZGUuIFRoZSBsZW5ndGggb3B0X2xlbiBpcyB1cGRhdGVkOyBzdGF0aWNfbGVuIGlzXHJcblx0XHQvLyBhbHNvIHVwZGF0ZWQgaWYgc3RyZWUgaXMgbm90IG51bGwuIFRoZSBmaWVsZCBtYXhfY29kZSBpcyBzZXQuXHJcblx0XHR0aGF0LmJ1aWxkX3RyZWUgPSBmdW5jdGlvbihzKSB7XHJcblx0XHRcdHZhciB0cmVlID0gdGhhdC5keW5fdHJlZTtcclxuXHRcdFx0dmFyIHN0cmVlID0gdGhhdC5zdGF0X2Rlc2Muc3RhdGljX3RyZWU7XHJcblx0XHRcdHZhciBlbGVtcyA9IHRoYXQuc3RhdF9kZXNjLmVsZW1zO1xyXG5cdFx0XHR2YXIgbiwgbTsgLy8gaXRlcmF0ZSBvdmVyIGhlYXAgZWxlbWVudHNcclxuXHRcdFx0dmFyIG1heF9jb2RlID0gLTE7IC8vIGxhcmdlc3QgY29kZSB3aXRoIG5vbiB6ZXJvIGZyZXF1ZW5jeVxyXG5cdFx0XHR2YXIgbm9kZTsgLy8gbmV3IG5vZGUgYmVpbmcgY3JlYXRlZFxyXG5cclxuXHRcdFx0Ly8gQ29uc3RydWN0IHRoZSBpbml0aWFsIGhlYXAsIHdpdGggbGVhc3QgZnJlcXVlbnQgZWxlbWVudCBpblxyXG5cdFx0XHQvLyBoZWFwWzFdLiBUaGUgc29ucyBvZiBoZWFwW25dIGFyZSBoZWFwWzIqbl0gYW5kIGhlYXBbMipuKzFdLlxyXG5cdFx0XHQvLyBoZWFwWzBdIGlzIG5vdCB1c2VkLlxyXG5cdFx0XHRzLmhlYXBfbGVuID0gMDtcclxuXHRcdFx0cy5oZWFwX21heCA9IEhFQVBfU0laRTtcclxuXHJcblx0XHRcdGZvciAobiA9IDA7IG4gPCBlbGVtczsgbisrKSB7XHJcblx0XHRcdFx0aWYgKHRyZWVbbiAqIDJdICE9PSAwKSB7XHJcblx0XHRcdFx0XHRzLmhlYXBbKytzLmhlYXBfbGVuXSA9IG1heF9jb2RlID0gbjtcclxuXHRcdFx0XHRcdHMuZGVwdGhbbl0gPSAwO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0cmVlW24gKiAyICsgMV0gPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVGhlIHBremlwIGZvcm1hdCByZXF1aXJlcyB0aGF0IGF0IGxlYXN0IG9uZSBkaXN0YW5jZSBjb2RlIGV4aXN0cyxcclxuXHRcdFx0Ly8gYW5kIHRoYXQgYXQgbGVhc3Qgb25lIGJpdCBzaG91bGQgYmUgc2VudCBldmVuIGlmIHRoZXJlIGlzIG9ubHkgb25lXHJcblx0XHRcdC8vIHBvc3NpYmxlIGNvZGUuIFNvIHRvIGF2b2lkIHNwZWNpYWwgY2hlY2tzIGxhdGVyIG9uIHdlIGZvcmNlIGF0IGxlYXN0XHJcblx0XHRcdC8vIHR3byBjb2RlcyBvZiBub24gemVybyBmcmVxdWVuY3kuXHJcblx0XHRcdHdoaWxlIChzLmhlYXBfbGVuIDwgMikge1xyXG5cdFx0XHRcdG5vZGUgPSBzLmhlYXBbKytzLmhlYXBfbGVuXSA9IG1heF9jb2RlIDwgMiA/ICsrbWF4X2NvZGUgOiAwO1xyXG5cdFx0XHRcdHRyZWVbbm9kZSAqIDJdID0gMTtcclxuXHRcdFx0XHRzLmRlcHRoW25vZGVdID0gMDtcclxuXHRcdFx0XHRzLm9wdF9sZW4tLTtcclxuXHRcdFx0XHRpZiAoc3RyZWUpXHJcblx0XHRcdFx0XHRzLnN0YXRpY19sZW4gLT0gc3RyZWVbbm9kZSAqIDIgKyAxXTtcclxuXHRcdFx0XHQvLyBub2RlIGlzIDAgb3IgMSBzbyBpdCBkb2VzIG5vdCBoYXZlIGV4dHJhIGJpdHNcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGF0Lm1heF9jb2RlID0gbWF4X2NvZGU7XHJcblxyXG5cdFx0XHQvLyBUaGUgZWxlbWVudHMgaGVhcFtoZWFwX2xlbi8yKzEgLi4gaGVhcF9sZW5dIGFyZSBsZWF2ZXMgb2YgdGhlIHRyZWUsXHJcblx0XHRcdC8vIGVzdGFibGlzaCBzdWItaGVhcHMgb2YgaW5jcmVhc2luZyBsZW5ndGhzOlxyXG5cclxuXHRcdFx0Zm9yIChuID0gTWF0aC5mbG9vcihzLmhlYXBfbGVuIC8gMik7IG4gPj0gMTsgbi0tKVxyXG5cdFx0XHRcdHMucHFkb3duaGVhcCh0cmVlLCBuKTtcclxuXHJcblx0XHRcdC8vIENvbnN0cnVjdCB0aGUgSHVmZm1hbiB0cmVlIGJ5IHJlcGVhdGVkbHkgY29tYmluaW5nIHRoZSBsZWFzdCB0d29cclxuXHRcdFx0Ly8gZnJlcXVlbnQgbm9kZXMuXHJcblxyXG5cdFx0XHRub2RlID0gZWxlbXM7IC8vIG5leHQgaW50ZXJuYWwgbm9kZSBvZiB0aGUgdHJlZVxyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0Ly8gbiA9IG5vZGUgb2YgbGVhc3QgZnJlcXVlbmN5XHJcblx0XHRcdFx0biA9IHMuaGVhcFsxXTtcclxuXHRcdFx0XHRzLmhlYXBbMV0gPSBzLmhlYXBbcy5oZWFwX2xlbi0tXTtcclxuXHRcdFx0XHRzLnBxZG93bmhlYXAodHJlZSwgMSk7XHJcblx0XHRcdFx0bSA9IHMuaGVhcFsxXTsgLy8gbSA9IG5vZGUgb2YgbmV4dCBsZWFzdCBmcmVxdWVuY3lcclxuXHJcblx0XHRcdFx0cy5oZWFwWy0tcy5oZWFwX21heF0gPSBuOyAvLyBrZWVwIHRoZSBub2RlcyBzb3J0ZWQgYnkgZnJlcXVlbmN5XHJcblx0XHRcdFx0cy5oZWFwWy0tcy5oZWFwX21heF0gPSBtO1xyXG5cclxuXHRcdFx0XHQvLyBDcmVhdGUgYSBuZXcgbm9kZSBmYXRoZXIgb2YgbiBhbmQgbVxyXG5cdFx0XHRcdHRyZWVbbm9kZSAqIDJdID0gKHRyZWVbbiAqIDJdICsgdHJlZVttICogMl0pO1xyXG5cdFx0XHRcdHMuZGVwdGhbbm9kZV0gPSBNYXRoLm1heChzLmRlcHRoW25dLCBzLmRlcHRoW21dKSArIDE7XHJcblx0XHRcdFx0dHJlZVtuICogMiArIDFdID0gdHJlZVttICogMiArIDFdID0gbm9kZTtcclxuXHJcblx0XHRcdFx0Ly8gYW5kIGluc2VydCB0aGUgbmV3IG5vZGUgaW4gdGhlIGhlYXBcclxuXHRcdFx0XHRzLmhlYXBbMV0gPSBub2RlKys7XHJcblx0XHRcdFx0cy5wcWRvd25oZWFwKHRyZWUsIDEpO1xyXG5cdFx0XHR9IHdoaWxlIChzLmhlYXBfbGVuID49IDIpO1xyXG5cclxuXHRcdFx0cy5oZWFwWy0tcy5oZWFwX21heF0gPSBzLmhlYXBbMV07XHJcblxyXG5cdFx0XHQvLyBBdCB0aGlzIHBvaW50LCB0aGUgZmllbGRzIGZyZXEgYW5kIGRhZCBhcmUgc2V0LiBXZSBjYW4gbm93XHJcblx0XHRcdC8vIGdlbmVyYXRlIHRoZSBiaXQgbGVuZ3Rocy5cclxuXHJcblx0XHRcdGdlbl9iaXRsZW4ocyk7XHJcblxyXG5cdFx0XHQvLyBUaGUgZmllbGQgbGVuIGlzIG5vdyBzZXQsIHdlIGNhbiBnZW5lcmF0ZSB0aGUgYml0IGNvZGVzXHJcblx0XHRcdGdlbl9jb2Rlcyh0cmVlLCB0aGF0Lm1heF9jb2RlLCBzLmJsX2NvdW50KTtcclxuXHRcdH07XHJcblxyXG5cdH1cclxuXHJcblx0VHJlZS5fbGVuZ3RoX2NvZGUgPSBbIDAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDgsIDksIDksIDEwLCAxMCwgMTEsIDExLCAxMiwgMTIsIDEyLCAxMiwgMTMsIDEzLCAxMywgMTMsIDE0LCAxNCwgMTQsIDE0LCAxNSwgMTUsIDE1LCAxNSwgMTYsIDE2LCAxNiwgMTYsXHJcblx0XHRcdDE2LCAxNiwgMTYsIDE2LCAxNywgMTcsIDE3LCAxNywgMTcsIDE3LCAxNywgMTcsIDE4LCAxOCwgMTgsIDE4LCAxOCwgMTgsIDE4LCAxOCwgMTksIDE5LCAxOSwgMTksIDE5LCAxOSwgMTksIDE5LCAyMCwgMjAsIDIwLCAyMCwgMjAsIDIwLCAyMCwgMjAsIDIwLFxyXG5cdFx0XHQyMCwgMjAsIDIwLCAyMCwgMjAsIDIwLCAyMCwgMjEsIDIxLCAyMSwgMjEsIDIxLCAyMSwgMjEsIDIxLCAyMSwgMjEsIDIxLCAyMSwgMjEsIDIxLCAyMSwgMjEsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMiwgMjIsIDIyLCAyMixcclxuXHRcdFx0MjIsIDIyLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjMsIDIzLCAyMywgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsXHJcblx0XHRcdDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNCwgMjQsIDI0LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LFxyXG5cdFx0XHQyNSwgMjUsIDI1LCAyNSwgMjUsIDI1LCAyNSwgMjUsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNiwgMjYsIDI2LCAyNixcclxuXHRcdFx0MjYsIDI2LCAyNiwgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI3LCAyNywgMjcsIDI4IF07XHJcblxyXG5cdFRyZWUuYmFzZV9sZW5ndGggPSBbIDAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDEwLCAxMiwgMTQsIDE2LCAyMCwgMjQsIDI4LCAzMiwgNDAsIDQ4LCA1NiwgNjQsIDgwLCA5NiwgMTEyLCAxMjgsIDE2MCwgMTkyLCAyMjQsIDAgXTtcclxuXHJcblx0VHJlZS5iYXNlX2Rpc3QgPSBbIDAsIDEsIDIsIDMsIDQsIDYsIDgsIDEyLCAxNiwgMjQsIDMyLCA0OCwgNjQsIDk2LCAxMjgsIDE5MiwgMjU2LCAzODQsIDUxMiwgNzY4LCAxMDI0LCAxNTM2LCAyMDQ4LCAzMDcyLCA0MDk2LCA2MTQ0LCA4MTkyLCAxMjI4OCwgMTYzODQsXHJcblx0XHRcdDI0NTc2IF07XHJcblxyXG5cdC8vIE1hcHBpbmcgZnJvbSBhIGRpc3RhbmNlIHRvIGEgZGlzdGFuY2UgY29kZS4gZGlzdCBpcyB0aGUgZGlzdGFuY2UgLSAxIGFuZFxyXG5cdC8vIG11c3Qgbm90IGhhdmUgc2lkZSBlZmZlY3RzLiBfZGlzdF9jb2RlWzI1Nl0gYW5kIF9kaXN0X2NvZGVbMjU3XSBhcmUgbmV2ZXJcclxuXHQvLyB1c2VkLlxyXG5cdFRyZWUuZF9jb2RlID0gZnVuY3Rpb24oZGlzdCkge1xyXG5cdFx0cmV0dXJuICgoZGlzdCkgPCAyNTYgPyBfZGlzdF9jb2RlW2Rpc3RdIDogX2Rpc3RfY29kZVsyNTYgKyAoKGRpc3QpID4+PiA3KV0pO1xyXG5cdH07XHJcblxyXG5cdC8vIGV4dHJhIGJpdHMgZm9yIGVhY2ggbGVuZ3RoIGNvZGVcclxuXHRUcmVlLmV4dHJhX2xiaXRzID0gWyAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAyLCAyLCAyLCAyLCAzLCAzLCAzLCAzLCA0LCA0LCA0LCA0LCA1LCA1LCA1LCA1LCAwIF07XHJcblxyXG5cdC8vIGV4dHJhIGJpdHMgZm9yIGVhY2ggZGlzdGFuY2UgY29kZVxyXG5cdFRyZWUuZXh0cmFfZGJpdHMgPSBbIDAsIDAsIDAsIDAsIDEsIDEsIDIsIDIsIDMsIDMsIDQsIDQsIDUsIDUsIDYsIDYsIDcsIDcsIDgsIDgsIDksIDksIDEwLCAxMCwgMTEsIDExLCAxMiwgMTIsIDEzLCAxMyBdO1xyXG5cclxuXHQvLyBleHRyYSBiaXRzIGZvciBlYWNoIGJpdCBsZW5ndGggY29kZVxyXG5cdFRyZWUuZXh0cmFfYmxiaXRzID0gWyAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAyLCAzLCA3IF07XHJcblxyXG5cdFRyZWUuYmxfb3JkZXIgPSBbIDE2LCAxNywgMTgsIDAsIDgsIDcsIDksIDYsIDEwLCA1LCAxMSwgNCwgMTIsIDMsIDEzLCAyLCAxNCwgMSwgMTUgXTtcclxuXHJcblx0Ly8gU3RhdGljVHJlZVxyXG5cclxuXHRmdW5jdGlvbiBTdGF0aWNUcmVlKHN0YXRpY190cmVlLCBleHRyYV9iaXRzLCBleHRyYV9iYXNlLCBlbGVtcywgbWF4X2xlbmd0aCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dGhhdC5zdGF0aWNfdHJlZSA9IHN0YXRpY190cmVlO1xyXG5cdFx0dGhhdC5leHRyYV9iaXRzID0gZXh0cmFfYml0cztcclxuXHRcdHRoYXQuZXh0cmFfYmFzZSA9IGV4dHJhX2Jhc2U7XHJcblx0XHR0aGF0LmVsZW1zID0gZWxlbXM7XHJcblx0XHR0aGF0Lm1heF9sZW5ndGggPSBtYXhfbGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0U3RhdGljVHJlZS5zdGF0aWNfbHRyZWUgPSBbIDEyLCA4LCAxNDAsIDgsIDc2LCA4LCAyMDQsIDgsIDQ0LCA4LCAxNzIsIDgsIDEwOCwgOCwgMjM2LCA4LCAyOCwgOCwgMTU2LCA4LCA5MiwgOCwgMjIwLCA4LCA2MCwgOCwgMTg4LCA4LCAxMjQsIDgsIDI1MiwgOCwgMiwgOCxcclxuXHRcdFx0MTMwLCA4LCA2NiwgOCwgMTk0LCA4LCAzNCwgOCwgMTYyLCA4LCA5OCwgOCwgMjI2LCA4LCAxOCwgOCwgMTQ2LCA4LCA4MiwgOCwgMjEwLCA4LCA1MCwgOCwgMTc4LCA4LCAxMTQsIDgsIDI0MiwgOCwgMTAsIDgsIDEzOCwgOCwgNzQsIDgsIDIwMiwgOCwgNDIsXHJcblx0XHRcdDgsIDE3MCwgOCwgMTA2LCA4LCAyMzQsIDgsIDI2LCA4LCAxNTQsIDgsIDkwLCA4LCAyMTgsIDgsIDU4LCA4LCAxODYsIDgsIDEyMiwgOCwgMjUwLCA4LCA2LCA4LCAxMzQsIDgsIDcwLCA4LCAxOTgsIDgsIDM4LCA4LCAxNjYsIDgsIDEwMiwgOCwgMjMwLCA4LFxyXG5cdFx0XHQyMiwgOCwgMTUwLCA4LCA4NiwgOCwgMjE0LCA4LCA1NCwgOCwgMTgyLCA4LCAxMTgsIDgsIDI0NiwgOCwgMTQsIDgsIDE0MiwgOCwgNzgsIDgsIDIwNiwgOCwgNDYsIDgsIDE3NCwgOCwgMTEwLCA4LCAyMzgsIDgsIDMwLCA4LCAxNTgsIDgsIDk0LCA4LFxyXG5cdFx0XHQyMjIsIDgsIDYyLCA4LCAxOTAsIDgsIDEyNiwgOCwgMjU0LCA4LCAxLCA4LCAxMjksIDgsIDY1LCA4LCAxOTMsIDgsIDMzLCA4LCAxNjEsIDgsIDk3LCA4LCAyMjUsIDgsIDE3LCA4LCAxNDUsIDgsIDgxLCA4LCAyMDksIDgsIDQ5LCA4LCAxNzcsIDgsIDExMyxcclxuXHRcdFx0OCwgMjQxLCA4LCA5LCA4LCAxMzcsIDgsIDczLCA4LCAyMDEsIDgsIDQxLCA4LCAxNjksIDgsIDEwNSwgOCwgMjMzLCA4LCAyNSwgOCwgMTUzLCA4LCA4OSwgOCwgMjE3LCA4LCA1NywgOCwgMTg1LCA4LCAxMjEsIDgsIDI0OSwgOCwgNSwgOCwgMTMzLCA4LFxyXG5cdFx0XHQ2OSwgOCwgMTk3LCA4LCAzNywgOCwgMTY1LCA4LCAxMDEsIDgsIDIyOSwgOCwgMjEsIDgsIDE0OSwgOCwgODUsIDgsIDIxMywgOCwgNTMsIDgsIDE4MSwgOCwgMTE3LCA4LCAyNDUsIDgsIDEzLCA4LCAxNDEsIDgsIDc3LCA4LCAyMDUsIDgsIDQ1LCA4LFxyXG5cdFx0XHQxNzMsIDgsIDEwOSwgOCwgMjM3LCA4LCAyOSwgOCwgMTU3LCA4LCA5MywgOCwgMjIxLCA4LCA2MSwgOCwgMTg5LCA4LCAxMjUsIDgsIDI1MywgOCwgMTksIDksIDI3NSwgOSwgMTQ3LCA5LCA0MDMsIDksIDgzLCA5LCAzMzksIDksIDIxMSwgOSwgNDY3LCA5LFxyXG5cdFx0XHQ1MSwgOSwgMzA3LCA5LCAxNzksIDksIDQzNSwgOSwgMTE1LCA5LCAzNzEsIDksIDI0MywgOSwgNDk5LCA5LCAxMSwgOSwgMjY3LCA5LCAxMzksIDksIDM5NSwgOSwgNzUsIDksIDMzMSwgOSwgMjAzLCA5LCA0NTksIDksIDQzLCA5LCAyOTksIDksIDE3MSwgOSxcclxuXHRcdFx0NDI3LCA5LCAxMDcsIDksIDM2MywgOSwgMjM1LCA5LCA0OTEsIDksIDI3LCA5LCAyODMsIDksIDE1NSwgOSwgNDExLCA5LCA5MSwgOSwgMzQ3LCA5LCAyMTksIDksIDQ3NSwgOSwgNTksIDksIDMxNSwgOSwgMTg3LCA5LCA0NDMsIDksIDEyMywgOSwgMzc5LFxyXG5cdFx0XHQ5LCAyNTEsIDksIDUwNywgOSwgNywgOSwgMjYzLCA5LCAxMzUsIDksIDM5MSwgOSwgNzEsIDksIDMyNywgOSwgMTk5LCA5LCA0NTUsIDksIDM5LCA5LCAyOTUsIDksIDE2NywgOSwgNDIzLCA5LCAxMDMsIDksIDM1OSwgOSwgMjMxLCA5LCA0ODcsIDksIDIzLFxyXG5cdFx0XHQ5LCAyNzksIDksIDE1MSwgOSwgNDA3LCA5LCA4NywgOSwgMzQzLCA5LCAyMTUsIDksIDQ3MSwgOSwgNTUsIDksIDMxMSwgOSwgMTgzLCA5LCA0MzksIDksIDExOSwgOSwgMzc1LCA5LCAyNDcsIDksIDUwMywgOSwgMTUsIDksIDI3MSwgOSwgMTQzLCA5LFxyXG5cdFx0XHQzOTksIDksIDc5LCA5LCAzMzUsIDksIDIwNywgOSwgNDYzLCA5LCA0NywgOSwgMzAzLCA5LCAxNzUsIDksIDQzMSwgOSwgMTExLCA5LCAzNjcsIDksIDIzOSwgOSwgNDk1LCA5LCAzMSwgOSwgMjg3LCA5LCAxNTksIDksIDQxNSwgOSwgOTUsIDksIDM1MSwgOSxcclxuXHRcdFx0MjIzLCA5LCA0NzksIDksIDYzLCA5LCAzMTksIDksIDE5MSwgOSwgNDQ3LCA5LCAxMjcsIDksIDM4MywgOSwgMjU1LCA5LCA1MTEsIDksIDAsIDcsIDY0LCA3LCAzMiwgNywgOTYsIDcsIDE2LCA3LCA4MCwgNywgNDgsIDcsIDExMiwgNywgOCwgNywgNzIsIDcsXHJcblx0XHRcdDQwLCA3LCAxMDQsIDcsIDI0LCA3LCA4OCwgNywgNTYsIDcsIDEyMCwgNywgNCwgNywgNjgsIDcsIDM2LCA3LCAxMDAsIDcsIDIwLCA3LCA4NCwgNywgNTIsIDcsIDExNiwgNywgMywgOCwgMTMxLCA4LCA2NywgOCwgMTk1LCA4LCAzNSwgOCwgMTYzLCA4LFxyXG5cdFx0XHQ5OSwgOCwgMjI3LCA4IF07XHJcblxyXG5cdFN0YXRpY1RyZWUuc3RhdGljX2R0cmVlID0gWyAwLCA1LCAxNiwgNSwgOCwgNSwgMjQsIDUsIDQsIDUsIDIwLCA1LCAxMiwgNSwgMjgsIDUsIDIsIDUsIDE4LCA1LCAxMCwgNSwgMjYsIDUsIDYsIDUsIDIyLCA1LCAxNCwgNSwgMzAsIDUsIDEsIDUsIDE3LCA1LCA5LCA1LFxyXG5cdFx0XHQyNSwgNSwgNSwgNSwgMjEsIDUsIDEzLCA1LCAyOSwgNSwgMywgNSwgMTksIDUsIDExLCA1LCAyNywgNSwgNywgNSwgMjMsIDUgXTtcclxuXHJcblx0U3RhdGljVHJlZS5zdGF0aWNfbF9kZXNjID0gbmV3IFN0YXRpY1RyZWUoU3RhdGljVHJlZS5zdGF0aWNfbHRyZWUsIFRyZWUuZXh0cmFfbGJpdHMsIExJVEVSQUxTICsgMSwgTF9DT0RFUywgTUFYX0JJVFMpO1xyXG5cclxuXHRTdGF0aWNUcmVlLnN0YXRpY19kX2Rlc2MgPSBuZXcgU3RhdGljVHJlZShTdGF0aWNUcmVlLnN0YXRpY19kdHJlZSwgVHJlZS5leHRyYV9kYml0cywgMCwgRF9DT0RFUywgTUFYX0JJVFMpO1xyXG5cclxuXHRTdGF0aWNUcmVlLnN0YXRpY19ibF9kZXNjID0gbmV3IFN0YXRpY1RyZWUobnVsbCwgVHJlZS5leHRyYV9ibGJpdHMsIDAsIEJMX0NPREVTLCBNQVhfQkxfQklUUyk7XHJcblxyXG5cdC8vIERlZmxhdGVcclxuXHJcblx0dmFyIE1BWF9NRU1fTEVWRUwgPSA5O1xyXG5cdHZhciBERUZfTUVNX0xFVkVMID0gODtcclxuXHJcblx0ZnVuY3Rpb24gQ29uZmlnKGdvb2RfbGVuZ3RoLCBtYXhfbGF6eSwgbmljZV9sZW5ndGgsIG1heF9jaGFpbiwgZnVuYykge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dGhhdC5nb29kX2xlbmd0aCA9IGdvb2RfbGVuZ3RoO1xyXG5cdFx0dGhhdC5tYXhfbGF6eSA9IG1heF9sYXp5O1xyXG5cdFx0dGhhdC5uaWNlX2xlbmd0aCA9IG5pY2VfbGVuZ3RoO1xyXG5cdFx0dGhhdC5tYXhfY2hhaW4gPSBtYXhfY2hhaW47XHJcblx0XHR0aGF0LmZ1bmMgPSBmdW5jO1xyXG5cdH1cclxuXHJcblx0dmFyIFNUT1JFRCA9IDA7XHJcblx0dmFyIEZBU1QgPSAxO1xyXG5cdHZhciBTTE9XID0gMjtcclxuXHR2YXIgY29uZmlnX3RhYmxlID0gWyBuZXcgQ29uZmlnKDAsIDAsIDAsIDAsIFNUT1JFRCksIG5ldyBDb25maWcoNCwgNCwgOCwgNCwgRkFTVCksIG5ldyBDb25maWcoNCwgNSwgMTYsIDgsIEZBU1QpLCBuZXcgQ29uZmlnKDQsIDYsIDMyLCAzMiwgRkFTVCksXHJcblx0XHRcdG5ldyBDb25maWcoNCwgNCwgMTYsIDE2LCBTTE9XKSwgbmV3IENvbmZpZyg4LCAxNiwgMzIsIDMyLCBTTE9XKSwgbmV3IENvbmZpZyg4LCAxNiwgMTI4LCAxMjgsIFNMT1cpLCBuZXcgQ29uZmlnKDgsIDMyLCAxMjgsIDI1NiwgU0xPVyksXHJcblx0XHRcdG5ldyBDb25maWcoMzIsIDEyOCwgMjU4LCAxMDI0LCBTTE9XKSwgbmV3IENvbmZpZygzMiwgMjU4LCAyNTgsIDQwOTYsIFNMT1cpIF07XHJcblxyXG5cdHZhciB6X2Vycm1zZyA9IFsgXCJuZWVkIGRpY3Rpb25hcnlcIiwgLy8gWl9ORUVEX0RJQ1RcclxuXHQvLyAyXHJcblx0XCJzdHJlYW0gZW5kXCIsIC8vIFpfU1RSRUFNX0VORCAxXHJcblx0XCJcIiwgLy8gWl9PSyAwXHJcblx0XCJcIiwgLy8gWl9FUlJOTyAoLTEpXHJcblx0XCJzdHJlYW0gZXJyb3JcIiwgLy8gWl9TVFJFQU1fRVJST1IgKC0yKVxyXG5cdFwiZGF0YSBlcnJvclwiLCAvLyBaX0RBVEFfRVJST1IgKC0zKVxyXG5cdFwiXCIsIC8vIFpfTUVNX0VSUk9SICgtNClcclxuXHRcImJ1ZmZlciBlcnJvclwiLCAvLyBaX0JVRl9FUlJPUiAoLTUpXHJcblx0XCJcIiwvLyBaX1ZFUlNJT05fRVJST1IgKC02KVxyXG5cdFwiXCIgXTtcclxuXHJcblx0Ly8gYmxvY2sgbm90IGNvbXBsZXRlZCwgbmVlZCBtb3JlIGlucHV0IG9yIG1vcmUgb3V0cHV0XHJcblx0dmFyIE5lZWRNb3JlID0gMDtcclxuXHJcblx0Ly8gYmxvY2sgZmx1c2ggcGVyZm9ybWVkXHJcblx0dmFyIEJsb2NrRG9uZSA9IDE7XHJcblxyXG5cdC8vIGZpbmlzaCBzdGFydGVkLCBuZWVkIG9ubHkgbW9yZSBvdXRwdXQgYXQgbmV4dCBkZWZsYXRlXHJcblx0dmFyIEZpbmlzaFN0YXJ0ZWQgPSAyO1xyXG5cclxuXHQvLyBmaW5pc2ggZG9uZSwgYWNjZXB0IG5vIG1vcmUgaW5wdXQgb3Igb3V0cHV0XHJcblx0dmFyIEZpbmlzaERvbmUgPSAzO1xyXG5cclxuXHQvLyBwcmVzZXQgZGljdGlvbmFyeSBmbGFnIGluIHpsaWIgaGVhZGVyXHJcblx0dmFyIFBSRVNFVF9ESUNUID0gMHgyMDtcclxuXHJcblx0dmFyIElOSVRfU1RBVEUgPSA0MjtcclxuXHR2YXIgQlVTWV9TVEFURSA9IDExMztcclxuXHR2YXIgRklOSVNIX1NUQVRFID0gNjY2O1xyXG5cclxuXHQvLyBUaGUgZGVmbGF0ZSBjb21wcmVzc2lvbiBtZXRob2RcclxuXHR2YXIgWl9ERUZMQVRFRCA9IDg7XHJcblxyXG5cdHZhciBTVE9SRURfQkxPQ0sgPSAwO1xyXG5cdHZhciBTVEFUSUNfVFJFRVMgPSAxO1xyXG5cdHZhciBEWU5fVFJFRVMgPSAyO1xyXG5cclxuXHR2YXIgTUlOX01BVENIID0gMztcclxuXHR2YXIgTUFYX01BVENIID0gMjU4O1xyXG5cdHZhciBNSU5fTE9PS0FIRUFEID0gKE1BWF9NQVRDSCArIE1JTl9NQVRDSCArIDEpO1xyXG5cclxuXHRmdW5jdGlvbiBzbWFsbGVyKHRyZWUsIG4sIG0sIGRlcHRoKSB7XHJcblx0XHR2YXIgdG4yID0gdHJlZVtuICogMl07XHJcblx0XHR2YXIgdG0yID0gdHJlZVttICogMl07XHJcblx0XHRyZXR1cm4gKHRuMiA8IHRtMiB8fCAodG4yID09IHRtMiAmJiBkZXB0aFtuXSA8PSBkZXB0aFttXSkpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gRGVmbGF0ZSgpIHtcclxuXHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHR2YXIgc3RybTsgLy8gcG9pbnRlciBiYWNrIHRvIHRoaXMgemxpYiBzdHJlYW1cclxuXHRcdHZhciBzdGF0dXM7IC8vIGFzIHRoZSBuYW1lIGltcGxpZXNcclxuXHRcdC8vIHBlbmRpbmdfYnVmOyAvLyBvdXRwdXQgc3RpbGwgcGVuZGluZ1xyXG5cdFx0dmFyIHBlbmRpbmdfYnVmX3NpemU7IC8vIHNpemUgb2YgcGVuZGluZ19idWZcclxuXHRcdC8vIHBlbmRpbmdfb3V0OyAvLyBuZXh0IHBlbmRpbmcgYnl0ZSB0byBvdXRwdXQgdG8gdGhlIHN0cmVhbVxyXG5cdFx0Ly8gcGVuZGluZzsgLy8gbmIgb2YgYnl0ZXMgaW4gdGhlIHBlbmRpbmcgYnVmZmVyXHJcblx0XHR2YXIgbWV0aG9kOyAvLyBTVE9SRUQgKGZvciB6aXAgb25seSkgb3IgREVGTEFURURcclxuXHRcdHZhciBsYXN0X2ZsdXNoOyAvLyB2YWx1ZSBvZiBmbHVzaCBwYXJhbSBmb3IgcHJldmlvdXMgZGVmbGF0ZSBjYWxsXHJcblxyXG5cdFx0dmFyIHdfc2l6ZTsgLy8gTFo3NyB3aW5kb3cgc2l6ZSAoMzJLIGJ5IGRlZmF1bHQpXHJcblx0XHR2YXIgd19iaXRzOyAvLyBsb2cyKHdfc2l6ZSkgKDguLjE2KVxyXG5cdFx0dmFyIHdfbWFzazsgLy8gd19zaXplIC0gMVxyXG5cclxuXHRcdHZhciB3aW5kb3c7XHJcblx0XHQvLyBTbGlkaW5nIHdpbmRvdy4gSW5wdXQgYnl0ZXMgYXJlIHJlYWQgaW50byB0aGUgc2Vjb25kIGhhbGYgb2YgdGhlIHdpbmRvdyxcclxuXHRcdC8vIGFuZCBtb3ZlIHRvIHRoZSBmaXJzdCBoYWxmIGxhdGVyIHRvIGtlZXAgYSBkaWN0aW9uYXJ5IG9mIGF0IGxlYXN0IHdTaXplXHJcblx0XHQvLyBieXRlcy4gV2l0aCB0aGlzIG9yZ2FuaXphdGlvbiwgbWF0Y2hlcyBhcmUgbGltaXRlZCB0byBhIGRpc3RhbmNlIG9mXHJcblx0XHQvLyB3U2l6ZS1NQVhfTUFUQ0ggYnl0ZXMsIGJ1dCB0aGlzIGVuc3VyZXMgdGhhdCBJTyBpcyBhbHdheXNcclxuXHRcdC8vIHBlcmZvcm1lZCB3aXRoIGEgbGVuZ3RoIG11bHRpcGxlIG9mIHRoZSBibG9jayBzaXplLiBBbHNvLCBpdCBsaW1pdHNcclxuXHRcdC8vIHRoZSB3aW5kb3cgc2l6ZSB0byA2NEssIHdoaWNoIGlzIHF1aXRlIHVzZWZ1bCBvbiBNU0RPUy5cclxuXHRcdC8vIFRvIGRvOiB1c2UgdGhlIHVzZXIgaW5wdXQgYnVmZmVyIGFzIHNsaWRpbmcgd2luZG93LlxyXG5cclxuXHRcdHZhciB3aW5kb3dfc2l6ZTtcclxuXHRcdC8vIEFjdHVhbCBzaXplIG9mIHdpbmRvdzogMip3U2l6ZSwgZXhjZXB0IHdoZW4gdGhlIHVzZXIgaW5wdXQgYnVmZmVyXHJcblx0XHQvLyBpcyBkaXJlY3RseSB1c2VkIGFzIHNsaWRpbmcgd2luZG93LlxyXG5cclxuXHRcdHZhciBwcmV2O1xyXG5cdFx0Ly8gTGluayB0byBvbGRlciBzdHJpbmcgd2l0aCBzYW1lIGhhc2ggaW5kZXguIFRvIGxpbWl0IHRoZSBzaXplIG9mIHRoaXNcclxuXHRcdC8vIGFycmF5IHRvIDY0SywgdGhpcyBsaW5rIGlzIG1haW50YWluZWQgb25seSBmb3IgdGhlIGxhc3QgMzJLIHN0cmluZ3MuXHJcblx0XHQvLyBBbiBpbmRleCBpbiB0aGlzIGFycmF5IGlzIHRodXMgYSB3aW5kb3cgaW5kZXggbW9kdWxvIDMySy5cclxuXHJcblx0XHR2YXIgaGVhZDsgLy8gSGVhZHMgb2YgdGhlIGhhc2ggY2hhaW5zIG9yIE5JTC5cclxuXHJcblx0XHR2YXIgaW5zX2g7IC8vIGhhc2ggaW5kZXggb2Ygc3RyaW5nIHRvIGJlIGluc2VydGVkXHJcblx0XHR2YXIgaGFzaF9zaXplOyAvLyBudW1iZXIgb2YgZWxlbWVudHMgaW4gaGFzaCB0YWJsZVxyXG5cdFx0dmFyIGhhc2hfYml0czsgLy8gbG9nMihoYXNoX3NpemUpXHJcblx0XHR2YXIgaGFzaF9tYXNrOyAvLyBoYXNoX3NpemUtMVxyXG5cclxuXHRcdC8vIE51bWJlciBvZiBiaXRzIGJ5IHdoaWNoIGluc19oIG11c3QgYmUgc2hpZnRlZCBhdCBlYWNoIGlucHV0XHJcblx0XHQvLyBzdGVwLiBJdCBtdXN0IGJlIHN1Y2ggdGhhdCBhZnRlciBNSU5fTUFUQ0ggc3RlcHMsIHRoZSBvbGRlc3RcclxuXHRcdC8vIGJ5dGUgbm8gbG9uZ2VyIHRha2VzIHBhcnQgaW4gdGhlIGhhc2gga2V5LCB0aGF0IGlzOlxyXG5cdFx0Ly8gaGFzaF9zaGlmdCAqIE1JTl9NQVRDSCA+PSBoYXNoX2JpdHNcclxuXHRcdHZhciBoYXNoX3NoaWZ0O1xyXG5cclxuXHRcdC8vIFdpbmRvdyBwb3NpdGlvbiBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBjdXJyZW50IG91dHB1dCBibG9jay4gR2V0c1xyXG5cdFx0Ly8gbmVnYXRpdmUgd2hlbiB0aGUgd2luZG93IGlzIG1vdmVkIGJhY2t3YXJkcy5cclxuXHJcblx0XHR2YXIgYmxvY2tfc3RhcnQ7XHJcblxyXG5cdFx0dmFyIG1hdGNoX2xlbmd0aDsgLy8gbGVuZ3RoIG9mIGJlc3QgbWF0Y2hcclxuXHRcdHZhciBwcmV2X21hdGNoOyAvLyBwcmV2aW91cyBtYXRjaFxyXG5cdFx0dmFyIG1hdGNoX2F2YWlsYWJsZTsgLy8gc2V0IGlmIHByZXZpb3VzIG1hdGNoIGV4aXN0c1xyXG5cdFx0dmFyIHN0cnN0YXJ0OyAvLyBzdGFydCBvZiBzdHJpbmcgdG8gaW5zZXJ0XHJcblx0XHR2YXIgbWF0Y2hfc3RhcnQ7IC8vIHN0YXJ0IG9mIG1hdGNoaW5nIHN0cmluZ1xyXG5cdFx0dmFyIGxvb2thaGVhZDsgLy8gbnVtYmVyIG9mIHZhbGlkIGJ5dGVzIGFoZWFkIGluIHdpbmRvd1xyXG5cclxuXHRcdC8vIExlbmd0aCBvZiB0aGUgYmVzdCBtYXRjaCBhdCBwcmV2aW91cyBzdGVwLiBNYXRjaGVzIG5vdCBncmVhdGVyIHRoYW4gdGhpc1xyXG5cdFx0Ly8gYXJlIGRpc2NhcmRlZC4gVGhpcyBpcyB1c2VkIGluIHRoZSBsYXp5IG1hdGNoIGV2YWx1YXRpb24uXHJcblx0XHR2YXIgcHJldl9sZW5ndGg7XHJcblxyXG5cdFx0Ly8gVG8gc3BlZWQgdXAgZGVmbGF0aW9uLCBoYXNoIGNoYWlucyBhcmUgbmV2ZXIgc2VhcmNoZWQgYmV5b25kIHRoaXNcclxuXHRcdC8vIGxlbmd0aC4gQSBoaWdoZXIgbGltaXQgaW1wcm92ZXMgY29tcHJlc3Npb24gcmF0aW8gYnV0IGRlZ3JhZGVzIHRoZSBzcGVlZC5cclxuXHRcdHZhciBtYXhfY2hhaW5fbGVuZ3RoO1xyXG5cclxuXHRcdC8vIEF0dGVtcHQgdG8gZmluZCBhIGJldHRlciBtYXRjaCBvbmx5IHdoZW4gdGhlIGN1cnJlbnQgbWF0Y2ggaXMgc3RyaWN0bHlcclxuXHRcdC8vIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlLiBUaGlzIG1lY2hhbmlzbSBpcyB1c2VkIG9ubHkgZm9yIGNvbXByZXNzaW9uXHJcblx0XHQvLyBsZXZlbHMgPj0gNC5cclxuXHRcdHZhciBtYXhfbGF6eV9tYXRjaDtcclxuXHJcblx0XHQvLyBJbnNlcnQgbmV3IHN0cmluZ3MgaW4gdGhlIGhhc2ggdGFibGUgb25seSBpZiB0aGUgbWF0Y2ggbGVuZ3RoIGlzIG5vdFxyXG5cdFx0Ly8gZ3JlYXRlciB0aGFuIHRoaXMgbGVuZ3RoLiBUaGlzIHNhdmVzIHRpbWUgYnV0IGRlZ3JhZGVzIGNvbXByZXNzaW9uLlxyXG5cdFx0Ly8gbWF4X2luc2VydF9sZW5ndGggaXMgdXNlZCBvbmx5IGZvciBjb21wcmVzc2lvbiBsZXZlbHMgPD0gMy5cclxuXHJcblx0XHR2YXIgbGV2ZWw7IC8vIGNvbXByZXNzaW9uIGxldmVsICgxLi45KVxyXG5cdFx0dmFyIHN0cmF0ZWd5OyAvLyBmYXZvciBvciBmb3JjZSBIdWZmbWFuIGNvZGluZ1xyXG5cclxuXHRcdC8vIFVzZSBhIGZhc3RlciBzZWFyY2ggd2hlbiB0aGUgcHJldmlvdXMgbWF0Y2ggaXMgbG9uZ2VyIHRoYW4gdGhpc1xyXG5cdFx0dmFyIGdvb2RfbWF0Y2g7XHJcblxyXG5cdFx0Ly8gU3RvcCBzZWFyY2hpbmcgd2hlbiBjdXJyZW50IG1hdGNoIGV4Y2VlZHMgdGhpc1xyXG5cdFx0dmFyIG5pY2VfbWF0Y2g7XHJcblxyXG5cdFx0dmFyIGR5bl9sdHJlZTsgLy8gbGl0ZXJhbCBhbmQgbGVuZ3RoIHRyZWVcclxuXHRcdHZhciBkeW5fZHRyZWU7IC8vIGRpc3RhbmNlIHRyZWVcclxuXHRcdHZhciBibF90cmVlOyAvLyBIdWZmbWFuIHRyZWUgZm9yIGJpdCBsZW5ndGhzXHJcblxyXG5cdFx0dmFyIGxfZGVzYyA9IG5ldyBUcmVlKCk7IC8vIGRlc2MgZm9yIGxpdGVyYWwgdHJlZVxyXG5cdFx0dmFyIGRfZGVzYyA9IG5ldyBUcmVlKCk7IC8vIGRlc2MgZm9yIGRpc3RhbmNlIHRyZWVcclxuXHRcdHZhciBibF9kZXNjID0gbmV3IFRyZWUoKTsgLy8gZGVzYyBmb3IgYml0IGxlbmd0aCB0cmVlXHJcblxyXG5cdFx0Ly8gdGhhdC5oZWFwX2xlbjsgLy8gbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBoZWFwXHJcblx0XHQvLyB0aGF0LmhlYXBfbWF4OyAvLyBlbGVtZW50IG9mIGxhcmdlc3QgZnJlcXVlbmN5XHJcblx0XHQvLyBUaGUgc29ucyBvZiBoZWFwW25dIGFyZSBoZWFwWzIqbl0gYW5kIGhlYXBbMipuKzFdLiBoZWFwWzBdIGlzIG5vdCB1c2VkLlxyXG5cdFx0Ly8gVGhlIHNhbWUgaGVhcCBhcnJheSBpcyB1c2VkIHRvIGJ1aWxkIGFsbCB0cmVlcy5cclxuXHJcblx0XHQvLyBEZXB0aCBvZiBlYWNoIHN1YnRyZWUgdXNlZCBhcyB0aWUgYnJlYWtlciBmb3IgdHJlZXMgb2YgZXF1YWwgZnJlcXVlbmN5XHJcblx0XHR0aGF0LmRlcHRoID0gW107XHJcblxyXG5cdFx0dmFyIGxfYnVmOyAvLyBpbmRleCBmb3IgbGl0ZXJhbHMgb3IgbGVuZ3RocyAqL1xyXG5cclxuXHRcdC8vIFNpemUgb2YgbWF0Y2ggYnVmZmVyIGZvciBsaXRlcmFscy9sZW5ndGhzLiBUaGVyZSBhcmUgNCByZWFzb25zIGZvclxyXG5cdFx0Ly8gbGltaXRpbmcgbGl0X2J1ZnNpemUgdG8gNjRLOlxyXG5cdFx0Ly8gLSBmcmVxdWVuY2llcyBjYW4gYmUga2VwdCBpbiAxNiBiaXQgY291bnRlcnNcclxuXHRcdC8vIC0gaWYgY29tcHJlc3Npb24gaXMgbm90IHN1Y2Nlc3NmdWwgZm9yIHRoZSBmaXJzdCBibG9jaywgYWxsIGlucHV0XHJcblx0XHQvLyBkYXRhIGlzIHN0aWxsIGluIHRoZSB3aW5kb3cgc28gd2UgY2FuIHN0aWxsIGVtaXQgYSBzdG9yZWQgYmxvY2sgZXZlblxyXG5cdFx0Ly8gd2hlbiBpbnB1dCBjb21lcyBmcm9tIHN0YW5kYXJkIGlucHV0LiAoVGhpcyBjYW4gYWxzbyBiZSBkb25lIGZvclxyXG5cdFx0Ly8gYWxsIGJsb2NrcyBpZiBsaXRfYnVmc2l6ZSBpcyBub3QgZ3JlYXRlciB0aGFuIDMySy4pXHJcblx0XHQvLyAtIGlmIGNvbXByZXNzaW9uIGlzIG5vdCBzdWNjZXNzZnVsIGZvciBhIGZpbGUgc21hbGxlciB0aGFuIDY0Sywgd2UgY2FuXHJcblx0XHQvLyBldmVuIGVtaXQgYSBzdG9yZWQgZmlsZSBpbnN0ZWFkIG9mIGEgc3RvcmVkIGJsb2NrIChzYXZpbmcgNSBieXRlcykuXHJcblx0XHQvLyBUaGlzIGlzIGFwcGxpY2FibGUgb25seSBmb3IgemlwIChub3QgZ3ppcCBvciB6bGliKS5cclxuXHRcdC8vIC0gY3JlYXRpbmcgbmV3IEh1ZmZtYW4gdHJlZXMgbGVzcyBmcmVxdWVudGx5IG1heSBub3QgcHJvdmlkZSBmYXN0XHJcblx0XHQvLyBhZGFwdGF0aW9uIHRvIGNoYW5nZXMgaW4gdGhlIGlucHV0IGRhdGEgc3RhdGlzdGljcy4gKFRha2UgZm9yXHJcblx0XHQvLyBleGFtcGxlIGEgYmluYXJ5IGZpbGUgd2l0aCBwb29ybHkgY29tcHJlc3NpYmxlIGNvZGUgZm9sbG93ZWQgYnlcclxuXHRcdC8vIGEgaGlnaGx5IGNvbXByZXNzaWJsZSBzdHJpbmcgdGFibGUuKSBTbWFsbGVyIGJ1ZmZlciBzaXplcyBnaXZlXHJcblx0XHQvLyBmYXN0IGFkYXB0YXRpb24gYnV0IGhhdmUgb2YgY291cnNlIHRoZSBvdmVyaGVhZCBvZiB0cmFuc21pdHRpbmdcclxuXHRcdC8vIHRyZWVzIG1vcmUgZnJlcXVlbnRseS5cclxuXHRcdC8vIC0gSSBjYW4ndCBjb3VudCBhYm92ZSA0XHJcblx0XHR2YXIgbGl0X2J1ZnNpemU7XHJcblxyXG5cdFx0dmFyIGxhc3RfbGl0OyAvLyBydW5uaW5nIGluZGV4IGluIGxfYnVmXHJcblxyXG5cdFx0Ly8gQnVmZmVyIGZvciBkaXN0YW5jZXMuIFRvIHNpbXBsaWZ5IHRoZSBjb2RlLCBkX2J1ZiBhbmQgbF9idWYgaGF2ZVxyXG5cdFx0Ly8gdGhlIHNhbWUgbnVtYmVyIG9mIGVsZW1lbnRzLiBUbyB1c2UgZGlmZmVyZW50IGxlbmd0aHMsIGFuIGV4dHJhIGZsYWdcclxuXHRcdC8vIGFycmF5IHdvdWxkIGJlIG5lY2Vzc2FyeS5cclxuXHJcblx0XHR2YXIgZF9idWY7IC8vIGluZGV4IG9mIHBlbmRpZ19idWZcclxuXHJcblx0XHQvLyB0aGF0Lm9wdF9sZW47IC8vIGJpdCBsZW5ndGggb2YgY3VycmVudCBibG9jayB3aXRoIG9wdGltYWwgdHJlZXNcclxuXHRcdC8vIHRoYXQuc3RhdGljX2xlbjsgLy8gYml0IGxlbmd0aCBvZiBjdXJyZW50IGJsb2NrIHdpdGggc3RhdGljIHRyZWVzXHJcblx0XHR2YXIgbWF0Y2hlczsgLy8gbnVtYmVyIG9mIHN0cmluZyBtYXRjaGVzIGluIGN1cnJlbnQgYmxvY2tcclxuXHRcdHZhciBsYXN0X2VvYl9sZW47IC8vIGJpdCBsZW5ndGggb2YgRU9CIGNvZGUgZm9yIGxhc3QgYmxvY2tcclxuXHJcblx0XHQvLyBPdXRwdXQgYnVmZmVyLiBiaXRzIGFyZSBpbnNlcnRlZCBzdGFydGluZyBhdCB0aGUgYm90dG9tIChsZWFzdFxyXG5cdFx0Ly8gc2lnbmlmaWNhbnQgYml0cykuXHJcblx0XHR2YXIgYmlfYnVmO1xyXG5cclxuXHRcdC8vIE51bWJlciBvZiB2YWxpZCBiaXRzIGluIGJpX2J1Zi4gQWxsIGJpdHMgYWJvdmUgdGhlIGxhc3QgdmFsaWQgYml0XHJcblx0XHQvLyBhcmUgYWx3YXlzIHplcm8uXHJcblx0XHR2YXIgYmlfdmFsaWQ7XHJcblxyXG5cdFx0Ly8gbnVtYmVyIG9mIGNvZGVzIGF0IGVhY2ggYml0IGxlbmd0aCBmb3IgYW4gb3B0aW1hbCB0cmVlXHJcblx0XHR0aGF0LmJsX2NvdW50ID0gW107XHJcblxyXG5cdFx0Ly8gaGVhcCB1c2VkIHRvIGJ1aWxkIHRoZSBIdWZmbWFuIHRyZWVzXHJcblx0XHR0aGF0LmhlYXAgPSBbXTtcclxuXHJcblx0XHRkeW5fbHRyZWUgPSBbXTtcclxuXHRcdGR5bl9kdHJlZSA9IFtdO1xyXG5cdFx0YmxfdHJlZSA9IFtdO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGxtX2luaXQoKSB7XHJcblx0XHRcdHZhciBpO1xyXG5cdFx0XHR3aW5kb3dfc2l6ZSA9IDIgKiB3X3NpemU7XHJcblxyXG5cdFx0XHRoZWFkW2hhc2hfc2l6ZSAtIDFdID0gMDtcclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGhhc2hfc2l6ZSAtIDE7IGkrKykge1xyXG5cdFx0XHRcdGhlYWRbaV0gPSAwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTZXQgdGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzOlxyXG5cdFx0XHRtYXhfbGF6eV9tYXRjaCA9IGNvbmZpZ190YWJsZVtsZXZlbF0ubWF4X2xhenk7XHJcblx0XHRcdGdvb2RfbWF0Y2ggPSBjb25maWdfdGFibGVbbGV2ZWxdLmdvb2RfbGVuZ3RoO1xyXG5cdFx0XHRuaWNlX21hdGNoID0gY29uZmlnX3RhYmxlW2xldmVsXS5uaWNlX2xlbmd0aDtcclxuXHRcdFx0bWF4X2NoYWluX2xlbmd0aCA9IGNvbmZpZ190YWJsZVtsZXZlbF0ubWF4X2NoYWluO1xyXG5cclxuXHRcdFx0c3Ryc3RhcnQgPSAwO1xyXG5cdFx0XHRibG9ja19zdGFydCA9IDA7XHJcblx0XHRcdGxvb2thaGVhZCA9IDA7XHJcblx0XHRcdG1hdGNoX2xlbmd0aCA9IHByZXZfbGVuZ3RoID0gTUlOX01BVENIIC0gMTtcclxuXHRcdFx0bWF0Y2hfYXZhaWxhYmxlID0gMDtcclxuXHRcdFx0aW5zX2ggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGluaXRfYmxvY2soKSB7XHJcblx0XHRcdHZhciBpO1xyXG5cdFx0XHQvLyBJbml0aWFsaXplIHRoZSB0cmVlcy5cclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IExfQ09ERVM7IGkrKylcclxuXHRcdFx0XHRkeW5fbHRyZWVbaSAqIDJdID0gMDtcclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IERfQ09ERVM7IGkrKylcclxuXHRcdFx0XHRkeW5fZHRyZWVbaSAqIDJdID0gMDtcclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IEJMX0NPREVTOyBpKyspXHJcblx0XHRcdFx0YmxfdHJlZVtpICogMl0gPSAwO1xyXG5cclxuXHRcdFx0ZHluX2x0cmVlW0VORF9CTE9DSyAqIDJdID0gMTtcclxuXHRcdFx0dGhhdC5vcHRfbGVuID0gdGhhdC5zdGF0aWNfbGVuID0gMDtcclxuXHRcdFx0bGFzdF9saXQgPSBtYXRjaGVzID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJbml0aWFsaXplIHRoZSB0cmVlIGRhdGEgc3RydWN0dXJlcyBmb3IgYSBuZXcgemxpYiBzdHJlYW0uXHJcblx0XHRmdW5jdGlvbiB0cl9pbml0KCkge1xyXG5cclxuXHRcdFx0bF9kZXNjLmR5bl90cmVlID0gZHluX2x0cmVlO1xyXG5cdFx0XHRsX2Rlc2Muc3RhdF9kZXNjID0gU3RhdGljVHJlZS5zdGF0aWNfbF9kZXNjO1xyXG5cclxuXHRcdFx0ZF9kZXNjLmR5bl90cmVlID0gZHluX2R0cmVlO1xyXG5cdFx0XHRkX2Rlc2Muc3RhdF9kZXNjID0gU3RhdGljVHJlZS5zdGF0aWNfZF9kZXNjO1xyXG5cclxuXHRcdFx0YmxfZGVzYy5keW5fdHJlZSA9IGJsX3RyZWU7XHJcblx0XHRcdGJsX2Rlc2Muc3RhdF9kZXNjID0gU3RhdGljVHJlZS5zdGF0aWNfYmxfZGVzYztcclxuXHJcblx0XHRcdGJpX2J1ZiA9IDA7XHJcblx0XHRcdGJpX3ZhbGlkID0gMDtcclxuXHRcdFx0bGFzdF9lb2JfbGVuID0gODsgLy8gZW5vdWdoIGxvb2thaGVhZCBmb3IgaW5mbGF0ZVxyXG5cclxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgZmlyc3QgYmxvY2sgb2YgdGhlIGZpcnN0IGZpbGU6XHJcblx0XHRcdGluaXRfYmxvY2soKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZXN0b3JlIHRoZSBoZWFwIHByb3BlcnR5IGJ5IG1vdmluZyBkb3duIHRoZSB0cmVlIHN0YXJ0aW5nIGF0IG5vZGUgayxcclxuXHRcdC8vIGV4Y2hhbmdpbmcgYSBub2RlIHdpdGggdGhlIHNtYWxsZXN0IG9mIGl0cyB0d28gc29ucyBpZiBuZWNlc3NhcnksXHJcblx0XHQvLyBzdG9wcGluZ1xyXG5cdFx0Ly8gd2hlbiB0aGUgaGVhcCBwcm9wZXJ0eSBpcyByZS1lc3RhYmxpc2hlZCAoZWFjaCBmYXRoZXIgc21hbGxlciB0aGFuIGl0c1xyXG5cdFx0Ly8gdHdvIHNvbnMpLlxyXG5cdFx0dGhhdC5wcWRvd25oZWFwID0gZnVuY3Rpb24odHJlZSwgLy8gdGhlIHRyZWUgdG8gcmVzdG9yZVxyXG5cdFx0ayAvLyBub2RlIHRvIG1vdmUgZG93blxyXG5cdFx0KSB7XHJcblx0XHRcdHZhciBoZWFwID0gdGhhdC5oZWFwO1xyXG5cdFx0XHR2YXIgdiA9IGhlYXBba107XHJcblx0XHRcdHZhciBqID0gayA8PCAxOyAvLyBsZWZ0IHNvbiBvZiBrXHJcblx0XHRcdHdoaWxlIChqIDw9IHRoYXQuaGVhcF9sZW4pIHtcclxuXHRcdFx0XHQvLyBTZXQgaiB0byB0aGUgc21hbGxlc3Qgb2YgdGhlIHR3byBzb25zOlxyXG5cdFx0XHRcdGlmIChqIDwgdGhhdC5oZWFwX2xlbiAmJiBzbWFsbGVyKHRyZWUsIGhlYXBbaiArIDFdLCBoZWFwW2pdLCB0aGF0LmRlcHRoKSkge1xyXG5cdFx0XHRcdFx0aisrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBFeGl0IGlmIHYgaXMgc21hbGxlciB0aGFuIGJvdGggc29uc1xyXG5cdFx0XHRcdGlmIChzbWFsbGVyKHRyZWUsIHYsIGhlYXBbal0sIHRoYXQuZGVwdGgpKVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdC8vIEV4Y2hhbmdlIHYgd2l0aCB0aGUgc21hbGxlc3Qgc29uXHJcblx0XHRcdFx0aGVhcFtrXSA9IGhlYXBbal07XHJcblx0XHRcdFx0ayA9IGo7XHJcblx0XHRcdFx0Ly8gQW5kIGNvbnRpbnVlIGRvd24gdGhlIHRyZWUsIHNldHRpbmcgaiB0byB0aGUgbGVmdCBzb24gb2Yga1xyXG5cdFx0XHRcdGogPDw9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aGVhcFtrXSA9IHY7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIFNjYW4gYSBsaXRlcmFsIG9yIGRpc3RhbmNlIHRyZWUgdG8gZGV0ZXJtaW5lIHRoZSBmcmVxdWVuY2llcyBvZiB0aGUgY29kZXNcclxuXHRcdC8vIGluIHRoZSBiaXQgbGVuZ3RoIHRyZWUuXHJcblx0XHRmdW5jdGlvbiBzY2FuX3RyZWUodHJlZSwvLyB0aGUgdHJlZSB0byBiZSBzY2FubmVkXHJcblx0XHRtYXhfY29kZSAvLyBhbmQgaXRzIGxhcmdlc3QgY29kZSBvZiBub24gemVybyBmcmVxdWVuY3lcclxuXHRcdCkge1xyXG5cdFx0XHR2YXIgbjsgLy8gaXRlcmF0ZXMgb3ZlciBhbGwgdHJlZSBlbGVtZW50c1xyXG5cdFx0XHR2YXIgcHJldmxlbiA9IC0xOyAvLyBsYXN0IGVtaXR0ZWQgbGVuZ3RoXHJcblx0XHRcdHZhciBjdXJsZW47IC8vIGxlbmd0aCBvZiBjdXJyZW50IGNvZGVcclxuXHRcdFx0dmFyIG5leHRsZW4gPSB0cmVlWzAgKiAyICsgMV07IC8vIGxlbmd0aCBvZiBuZXh0IGNvZGVcclxuXHRcdFx0dmFyIGNvdW50ID0gMDsgLy8gcmVwZWF0IGNvdW50IG9mIHRoZSBjdXJyZW50IGNvZGVcclxuXHRcdFx0dmFyIG1heF9jb3VudCA9IDc7IC8vIG1heCByZXBlYXQgY291bnRcclxuXHRcdFx0dmFyIG1pbl9jb3VudCA9IDQ7IC8vIG1pbiByZXBlYXQgY291bnRcclxuXHJcblx0XHRcdGlmIChuZXh0bGVuID09PSAwKSB7XHJcblx0XHRcdFx0bWF4X2NvdW50ID0gMTM4O1xyXG5cdFx0XHRcdG1pbl9jb3VudCA9IDM7XHJcblx0XHRcdH1cclxuXHRcdFx0dHJlZVsobWF4X2NvZGUgKyAxKSAqIDIgKyAxXSA9IDB4ZmZmZjsgLy8gZ3VhcmRcclxuXHJcblx0XHRcdGZvciAobiA9IDA7IG4gPD0gbWF4X2NvZGU7IG4rKykge1xyXG5cdFx0XHRcdGN1cmxlbiA9IG5leHRsZW47XHJcblx0XHRcdFx0bmV4dGxlbiA9IHRyZWVbKG4gKyAxKSAqIDIgKyAxXTtcclxuXHRcdFx0XHRpZiAoKytjb3VudCA8IG1heF9jb3VudCAmJiBjdXJsZW4gPT0gbmV4dGxlbikge1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChjb3VudCA8IG1pbl9jb3VudCkge1xyXG5cdFx0XHRcdFx0YmxfdHJlZVtjdXJsZW4gKiAyXSArPSBjb3VudDtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGN1cmxlbiAhPT0gMCkge1xyXG5cdFx0XHRcdFx0aWYgKGN1cmxlbiAhPSBwcmV2bGVuKVxyXG5cdFx0XHRcdFx0XHRibF90cmVlW2N1cmxlbiAqIDJdKys7XHJcblx0XHRcdFx0XHRibF90cmVlW1JFUF8zXzYgKiAyXSsrO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoY291bnQgPD0gMTApIHtcclxuXHRcdFx0XHRcdGJsX3RyZWVbUkVQWl8zXzEwICogMl0rKztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YmxfdHJlZVtSRVBaXzExXzEzOCAqIDJdKys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvdW50ID0gMDtcclxuXHRcdFx0XHRwcmV2bGVuID0gY3VybGVuO1xyXG5cdFx0XHRcdGlmIChuZXh0bGVuID09PSAwKSB7XHJcblx0XHRcdFx0XHRtYXhfY291bnQgPSAxMzg7XHJcblx0XHRcdFx0XHRtaW5fY291bnQgPSAzO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoY3VybGVuID09IG5leHRsZW4pIHtcclxuXHRcdFx0XHRcdG1heF9jb3VudCA9IDY7XHJcblx0XHRcdFx0XHRtaW5fY291bnQgPSAzO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtYXhfY291bnQgPSA3O1xyXG5cdFx0XHRcdFx0bWluX2NvdW50ID0gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBDb25zdHJ1Y3QgdGhlIEh1ZmZtYW4gdHJlZSBmb3IgdGhlIGJpdCBsZW5ndGhzIGFuZCByZXR1cm4gdGhlIGluZGV4IGluXHJcblx0XHQvLyBibF9vcmRlciBvZiB0aGUgbGFzdCBiaXQgbGVuZ3RoIGNvZGUgdG8gc2VuZC5cclxuXHRcdGZ1bmN0aW9uIGJ1aWxkX2JsX3RyZWUoKSB7XHJcblx0XHRcdHZhciBtYXhfYmxpbmRleDsgLy8gaW5kZXggb2YgbGFzdCBiaXQgbGVuZ3RoIGNvZGUgb2Ygbm9uIHplcm8gZnJlcVxyXG5cclxuXHRcdFx0Ly8gRGV0ZXJtaW5lIHRoZSBiaXQgbGVuZ3RoIGZyZXF1ZW5jaWVzIGZvciBsaXRlcmFsIGFuZCBkaXN0YW5jZSB0cmVlc1xyXG5cdFx0XHRzY2FuX3RyZWUoZHluX2x0cmVlLCBsX2Rlc2MubWF4X2NvZGUpO1xyXG5cdFx0XHRzY2FuX3RyZWUoZHluX2R0cmVlLCBkX2Rlc2MubWF4X2NvZGUpO1xyXG5cclxuXHRcdFx0Ly8gQnVpbGQgdGhlIGJpdCBsZW5ndGggdHJlZTpcclxuXHRcdFx0YmxfZGVzYy5idWlsZF90cmVlKHRoYXQpO1xyXG5cdFx0XHQvLyBvcHRfbGVuIG5vdyBpbmNsdWRlcyB0aGUgbGVuZ3RoIG9mIHRoZSB0cmVlIHJlcHJlc2VudGF0aW9ucywgZXhjZXB0XHJcblx0XHRcdC8vIHRoZSBsZW5ndGhzIG9mIHRoZSBiaXQgbGVuZ3RocyBjb2RlcyBhbmQgdGhlIDUrNSs0IGJpdHMgZm9yIHRoZVxyXG5cdFx0XHQvLyBjb3VudHMuXHJcblxyXG5cdFx0XHQvLyBEZXRlcm1pbmUgdGhlIG51bWJlciBvZiBiaXQgbGVuZ3RoIGNvZGVzIHRvIHNlbmQuIFRoZSBwa3ppcCBmb3JtYXRcclxuXHRcdFx0Ly8gcmVxdWlyZXMgdGhhdCBhdCBsZWFzdCA0IGJpdCBsZW5ndGggY29kZXMgYmUgc2VudC4gKGFwcG5vdGUudHh0IHNheXNcclxuXHRcdFx0Ly8gMyBidXQgdGhlIGFjdHVhbCB2YWx1ZSB1c2VkIGlzIDQuKVxyXG5cdFx0XHRmb3IgKG1heF9ibGluZGV4ID0gQkxfQ09ERVMgLSAxOyBtYXhfYmxpbmRleCA+PSAzOyBtYXhfYmxpbmRleC0tKSB7XHJcblx0XHRcdFx0aWYgKGJsX3RyZWVbVHJlZS5ibF9vcmRlclttYXhfYmxpbmRleF0gKiAyICsgMV0gIT09IDApXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBVcGRhdGUgb3B0X2xlbiB0byBpbmNsdWRlIHRoZSBiaXQgbGVuZ3RoIHRyZWUgYW5kIGNvdW50c1xyXG5cdFx0XHR0aGF0Lm9wdF9sZW4gKz0gMyAqIChtYXhfYmxpbmRleCArIDEpICsgNSArIDUgKyA0O1xyXG5cclxuXHRcdFx0cmV0dXJuIG1heF9ibGluZGV4O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE91dHB1dCBhIGJ5dGUgb24gdGhlIHN0cmVhbS5cclxuXHRcdC8vIElOIGFzc2VydGlvbjogdGhlcmUgaXMgZW5vdWdoIHJvb20gaW4gcGVuZGluZ19idWYuXHJcblx0XHRmdW5jdGlvbiBwdXRfYnl0ZShwKSB7XHJcblx0XHRcdHRoYXQucGVuZGluZ19idWZbdGhhdC5wZW5kaW5nKytdID0gcDtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBwdXRfc2hvcnQodykge1xyXG5cdFx0XHRwdXRfYnl0ZSh3ICYgMHhmZik7XHJcblx0XHRcdHB1dF9ieXRlKCh3ID4+PiA4KSAmIDB4ZmYpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHB1dFNob3J0TVNCKGIpIHtcclxuXHRcdFx0cHV0X2J5dGUoKGIgPj4gOCkgJiAweGZmKTtcclxuXHRcdFx0cHV0X2J5dGUoKGIgJiAweGZmKSAmIDB4ZmYpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHNlbmRfYml0cyh2YWx1ZSwgbGVuZ3RoKSB7XHJcblx0XHRcdHZhciB2YWwsIGxlbiA9IGxlbmd0aDtcclxuXHRcdFx0aWYgKGJpX3ZhbGlkID4gQnVmX3NpemUgLSBsZW4pIHtcclxuXHRcdFx0XHR2YWwgPSB2YWx1ZTtcclxuXHRcdFx0XHQvLyBiaV9idWYgfD0gKHZhbCA8PCBiaV92YWxpZCk7XHJcblx0XHRcdFx0YmlfYnVmIHw9ICgodmFsIDw8IGJpX3ZhbGlkKSAmIDB4ZmZmZik7XHJcblx0XHRcdFx0cHV0X3Nob3J0KGJpX2J1Zik7XHJcblx0XHRcdFx0YmlfYnVmID0gdmFsID4+PiAoQnVmX3NpemUgLSBiaV92YWxpZCk7XHJcblx0XHRcdFx0YmlfdmFsaWQgKz0gbGVuIC0gQnVmX3NpemU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gYmlfYnVmIHw9ICh2YWx1ZSkgPDwgYmlfdmFsaWQ7XHJcblx0XHRcdFx0YmlfYnVmIHw9ICgoKHZhbHVlKSA8PCBiaV92YWxpZCkgJiAweGZmZmYpO1xyXG5cdFx0XHRcdGJpX3ZhbGlkICs9IGxlbjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHNlbmRfY29kZShjLCB0cmVlKSB7XHJcblx0XHRcdHZhciBjMiA9IGMgKiAyO1xyXG5cdFx0XHRzZW5kX2JpdHModHJlZVtjMl0gJiAweGZmZmYsIHRyZWVbYzIgKyAxXSAmIDB4ZmZmZik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2VuZCBhIGxpdGVyYWwgb3IgZGlzdGFuY2UgdHJlZSBpbiBjb21wcmVzc2VkIGZvcm0sIHVzaW5nIHRoZSBjb2RlcyBpblxyXG5cdFx0Ly8gYmxfdHJlZS5cclxuXHRcdGZ1bmN0aW9uIHNlbmRfdHJlZSh0cmVlLC8vIHRoZSB0cmVlIHRvIGJlIHNlbnRcclxuXHRcdG1heF9jb2RlIC8vIGFuZCBpdHMgbGFyZ2VzdCBjb2RlIG9mIG5vbiB6ZXJvIGZyZXF1ZW5jeVxyXG5cdFx0KSB7XHJcblx0XHRcdHZhciBuOyAvLyBpdGVyYXRlcyBvdmVyIGFsbCB0cmVlIGVsZW1lbnRzXHJcblx0XHRcdHZhciBwcmV2bGVuID0gLTE7IC8vIGxhc3QgZW1pdHRlZCBsZW5ndGhcclxuXHRcdFx0dmFyIGN1cmxlbjsgLy8gbGVuZ3RoIG9mIGN1cnJlbnQgY29kZVxyXG5cdFx0XHR2YXIgbmV4dGxlbiA9IHRyZWVbMCAqIDIgKyAxXTsgLy8gbGVuZ3RoIG9mIG5leHQgY29kZVxyXG5cdFx0XHR2YXIgY291bnQgPSAwOyAvLyByZXBlYXQgY291bnQgb2YgdGhlIGN1cnJlbnQgY29kZVxyXG5cdFx0XHR2YXIgbWF4X2NvdW50ID0gNzsgLy8gbWF4IHJlcGVhdCBjb3VudFxyXG5cdFx0XHR2YXIgbWluX2NvdW50ID0gNDsgLy8gbWluIHJlcGVhdCBjb3VudFxyXG5cclxuXHRcdFx0aWYgKG5leHRsZW4gPT09IDApIHtcclxuXHRcdFx0XHRtYXhfY291bnQgPSAxMzg7XHJcblx0XHRcdFx0bWluX2NvdW50ID0gMztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChuID0gMDsgbiA8PSBtYXhfY29kZTsgbisrKSB7XHJcblx0XHRcdFx0Y3VybGVuID0gbmV4dGxlbjtcclxuXHRcdFx0XHRuZXh0bGVuID0gdHJlZVsobiArIDEpICogMiArIDFdO1xyXG5cdFx0XHRcdGlmICgrK2NvdW50IDwgbWF4X2NvdW50ICYmIGN1cmxlbiA9PSBuZXh0bGVuKSB7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGNvdW50IDwgbWluX2NvdW50KSB7XHJcblx0XHRcdFx0XHRkbyB7XHJcblx0XHRcdFx0XHRcdHNlbmRfY29kZShjdXJsZW4sIGJsX3RyZWUpO1xyXG5cdFx0XHRcdFx0fSB3aGlsZSAoLS1jb3VudCAhPT0gMCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChjdXJsZW4gIT09IDApIHtcclxuXHRcdFx0XHRcdGlmIChjdXJsZW4gIT0gcHJldmxlbikge1xyXG5cdFx0XHRcdFx0XHRzZW5kX2NvZGUoY3VybGVuLCBibF90cmVlKTtcclxuXHRcdFx0XHRcdFx0Y291bnQtLTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNlbmRfY29kZShSRVBfM182LCBibF90cmVlKTtcclxuXHRcdFx0XHRcdHNlbmRfYml0cyhjb3VudCAtIDMsIDIpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoY291bnQgPD0gMTApIHtcclxuXHRcdFx0XHRcdHNlbmRfY29kZShSRVBaXzNfMTAsIGJsX3RyZWUpO1xyXG5cdFx0XHRcdFx0c2VuZF9iaXRzKGNvdW50IC0gMywgMyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNlbmRfY29kZShSRVBaXzExXzEzOCwgYmxfdHJlZSk7XHJcblx0XHRcdFx0XHRzZW5kX2JpdHMoY291bnQgLSAxMSwgNyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvdW50ID0gMDtcclxuXHRcdFx0XHRwcmV2bGVuID0gY3VybGVuO1xyXG5cdFx0XHRcdGlmIChuZXh0bGVuID09PSAwKSB7XHJcblx0XHRcdFx0XHRtYXhfY291bnQgPSAxMzg7XHJcblx0XHRcdFx0XHRtaW5fY291bnQgPSAzO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoY3VybGVuID09IG5leHRsZW4pIHtcclxuXHRcdFx0XHRcdG1heF9jb3VudCA9IDY7XHJcblx0XHRcdFx0XHRtaW5fY291bnQgPSAzO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtYXhfY291bnQgPSA3O1xyXG5cdFx0XHRcdFx0bWluX2NvdW50ID0gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZW5kIHRoZSBoZWFkZXIgZm9yIGEgYmxvY2sgdXNpbmcgZHluYW1pYyBIdWZmbWFuIHRyZWVzOiB0aGUgY291bnRzLCB0aGVcclxuXHRcdC8vIGxlbmd0aHMgb2YgdGhlIGJpdCBsZW5ndGggY29kZXMsIHRoZSBsaXRlcmFsIHRyZWUgYW5kIHRoZSBkaXN0YW5jZSB0cmVlLlxyXG5cdFx0Ly8gSU4gYXNzZXJ0aW9uOiBsY29kZXMgPj0gMjU3LCBkY29kZXMgPj0gMSwgYmxjb2RlcyA+PSA0LlxyXG5cdFx0ZnVuY3Rpb24gc2VuZF9hbGxfdHJlZXMobGNvZGVzLCBkY29kZXMsIGJsY29kZXMpIHtcclxuXHRcdFx0dmFyIHJhbms7IC8vIGluZGV4IGluIGJsX29yZGVyXHJcblxyXG5cdFx0XHRzZW5kX2JpdHMobGNvZGVzIC0gMjU3LCA1KTsgLy8gbm90ICsyNTUgYXMgc3RhdGVkIGluIGFwcG5vdGUudHh0XHJcblx0XHRcdHNlbmRfYml0cyhkY29kZXMgLSAxLCA1KTtcclxuXHRcdFx0c2VuZF9iaXRzKGJsY29kZXMgLSA0LCA0KTsgLy8gbm90IC0zIGFzIHN0YXRlZCBpbiBhcHBub3RlLnR4dFxyXG5cdFx0XHRmb3IgKHJhbmsgPSAwOyByYW5rIDwgYmxjb2RlczsgcmFuaysrKSB7XHJcblx0XHRcdFx0c2VuZF9iaXRzKGJsX3RyZWVbVHJlZS5ibF9vcmRlcltyYW5rXSAqIDIgKyAxXSwgMyk7XHJcblx0XHRcdH1cclxuXHRcdFx0c2VuZF90cmVlKGR5bl9sdHJlZSwgbGNvZGVzIC0gMSk7IC8vIGxpdGVyYWwgdHJlZVxyXG5cdFx0XHRzZW5kX3RyZWUoZHluX2R0cmVlLCBkY29kZXMgLSAxKTsgLy8gZGlzdGFuY2UgdHJlZVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZsdXNoIHRoZSBiaXQgYnVmZmVyLCBrZWVwaW5nIGF0IG1vc3QgNyBiaXRzIGluIGl0LlxyXG5cdFx0ZnVuY3Rpb24gYmlfZmx1c2goKSB7XHJcblx0XHRcdGlmIChiaV92YWxpZCA9PSAxNikge1xyXG5cdFx0XHRcdHB1dF9zaG9ydChiaV9idWYpO1xyXG5cdFx0XHRcdGJpX2J1ZiA9IDA7XHJcblx0XHRcdFx0YmlfdmFsaWQgPSAwO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGJpX3ZhbGlkID49IDgpIHtcclxuXHRcdFx0XHRwdXRfYnl0ZShiaV9idWYgJiAweGZmKTtcclxuXHRcdFx0XHRiaV9idWYgPj4+PSA4O1xyXG5cdFx0XHRcdGJpX3ZhbGlkIC09IDg7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZW5kIG9uZSBlbXB0eSBzdGF0aWMgYmxvY2sgdG8gZ2l2ZSBlbm91Z2ggbG9va2FoZWFkIGZvciBpbmZsYXRlLlxyXG5cdFx0Ly8gVGhpcyB0YWtlcyAxMCBiaXRzLCBvZiB3aGljaCA3IG1heSByZW1haW4gaW4gdGhlIGJpdCBidWZmZXIuXHJcblx0XHQvLyBUaGUgY3VycmVudCBpbmZsYXRlIGNvZGUgcmVxdWlyZXMgOSBiaXRzIG9mIGxvb2thaGVhZC4gSWYgdGhlXHJcblx0XHQvLyBsYXN0IHR3byBjb2RlcyBmb3IgdGhlIHByZXZpb3VzIGJsb2NrIChyZWFsIGNvZGUgcGx1cyBFT0IpIHdlcmUgY29kZWRcclxuXHRcdC8vIG9uIDUgYml0cyBvciBsZXNzLCBpbmZsYXRlIG1heSBoYXZlIG9ubHkgNSszIGJpdHMgb2YgbG9va2FoZWFkIHRvIGRlY29kZVxyXG5cdFx0Ly8gdGhlIGxhc3QgcmVhbCBjb2RlLiBJbiB0aGlzIGNhc2Ugd2Ugc2VuZCB0d28gZW1wdHkgc3RhdGljIGJsb2NrcyBpbnN0ZWFkXHJcblx0XHQvLyBvZiBvbmUuIChUaGVyZSBhcmUgbm8gcHJvYmxlbXMgaWYgdGhlIHByZXZpb3VzIGJsb2NrIGlzIHN0b3JlZCBvciBmaXhlZC4pXHJcblx0XHQvLyBUbyBzaW1wbGlmeSB0aGUgY29kZSwgd2UgYXNzdW1lIHRoZSB3b3JzdCBjYXNlIG9mIGxhc3QgcmVhbCBjb2RlIGVuY29kZWRcclxuXHRcdC8vIG9uIG9uZSBiaXQgb25seS5cclxuXHRcdGZ1bmN0aW9uIF90cl9hbGlnbigpIHtcclxuXHRcdFx0c2VuZF9iaXRzKFNUQVRJQ19UUkVFUyA8PCAxLCAzKTtcclxuXHRcdFx0c2VuZF9jb2RlKEVORF9CTE9DSywgU3RhdGljVHJlZS5zdGF0aWNfbHRyZWUpO1xyXG5cclxuXHRcdFx0YmlfZmx1c2goKTtcclxuXHJcblx0XHRcdC8vIE9mIHRoZSAxMCBiaXRzIGZvciB0aGUgZW1wdHkgYmxvY2ssIHdlIGhhdmUgYWxyZWFkeSBzZW50XHJcblx0XHRcdC8vICgxMCAtIGJpX3ZhbGlkKSBiaXRzLiBUaGUgbG9va2FoZWFkIGZvciB0aGUgbGFzdCByZWFsIGNvZGUgKGJlZm9yZVxyXG5cdFx0XHQvLyB0aGUgRU9CIG9mIHRoZSBwcmV2aW91cyBibG9jaykgd2FzIHRodXMgYXQgbGVhc3Qgb25lIHBsdXMgdGhlIGxlbmd0aFxyXG5cdFx0XHQvLyBvZiB0aGUgRU9CIHBsdXMgd2hhdCB3ZSBoYXZlIGp1c3Qgc2VudCBvZiB0aGUgZW1wdHkgc3RhdGljIGJsb2NrLlxyXG5cdFx0XHRpZiAoMSArIGxhc3RfZW9iX2xlbiArIDEwIC0gYmlfdmFsaWQgPCA5KSB7XHJcblx0XHRcdFx0c2VuZF9iaXRzKFNUQVRJQ19UUkVFUyA8PCAxLCAzKTtcclxuXHRcdFx0XHRzZW5kX2NvZGUoRU5EX0JMT0NLLCBTdGF0aWNUcmVlLnN0YXRpY19sdHJlZSk7XHJcblx0XHRcdFx0YmlfZmx1c2goKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsYXN0X2VvYl9sZW4gPSA3O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNhdmUgdGhlIG1hdGNoIGluZm8gYW5kIHRhbGx5IHRoZSBmcmVxdWVuY3kgY291bnRzLiBSZXR1cm4gdHJ1ZSBpZlxyXG5cdFx0Ly8gdGhlIGN1cnJlbnQgYmxvY2sgbXVzdCBiZSBmbHVzaGVkLlxyXG5cdFx0ZnVuY3Rpb24gX3RyX3RhbGx5KGRpc3QsIC8vIGRpc3RhbmNlIG9mIG1hdGNoZWQgc3RyaW5nXHJcblx0XHRsYyAvLyBtYXRjaCBsZW5ndGgtTUlOX01BVENIIG9yIHVubWF0Y2hlZCBjaGFyIChpZiBkaXN0PT0wKVxyXG5cdFx0KSB7XHJcblx0XHRcdHZhciBvdXRfbGVuZ3RoLCBpbl9sZW5ndGgsIGRjb2RlO1xyXG5cdFx0XHR0aGF0LnBlbmRpbmdfYnVmW2RfYnVmICsgbGFzdF9saXQgKiAyXSA9IChkaXN0ID4+PiA4KSAmIDB4ZmY7XHJcblx0XHRcdHRoYXQucGVuZGluZ19idWZbZF9idWYgKyBsYXN0X2xpdCAqIDIgKyAxXSA9IGRpc3QgJiAweGZmO1xyXG5cclxuXHRcdFx0dGhhdC5wZW5kaW5nX2J1ZltsX2J1ZiArIGxhc3RfbGl0XSA9IGxjICYgMHhmZjtcclxuXHRcdFx0bGFzdF9saXQrKztcclxuXHJcblx0XHRcdGlmIChkaXN0ID09PSAwKSB7XHJcblx0XHRcdFx0Ly8gbGMgaXMgdGhlIHVubWF0Y2hlZCBjaGFyXHJcblx0XHRcdFx0ZHluX2x0cmVlW2xjICogMl0rKztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtYXRjaGVzKys7XHJcblx0XHRcdFx0Ly8gSGVyZSwgbGMgaXMgdGhlIG1hdGNoIGxlbmd0aCAtIE1JTl9NQVRDSFxyXG5cdFx0XHRcdGRpc3QtLTsgLy8gZGlzdCA9IG1hdGNoIGRpc3RhbmNlIC0gMVxyXG5cdFx0XHRcdGR5bl9sdHJlZVsoVHJlZS5fbGVuZ3RoX2NvZGVbbGNdICsgTElURVJBTFMgKyAxKSAqIDJdKys7XHJcblx0XHRcdFx0ZHluX2R0cmVlW1RyZWUuZF9jb2RlKGRpc3QpICogMl0rKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKChsYXN0X2xpdCAmIDB4MWZmZikgPT09IDAgJiYgbGV2ZWwgPiAyKSB7XHJcblx0XHRcdFx0Ly8gQ29tcHV0ZSBhbiB1cHBlciBib3VuZCBmb3IgdGhlIGNvbXByZXNzZWQgbGVuZ3RoXHJcblx0XHRcdFx0b3V0X2xlbmd0aCA9IGxhc3RfbGl0ICogODtcclxuXHRcdFx0XHRpbl9sZW5ndGggPSBzdHJzdGFydCAtIGJsb2NrX3N0YXJ0O1xyXG5cdFx0XHRcdGZvciAoZGNvZGUgPSAwOyBkY29kZSA8IERfQ09ERVM7IGRjb2RlKyspIHtcclxuXHRcdFx0XHRcdG91dF9sZW5ndGggKz0gZHluX2R0cmVlW2Rjb2RlICogMl0gKiAoNSArIFRyZWUuZXh0cmFfZGJpdHNbZGNvZGVdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b3V0X2xlbmd0aCA+Pj49IDM7XHJcblx0XHRcdFx0aWYgKChtYXRjaGVzIDwgTWF0aC5mbG9vcihsYXN0X2xpdCAvIDIpKSAmJiBvdXRfbGVuZ3RoIDwgTWF0aC5mbG9vcihpbl9sZW5ndGggLyAyKSlcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gKGxhc3RfbGl0ID09IGxpdF9idWZzaXplIC0gMSk7XHJcblx0XHRcdC8vIFdlIGF2b2lkIGVxdWFsaXR5IHdpdGggbGl0X2J1ZnNpemUgYmVjYXVzZSBvZiB3cmFwYXJvdW5kIGF0IDY0S1xyXG5cdFx0XHQvLyBvbiAxNiBiaXQgbWFjaGluZXMgYW5kIGJlY2F1c2Ugc3RvcmVkIGJsb2NrcyBhcmUgcmVzdHJpY3RlZCB0b1xyXG5cdFx0XHQvLyA2NEstMSBieXRlcy5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZW5kIHRoZSBibG9jayBkYXRhIGNvbXByZXNzZWQgdXNpbmcgdGhlIGdpdmVuIEh1ZmZtYW4gdHJlZXNcclxuXHRcdGZ1bmN0aW9uIGNvbXByZXNzX2Jsb2NrKGx0cmVlLCBkdHJlZSkge1xyXG5cdFx0XHR2YXIgZGlzdDsgLy8gZGlzdGFuY2Ugb2YgbWF0Y2hlZCBzdHJpbmdcclxuXHRcdFx0dmFyIGxjOyAvLyBtYXRjaCBsZW5ndGggb3IgdW5tYXRjaGVkIGNoYXIgKGlmIGRpc3QgPT09IDApXHJcblx0XHRcdHZhciBseCA9IDA7IC8vIHJ1bm5pbmcgaW5kZXggaW4gbF9idWZcclxuXHRcdFx0dmFyIGNvZGU7IC8vIHRoZSBjb2RlIHRvIHNlbmRcclxuXHRcdFx0dmFyIGV4dHJhOyAvLyBudW1iZXIgb2YgZXh0cmEgYml0cyB0byBzZW5kXHJcblxyXG5cdFx0XHRpZiAobGFzdF9saXQgIT09IDApIHtcclxuXHRcdFx0XHRkbyB7XHJcblx0XHRcdFx0XHRkaXN0ID0gKCh0aGF0LnBlbmRpbmdfYnVmW2RfYnVmICsgbHggKiAyXSA8PCA4KSAmIDB4ZmYwMCkgfCAodGhhdC5wZW5kaW5nX2J1ZltkX2J1ZiArIGx4ICogMiArIDFdICYgMHhmZik7XHJcblx0XHRcdFx0XHRsYyA9ICh0aGF0LnBlbmRpbmdfYnVmW2xfYnVmICsgbHhdKSAmIDB4ZmY7XHJcblx0XHRcdFx0XHRseCsrO1xyXG5cclxuXHRcdFx0XHRcdGlmIChkaXN0ID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdHNlbmRfY29kZShsYywgbHRyZWUpOyAvLyBzZW5kIGEgbGl0ZXJhbCBieXRlXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBIZXJlLCBsYyBpcyB0aGUgbWF0Y2ggbGVuZ3RoIC0gTUlOX01BVENIXHJcblx0XHRcdFx0XHRcdGNvZGUgPSBUcmVlLl9sZW5ndGhfY29kZVtsY107XHJcblxyXG5cdFx0XHRcdFx0XHRzZW5kX2NvZGUoY29kZSArIExJVEVSQUxTICsgMSwgbHRyZWUpOyAvLyBzZW5kIHRoZSBsZW5ndGhcclxuXHRcdFx0XHRcdFx0Ly8gY29kZVxyXG5cdFx0XHRcdFx0XHRleHRyYSA9IFRyZWUuZXh0cmFfbGJpdHNbY29kZV07XHJcblx0XHRcdFx0XHRcdGlmIChleHRyYSAhPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdGxjIC09IFRyZWUuYmFzZV9sZW5ndGhbY29kZV07XHJcblx0XHRcdFx0XHRcdFx0c2VuZF9iaXRzKGxjLCBleHRyYSk7IC8vIHNlbmQgdGhlIGV4dHJhIGxlbmd0aCBiaXRzXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZGlzdC0tOyAvLyBkaXN0IGlzIG5vdyB0aGUgbWF0Y2ggZGlzdGFuY2UgLSAxXHJcblx0XHRcdFx0XHRcdGNvZGUgPSBUcmVlLmRfY29kZShkaXN0KTtcclxuXHJcblx0XHRcdFx0XHRcdHNlbmRfY29kZShjb2RlLCBkdHJlZSk7IC8vIHNlbmQgdGhlIGRpc3RhbmNlIGNvZGVcclxuXHRcdFx0XHRcdFx0ZXh0cmEgPSBUcmVlLmV4dHJhX2RiaXRzW2NvZGVdO1xyXG5cdFx0XHRcdFx0XHRpZiAoZXh0cmEgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRkaXN0IC09IFRyZWUuYmFzZV9kaXN0W2NvZGVdO1xyXG5cdFx0XHRcdFx0XHRcdHNlbmRfYml0cyhkaXN0LCBleHRyYSk7IC8vIHNlbmQgdGhlIGV4dHJhIGRpc3RhbmNlIGJpdHNcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSAvLyBsaXRlcmFsIG9yIG1hdGNoIHBhaXIgP1xyXG5cclxuXHRcdFx0XHRcdC8vIENoZWNrIHRoYXQgdGhlIG92ZXJsYXkgYmV0d2VlbiBwZW5kaW5nX2J1ZiBhbmQgZF9idWYrbF9idWYgaXNcclxuXHRcdFx0XHRcdC8vIG9rOlxyXG5cdFx0XHRcdH0gd2hpbGUgKGx4IDwgbGFzdF9saXQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZW5kX2NvZGUoRU5EX0JMT0NLLCBsdHJlZSk7XHJcblx0XHRcdGxhc3RfZW9iX2xlbiA9IGx0cmVlW0VORF9CTE9DSyAqIDIgKyAxXTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBGbHVzaCB0aGUgYml0IGJ1ZmZlciBhbmQgYWxpZ24gdGhlIG91dHB1dCBvbiBhIGJ5dGUgYm91bmRhcnlcclxuXHRcdGZ1bmN0aW9uIGJpX3dpbmR1cCgpIHtcclxuXHRcdFx0aWYgKGJpX3ZhbGlkID4gOCkge1xyXG5cdFx0XHRcdHB1dF9zaG9ydChiaV9idWYpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGJpX3ZhbGlkID4gMCkge1xyXG5cdFx0XHRcdHB1dF9ieXRlKGJpX2J1ZiAmIDB4ZmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJpX2J1ZiA9IDA7XHJcblx0XHRcdGJpX3ZhbGlkID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDb3B5IGEgc3RvcmVkIGJsb2NrLCBzdG9yaW5nIGZpcnN0IHRoZSBsZW5ndGggYW5kIGl0c1xyXG5cdFx0Ly8gb25lJ3MgY29tcGxlbWVudCBpZiByZXF1ZXN0ZWQuXHJcblx0XHRmdW5jdGlvbiBjb3B5X2Jsb2NrKGJ1ZiwgLy8gdGhlIGlucHV0IGRhdGFcclxuXHRcdGxlbiwgLy8gaXRzIGxlbmd0aFxyXG5cdFx0aGVhZGVyIC8vIHRydWUgaWYgYmxvY2sgaGVhZGVyIG11c3QgYmUgd3JpdHRlblxyXG5cdFx0KSB7XHJcblx0XHRcdGJpX3dpbmR1cCgpOyAvLyBhbGlnbiBvbiBieXRlIGJvdW5kYXJ5XHJcblx0XHRcdGxhc3RfZW9iX2xlbiA9IDg7IC8vIGVub3VnaCBsb29rYWhlYWQgZm9yIGluZmxhdGVcclxuXHJcblx0XHRcdGlmIChoZWFkZXIpIHtcclxuXHRcdFx0XHRwdXRfc2hvcnQobGVuKTtcclxuXHRcdFx0XHRwdXRfc2hvcnQofmxlbik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoYXQucGVuZGluZ19idWYuc2V0KHdpbmRvdy5zdWJhcnJheShidWYsIGJ1ZiArIGxlbiksIHRoYXQucGVuZGluZyk7XHJcblx0XHRcdHRoYXQucGVuZGluZyArPSBsZW47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2VuZCBhIHN0b3JlZCBibG9ja1xyXG5cdFx0ZnVuY3Rpb24gX3RyX3N0b3JlZF9ibG9jayhidWYsIC8vIGlucHV0IGJsb2NrXHJcblx0XHRzdG9yZWRfbGVuLCAvLyBsZW5ndGggb2YgaW5wdXQgYmxvY2tcclxuXHRcdGVvZiAvLyB0cnVlIGlmIHRoaXMgaXMgdGhlIGxhc3QgYmxvY2sgZm9yIGEgZmlsZVxyXG5cdFx0KSB7XHJcblx0XHRcdHNlbmRfYml0cygoU1RPUkVEX0JMT0NLIDw8IDEpICsgKGVvZiA/IDEgOiAwKSwgMyk7IC8vIHNlbmQgYmxvY2sgdHlwZVxyXG5cdFx0XHRjb3B5X2Jsb2NrKGJ1Ziwgc3RvcmVkX2xlbiwgdHJ1ZSk7IC8vIHdpdGggaGVhZGVyXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRGV0ZXJtaW5lIHRoZSBiZXN0IGVuY29kaW5nIGZvciB0aGUgY3VycmVudCBibG9jazogZHluYW1pYyB0cmVlcywgc3RhdGljXHJcblx0XHQvLyB0cmVlcyBvciBzdG9yZSwgYW5kIG91dHB1dCB0aGUgZW5jb2RlZCBibG9jayB0byB0aGUgemlwIGZpbGUuXHJcblx0XHRmdW5jdGlvbiBfdHJfZmx1c2hfYmxvY2soYnVmLCAvLyBpbnB1dCBibG9jaywgb3IgTlVMTCBpZiB0b28gb2xkXHJcblx0XHRzdG9yZWRfbGVuLCAvLyBsZW5ndGggb2YgaW5wdXQgYmxvY2tcclxuXHRcdGVvZiAvLyB0cnVlIGlmIHRoaXMgaXMgdGhlIGxhc3QgYmxvY2sgZm9yIGEgZmlsZVxyXG5cdFx0KSB7XHJcblx0XHRcdHZhciBvcHRfbGVuYiwgc3RhdGljX2xlbmI7Ly8gb3B0X2xlbiBhbmQgc3RhdGljX2xlbiBpbiBieXRlc1xyXG5cdFx0XHR2YXIgbWF4X2JsaW5kZXggPSAwOyAvLyBpbmRleCBvZiBsYXN0IGJpdCBsZW5ndGggY29kZSBvZiBub24gemVybyBmcmVxXHJcblxyXG5cdFx0XHQvLyBCdWlsZCB0aGUgSHVmZm1hbiB0cmVlcyB1bmxlc3MgYSBzdG9yZWQgYmxvY2sgaXMgZm9yY2VkXHJcblx0XHRcdGlmIChsZXZlbCA+IDApIHtcclxuXHRcdFx0XHQvLyBDb25zdHJ1Y3QgdGhlIGxpdGVyYWwgYW5kIGRpc3RhbmNlIHRyZWVzXHJcblx0XHRcdFx0bF9kZXNjLmJ1aWxkX3RyZWUodGhhdCk7XHJcblxyXG5cdFx0XHRcdGRfZGVzYy5idWlsZF90cmVlKHRoYXQpO1xyXG5cclxuXHRcdFx0XHQvLyBBdCB0aGlzIHBvaW50LCBvcHRfbGVuIGFuZCBzdGF0aWNfbGVuIGFyZSB0aGUgdG90YWwgYml0IGxlbmd0aHNcclxuXHRcdFx0XHQvLyBvZlxyXG5cdFx0XHRcdC8vIHRoZSBjb21wcmVzc2VkIGJsb2NrIGRhdGEsIGV4Y2x1ZGluZyB0aGUgdHJlZSByZXByZXNlbnRhdGlvbnMuXHJcblxyXG5cdFx0XHRcdC8vIEJ1aWxkIHRoZSBiaXQgbGVuZ3RoIHRyZWUgZm9yIHRoZSBhYm92ZSB0d28gdHJlZXMsIGFuZCBnZXQgdGhlXHJcblx0XHRcdFx0Ly8gaW5kZXhcclxuXHRcdFx0XHQvLyBpbiBibF9vcmRlciBvZiB0aGUgbGFzdCBiaXQgbGVuZ3RoIGNvZGUgdG8gc2VuZC5cclxuXHRcdFx0XHRtYXhfYmxpbmRleCA9IGJ1aWxkX2JsX3RyZWUoKTtcclxuXHJcblx0XHRcdFx0Ly8gRGV0ZXJtaW5lIHRoZSBiZXN0IGVuY29kaW5nLiBDb21wdXRlIGZpcnN0IHRoZSBibG9jayBsZW5ndGggaW5cclxuXHRcdFx0XHQvLyBieXRlc1xyXG5cdFx0XHRcdG9wdF9sZW5iID0gKHRoYXQub3B0X2xlbiArIDMgKyA3KSA+Pj4gMztcclxuXHRcdFx0XHRzdGF0aWNfbGVuYiA9ICh0aGF0LnN0YXRpY19sZW4gKyAzICsgNykgPj4+IDM7XHJcblxyXG5cdFx0XHRcdGlmIChzdGF0aWNfbGVuYiA8PSBvcHRfbGVuYilcclxuXHRcdFx0XHRcdG9wdF9sZW5iID0gc3RhdGljX2xlbmI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b3B0X2xlbmIgPSBzdGF0aWNfbGVuYiA9IHN0b3JlZF9sZW4gKyA1OyAvLyBmb3JjZSBhIHN0b3JlZCBibG9ja1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoKHN0b3JlZF9sZW4gKyA0IDw9IG9wdF9sZW5iKSAmJiBidWYgIT0gLTEpIHtcclxuXHRcdFx0XHQvLyA0OiB0d28gd29yZHMgZm9yIHRoZSBsZW5ndGhzXHJcblx0XHRcdFx0Ly8gVGhlIHRlc3QgYnVmICE9IE5VTEwgaXMgb25seSBuZWNlc3NhcnkgaWYgTElUX0JVRlNJWkUgPiBXU0laRS5cclxuXHRcdFx0XHQvLyBPdGhlcndpc2Ugd2UgY2FuJ3QgaGF2ZSBwcm9jZXNzZWQgbW9yZSB0aGFuIFdTSVpFIGlucHV0IGJ5dGVzXHJcblx0XHRcdFx0Ly8gc2luY2VcclxuXHRcdFx0XHQvLyB0aGUgbGFzdCBibG9jayBmbHVzaCwgYmVjYXVzZSBjb21wcmVzc2lvbiB3b3VsZCBoYXZlIGJlZW5cclxuXHRcdFx0XHQvLyBzdWNjZXNzZnVsLiBJZiBMSVRfQlVGU0laRSA8PSBXU0laRSwgaXQgaXMgbmV2ZXIgdG9vIGxhdGUgdG9cclxuXHRcdFx0XHQvLyB0cmFuc2Zvcm0gYSBibG9jayBpbnRvIGEgc3RvcmVkIGJsb2NrLlxyXG5cdFx0XHRcdF90cl9zdG9yZWRfYmxvY2soYnVmLCBzdG9yZWRfbGVuLCBlb2YpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHN0YXRpY19sZW5iID09IG9wdF9sZW5iKSB7XHJcblx0XHRcdFx0c2VuZF9iaXRzKChTVEFUSUNfVFJFRVMgPDwgMSkgKyAoZW9mID8gMSA6IDApLCAzKTtcclxuXHRcdFx0XHRjb21wcmVzc19ibG9jayhTdGF0aWNUcmVlLnN0YXRpY19sdHJlZSwgU3RhdGljVHJlZS5zdGF0aWNfZHRyZWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbmRfYml0cygoRFlOX1RSRUVTIDw8IDEpICsgKGVvZiA/IDEgOiAwKSwgMyk7XHJcblx0XHRcdFx0c2VuZF9hbGxfdHJlZXMobF9kZXNjLm1heF9jb2RlICsgMSwgZF9kZXNjLm1heF9jb2RlICsgMSwgbWF4X2JsaW5kZXggKyAxKTtcclxuXHRcdFx0XHRjb21wcmVzc19ibG9jayhkeW5fbHRyZWUsIGR5bl9kdHJlZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFRoZSBhYm92ZSBjaGVjayBpcyBtYWRlIG1vZCAyXjMyLCBmb3IgZmlsZXMgbGFyZ2VyIHRoYW4gNTEyIE1CXHJcblx0XHRcdC8vIGFuZCB1TG9uZyBpbXBsZW1lbnRlZCBvbiAzMiBiaXRzLlxyXG5cclxuXHRcdFx0aW5pdF9ibG9jaygpO1xyXG5cclxuXHRcdFx0aWYgKGVvZikge1xyXG5cdFx0XHRcdGJpX3dpbmR1cCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmx1c2hfYmxvY2tfb25seShlb2YpIHtcclxuXHRcdFx0X3RyX2ZsdXNoX2Jsb2NrKGJsb2NrX3N0YXJ0ID49IDAgPyBibG9ja19zdGFydCA6IC0xLCBzdHJzdGFydCAtIGJsb2NrX3N0YXJ0LCBlb2YpO1xyXG5cdFx0XHRibG9ja19zdGFydCA9IHN0cnN0YXJ0O1xyXG5cdFx0XHRzdHJtLmZsdXNoX3BlbmRpbmcoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBGaWxsIHRoZSB3aW5kb3cgd2hlbiB0aGUgbG9va2FoZWFkIGJlY29tZXMgaW5zdWZmaWNpZW50LlxyXG5cdFx0Ly8gVXBkYXRlcyBzdHJzdGFydCBhbmQgbG9va2FoZWFkLlxyXG5cdFx0Ly9cclxuXHRcdC8vIElOIGFzc2VydGlvbjogbG9va2FoZWFkIDwgTUlOX0xPT0tBSEVBRFxyXG5cdFx0Ly8gT1VUIGFzc2VydGlvbnM6IHN0cnN0YXJ0IDw9IHdpbmRvd19zaXplLU1JTl9MT09LQUhFQURcclxuXHRcdC8vIEF0IGxlYXN0IG9uZSBieXRlIGhhcyBiZWVuIHJlYWQsIG9yIGF2YWlsX2luID09PSAwOyByZWFkcyBhcmVcclxuXHRcdC8vIHBlcmZvcm1lZCBmb3IgYXQgbGVhc3QgdHdvIGJ5dGVzIChyZXF1aXJlZCBmb3IgdGhlIHppcCB0cmFuc2xhdGVfZW9sXHJcblx0XHQvLyBvcHRpb24gLS0gbm90IHN1cHBvcnRlZCBoZXJlKS5cclxuXHRcdGZ1bmN0aW9uIGZpbGxfd2luZG93KCkge1xyXG5cdFx0XHR2YXIgbiwgbTtcclxuXHRcdFx0dmFyIHA7XHJcblx0XHRcdHZhciBtb3JlOyAvLyBBbW91bnQgb2YgZnJlZSBzcGFjZSBhdCB0aGUgZW5kIG9mIHRoZSB3aW5kb3cuXHJcblxyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0bW9yZSA9ICh3aW5kb3dfc2l6ZSAtIGxvb2thaGVhZCAtIHN0cnN0YXJ0KTtcclxuXHJcblx0XHRcdFx0Ly8gRGVhbCB3aXRoICFAIyQlIDY0SyBsaW1pdDpcclxuXHRcdFx0XHRpZiAobW9yZSA9PT0gMCAmJiBzdHJzdGFydCA9PT0gMCAmJiBsb29rYWhlYWQgPT09IDApIHtcclxuXHRcdFx0XHRcdG1vcmUgPSB3X3NpemU7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtb3JlID09IC0xKSB7XHJcblx0XHRcdFx0XHQvLyBWZXJ5IHVubGlrZWx5LCBidXQgcG9zc2libGUgb24gMTYgYml0IG1hY2hpbmUgaWYgc3Ryc3RhcnQgPT1cclxuXHRcdFx0XHRcdC8vIDBcclxuXHRcdFx0XHRcdC8vIGFuZCBsb29rYWhlYWQgPT0gMSAoaW5wdXQgZG9uZSBvbmUgYnl0ZSBhdCB0aW1lKVxyXG5cdFx0XHRcdFx0bW9yZS0tO1xyXG5cclxuXHRcdFx0XHRcdC8vIElmIHRoZSB3aW5kb3cgaXMgYWxtb3N0IGZ1bGwgYW5kIHRoZXJlIGlzIGluc3VmZmljaWVudFxyXG5cdFx0XHRcdFx0Ly8gbG9va2FoZWFkLFxyXG5cdFx0XHRcdFx0Ly8gbW92ZSB0aGUgdXBwZXIgaGFsZiB0byB0aGUgbG93ZXIgb25lIHRvIG1ha2Ugcm9vbSBpbiB0aGVcclxuXHRcdFx0XHRcdC8vIHVwcGVyIGhhbGYuXHJcblx0XHRcdFx0fSBlbHNlIGlmIChzdHJzdGFydCA+PSB3X3NpemUgKyB3X3NpemUgLSBNSU5fTE9PS0FIRUFEKSB7XHJcblx0XHRcdFx0XHR3aW5kb3cuc2V0KHdpbmRvdy5zdWJhcnJheSh3X3NpemUsIHdfc2l6ZSArIHdfc2l6ZSksIDApO1xyXG5cclxuXHRcdFx0XHRcdG1hdGNoX3N0YXJ0IC09IHdfc2l6ZTtcclxuXHRcdFx0XHRcdHN0cnN0YXJ0IC09IHdfc2l6ZTsgLy8gd2Ugbm93IGhhdmUgc3Ryc3RhcnQgPj0gTUFYX0RJU1RcclxuXHRcdFx0XHRcdGJsb2NrX3N0YXJ0IC09IHdfc2l6ZTtcclxuXHJcblx0XHRcdFx0XHQvLyBTbGlkZSB0aGUgaGFzaCB0YWJsZSAoY291bGQgYmUgYXZvaWRlZCB3aXRoIDMyIGJpdCB2YWx1ZXNcclxuXHRcdFx0XHRcdC8vIGF0IHRoZSBleHBlbnNlIG9mIG1lbW9yeSB1c2FnZSkuIFdlIHNsaWRlIGV2ZW4gd2hlbiBsZXZlbCA9PVxyXG5cdFx0XHRcdFx0Ly8gMFxyXG5cdFx0XHRcdFx0Ly8gdG8ga2VlcCB0aGUgaGFzaCB0YWJsZSBjb25zaXN0ZW50IGlmIHdlIHN3aXRjaCBiYWNrIHRvIGxldmVsXHJcblx0XHRcdFx0XHQvLyA+IDBcclxuXHRcdFx0XHRcdC8vIGxhdGVyLiAoVXNpbmcgbGV2ZWwgMCBwZXJtYW5lbnRseSBpcyBub3QgYW4gb3B0aW1hbCB1c2FnZSBvZlxyXG5cdFx0XHRcdFx0Ly8gemxpYiwgc28gd2UgZG9uJ3QgY2FyZSBhYm91dCB0aGlzIHBhdGhvbG9naWNhbCBjYXNlLilcclxuXHJcblx0XHRcdFx0XHRuID0gaGFzaF9zaXplO1xyXG5cdFx0XHRcdFx0cCA9IG47XHJcblx0XHRcdFx0XHRkbyB7XHJcblx0XHRcdFx0XHRcdG0gPSAoaGVhZFstLXBdICYgMHhmZmZmKTtcclxuXHRcdFx0XHRcdFx0aGVhZFtwXSA9IChtID49IHdfc2l6ZSA/IG0gLSB3X3NpemUgOiAwKTtcclxuXHRcdFx0XHRcdH0gd2hpbGUgKC0tbiAhPT0gMCk7XHJcblxyXG5cdFx0XHRcdFx0biA9IHdfc2l6ZTtcclxuXHRcdFx0XHRcdHAgPSBuO1xyXG5cdFx0XHRcdFx0ZG8ge1xyXG5cdFx0XHRcdFx0XHRtID0gKHByZXZbLS1wXSAmIDB4ZmZmZik7XHJcblx0XHRcdFx0XHRcdHByZXZbcF0gPSAobSA+PSB3X3NpemUgPyBtIC0gd19zaXplIDogMCk7XHJcblx0XHRcdFx0XHRcdC8vIElmIG4gaXMgbm90IG9uIGFueSBoYXNoIGNoYWluLCBwcmV2W25dIGlzIGdhcmJhZ2UgYnV0XHJcblx0XHRcdFx0XHRcdC8vIGl0cyB2YWx1ZSB3aWxsIG5ldmVyIGJlIHVzZWQuXHJcblx0XHRcdFx0XHR9IHdoaWxlICgtLW4gIT09IDApO1xyXG5cdFx0XHRcdFx0bW9yZSArPSB3X3NpemU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoc3RybS5hdmFpbF9pbiA9PT0gMClcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdFx0Ly8gSWYgdGhlcmUgd2FzIG5vIHNsaWRpbmc6XHJcblx0XHRcdFx0Ly8gc3Ryc3RhcnQgPD0gV1NJWkUrTUFYX0RJU1QtMSAmJiBsb29rYWhlYWQgPD0gTUlOX0xPT0tBSEVBRCAtIDEgJiZcclxuXHRcdFx0XHQvLyBtb3JlID09IHdpbmRvd19zaXplIC0gbG9va2FoZWFkIC0gc3Ryc3RhcnRcclxuXHRcdFx0XHQvLyA9PiBtb3JlID49IHdpbmRvd19zaXplIC0gKE1JTl9MT09LQUhFQUQtMSArIFdTSVpFICsgTUFYX0RJU1QtMSlcclxuXHRcdFx0XHQvLyA9PiBtb3JlID49IHdpbmRvd19zaXplIC0gMipXU0laRSArIDJcclxuXHRcdFx0XHQvLyBJbiB0aGUgQklHX01FTSBvciBNTUFQIGNhc2UgKG5vdCB5ZXQgc3VwcG9ydGVkKSxcclxuXHRcdFx0XHQvLyB3aW5kb3dfc2l6ZSA9PSBpbnB1dF9zaXplICsgTUlOX0xPT0tBSEVBRCAmJlxyXG5cdFx0XHRcdC8vIHN0cnN0YXJ0ICsgcy0+bG9va2FoZWFkIDw9IGlucHV0X3NpemUgPT4gbW9yZSA+PSBNSU5fTE9PS0FIRUFELlxyXG5cdFx0XHRcdC8vIE90aGVyd2lzZSwgd2luZG93X3NpemUgPT0gMipXU0laRSBzbyBtb3JlID49IDIuXHJcblx0XHRcdFx0Ly8gSWYgdGhlcmUgd2FzIHNsaWRpbmcsIG1vcmUgPj0gV1NJWkUuIFNvIGluIGFsbCBjYXNlcywgbW9yZSA+PSAyLlxyXG5cclxuXHRcdFx0XHRuID0gc3RybS5yZWFkX2J1Zih3aW5kb3csIHN0cnN0YXJ0ICsgbG9va2FoZWFkLCBtb3JlKTtcclxuXHRcdFx0XHRsb29rYWhlYWQgKz0gbjtcclxuXHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgaGFzaCB2YWx1ZSBub3cgdGhhdCB3ZSBoYXZlIHNvbWUgaW5wdXQ6XHJcblx0XHRcdFx0aWYgKGxvb2thaGVhZCA+PSBNSU5fTUFUQ0gpIHtcclxuXHRcdFx0XHRcdGluc19oID0gd2luZG93W3N0cnN0YXJ0XSAmIDB4ZmY7XHJcblx0XHRcdFx0XHRpbnNfaCA9ICgoKGluc19oKSA8PCBoYXNoX3NoaWZ0KSBeICh3aW5kb3dbc3Ryc3RhcnQgKyAxXSAmIDB4ZmYpKSAmIGhhc2hfbWFzaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gSWYgdGhlIHdob2xlIGlucHV0IGhhcyBsZXNzIHRoYW4gTUlOX01BVENIIGJ5dGVzLCBpbnNfaCBpc1xyXG5cdFx0XHRcdC8vIGdhcmJhZ2UsXHJcblx0XHRcdFx0Ly8gYnV0IHRoaXMgaXMgbm90IGltcG9ydGFudCBzaW5jZSBvbmx5IGxpdGVyYWwgYnl0ZXMgd2lsbCBiZVxyXG5cdFx0XHRcdC8vIGVtaXR0ZWQuXHJcblx0XHRcdH0gd2hpbGUgKGxvb2thaGVhZCA8IE1JTl9MT09LQUhFQUQgJiYgc3RybS5hdmFpbF9pbiAhPT0gMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ29weSB3aXRob3V0IGNvbXByZXNzaW9uIGFzIG11Y2ggYXMgcG9zc2libGUgZnJvbSB0aGUgaW5wdXQgc3RyZWFtLFxyXG5cdFx0Ly8gcmV0dXJuXHJcblx0XHQvLyB0aGUgY3VycmVudCBibG9jayBzdGF0ZS5cclxuXHRcdC8vIFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgaW5zZXJ0IG5ldyBzdHJpbmdzIGluIHRoZSBkaWN0aW9uYXJ5IHNpbmNlXHJcblx0XHQvLyB1bmNvbXByZXNzaWJsZSBkYXRhIGlzIHByb2JhYmx5IG5vdCB1c2VmdWwuIFRoaXMgZnVuY3Rpb24gaXMgdXNlZFxyXG5cdFx0Ly8gb25seSBmb3IgdGhlIGxldmVsPTAgY29tcHJlc3Npb24gb3B0aW9uLlxyXG5cdFx0Ly8gTk9URTogdGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgb3B0aW1pemVkIHRvIGF2b2lkIGV4dHJhIGNvcHlpbmcgZnJvbVxyXG5cdFx0Ly8gd2luZG93IHRvIHBlbmRpbmdfYnVmLlxyXG5cdFx0ZnVuY3Rpb24gZGVmbGF0ZV9zdG9yZWQoZmx1c2gpIHtcclxuXHRcdFx0Ly8gU3RvcmVkIGJsb2NrcyBhcmUgbGltaXRlZCB0byAweGZmZmYgYnl0ZXMsIHBlbmRpbmdfYnVmIGlzIGxpbWl0ZWRcclxuXHRcdFx0Ly8gdG8gcGVuZGluZ19idWZfc2l6ZSwgYW5kIGVhY2ggc3RvcmVkIGJsb2NrIGhhcyBhIDUgYnl0ZSBoZWFkZXI6XHJcblxyXG5cdFx0XHR2YXIgbWF4X2Jsb2NrX3NpemUgPSAweGZmZmY7XHJcblx0XHRcdHZhciBtYXhfc3RhcnQ7XHJcblxyXG5cdFx0XHRpZiAobWF4X2Jsb2NrX3NpemUgPiBwZW5kaW5nX2J1Zl9zaXplIC0gNSkge1xyXG5cdFx0XHRcdG1heF9ibG9ja19zaXplID0gcGVuZGluZ19idWZfc2l6ZSAtIDU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENvcHkgYXMgbXVjaCBhcyBwb3NzaWJsZSBmcm9tIGlucHV0IHRvIG91dHB1dDpcclxuXHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHQvLyBGaWxsIHRoZSB3aW5kb3cgYXMgbXVjaCBhcyBwb3NzaWJsZTpcclxuXHRcdFx0XHRpZiAobG9va2FoZWFkIDw9IDEpIHtcclxuXHRcdFx0XHRcdGZpbGxfd2luZG93KCk7XHJcblx0XHRcdFx0XHRpZiAobG9va2FoZWFkID09PSAwICYmIGZsdXNoID09IFpfTk9fRkxVU0gpXHJcblx0XHRcdFx0XHRcdHJldHVybiBOZWVkTW9yZTtcclxuXHRcdFx0XHRcdGlmIChsb29rYWhlYWQgPT09IDApXHJcblx0XHRcdFx0XHRcdGJyZWFrOyAvLyBmbHVzaCB0aGUgY3VycmVudCBibG9ja1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c3Ryc3RhcnQgKz0gbG9va2FoZWFkO1xyXG5cdFx0XHRcdGxvb2thaGVhZCA9IDA7XHJcblxyXG5cdFx0XHRcdC8vIEVtaXQgYSBzdG9yZWQgYmxvY2sgaWYgcGVuZGluZ19idWYgd2lsbCBiZSBmdWxsOlxyXG5cdFx0XHRcdG1heF9zdGFydCA9IGJsb2NrX3N0YXJ0ICsgbWF4X2Jsb2NrX3NpemU7XHJcblx0XHRcdFx0aWYgKHN0cnN0YXJ0ID09PSAwIHx8IHN0cnN0YXJ0ID49IG1heF9zdGFydCkge1xyXG5cdFx0XHRcdFx0Ly8gc3Ryc3RhcnQgPT09IDAgaXMgcG9zc2libGUgd2hlbiB3cmFwYXJvdW5kIG9uIDE2LWJpdCBtYWNoaW5lXHJcblx0XHRcdFx0XHRsb29rYWhlYWQgPSAoc3Ryc3RhcnQgLSBtYXhfc3RhcnQpO1xyXG5cdFx0XHRcdFx0c3Ryc3RhcnQgPSBtYXhfc3RhcnQ7XHJcblxyXG5cdFx0XHRcdFx0Zmx1c2hfYmxvY2tfb25seShmYWxzZSk7XHJcblx0XHRcdFx0XHRpZiAoc3RybS5hdmFpbF9vdXQgPT09IDApXHJcblx0XHRcdFx0XHRcdHJldHVybiBOZWVkTW9yZTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBGbHVzaCBpZiB3ZSBtYXkgaGF2ZSB0byBzbGlkZSwgb3RoZXJ3aXNlIGJsb2NrX3N0YXJ0IG1heSBiZWNvbWVcclxuXHRcdFx0XHQvLyBuZWdhdGl2ZSBhbmQgdGhlIGRhdGEgd2lsbCBiZSBnb25lOlxyXG5cdFx0XHRcdGlmIChzdHJzdGFydCAtIGJsb2NrX3N0YXJ0ID49IHdfc2l6ZSAtIE1JTl9MT09LQUhFQUQpIHtcclxuXHRcdFx0XHRcdGZsdXNoX2Jsb2NrX29ubHkoZmFsc2UpO1xyXG5cdFx0XHRcdFx0aWYgKHN0cm0uYXZhaWxfb3V0ID09PSAwKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gTmVlZE1vcmU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmbHVzaF9ibG9ja19vbmx5KGZsdXNoID09IFpfRklOSVNIKTtcclxuXHRcdFx0aWYgKHN0cm0uYXZhaWxfb3V0ID09PSAwKVxyXG5cdFx0XHRcdHJldHVybiAoZmx1c2ggPT0gWl9GSU5JU0gpID8gRmluaXNoU3RhcnRlZCA6IE5lZWRNb3JlO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZsdXNoID09IFpfRklOSVNIID8gRmluaXNoRG9uZSA6IEJsb2NrRG9uZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBsb25nZXN0X21hdGNoKGN1cl9tYXRjaCkge1xyXG5cdFx0XHR2YXIgY2hhaW5fbGVuZ3RoID0gbWF4X2NoYWluX2xlbmd0aDsgLy8gbWF4IGhhc2ggY2hhaW4gbGVuZ3RoXHJcblx0XHRcdHZhciBzY2FuID0gc3Ryc3RhcnQ7IC8vIGN1cnJlbnQgc3RyaW5nXHJcblx0XHRcdHZhciBtYXRjaDsgLy8gbWF0Y2hlZCBzdHJpbmdcclxuXHRcdFx0dmFyIGxlbjsgLy8gbGVuZ3RoIG9mIGN1cnJlbnQgbWF0Y2hcclxuXHRcdFx0dmFyIGJlc3RfbGVuID0gcHJldl9sZW5ndGg7IC8vIGJlc3QgbWF0Y2ggbGVuZ3RoIHNvIGZhclxyXG5cdFx0XHR2YXIgbGltaXQgPSBzdHJzdGFydCA+ICh3X3NpemUgLSBNSU5fTE9PS0FIRUFEKSA/IHN0cnN0YXJ0IC0gKHdfc2l6ZSAtIE1JTl9MT09LQUhFQUQpIDogMDtcclxuXHRcdFx0dmFyIF9uaWNlX21hdGNoID0gbmljZV9tYXRjaDtcclxuXHJcblx0XHRcdC8vIFN0b3Agd2hlbiBjdXJfbWF0Y2ggYmVjb21lcyA8PSBsaW1pdC4gVG8gc2ltcGxpZnkgdGhlIGNvZGUsXHJcblx0XHRcdC8vIHdlIHByZXZlbnQgbWF0Y2hlcyB3aXRoIHRoZSBzdHJpbmcgb2Ygd2luZG93IGluZGV4IDAuXHJcblxyXG5cdFx0XHR2YXIgd21hc2sgPSB3X21hc2s7XHJcblxyXG5cdFx0XHR2YXIgc3RyZW5kID0gc3Ryc3RhcnQgKyBNQVhfTUFUQ0g7XHJcblx0XHRcdHZhciBzY2FuX2VuZDEgPSB3aW5kb3dbc2NhbiArIGJlc3RfbGVuIC0gMV07XHJcblx0XHRcdHZhciBzY2FuX2VuZCA9IHdpbmRvd1tzY2FuICsgYmVzdF9sZW5dO1xyXG5cclxuXHRcdFx0Ly8gVGhlIGNvZGUgaXMgb3B0aW1pemVkIGZvciBIQVNIX0JJVFMgPj0gOCBhbmQgTUFYX01BVENILTIgbXVsdGlwbGUgb2ZcclxuXHRcdFx0Ly8gMTYuXHJcblx0XHRcdC8vIEl0IGlzIGVhc3kgdG8gZ2V0IHJpZCBvZiB0aGlzIG9wdGltaXphdGlvbiBpZiBuZWNlc3NhcnkuXHJcblxyXG5cdFx0XHQvLyBEbyBub3Qgd2FzdGUgdG9vIG11Y2ggdGltZSBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBnb29kIG1hdGNoOlxyXG5cdFx0XHRpZiAocHJldl9sZW5ndGggPj0gZ29vZF9tYXRjaCkge1xyXG5cdFx0XHRcdGNoYWluX2xlbmd0aCA+Pj0gMjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRG8gbm90IGxvb2sgZm9yIG1hdGNoZXMgYmV5b25kIHRoZSBlbmQgb2YgdGhlIGlucHV0LiBUaGlzIGlzXHJcblx0XHRcdC8vIG5lY2Vzc2FyeVxyXG5cdFx0XHQvLyB0byBtYWtlIGRlZmxhdGUgZGV0ZXJtaW5pc3RpYy5cclxuXHRcdFx0aWYgKF9uaWNlX21hdGNoID4gbG9va2FoZWFkKVxyXG5cdFx0XHRcdF9uaWNlX21hdGNoID0gbG9va2FoZWFkO1xyXG5cclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdG1hdGNoID0gY3VyX21hdGNoO1xyXG5cclxuXHRcdFx0XHQvLyBTa2lwIHRvIG5leHQgbWF0Y2ggaWYgdGhlIG1hdGNoIGxlbmd0aCBjYW5ub3QgaW5jcmVhc2VcclxuXHRcdFx0XHQvLyBvciBpZiB0aGUgbWF0Y2ggbGVuZ3RoIGlzIGxlc3MgdGhhbiAyOlxyXG5cdFx0XHRcdGlmICh3aW5kb3dbbWF0Y2ggKyBiZXN0X2xlbl0gIT0gc2Nhbl9lbmQgfHwgd2luZG93W21hdGNoICsgYmVzdF9sZW4gLSAxXSAhPSBzY2FuX2VuZDEgfHwgd2luZG93W21hdGNoXSAhPSB3aW5kb3dbc2Nhbl1cclxuXHRcdFx0XHRcdFx0fHwgd2luZG93WysrbWF0Y2hdICE9IHdpbmRvd1tzY2FuICsgMV0pXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0Ly8gVGhlIGNoZWNrIGF0IGJlc3RfbGVuLTEgY2FuIGJlIHJlbW92ZWQgYmVjYXVzZSBpdCB3aWxsIGJlIG1hZGVcclxuXHRcdFx0XHQvLyBhZ2FpbiBsYXRlci4gKFRoaXMgaGV1cmlzdGljIGlzIG5vdCBhbHdheXMgYSB3aW4uKVxyXG5cdFx0XHRcdC8vIEl0IGlzIG5vdCBuZWNlc3NhcnkgdG8gY29tcGFyZSBzY2FuWzJdIGFuZCBtYXRjaFsyXSBzaW5jZSB0aGV5XHJcblx0XHRcdFx0Ly8gYXJlIGFsd2F5cyBlcXVhbCB3aGVuIHRoZSBvdGhlciBieXRlcyBtYXRjaCwgZ2l2ZW4gdGhhdFxyXG5cdFx0XHRcdC8vIHRoZSBoYXNoIGtleXMgYXJlIGVxdWFsIGFuZCB0aGF0IEhBU0hfQklUUyA+PSA4LlxyXG5cdFx0XHRcdHNjYW4gKz0gMjtcclxuXHRcdFx0XHRtYXRjaCsrO1xyXG5cclxuXHRcdFx0XHQvLyBXZSBjaGVjayBmb3IgaW5zdWZmaWNpZW50IGxvb2thaGVhZCBvbmx5IGV2ZXJ5IDh0aCBjb21wYXJpc29uO1xyXG5cdFx0XHRcdC8vIHRoZSAyNTZ0aCBjaGVjayB3aWxsIGJlIG1hZGUgYXQgc3Ryc3RhcnQrMjU4LlxyXG5cdFx0XHRcdGRvIHtcclxuXHRcdFx0XHR9IHdoaWxlICh3aW5kb3dbKytzY2FuXSA9PSB3aW5kb3dbKyttYXRjaF0gJiYgd2luZG93Wysrc2Nhbl0gPT0gd2luZG93WysrbWF0Y2hdICYmIHdpbmRvd1srK3NjYW5dID09IHdpbmRvd1srK21hdGNoXVxyXG5cdFx0XHRcdFx0XHQmJiB3aW5kb3dbKytzY2FuXSA9PSB3aW5kb3dbKyttYXRjaF0gJiYgd2luZG93Wysrc2Nhbl0gPT0gd2luZG93WysrbWF0Y2hdICYmIHdpbmRvd1srK3NjYW5dID09IHdpbmRvd1srK21hdGNoXVxyXG5cdFx0XHRcdFx0XHQmJiB3aW5kb3dbKytzY2FuXSA9PSB3aW5kb3dbKyttYXRjaF0gJiYgd2luZG93Wysrc2Nhbl0gPT0gd2luZG93WysrbWF0Y2hdICYmIHNjYW4gPCBzdHJlbmQpO1xyXG5cclxuXHRcdFx0XHRsZW4gPSBNQVhfTUFUQ0ggLSAoc3RyZW5kIC0gc2Nhbik7XHJcblx0XHRcdFx0c2NhbiA9IHN0cmVuZCAtIE1BWF9NQVRDSDtcclxuXHJcblx0XHRcdFx0aWYgKGxlbiA+IGJlc3RfbGVuKSB7XHJcblx0XHRcdFx0XHRtYXRjaF9zdGFydCA9IGN1cl9tYXRjaDtcclxuXHRcdFx0XHRcdGJlc3RfbGVuID0gbGVuO1xyXG5cdFx0XHRcdFx0aWYgKGxlbiA+PSBfbmljZV9tYXRjaClcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRzY2FuX2VuZDEgPSB3aW5kb3dbc2NhbiArIGJlc3RfbGVuIC0gMV07XHJcblx0XHRcdFx0XHRzY2FuX2VuZCA9IHdpbmRvd1tzY2FuICsgYmVzdF9sZW5dO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gd2hpbGUgKChjdXJfbWF0Y2ggPSAocHJldltjdXJfbWF0Y2ggJiB3bWFza10gJiAweGZmZmYpKSA+IGxpbWl0ICYmIC0tY2hhaW5fbGVuZ3RoICE9PSAwKTtcclxuXHJcblx0XHRcdGlmIChiZXN0X2xlbiA8PSBsb29rYWhlYWQpXHJcblx0XHRcdFx0cmV0dXJuIGJlc3RfbGVuO1xyXG5cdFx0XHRyZXR1cm4gbG9va2FoZWFkO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENvbXByZXNzIGFzIG11Y2ggYXMgcG9zc2libGUgZnJvbSB0aGUgaW5wdXQgc3RyZWFtLCByZXR1cm4gdGhlIGN1cnJlbnRcclxuXHRcdC8vIGJsb2NrIHN0YXRlLlxyXG5cdFx0Ly8gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCBwZXJmb3JtIGxhenkgZXZhbHVhdGlvbiBvZiBtYXRjaGVzIGFuZCBpbnNlcnRzXHJcblx0XHQvLyBuZXcgc3RyaW5ncyBpbiB0aGUgZGljdGlvbmFyeSBvbmx5IGZvciB1bm1hdGNoZWQgc3RyaW5ncyBvciBmb3Igc2hvcnRcclxuXHRcdC8vIG1hdGNoZXMuIEl0IGlzIHVzZWQgb25seSBmb3IgdGhlIGZhc3QgY29tcHJlc3Npb24gb3B0aW9ucy5cclxuXHRcdGZ1bmN0aW9uIGRlZmxhdGVfZmFzdChmbHVzaCkge1xyXG5cdFx0XHQvLyBzaG9ydCBoYXNoX2hlYWQgPSAwOyAvLyBoZWFkIG9mIHRoZSBoYXNoIGNoYWluXHJcblx0XHRcdHZhciBoYXNoX2hlYWQgPSAwOyAvLyBoZWFkIG9mIHRoZSBoYXNoIGNoYWluXHJcblx0XHRcdHZhciBiZmx1c2g7IC8vIHNldCBpZiBjdXJyZW50IGJsb2NrIG11c3QgYmUgZmx1c2hlZFxyXG5cclxuXHRcdFx0d2hpbGUgKHRydWUpIHtcclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSBhbHdheXMgaGF2ZSBlbm91Z2ggbG9va2FoZWFkLCBleGNlcHRcclxuXHRcdFx0XHQvLyBhdCB0aGUgZW5kIG9mIHRoZSBpbnB1dCBmaWxlLiBXZSBuZWVkIE1BWF9NQVRDSCBieXRlc1xyXG5cdFx0XHRcdC8vIGZvciB0aGUgbmV4dCBtYXRjaCwgcGx1cyBNSU5fTUFUQ0ggYnl0ZXMgdG8gaW5zZXJ0IHRoZVxyXG5cdFx0XHRcdC8vIHN0cmluZyBmb2xsb3dpbmcgdGhlIG5leHQgbWF0Y2guXHJcblx0XHRcdFx0aWYgKGxvb2thaGVhZCA8IE1JTl9MT09LQUhFQUQpIHtcclxuXHRcdFx0XHRcdGZpbGxfd2luZG93KCk7XHJcblx0XHRcdFx0XHRpZiAobG9va2FoZWFkIDwgTUlOX0xPT0tBSEVBRCAmJiBmbHVzaCA9PSBaX05PX0ZMVVNIKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBOZWVkTW9yZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChsb29rYWhlYWQgPT09IDApXHJcblx0XHRcdFx0XHRcdGJyZWFrOyAvLyBmbHVzaCB0aGUgY3VycmVudCBibG9ja1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gSW5zZXJ0IHRoZSBzdHJpbmcgd2luZG93W3N0cnN0YXJ0IC4uIHN0cnN0YXJ0KzJdIGluIHRoZVxyXG5cdFx0XHRcdC8vIGRpY3Rpb25hcnksIGFuZCBzZXQgaGFzaF9oZWFkIHRvIHRoZSBoZWFkIG9mIHRoZSBoYXNoIGNoYWluOlxyXG5cdFx0XHRcdGlmIChsb29rYWhlYWQgPj0gTUlOX01BVENIKSB7XHJcblx0XHRcdFx0XHRpbnNfaCA9ICgoKGluc19oKSA8PCBoYXNoX3NoaWZ0KSBeICh3aW5kb3dbKHN0cnN0YXJ0KSArIChNSU5fTUFUQ0ggLSAxKV0gJiAweGZmKSkgJiBoYXNoX21hc2s7XHJcblxyXG5cdFx0XHRcdFx0Ly8gcHJldltzdHJzdGFydCZ3X21hc2tdPWhhc2hfaGVhZD1oZWFkW2luc19oXTtcclxuXHRcdFx0XHRcdGhhc2hfaGVhZCA9IChoZWFkW2luc19oXSAmIDB4ZmZmZik7XHJcblx0XHRcdFx0XHRwcmV2W3N0cnN0YXJ0ICYgd19tYXNrXSA9IGhlYWRbaW5zX2hdO1xyXG5cdFx0XHRcdFx0aGVhZFtpbnNfaF0gPSBzdHJzdGFydDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEZpbmQgdGhlIGxvbmdlc3QgbWF0Y2gsIGRpc2NhcmRpbmcgdGhvc2UgPD0gcHJldl9sZW5ndGguXHJcblx0XHRcdFx0Ly8gQXQgdGhpcyBwb2ludCB3ZSBoYXZlIGFsd2F5cyBtYXRjaF9sZW5ndGggPCBNSU5fTUFUQ0hcclxuXHJcblx0XHRcdFx0aWYgKGhhc2hfaGVhZCAhPT0gMCAmJiAoKHN0cnN0YXJ0IC0gaGFzaF9oZWFkKSAmIDB4ZmZmZikgPD0gd19zaXplIC0gTUlOX0xPT0tBSEVBRCkge1xyXG5cdFx0XHRcdFx0Ly8gVG8gc2ltcGxpZnkgdGhlIGNvZGUsIHdlIHByZXZlbnQgbWF0Y2hlcyB3aXRoIHRoZSBzdHJpbmdcclxuXHRcdFx0XHRcdC8vIG9mIHdpbmRvdyBpbmRleCAwIChpbiBwYXJ0aWN1bGFyIHdlIGhhdmUgdG8gYXZvaWQgYSBtYXRjaFxyXG5cdFx0XHRcdFx0Ly8gb2YgdGhlIHN0cmluZyB3aXRoIGl0c2VsZiBhdCB0aGUgc3RhcnQgb2YgdGhlIGlucHV0IGZpbGUpLlxyXG5cdFx0XHRcdFx0aWYgKHN0cmF0ZWd5ICE9IFpfSFVGRk1BTl9PTkxZKSB7XHJcblx0XHRcdFx0XHRcdG1hdGNoX2xlbmd0aCA9IGxvbmdlc3RfbWF0Y2goaGFzaF9oZWFkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGxvbmdlc3RfbWF0Y2goKSBzZXRzIG1hdGNoX3N0YXJ0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChtYXRjaF9sZW5ndGggPj0gTUlOX01BVENIKSB7XHJcblx0XHRcdFx0XHQvLyBjaGVja19tYXRjaChzdHJzdGFydCwgbWF0Y2hfc3RhcnQsIG1hdGNoX2xlbmd0aCk7XHJcblxyXG5cdFx0XHRcdFx0YmZsdXNoID0gX3RyX3RhbGx5KHN0cnN0YXJ0IC0gbWF0Y2hfc3RhcnQsIG1hdGNoX2xlbmd0aCAtIE1JTl9NQVRDSCk7XHJcblxyXG5cdFx0XHRcdFx0bG9va2FoZWFkIC09IG1hdGNoX2xlbmd0aDtcclxuXHJcblx0XHRcdFx0XHQvLyBJbnNlcnQgbmV3IHN0cmluZ3MgaW4gdGhlIGhhc2ggdGFibGUgb25seSBpZiB0aGUgbWF0Y2ggbGVuZ3RoXHJcblx0XHRcdFx0XHQvLyBpcyBub3QgdG9vIGxhcmdlLiBUaGlzIHNhdmVzIHRpbWUgYnV0IGRlZ3JhZGVzIGNvbXByZXNzaW9uLlxyXG5cdFx0XHRcdFx0aWYgKG1hdGNoX2xlbmd0aCA8PSBtYXhfbGF6eV9tYXRjaCAmJiBsb29rYWhlYWQgPj0gTUlOX01BVENIKSB7XHJcblx0XHRcdFx0XHRcdG1hdGNoX2xlbmd0aC0tOyAvLyBzdHJpbmcgYXQgc3Ryc3RhcnQgYWxyZWFkeSBpbiBoYXNoIHRhYmxlXHJcblx0XHRcdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdFx0XHRzdHJzdGFydCsrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpbnNfaCA9ICgoaW5zX2ggPDwgaGFzaF9zaGlmdCkgXiAod2luZG93WyhzdHJzdGFydCkgKyAoTUlOX01BVENIIC0gMSldICYgMHhmZikpICYgaGFzaF9tYXNrO1xyXG5cdFx0XHRcdFx0XHRcdC8vIHByZXZbc3Ryc3RhcnQmd19tYXNrXT1oYXNoX2hlYWQ9aGVhZFtpbnNfaF07XHJcblx0XHRcdFx0XHRcdFx0aGFzaF9oZWFkID0gKGhlYWRbaW5zX2hdICYgMHhmZmZmKTtcclxuXHRcdFx0XHRcdFx0XHRwcmV2W3N0cnN0YXJ0ICYgd19tYXNrXSA9IGhlYWRbaW5zX2hdO1xyXG5cdFx0XHRcdFx0XHRcdGhlYWRbaW5zX2hdID0gc3Ryc3RhcnQ7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIHN0cnN0YXJ0IG5ldmVyIGV4Y2VlZHMgV1NJWkUtTUFYX01BVENILCBzbyB0aGVyZSBhcmVcclxuXHRcdFx0XHRcdFx0XHQvLyBhbHdheXMgTUlOX01BVENIIGJ5dGVzIGFoZWFkLlxyXG5cdFx0XHRcdFx0XHR9IHdoaWxlICgtLW1hdGNoX2xlbmd0aCAhPT0gMCk7XHJcblx0XHRcdFx0XHRcdHN0cnN0YXJ0Kys7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRzdHJzdGFydCArPSBtYXRjaF9sZW5ndGg7XHJcblx0XHRcdFx0XHRcdG1hdGNoX2xlbmd0aCA9IDA7XHJcblx0XHRcdFx0XHRcdGluc19oID0gd2luZG93W3N0cnN0YXJ0XSAmIDB4ZmY7XHJcblxyXG5cdFx0XHRcdFx0XHRpbnNfaCA9ICgoKGluc19oKSA8PCBoYXNoX3NoaWZ0KSBeICh3aW5kb3dbc3Ryc3RhcnQgKyAxXSAmIDB4ZmYpKSAmIGhhc2hfbWFzaztcclxuXHRcdFx0XHRcdFx0Ly8gSWYgbG9va2FoZWFkIDwgTUlOX01BVENILCBpbnNfaCBpcyBnYXJiYWdlLCBidXQgaXQgZG9lc1xyXG5cdFx0XHRcdFx0XHQvLyBub3RcclxuXHRcdFx0XHRcdFx0Ly8gbWF0dGVyIHNpbmNlIGl0IHdpbGwgYmUgcmVjb21wdXRlZCBhdCBuZXh0IGRlZmxhdGUgY2FsbC5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gTm8gbWF0Y2gsIG91dHB1dCBhIGxpdGVyYWwgYnl0ZVxyXG5cclxuXHRcdFx0XHRcdGJmbHVzaCA9IF90cl90YWxseSgwLCB3aW5kb3dbc3Ryc3RhcnRdICYgMHhmZik7XHJcblx0XHRcdFx0XHRsb29rYWhlYWQtLTtcclxuXHRcdFx0XHRcdHN0cnN0YXJ0Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChiZmx1c2gpIHtcclxuXHJcblx0XHRcdFx0XHRmbHVzaF9ibG9ja19vbmx5KGZhbHNlKTtcclxuXHRcdFx0XHRcdGlmIChzdHJtLmF2YWlsX291dCA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIE5lZWRNb3JlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zmx1c2hfYmxvY2tfb25seShmbHVzaCA9PSBaX0ZJTklTSCk7XHJcblx0XHRcdGlmIChzdHJtLmF2YWlsX291dCA9PT0gMCkge1xyXG5cdFx0XHRcdGlmIChmbHVzaCA9PSBaX0ZJTklTSClcclxuXHRcdFx0XHRcdHJldHVybiBGaW5pc2hTdGFydGVkO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBOZWVkTW9yZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmx1c2ggPT0gWl9GSU5JU0ggPyBGaW5pc2hEb25lIDogQmxvY2tEb25lO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNhbWUgYXMgYWJvdmUsIGJ1dCBhY2hpZXZlcyBiZXR0ZXIgY29tcHJlc3Npb24uIFdlIHVzZSBhIGxhenlcclxuXHRcdC8vIGV2YWx1YXRpb24gZm9yIG1hdGNoZXM6IGEgbWF0Y2ggaXMgZmluYWxseSBhZG9wdGVkIG9ubHkgaWYgdGhlcmUgaXNcclxuXHRcdC8vIG5vIGJldHRlciBtYXRjaCBhdCB0aGUgbmV4dCB3aW5kb3cgcG9zaXRpb24uXHJcblx0XHRmdW5jdGlvbiBkZWZsYXRlX3Nsb3coZmx1c2gpIHtcclxuXHRcdFx0Ly8gc2hvcnQgaGFzaF9oZWFkID0gMDsgLy8gaGVhZCBvZiBoYXNoIGNoYWluXHJcblx0XHRcdHZhciBoYXNoX2hlYWQgPSAwOyAvLyBoZWFkIG9mIGhhc2ggY2hhaW5cclxuXHRcdFx0dmFyIGJmbHVzaDsgLy8gc2V0IGlmIGN1cnJlbnQgYmxvY2sgbXVzdCBiZSBmbHVzaGVkXHJcblx0XHRcdHZhciBtYXhfaW5zZXJ0O1xyXG5cclxuXHRcdFx0Ly8gUHJvY2VzcyB0aGUgaW5wdXQgYmxvY2suXHJcblx0XHRcdHdoaWxlICh0cnVlKSB7XHJcblx0XHRcdFx0Ly8gTWFrZSBzdXJlIHRoYXQgd2UgYWx3YXlzIGhhdmUgZW5vdWdoIGxvb2thaGVhZCwgZXhjZXB0XHJcblx0XHRcdFx0Ly8gYXQgdGhlIGVuZCBvZiB0aGUgaW5wdXQgZmlsZS4gV2UgbmVlZCBNQVhfTUFUQ0ggYnl0ZXNcclxuXHRcdFx0XHQvLyBmb3IgdGhlIG5leHQgbWF0Y2gsIHBsdXMgTUlOX01BVENIIGJ5dGVzIHRvIGluc2VydCB0aGVcclxuXHRcdFx0XHQvLyBzdHJpbmcgZm9sbG93aW5nIHRoZSBuZXh0IG1hdGNoLlxyXG5cclxuXHRcdFx0XHRpZiAobG9va2FoZWFkIDwgTUlOX0xPT0tBSEVBRCkge1xyXG5cdFx0XHRcdFx0ZmlsbF93aW5kb3coKTtcclxuXHRcdFx0XHRcdGlmIChsb29rYWhlYWQgPCBNSU5fTE9PS0FIRUFEICYmIGZsdXNoID09IFpfTk9fRkxVU0gpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIE5lZWRNb3JlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGxvb2thaGVhZCA9PT0gMClcclxuXHRcdFx0XHRcdFx0YnJlYWs7IC8vIGZsdXNoIHRoZSBjdXJyZW50IGJsb2NrXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBJbnNlcnQgdGhlIHN0cmluZyB3aW5kb3dbc3Ryc3RhcnQgLi4gc3Ryc3RhcnQrMl0gaW4gdGhlXHJcblx0XHRcdFx0Ly8gZGljdGlvbmFyeSwgYW5kIHNldCBoYXNoX2hlYWQgdG8gdGhlIGhlYWQgb2YgdGhlIGhhc2ggY2hhaW46XHJcblxyXG5cdFx0XHRcdGlmIChsb29rYWhlYWQgPj0gTUlOX01BVENIKSB7XHJcblx0XHRcdFx0XHRpbnNfaCA9ICgoKGluc19oKSA8PCBoYXNoX3NoaWZ0KSBeICh3aW5kb3dbKHN0cnN0YXJ0KSArIChNSU5fTUFUQ0ggLSAxKV0gJiAweGZmKSkgJiBoYXNoX21hc2s7XHJcblx0XHRcdFx0XHQvLyBwcmV2W3N0cnN0YXJ0JndfbWFza109aGFzaF9oZWFkPWhlYWRbaW5zX2hdO1xyXG5cdFx0XHRcdFx0aGFzaF9oZWFkID0gKGhlYWRbaW5zX2hdICYgMHhmZmZmKTtcclxuXHRcdFx0XHRcdHByZXZbc3Ryc3RhcnQgJiB3X21hc2tdID0gaGVhZFtpbnNfaF07XHJcblx0XHRcdFx0XHRoZWFkW2luc19oXSA9IHN0cnN0YXJ0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gRmluZCB0aGUgbG9uZ2VzdCBtYXRjaCwgZGlzY2FyZGluZyB0aG9zZSA8PSBwcmV2X2xlbmd0aC5cclxuXHRcdFx0XHRwcmV2X2xlbmd0aCA9IG1hdGNoX2xlbmd0aDtcclxuXHRcdFx0XHRwcmV2X21hdGNoID0gbWF0Y2hfc3RhcnQ7XHJcblx0XHRcdFx0bWF0Y2hfbGVuZ3RoID0gTUlOX01BVENIIC0gMTtcclxuXHJcblx0XHRcdFx0aWYgKGhhc2hfaGVhZCAhPT0gMCAmJiBwcmV2X2xlbmd0aCA8IG1heF9sYXp5X21hdGNoICYmICgoc3Ryc3RhcnQgLSBoYXNoX2hlYWQpICYgMHhmZmZmKSA8PSB3X3NpemUgLSBNSU5fTE9PS0FIRUFEKSB7XHJcblx0XHRcdFx0XHQvLyBUbyBzaW1wbGlmeSB0aGUgY29kZSwgd2UgcHJldmVudCBtYXRjaGVzIHdpdGggdGhlIHN0cmluZ1xyXG5cdFx0XHRcdFx0Ly8gb2Ygd2luZG93IGluZGV4IDAgKGluIHBhcnRpY3VsYXIgd2UgaGF2ZSB0byBhdm9pZCBhIG1hdGNoXHJcblx0XHRcdFx0XHQvLyBvZiB0aGUgc3RyaW5nIHdpdGggaXRzZWxmIGF0IHRoZSBzdGFydCBvZiB0aGUgaW5wdXQgZmlsZSkuXHJcblxyXG5cdFx0XHRcdFx0aWYgKHN0cmF0ZWd5ICE9IFpfSFVGRk1BTl9PTkxZKSB7XHJcblx0XHRcdFx0XHRcdG1hdGNoX2xlbmd0aCA9IGxvbmdlc3RfbWF0Y2goaGFzaF9oZWFkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGxvbmdlc3RfbWF0Y2goKSBzZXRzIG1hdGNoX3N0YXJ0XHJcblxyXG5cdFx0XHRcdFx0aWYgKG1hdGNoX2xlbmd0aCA8PSA1ICYmIChzdHJhdGVneSA9PSBaX0ZJTFRFUkVEIHx8IChtYXRjaF9sZW5ndGggPT0gTUlOX01BVENIICYmIHN0cnN0YXJ0IC0gbWF0Y2hfc3RhcnQgPiA0MDk2KSkpIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIElmIHByZXZfbWF0Y2ggaXMgYWxzbyBNSU5fTUFUQ0gsIG1hdGNoX3N0YXJ0IGlzIGdhcmJhZ2VcclxuXHRcdFx0XHRcdFx0Ly8gYnV0IHdlIHdpbGwgaWdub3JlIHRoZSBjdXJyZW50IG1hdGNoIGFueXdheS5cclxuXHRcdFx0XHRcdFx0bWF0Y2hfbGVuZ3RoID0gTUlOX01BVENIIC0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIElmIHRoZXJlIHdhcyBhIG1hdGNoIGF0IHRoZSBwcmV2aW91cyBzdGVwIGFuZCB0aGUgY3VycmVudFxyXG5cdFx0XHRcdC8vIG1hdGNoIGlzIG5vdCBiZXR0ZXIsIG91dHB1dCB0aGUgcHJldmlvdXMgbWF0Y2g6XHJcblx0XHRcdFx0aWYgKHByZXZfbGVuZ3RoID49IE1JTl9NQVRDSCAmJiBtYXRjaF9sZW5ndGggPD0gcHJldl9sZW5ndGgpIHtcclxuXHRcdFx0XHRcdG1heF9pbnNlcnQgPSBzdHJzdGFydCArIGxvb2thaGVhZCAtIE1JTl9NQVRDSDtcclxuXHRcdFx0XHRcdC8vIERvIG5vdCBpbnNlcnQgc3RyaW5ncyBpbiBoYXNoIHRhYmxlIGJleW9uZCB0aGlzLlxyXG5cclxuXHRcdFx0XHRcdC8vIGNoZWNrX21hdGNoKHN0cnN0YXJ0LTEsIHByZXZfbWF0Y2gsIHByZXZfbGVuZ3RoKTtcclxuXHJcblx0XHRcdFx0XHRiZmx1c2ggPSBfdHJfdGFsbHkoc3Ryc3RhcnQgLSAxIC0gcHJldl9tYXRjaCwgcHJldl9sZW5ndGggLSBNSU5fTUFUQ0gpO1xyXG5cclxuXHRcdFx0XHRcdC8vIEluc2VydCBpbiBoYXNoIHRhYmxlIGFsbCBzdHJpbmdzIHVwIHRvIHRoZSBlbmQgb2YgdGhlIG1hdGNoLlxyXG5cdFx0XHRcdFx0Ly8gc3Ryc3RhcnQtMSBhbmQgc3Ryc3RhcnQgYXJlIGFscmVhZHkgaW5zZXJ0ZWQuIElmIHRoZXJlIGlzIG5vdFxyXG5cdFx0XHRcdFx0Ly8gZW5vdWdoIGxvb2thaGVhZCwgdGhlIGxhc3QgdHdvIHN0cmluZ3MgYXJlIG5vdCBpbnNlcnRlZCBpblxyXG5cdFx0XHRcdFx0Ly8gdGhlIGhhc2ggdGFibGUuXHJcblx0XHRcdFx0XHRsb29rYWhlYWQgLT0gcHJldl9sZW5ndGggLSAxO1xyXG5cdFx0XHRcdFx0cHJldl9sZW5ndGggLT0gMjtcclxuXHRcdFx0XHRcdGRvIHtcclxuXHRcdFx0XHRcdFx0aWYgKCsrc3Ryc3RhcnQgPD0gbWF4X2luc2VydCkge1xyXG5cdFx0XHRcdFx0XHRcdGluc19oID0gKCgoaW5zX2gpIDw8IGhhc2hfc2hpZnQpIF4gKHdpbmRvd1soc3Ryc3RhcnQpICsgKE1JTl9NQVRDSCAtIDEpXSAmIDB4ZmYpKSAmIGhhc2hfbWFzaztcclxuXHRcdFx0XHRcdFx0XHQvLyBwcmV2W3N0cnN0YXJ0JndfbWFza109aGFzaF9oZWFkPWhlYWRbaW5zX2hdO1xyXG5cdFx0XHRcdFx0XHRcdGhhc2hfaGVhZCA9IChoZWFkW2luc19oXSAmIDB4ZmZmZik7XHJcblx0XHRcdFx0XHRcdFx0cHJldltzdHJzdGFydCAmIHdfbWFza10gPSBoZWFkW2luc19oXTtcclxuXHRcdFx0XHRcdFx0XHRoZWFkW2luc19oXSA9IHN0cnN0YXJ0O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IHdoaWxlICgtLXByZXZfbGVuZ3RoICE9PSAwKTtcclxuXHRcdFx0XHRcdG1hdGNoX2F2YWlsYWJsZSA9IDA7XHJcblx0XHRcdFx0XHRtYXRjaF9sZW5ndGggPSBNSU5fTUFUQ0ggLSAxO1xyXG5cdFx0XHRcdFx0c3Ryc3RhcnQrKztcclxuXHJcblx0XHRcdFx0XHRpZiAoYmZsdXNoKSB7XHJcblx0XHRcdFx0XHRcdGZsdXNoX2Jsb2NrX29ubHkoZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHRpZiAoc3RybS5hdmFpbF9vdXQgPT09IDApXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIE5lZWRNb3JlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2hfYXZhaWxhYmxlICE9PSAwKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWYgdGhlcmUgd2FzIG5vIG1hdGNoIGF0IHRoZSBwcmV2aW91cyBwb3NpdGlvbiwgb3V0cHV0IGFcclxuXHRcdFx0XHRcdC8vIHNpbmdsZSBsaXRlcmFsLiBJZiB0aGVyZSB3YXMgYSBtYXRjaCBidXQgdGhlIGN1cnJlbnQgbWF0Y2hcclxuXHRcdFx0XHRcdC8vIGlzIGxvbmdlciwgdHJ1bmNhdGUgdGhlIHByZXZpb3VzIG1hdGNoIHRvIGEgc2luZ2xlIGxpdGVyYWwuXHJcblxyXG5cdFx0XHRcdFx0YmZsdXNoID0gX3RyX3RhbGx5KDAsIHdpbmRvd1tzdHJzdGFydCAtIDFdICYgMHhmZik7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGJmbHVzaCkge1xyXG5cdFx0XHRcdFx0XHRmbHVzaF9ibG9ja19vbmx5KGZhbHNlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0cnN0YXJ0Kys7XHJcblx0XHRcdFx0XHRsb29rYWhlYWQtLTtcclxuXHRcdFx0XHRcdGlmIChzdHJtLmF2YWlsX291dCA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIE5lZWRNb3JlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBUaGVyZSBpcyBubyBwcmV2aW91cyBtYXRjaCB0byBjb21wYXJlIHdpdGgsIHdhaXQgZm9yXHJcblx0XHRcdFx0XHQvLyB0aGUgbmV4dCBzdGVwIHRvIGRlY2lkZS5cclxuXHJcblx0XHRcdFx0XHRtYXRjaF9hdmFpbGFibGUgPSAxO1xyXG5cdFx0XHRcdFx0c3Ryc3RhcnQrKztcclxuXHRcdFx0XHRcdGxvb2thaGVhZC0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG1hdGNoX2F2YWlsYWJsZSAhPT0gMCkge1xyXG5cdFx0XHRcdGJmbHVzaCA9IF90cl90YWxseSgwLCB3aW5kb3dbc3Ryc3RhcnQgLSAxXSAmIDB4ZmYpO1xyXG5cdFx0XHRcdG1hdGNoX2F2YWlsYWJsZSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0Zmx1c2hfYmxvY2tfb25seShmbHVzaCA9PSBaX0ZJTklTSCk7XHJcblxyXG5cdFx0XHRpZiAoc3RybS5hdmFpbF9vdXQgPT09IDApIHtcclxuXHRcdFx0XHRpZiAoZmx1c2ggPT0gWl9GSU5JU0gpXHJcblx0XHRcdFx0XHRyZXR1cm4gRmluaXNoU3RhcnRlZDtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gTmVlZE1vcmU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmbHVzaCA9PSBaX0ZJTklTSCA/IEZpbmlzaERvbmUgOiBCbG9ja0RvbmU7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZGVmbGF0ZVJlc2V0KHN0cm0pIHtcclxuXHRcdFx0c3RybS50b3RhbF9pbiA9IHN0cm0udG90YWxfb3V0ID0gMDtcclxuXHRcdFx0c3RybS5tc2cgPSBudWxsOyAvL1xyXG5cdFx0XHRcclxuXHRcdFx0dGhhdC5wZW5kaW5nID0gMDtcclxuXHRcdFx0dGhhdC5wZW5kaW5nX291dCA9IDA7XHJcblxyXG5cdFx0XHRzdGF0dXMgPSBCVVNZX1NUQVRFO1xyXG5cclxuXHRcdFx0bGFzdF9mbHVzaCA9IFpfTk9fRkxVU0g7XHJcblxyXG5cdFx0XHR0cl9pbml0KCk7XHJcblx0XHRcdGxtX2luaXQoKTtcclxuXHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhhdC5kZWZsYXRlSW5pdCA9IGZ1bmN0aW9uKHN0cm0sIF9sZXZlbCwgYml0cywgX21ldGhvZCwgbWVtTGV2ZWwsIF9zdHJhdGVneSkge1xyXG5cdFx0XHRpZiAoIV9tZXRob2QpXHJcblx0XHRcdFx0X21ldGhvZCA9IFpfREVGTEFURUQ7XHJcblx0XHRcdGlmICghbWVtTGV2ZWwpXHJcblx0XHRcdFx0bWVtTGV2ZWwgPSBERUZfTUVNX0xFVkVMO1xyXG5cdFx0XHRpZiAoIV9zdHJhdGVneSlcclxuXHRcdFx0XHRfc3RyYXRlZ3kgPSBaX0RFRkFVTFRfU1RSQVRFR1k7XHJcblxyXG5cdFx0XHQvLyBieXRlW10gbXlfdmVyc2lvbj1aTElCX1ZFUlNJT047XHJcblxyXG5cdFx0XHQvL1xyXG5cdFx0XHQvLyBpZiAoIXZlcnNpb24gfHwgdmVyc2lvblswXSAhPSBteV92ZXJzaW9uWzBdXHJcblx0XHRcdC8vIHx8IHN0cmVhbV9zaXplICE9IHNpemVvZih6X3N0cmVhbSkpIHtcclxuXHRcdFx0Ly8gcmV0dXJuIFpfVkVSU0lPTl9FUlJPUjtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0c3RybS5tc2cgPSBudWxsO1xyXG5cclxuXHRcdFx0aWYgKF9sZXZlbCA9PSBaX0RFRkFVTFRfQ09NUFJFU1NJT04pXHJcblx0XHRcdFx0X2xldmVsID0gNjtcclxuXHJcblx0XHRcdGlmIChtZW1MZXZlbCA8IDEgfHwgbWVtTGV2ZWwgPiBNQVhfTUVNX0xFVkVMIHx8IF9tZXRob2QgIT0gWl9ERUZMQVRFRCB8fCBiaXRzIDwgOSB8fCBiaXRzID4gMTUgfHwgX2xldmVsIDwgMCB8fCBfbGV2ZWwgPiA5IHx8IF9zdHJhdGVneSA8IDBcclxuXHRcdFx0XHRcdHx8IF9zdHJhdGVneSA+IFpfSFVGRk1BTl9PTkxZKSB7XHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdHJtLmRzdGF0ZSA9IHRoYXQ7XHJcblxyXG5cdFx0XHR3X2JpdHMgPSBiaXRzO1xyXG5cdFx0XHR3X3NpemUgPSAxIDw8IHdfYml0cztcclxuXHRcdFx0d19tYXNrID0gd19zaXplIC0gMTtcclxuXHJcblx0XHRcdGhhc2hfYml0cyA9IG1lbUxldmVsICsgNztcclxuXHRcdFx0aGFzaF9zaXplID0gMSA8PCBoYXNoX2JpdHM7XHJcblx0XHRcdGhhc2hfbWFzayA9IGhhc2hfc2l6ZSAtIDE7XHJcblx0XHRcdGhhc2hfc2hpZnQgPSBNYXRoLmZsb29yKChoYXNoX2JpdHMgKyBNSU5fTUFUQ0ggLSAxKSAvIE1JTl9NQVRDSCk7XHJcblxyXG5cdFx0XHR3aW5kb3cgPSBuZXcgVWludDhBcnJheSh3X3NpemUgKiAyKTtcclxuXHRcdFx0cHJldiA9IFtdO1xyXG5cdFx0XHRoZWFkID0gW107XHJcblxyXG5cdFx0XHRsaXRfYnVmc2l6ZSA9IDEgPDwgKG1lbUxldmVsICsgNik7IC8vIDE2SyBlbGVtZW50cyBieSBkZWZhdWx0XHJcblxyXG5cdFx0XHQvLyBXZSBvdmVybGF5IHBlbmRpbmdfYnVmIGFuZCBkX2J1ZitsX2J1Zi4gVGhpcyB3b3JrcyBzaW5jZSB0aGUgYXZlcmFnZVxyXG5cdFx0XHQvLyBvdXRwdXQgc2l6ZSBmb3IgKGxlbmd0aCxkaXN0YW5jZSkgY29kZXMgaXMgPD0gMjQgYml0cy5cclxuXHRcdFx0dGhhdC5wZW5kaW5nX2J1ZiA9IG5ldyBVaW50OEFycmF5KGxpdF9idWZzaXplICogNCk7XHJcblx0XHRcdHBlbmRpbmdfYnVmX3NpemUgPSBsaXRfYnVmc2l6ZSAqIDQ7XHJcblxyXG5cdFx0XHRkX2J1ZiA9IE1hdGguZmxvb3IobGl0X2J1ZnNpemUgLyAyKTtcclxuXHRcdFx0bF9idWYgPSAoMSArIDIpICogbGl0X2J1ZnNpemU7XHJcblxyXG5cdFx0XHRsZXZlbCA9IF9sZXZlbDtcclxuXHJcblx0XHRcdHN0cmF0ZWd5ID0gX3N0cmF0ZWd5O1xyXG5cdFx0XHRtZXRob2QgPSBfbWV0aG9kICYgMHhmZjtcclxuXHJcblx0XHRcdHJldHVybiBkZWZsYXRlUmVzZXQoc3RybSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuZGVmbGF0ZUVuZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoc3RhdHVzICE9IElOSVRfU1RBVEUgJiYgc3RhdHVzICE9IEJVU1lfU1RBVEUgJiYgc3RhdHVzICE9IEZJTklTSF9TVEFURSkge1xyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBEZWFsbG9jYXRlIGluIHJldmVyc2Ugb3JkZXIgb2YgYWxsb2NhdGlvbnM6XHJcblx0XHRcdHRoYXQucGVuZGluZ19idWYgPSBudWxsO1xyXG5cdFx0XHRoZWFkID0gbnVsbDtcclxuXHRcdFx0cHJldiA9IG51bGw7XHJcblx0XHRcdHdpbmRvdyA9IG51bGw7XHJcblx0XHRcdC8vIGZyZWVcclxuXHRcdFx0dGhhdC5kc3RhdGUgPSBudWxsO1xyXG5cdFx0XHRyZXR1cm4gc3RhdHVzID09IEJVU1lfU1RBVEUgPyBaX0RBVEFfRVJST1IgOiBaX09LO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmRlZmxhdGVQYXJhbXMgPSBmdW5jdGlvbihzdHJtLCBfbGV2ZWwsIF9zdHJhdGVneSkge1xyXG5cdFx0XHR2YXIgZXJyID0gWl9PSztcclxuXHJcblx0XHRcdGlmIChfbGV2ZWwgPT0gWl9ERUZBVUxUX0NPTVBSRVNTSU9OKSB7XHJcblx0XHRcdFx0X2xldmVsID0gNjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoX2xldmVsIDwgMCB8fCBfbGV2ZWwgPiA5IHx8IF9zdHJhdGVneSA8IDAgfHwgX3N0cmF0ZWd5ID4gWl9IVUZGTUFOX09OTFkpIHtcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjb25maWdfdGFibGVbbGV2ZWxdLmZ1bmMgIT0gY29uZmlnX3RhYmxlW19sZXZlbF0uZnVuYyAmJiBzdHJtLnRvdGFsX2luICE9PSAwKSB7XHJcblx0XHRcdFx0Ly8gRmx1c2ggdGhlIGxhc3QgYnVmZmVyOlxyXG5cdFx0XHRcdGVyciA9IHN0cm0uZGVmbGF0ZShaX1BBUlRJQUxfRkxVU0gpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAobGV2ZWwgIT0gX2xldmVsKSB7XHJcblx0XHRcdFx0bGV2ZWwgPSBfbGV2ZWw7XHJcblx0XHRcdFx0bWF4X2xhenlfbWF0Y2ggPSBjb25maWdfdGFibGVbbGV2ZWxdLm1heF9sYXp5O1xyXG5cdFx0XHRcdGdvb2RfbWF0Y2ggPSBjb25maWdfdGFibGVbbGV2ZWxdLmdvb2RfbGVuZ3RoO1xyXG5cdFx0XHRcdG5pY2VfbWF0Y2ggPSBjb25maWdfdGFibGVbbGV2ZWxdLm5pY2VfbGVuZ3RoO1xyXG5cdFx0XHRcdG1heF9jaGFpbl9sZW5ndGggPSBjb25maWdfdGFibGVbbGV2ZWxdLm1heF9jaGFpbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdHJhdGVneSA9IF9zdHJhdGVneTtcclxuXHRcdFx0cmV0dXJuIGVycjtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5kZWZsYXRlU2V0RGljdGlvbmFyeSA9IGZ1bmN0aW9uKHN0cm0sIGRpY3Rpb25hcnksIGRpY3RMZW5ndGgpIHtcclxuXHRcdFx0dmFyIGxlbmd0aCA9IGRpY3RMZW5ndGg7XHJcblx0XHRcdHZhciBuLCBpbmRleCA9IDA7XHJcblxyXG5cdFx0XHRpZiAoIWRpY3Rpb25hcnkgfHwgc3RhdHVzICE9IElOSVRfU1RBVEUpXHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cclxuXHRcdFx0aWYgKGxlbmd0aCA8IE1JTl9NQVRDSClcclxuXHRcdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdFx0aWYgKGxlbmd0aCA+IHdfc2l6ZSAtIE1JTl9MT09LQUhFQUQpIHtcclxuXHRcdFx0XHRsZW5ndGggPSB3X3NpemUgLSBNSU5fTE9PS0FIRUFEO1xyXG5cdFx0XHRcdGluZGV4ID0gZGljdExlbmd0aCAtIGxlbmd0aDsgLy8gdXNlIHRoZSB0YWlsIG9mIHRoZSBkaWN0aW9uYXJ5XHJcblx0XHRcdH1cclxuXHRcdFx0d2luZG93LnNldChkaWN0aW9uYXJ5LnN1YmFycmF5KGluZGV4LCBpbmRleCArIGxlbmd0aCksIDApO1xyXG5cclxuXHRcdFx0c3Ryc3RhcnQgPSBsZW5ndGg7XHJcblx0XHRcdGJsb2NrX3N0YXJ0ID0gbGVuZ3RoO1xyXG5cclxuXHRcdFx0Ly8gSW5zZXJ0IGFsbCBzdHJpbmdzIGluIHRoZSBoYXNoIHRhYmxlIChleGNlcHQgZm9yIHRoZSBsYXN0IHR3byBieXRlcykuXHJcblx0XHRcdC8vIHMtPmxvb2thaGVhZCBzdGF5cyBudWxsLCBzbyBzLT5pbnNfaCB3aWxsIGJlIHJlY29tcHV0ZWQgYXQgdGhlIG5leHRcclxuXHRcdFx0Ly8gY2FsbCBvZiBmaWxsX3dpbmRvdy5cclxuXHJcblx0XHRcdGluc19oID0gd2luZG93WzBdICYgMHhmZjtcclxuXHRcdFx0aW5zX2ggPSAoKChpbnNfaCkgPDwgaGFzaF9zaGlmdCkgXiAod2luZG93WzFdICYgMHhmZikpICYgaGFzaF9tYXNrO1xyXG5cclxuXHRcdFx0Zm9yIChuID0gMDsgbiA8PSBsZW5ndGggLSBNSU5fTUFUQ0g7IG4rKykge1xyXG5cdFx0XHRcdGluc19oID0gKCgoaW5zX2gpIDw8IGhhc2hfc2hpZnQpIF4gKHdpbmRvd1sobikgKyAoTUlOX01BVENIIC0gMSldICYgMHhmZikpICYgaGFzaF9tYXNrO1xyXG5cdFx0XHRcdHByZXZbbiAmIHdfbWFza10gPSBoZWFkW2luc19oXTtcclxuXHRcdFx0XHRoZWFkW2luc19oXSA9IG47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuZGVmbGF0ZSA9IGZ1bmN0aW9uKF9zdHJtLCBmbHVzaCkge1xyXG5cdFx0XHR2YXIgaSwgaGVhZGVyLCBsZXZlbF9mbGFncywgb2xkX2ZsdXNoLCBic3RhdGU7XHJcblxyXG5cdFx0XHRpZiAoZmx1c2ggPiBaX0ZJTklTSCB8fCBmbHVzaCA8IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghX3N0cm0ubmV4dF9vdXQgfHwgKCFfc3RybS5uZXh0X2luICYmIF9zdHJtLmF2YWlsX2luICE9PSAwKSB8fCAoc3RhdHVzID09IEZJTklTSF9TVEFURSAmJiBmbHVzaCAhPSBaX0ZJTklTSCkpIHtcclxuXHRcdFx0XHRfc3RybS5tc2cgPSB6X2Vycm1zZ1taX05FRURfRElDVCAtIChaX1NUUkVBTV9FUlJPUildO1xyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoX3N0cm0uYXZhaWxfb3V0ID09PSAwKSB7XHJcblx0XHRcdFx0X3N0cm0ubXNnID0gel9lcnJtc2dbWl9ORUVEX0RJQ1QgLSAoWl9CVUZfRVJST1IpXTtcclxuXHRcdFx0XHRyZXR1cm4gWl9CVUZfRVJST1I7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0cm0gPSBfc3RybTsgLy8ganVzdCBpbiBjYXNlXHJcblx0XHRcdG9sZF9mbHVzaCA9IGxhc3RfZmx1c2g7XHJcblx0XHRcdGxhc3RfZmx1c2ggPSBmbHVzaDtcclxuXHJcblx0XHRcdC8vIFdyaXRlIHRoZSB6bGliIGhlYWRlclxyXG5cdFx0XHRpZiAoc3RhdHVzID09IElOSVRfU1RBVEUpIHtcclxuXHRcdFx0XHRoZWFkZXIgPSAoWl9ERUZMQVRFRCArICgod19iaXRzIC0gOCkgPDwgNCkpIDw8IDg7XHJcblx0XHRcdFx0bGV2ZWxfZmxhZ3MgPSAoKGxldmVsIC0gMSkgJiAweGZmKSA+PiAxO1xyXG5cclxuXHRcdFx0XHRpZiAobGV2ZWxfZmxhZ3MgPiAzKVxyXG5cdFx0XHRcdFx0bGV2ZWxfZmxhZ3MgPSAzO1xyXG5cdFx0XHRcdGhlYWRlciB8PSAobGV2ZWxfZmxhZ3MgPDwgNik7XHJcblx0XHRcdFx0aWYgKHN0cnN0YXJ0ICE9PSAwKVxyXG5cdFx0XHRcdFx0aGVhZGVyIHw9IFBSRVNFVF9ESUNUO1xyXG5cdFx0XHRcdGhlYWRlciArPSAzMSAtIChoZWFkZXIgJSAzMSk7XHJcblxyXG5cdFx0XHRcdHN0YXR1cyA9IEJVU1lfU1RBVEU7XHJcblx0XHRcdFx0cHV0U2hvcnRNU0IoaGVhZGVyKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRmx1c2ggYXMgbXVjaCBwZW5kaW5nIG91dHB1dCBhcyBwb3NzaWJsZVxyXG5cdFx0XHRpZiAodGhhdC5wZW5kaW5nICE9PSAwKSB7XHJcblx0XHRcdFx0c3RybS5mbHVzaF9wZW5kaW5nKCk7XHJcblx0XHRcdFx0aWYgKHN0cm0uYXZhaWxfb3V0ID09PSAwKSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIiBhdmFpbF9vdXQ9PTBcIik7XHJcblx0XHRcdFx0XHQvLyBTaW5jZSBhdmFpbF9vdXQgaXMgMCwgZGVmbGF0ZSB3aWxsIGJlIGNhbGxlZCBhZ2FpbiB3aXRoXHJcblx0XHRcdFx0XHQvLyBtb3JlIG91dHB1dCBzcGFjZSwgYnV0IHBvc3NpYmx5IHdpdGggYm90aCBwZW5kaW5nIGFuZFxyXG5cdFx0XHRcdFx0Ly8gYXZhaWxfaW4gZXF1YWwgdG8gemVyby4gVGhlcmUgd29uJ3QgYmUgYW55dGhpbmcgdG8gZG8sXHJcblx0XHRcdFx0XHQvLyBidXQgdGhpcyBpcyBub3QgYW4gZXJyb3Igc2l0dWF0aW9uIHNvIG1ha2Ugc3VyZSB3ZVxyXG5cdFx0XHRcdFx0Ly8gcmV0dXJuIE9LIGluc3RlYWQgb2YgQlVGX0VSUk9SIGF0IG5leHQgY2FsbCBvZiBkZWZsYXRlOlxyXG5cdFx0XHRcdFx0bGFzdF9mbHVzaCA9IC0xO1xyXG5cdFx0XHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhlcmUgaXMgc29tZXRoaW5nIHRvIGRvIGFuZCBhdm9pZCBkdXBsaWNhdGVcclxuXHRcdFx0XHQvLyBjb25zZWN1dGl2ZVxyXG5cdFx0XHRcdC8vIGZsdXNoZXMuIEZvciByZXBlYXRlZCBhbmQgdXNlbGVzcyBjYWxscyB3aXRoIFpfRklOSVNILCB3ZSBrZWVwXHJcblx0XHRcdFx0Ly8gcmV0dXJuaW5nIFpfU1RSRUFNX0VORCBpbnN0ZWFkIG9mIFpfQlVGRl9FUlJPUi5cclxuXHRcdFx0fSBlbHNlIGlmIChzdHJtLmF2YWlsX2luID09PSAwICYmIGZsdXNoIDw9IG9sZF9mbHVzaCAmJiBmbHVzaCAhPSBaX0ZJTklTSCkge1xyXG5cdFx0XHRcdHN0cm0ubXNnID0gel9lcnJtc2dbWl9ORUVEX0RJQ1QgLSAoWl9CVUZfRVJST1IpXTtcclxuXHRcdFx0XHRyZXR1cm4gWl9CVUZfRVJST1I7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFVzZXIgbXVzdCBub3QgcHJvdmlkZSBtb3JlIGlucHV0IGFmdGVyIHRoZSBmaXJzdCBGSU5JU0g6XHJcblx0XHRcdGlmIChzdGF0dXMgPT0gRklOSVNIX1NUQVRFICYmIHN0cm0uYXZhaWxfaW4gIT09IDApIHtcclxuXHRcdFx0XHRfc3RybS5tc2cgPSB6X2Vycm1zZ1taX05FRURfRElDVCAtIChaX0JVRl9FUlJPUildO1xyXG5cdFx0XHRcdHJldHVybiBaX0JVRl9FUlJPUjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gU3RhcnQgYSBuZXcgYmxvY2sgb3IgY29udGludWUgdGhlIGN1cnJlbnQgb25lLlxyXG5cdFx0XHRpZiAoc3RybS5hdmFpbF9pbiAhPT0gMCB8fCBsb29rYWhlYWQgIT09IDAgfHwgKGZsdXNoICE9IFpfTk9fRkxVU0ggJiYgc3RhdHVzICE9IEZJTklTSF9TVEFURSkpIHtcclxuXHRcdFx0XHRic3RhdGUgPSAtMTtcclxuXHRcdFx0XHRzd2l0Y2ggKGNvbmZpZ190YWJsZVtsZXZlbF0uZnVuYykge1xyXG5cdFx0XHRcdGNhc2UgU1RPUkVEOlxyXG5cdFx0XHRcdFx0YnN0YXRlID0gZGVmbGF0ZV9zdG9yZWQoZmx1c2gpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBGQVNUOlxyXG5cdFx0XHRcdFx0YnN0YXRlID0gZGVmbGF0ZV9mYXN0KGZsdXNoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgU0xPVzpcclxuXHRcdFx0XHRcdGJzdGF0ZSA9IGRlZmxhdGVfc2xvdyhmbHVzaCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGJzdGF0ZSA9PSBGaW5pc2hTdGFydGVkIHx8IGJzdGF0ZSA9PSBGaW5pc2hEb25lKSB7XHJcblx0XHRcdFx0XHRzdGF0dXMgPSBGSU5JU0hfU1RBVEU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChic3RhdGUgPT0gTmVlZE1vcmUgfHwgYnN0YXRlID09IEZpbmlzaFN0YXJ0ZWQpIHtcclxuXHRcdFx0XHRcdGlmIChzdHJtLmF2YWlsX291dCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRsYXN0X2ZsdXNoID0gLTE7IC8vIGF2b2lkIEJVRl9FUlJPUiBuZXh0IGNhbGwsIHNlZSBhYm92ZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIFpfT0s7XHJcblx0XHRcdFx0XHQvLyBJZiBmbHVzaCAhPSBaX05PX0ZMVVNIICYmIGF2YWlsX291dCA9PT0gMCwgdGhlIG5leHQgY2FsbFxyXG5cdFx0XHRcdFx0Ly8gb2YgZGVmbGF0ZSBzaG91bGQgdXNlIHRoZSBzYW1lIGZsdXNoIHBhcmFtZXRlciB0byBtYWtlIHN1cmVcclxuXHRcdFx0XHRcdC8vIHRoYXQgdGhlIGZsdXNoIGlzIGNvbXBsZXRlLiBTbyB3ZSBkb24ndCBoYXZlIHRvIG91dHB1dCBhblxyXG5cdFx0XHRcdFx0Ly8gZW1wdHkgYmxvY2sgaGVyZSwgdGhpcyB3aWxsIGJlIGRvbmUgYXQgbmV4dCBjYWxsLiBUaGlzIGFsc29cclxuXHRcdFx0XHRcdC8vIGVuc3VyZXMgdGhhdCBmb3IgYSB2ZXJ5IHNtYWxsIG91dHB1dCBidWZmZXIsIHdlIGVtaXQgYXQgbW9zdFxyXG5cdFx0XHRcdFx0Ly8gb25lIGVtcHR5IGJsb2NrLlxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGJzdGF0ZSA9PSBCbG9ja0RvbmUpIHtcclxuXHRcdFx0XHRcdGlmIChmbHVzaCA9PSBaX1BBUlRJQUxfRkxVU0gpIHtcclxuXHRcdFx0XHRcdFx0X3RyX2FsaWduKCk7XHJcblx0XHRcdFx0XHR9IGVsc2UgeyAvLyBGVUxMX0ZMVVNIIG9yIFNZTkNfRkxVU0hcclxuXHRcdFx0XHRcdFx0X3RyX3N0b3JlZF9ibG9jaygwLCAwLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRcdC8vIEZvciBhIGZ1bGwgZmx1c2gsIHRoaXMgZW1wdHkgYmxvY2sgd2lsbCBiZSByZWNvZ25pemVkXHJcblx0XHRcdFx0XHRcdC8vIGFzIGEgc3BlY2lhbCBtYXJrZXIgYnkgaW5mbGF0ZV9zeW5jKCkuXHJcblx0XHRcdFx0XHRcdGlmIChmbHVzaCA9PSBaX0ZVTExfRkxVU0gpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBzdGF0ZS5oZWFkW3MuaGFzaF9zaXplLTFdPTA7XHJcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGhhc2hfc2l6ZS8qLTEqLzsgaSsrKVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZm9yZ2V0IGhpc3RvcnlcclxuXHRcdFx0XHRcdFx0XHRcdGhlYWRbaV0gPSAwO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzdHJtLmZsdXNoX3BlbmRpbmcoKTtcclxuXHRcdFx0XHRcdGlmIChzdHJtLmF2YWlsX291dCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRsYXN0X2ZsdXNoID0gLTE7IC8vIGF2b2lkIEJVRl9FUlJPUiBhdCBuZXh0IGNhbGwsIHNlZSBhYm92ZVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChmbHVzaCAhPSBaX0ZJTklTSClcclxuXHRcdFx0XHRyZXR1cm4gWl9PSztcclxuXHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VORDtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvLyBaU3RyZWFtXHJcblxyXG5cdGZ1bmN0aW9uIFpTdHJlYW0oKSB7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHR0aGF0Lm5leHRfaW5faW5kZXggPSAwO1xyXG5cdFx0dGhhdC5uZXh0X291dF9pbmRleCA9IDA7XHJcblx0XHQvLyB0aGF0Lm5leHRfaW47IC8vIG5leHQgaW5wdXQgYnl0ZVxyXG5cdFx0dGhhdC5hdmFpbF9pbiA9IDA7IC8vIG51bWJlciBvZiBieXRlcyBhdmFpbGFibGUgYXQgbmV4dF9pblxyXG5cdFx0dGhhdC50b3RhbF9pbiA9IDA7IC8vIHRvdGFsIG5iIG9mIGlucHV0IGJ5dGVzIHJlYWQgc28gZmFyXHJcblx0XHQvLyB0aGF0Lm5leHRfb3V0OyAvLyBuZXh0IG91dHB1dCBieXRlIHNob3VsZCBiZSBwdXQgdGhlcmVcclxuXHRcdHRoYXQuYXZhaWxfb3V0ID0gMDsgLy8gcmVtYWluaW5nIGZyZWUgc3BhY2UgYXQgbmV4dF9vdXRcclxuXHRcdHRoYXQudG90YWxfb3V0ID0gMDsgLy8gdG90YWwgbmIgb2YgYnl0ZXMgb3V0cHV0IHNvIGZhclxyXG5cdFx0Ly8gdGhhdC5tc2c7XHJcblx0XHQvLyB0aGF0LmRzdGF0ZTtcclxuXHR9XHJcblxyXG5cdFpTdHJlYW0ucHJvdG90eXBlID0ge1xyXG5cdFx0ZGVmbGF0ZUluaXQgOiBmdW5jdGlvbihsZXZlbCwgYml0cykge1xyXG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHRcdHRoYXQuZHN0YXRlID0gbmV3IERlZmxhdGUoKTtcclxuXHRcdFx0aWYgKCFiaXRzKVxyXG5cdFx0XHRcdGJpdHMgPSBNQVhfQklUUztcclxuXHRcdFx0cmV0dXJuIHRoYXQuZHN0YXRlLmRlZmxhdGVJbml0KHRoYXQsIGxldmVsLCBiaXRzKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVmbGF0ZSA6IGZ1bmN0aW9uKGZsdXNoKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0aWYgKCF0aGF0LmRzdGF0ZSkge1xyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhhdC5kc3RhdGUuZGVmbGF0ZSh0aGF0LCBmbHVzaCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlZmxhdGVFbmQgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRpZiAoIXRoYXQuZHN0YXRlKVxyXG5cdFx0XHRcdHJldHVybiBaX1NUUkVBTV9FUlJPUjtcclxuXHRcdFx0dmFyIHJldCA9IHRoYXQuZHN0YXRlLmRlZmxhdGVFbmQoKTtcclxuXHRcdFx0dGhhdC5kc3RhdGUgPSBudWxsO1xyXG5cdFx0XHRyZXR1cm4gcmV0O1xyXG5cdFx0fSxcclxuXHJcblx0XHRkZWZsYXRlUGFyYW1zIDogZnVuY3Rpb24obGV2ZWwsIHN0cmF0ZWd5KSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0aWYgKCF0aGF0LmRzdGF0ZSlcclxuXHRcdFx0XHRyZXR1cm4gWl9TVFJFQU1fRVJST1I7XHJcblx0XHRcdHJldHVybiB0aGF0LmRzdGF0ZS5kZWZsYXRlUGFyYW1zKHRoYXQsIGxldmVsLCBzdHJhdGVneSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlZmxhdGVTZXREaWN0aW9uYXJ5IDogZnVuY3Rpb24oZGljdGlvbmFyeSwgZGljdExlbmd0aCkge1xyXG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHRcdGlmICghdGhhdC5kc3RhdGUpXHJcblx0XHRcdFx0cmV0dXJuIFpfU1RSRUFNX0VSUk9SO1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5kc3RhdGUuZGVmbGF0ZVNldERpY3Rpb25hcnkodGhhdCwgZGljdGlvbmFyeSwgZGljdExlbmd0aCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFJlYWQgYSBuZXcgYnVmZmVyIGZyb20gdGhlIGN1cnJlbnQgaW5wdXQgc3RyZWFtLCB1cGRhdGUgdGhlXHJcblx0XHQvLyB0b3RhbCBudW1iZXIgb2YgYnl0ZXMgcmVhZC4gQWxsIGRlZmxhdGUoKSBpbnB1dCBnb2VzIHRocm91Z2hcclxuXHRcdC8vIHRoaXMgZnVuY3Rpb24gc28gc29tZSBhcHBsaWNhdGlvbnMgbWF5IHdpc2ggdG8gbW9kaWZ5IGl0IHRvIGF2b2lkXHJcblx0XHQvLyBhbGxvY2F0aW5nIGEgbGFyZ2Ugc3RybS0+bmV4dF9pbiBidWZmZXIgYW5kIGNvcHlpbmcgZnJvbSBpdC5cclxuXHRcdC8vIChTZWUgYWxzbyBmbHVzaF9wZW5kaW5nKCkpLlxyXG5cdFx0cmVhZF9idWYgOiBmdW5jdGlvbihidWYsIHN0YXJ0LCBzaXplKSB7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0dmFyIGxlbiA9IHRoYXQuYXZhaWxfaW47XHJcblx0XHRcdGlmIChsZW4gPiBzaXplKVxyXG5cdFx0XHRcdGxlbiA9IHNpemU7XHJcblx0XHRcdGlmIChsZW4gPT09IDApXHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdHRoYXQuYXZhaWxfaW4gLT0gbGVuO1xyXG5cdFx0XHRidWYuc2V0KHRoYXQubmV4dF9pbi5zdWJhcnJheSh0aGF0Lm5leHRfaW5faW5kZXgsIHRoYXQubmV4dF9pbl9pbmRleCArIGxlbiksIHN0YXJ0KTtcclxuXHRcdFx0dGhhdC5uZXh0X2luX2luZGV4ICs9IGxlbjtcclxuXHRcdFx0dGhhdC50b3RhbF9pbiArPSBsZW47XHJcblx0XHRcdHJldHVybiBsZW47XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIEZsdXNoIGFzIG11Y2ggcGVuZGluZyBvdXRwdXQgYXMgcG9zc2libGUuIEFsbCBkZWZsYXRlKCkgb3V0cHV0IGdvZXNcclxuXHRcdC8vIHRocm91Z2ggdGhpcyBmdW5jdGlvbiBzbyBzb21lIGFwcGxpY2F0aW9ucyBtYXkgd2lzaCB0byBtb2RpZnkgaXRcclxuXHRcdC8vIHRvIGF2b2lkIGFsbG9jYXRpbmcgYSBsYXJnZSBzdHJtLT5uZXh0X291dCBidWZmZXIgYW5kIGNvcHlpbmcgaW50byBpdC5cclxuXHRcdC8vIChTZWUgYWxzbyByZWFkX2J1ZigpKS5cclxuXHRcdGZsdXNoX3BlbmRpbmcgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHR2YXIgbGVuID0gdGhhdC5kc3RhdGUucGVuZGluZztcclxuXHJcblx0XHRcdGlmIChsZW4gPiB0aGF0LmF2YWlsX291dClcclxuXHRcdFx0XHRsZW4gPSB0aGF0LmF2YWlsX291dDtcclxuXHRcdFx0aWYgKGxlbiA9PT0gMClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHQvLyBpZiAodGhhdC5kc3RhdGUucGVuZGluZ19idWYubGVuZ3RoIDw9IHRoYXQuZHN0YXRlLnBlbmRpbmdfb3V0IHx8IHRoYXQubmV4dF9vdXQubGVuZ3RoIDw9IHRoYXQubmV4dF9vdXRfaW5kZXhcclxuXHRcdFx0Ly8gfHwgdGhhdC5kc3RhdGUucGVuZGluZ19idWYubGVuZ3RoIDwgKHRoYXQuZHN0YXRlLnBlbmRpbmdfb3V0ICsgbGVuKSB8fCB0aGF0Lm5leHRfb3V0Lmxlbmd0aCA8ICh0aGF0Lm5leHRfb3V0X2luZGV4ICtcclxuXHRcdFx0Ly8gbGVuKSkge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyh0aGF0LmRzdGF0ZS5wZW5kaW5nX2J1Zi5sZW5ndGggKyBcIiwgXCIgKyB0aGF0LmRzdGF0ZS5wZW5kaW5nX291dCArIFwiLCBcIiArIHRoYXQubmV4dF9vdXQubGVuZ3RoICsgXCIsIFwiICtcclxuXHRcdFx0Ly8gdGhhdC5uZXh0X291dF9pbmRleCArIFwiLCBcIiArIGxlbik7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiYXZhaWxfb3V0PVwiICsgdGhhdC5hdmFpbF9vdXQpO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHR0aGF0Lm5leHRfb3V0LnNldCh0aGF0LmRzdGF0ZS5wZW5kaW5nX2J1Zi5zdWJhcnJheSh0aGF0LmRzdGF0ZS5wZW5kaW5nX291dCwgdGhhdC5kc3RhdGUucGVuZGluZ19vdXQgKyBsZW4pLCB0aGF0Lm5leHRfb3V0X2luZGV4KTtcclxuXHJcblx0XHRcdHRoYXQubmV4dF9vdXRfaW5kZXggKz0gbGVuO1xyXG5cdFx0XHR0aGF0LmRzdGF0ZS5wZW5kaW5nX291dCArPSBsZW47XHJcblx0XHRcdHRoYXQudG90YWxfb3V0ICs9IGxlbjtcclxuXHRcdFx0dGhhdC5hdmFpbF9vdXQgLT0gbGVuO1xyXG5cdFx0XHR0aGF0LmRzdGF0ZS5wZW5kaW5nIC09IGxlbjtcclxuXHRcdFx0aWYgKHRoYXQuZHN0YXRlLnBlbmRpbmcgPT09IDApIHtcclxuXHRcdFx0XHR0aGF0LmRzdGF0ZS5wZW5kaW5nX291dCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBEZWZsYXRlclxyXG5cclxuXHRmdW5jdGlvbiBEZWZsYXRlcihsZXZlbCkge1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIHogPSBuZXcgWlN0cmVhbSgpO1xyXG5cdFx0dmFyIGJ1ZnNpemUgPSA1MTI7XHJcblx0XHR2YXIgZmx1c2ggPSBaX05PX0ZMVVNIO1xyXG5cdFx0dmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGJ1ZnNpemUpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgbGV2ZWwgPT0gXCJ1bmRlZmluZWRcIilcclxuXHRcdFx0bGV2ZWwgPSBaX0RFRkFVTFRfQ09NUFJFU1NJT047XHJcblx0XHR6LmRlZmxhdGVJbml0KGxldmVsKTtcclxuXHRcdHoubmV4dF9vdXQgPSBidWY7XHJcblxyXG5cdFx0dGhhdC5hcHBlbmQgPSBmdW5jdGlvbihkYXRhLCBvbnByb2dyZXNzKSB7XHJcblx0XHRcdHZhciBlcnIsIGJ1ZmZlcnMgPSBbXSwgbGFzdEluZGV4ID0gMCwgYnVmZmVySW5kZXggPSAwLCBidWZmZXJTaXplID0gMCwgYXJyYXk7XHJcblx0XHRcdGlmICghZGF0YS5sZW5ndGgpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR6Lm5leHRfaW5faW5kZXggPSAwO1xyXG5cdFx0XHR6Lm5leHRfaW4gPSBkYXRhO1xyXG5cdFx0XHR6LmF2YWlsX2luID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHR6Lm5leHRfb3V0X2luZGV4ID0gMDtcclxuXHRcdFx0XHR6LmF2YWlsX291dCA9IGJ1ZnNpemU7XHJcblx0XHRcdFx0ZXJyID0gei5kZWZsYXRlKGZsdXNoKTtcclxuXHRcdFx0XHRpZiAoZXJyICE9IFpfT0spXHJcblx0XHRcdFx0XHR0aHJvdyBcImRlZmxhdGluZzogXCIgKyB6Lm1zZztcclxuXHRcdFx0XHRpZiAoei5uZXh0X291dF9pbmRleClcclxuXHRcdFx0XHRcdGlmICh6Lm5leHRfb3V0X2luZGV4ID09IGJ1ZnNpemUpXHJcblx0XHRcdFx0XHRcdGJ1ZmZlcnMucHVzaChuZXcgVWludDhBcnJheShidWYpKTtcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0YnVmZmVycy5wdXNoKG5ldyBVaW50OEFycmF5KGJ1Zi5zdWJhcnJheSgwLCB6Lm5leHRfb3V0X2luZGV4KSkpO1xyXG5cdFx0XHRcdGJ1ZmZlclNpemUgKz0gei5uZXh0X291dF9pbmRleDtcclxuXHRcdFx0XHRpZiAob25wcm9ncmVzcyAmJiB6Lm5leHRfaW5faW5kZXggPiAwICYmIHoubmV4dF9pbl9pbmRleCAhPSBsYXN0SW5kZXgpIHtcclxuXHRcdFx0XHRcdG9ucHJvZ3Jlc3Moei5uZXh0X2luX2luZGV4KTtcclxuXHRcdFx0XHRcdGxhc3RJbmRleCA9IHoubmV4dF9pbl9pbmRleDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gd2hpbGUgKHouYXZhaWxfaW4gPiAwIHx8IHouYXZhaWxfb3V0ID09PSAwKTtcclxuXHRcdFx0YXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJTaXplKTtcclxuXHRcdFx0YnVmZmVycy5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rKSB7XHJcblx0XHRcdFx0YXJyYXkuc2V0KGNodW5rLCBidWZmZXJJbmRleCk7XHJcblx0XHRcdFx0YnVmZmVySW5kZXggKz0gY2h1bmsubGVuZ3RoO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIGFycmF5O1xyXG5cdFx0fTtcclxuXHRcdHRoYXQuZmx1c2ggPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGVyciwgYnVmZmVycyA9IFtdLCBidWZmZXJJbmRleCA9IDAsIGJ1ZmZlclNpemUgPSAwLCBhcnJheTtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdHoubmV4dF9vdXRfaW5kZXggPSAwO1xyXG5cdFx0XHRcdHouYXZhaWxfb3V0ID0gYnVmc2l6ZTtcclxuXHRcdFx0XHRlcnIgPSB6LmRlZmxhdGUoWl9GSU5JU0gpO1xyXG5cdFx0XHRcdGlmIChlcnIgIT0gWl9TVFJFQU1fRU5EICYmIGVyciAhPSBaX09LKVxyXG5cdFx0XHRcdFx0dGhyb3cgXCJkZWZsYXRpbmc6IFwiICsgei5tc2c7XHJcblx0XHRcdFx0aWYgKGJ1ZnNpemUgLSB6LmF2YWlsX291dCA+IDApXHJcblx0XHRcdFx0XHRidWZmZXJzLnB1c2gobmV3IFVpbnQ4QXJyYXkoYnVmLnN1YmFycmF5KDAsIHoubmV4dF9vdXRfaW5kZXgpKSk7XHJcblx0XHRcdFx0YnVmZmVyU2l6ZSArPSB6Lm5leHRfb3V0X2luZGV4O1xyXG5cdFx0XHR9IHdoaWxlICh6LmF2YWlsX2luID4gMCB8fCB6LmF2YWlsX291dCA9PT0gMCk7XHJcblx0XHRcdHouZGVmbGF0ZUVuZCgpO1xyXG5cdFx0XHRhcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlclNpemUpO1xyXG5cdFx0XHRidWZmZXJzLmZvckVhY2goZnVuY3Rpb24oY2h1bmspIHtcclxuXHRcdFx0XHRhcnJheS5zZXQoY2h1bmssIGJ1ZmZlckluZGV4KTtcclxuXHRcdFx0XHRidWZmZXJJbmRleCArPSBjaHVuay5sZW5ndGg7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gYXJyYXk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dmFyIGRlZmxhdGVyO1xyXG5cclxuXHRpZiAob2JqLnppcClcclxuXHRcdG9iai56aXAuRGVmbGF0ZXIgPSBEZWZsYXRlcjtcclxuXHRlbHNlIHtcclxuXHRcdGRlZmxhdGVyID0gbmV3IERlZmxhdGVyKCk7XHJcblx0XHRvYmouYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0dmFyIG1lc3NhZ2UgPSBldmVudC5kYXRhO1xyXG5cdFx0XHRpZiAobWVzc2FnZS5pbml0KSB7XHJcblx0XHRcdFx0ZGVmbGF0ZXIgPSBuZXcgRGVmbGF0ZXIobWVzc2FnZS5sZXZlbCk7XHJcblx0XHRcdFx0b2JqLnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0XHRcdG9uaW5pdCA6IHRydWVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAobWVzc2FnZS5hcHBlbmQpXHJcblx0XHRcdFx0b2JqLnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0XHRcdG9uYXBwZW5kIDogdHJ1ZSxcclxuXHRcdFx0XHRcdGRhdGEgOiBkZWZsYXRlci5hcHBlbmQobWVzc2FnZS5kYXRhLCBmdW5jdGlvbihjdXJyZW50KSB7XHJcblx0XHRcdFx0XHRcdG9iai5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdFx0cHJvZ3Jlc3MgOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnQgOiBjdXJyZW50XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0aWYgKG1lc3NhZ2UuZmx1c2gpXHJcblx0XHRcdFx0b2JqLnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0XHRcdG9uZmx1c2ggOiB0cnVlLFxyXG5cdFx0XHRcdFx0ZGF0YSA6IGRlZmxhdGVyLmZsdXNoKClcclxuXHRcdFx0XHR9KTtcclxuXHRcdH0sIGZhbHNlKTtcclxuXHR9XHJcblxyXG59KShzZWxmKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3RyaW5nLXJlcGxhY2Utd2VicGFjay1wbHVnaW4vbG9hZGVyLmpzP2lkPWFuN3FuNGZtMHRrIS4vbm9kZV9tb2R1bGVzL3N0cmluZy1yZXBsYWNlLXdlYnBhY2stcGx1Z2luL2xvYWRlci5qcz9pZD1rM3h3N2N6bWNsIS4vbm9kZV9tb2R1bGVzL3RlcnJpYWpzL2J1aWxkcHJvY2Vzcy9yZW1vdmVDZXNpdW1EZWJ1Z1ByYWdtYXMuanMhLi9ub2RlX21vZHVsZXMvdGVycmlhanMtY2VzaXVtL1NvdXJjZS9UaGlyZFBhcnR5L1dvcmtlcnMvZGVmbGF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBIiwic291cmNlUm9vdCI6IiJ9