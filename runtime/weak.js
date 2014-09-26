// Js_of_ocaml runtime support
// http://www.ocsigen.org/js_of_ocaml/
// Copyright (C) 2010 Jérôme Vouillon
// Laboratoire PPS - CNRS Université Paris Diderot
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, with linking exception;
// either version 2.1 of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.

// Weak API, but without the weak semantics

//Provides: caml_weak_create
function caml_weak_create (n) {
  var x = [];
  x.length = n + 1;
  return x;
}
//Provides: caml_weak_set
function caml_weak_set(x, i, v) { x[i] = v; return 0; }
//Provides: caml_weak_get mutable
function caml_weak_get(x, i) { return (x[i]===undefined)?0:x[i]; }
//Provides: caml_weak_get_copy mutable
//Requires: caml_weak_get
//Requires: caml_obj_dup
function caml_weak_get_copy(x, i) {
  var y = caml_weak_get(x, i);
  if (y === 0) return y;
  var z = y[0];
  if (z instanceof Array) return [0, caml_obj_dup(z)];
  if (ISBLOCK(z)) return BLOCK(TAG(z),caml_obj_dup(z));
  return y;
}
//Provides: caml_weak_check mutable
function caml_weak_check(x, i) {
  return x[i]!==undefined && x[i] !==0;
}
//Provides: caml_weak_blit
//Requires: caml_array_blit
var caml_weak_blit = caml_array_blit;
