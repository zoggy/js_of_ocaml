/***********************************************************************/
/*                                                                     */
/*                           Objective Caml                            */
/*                                                                     */
/*            Xavier Leroy, projet Cristal, INRIA Rocquencourt         */
/*                                                                     */
/*  Copyright 1996 Institut National de Recherche en Informatique et   */
/*  en Automatique.  All rights reserved.  This file is distributed    */
/*  under the terms of the GNU Library General Public License, with    */
/*  the special exception on linking described in file ../LICENSE.     */
/*                                                                     */
/***********************************************************************/

/* $Id: parsing.c 8983 2008-08-06 09:38:25Z xleroy $ */

/* The PDA automaton for parsers generated by camlyacc */

/* The pushdown automata */

//Provides: caml_parse_engine
//Requires: caml_lex_array
function caml_parse_engine(tables, env, cmd, arg)
{
  var ERRCODE = 256;

  //var START = 0;
  //var TOKEN_READ = 1;
  //var STACKS_GROWN_1 = 2;
  //var STACKS_GROWN_2 = 3;
  //var SEMANTIC_ACTION_COMPUTED = 4;
  //var ERROR_DETECTED = 5;
  var loop = 6;
  var testshift = 7;
  var shift = 8;
  var shift_recover = 9;
  var reduce = 10;

  var READ_TOKEN = 0;
  var RAISE_PARSE_ERROR = 1;
  var GROW_STACKS_1 = 2;
  var GROW_STACKS_2 = 3;
  var COMPUTE_SEMANTIC_ACTION = 4;
  var CALL_ERROR_FUNCTION = 5;

  var env_s_stack = 0;
  var env_v_stack = 1;
  var env_symb_start_stack = 2;
  var env_symb_end_stack = 3;
  var env_stacksize = 4;
  var env_stackbase = 5;
  var env_curr_char = 6;
  var env_lval = 7;
  var env_symb_start = 8;
  var env_symb_end = 9;
  var env_asp = 10;
  var env_rule_len = 11;
  var env_rule_number = 12;
  var env_sp = 13;
  var env_state = 14;
  var env_errflag = 15;

  // var _tbl_actions = 0;
  var tbl_transl_const = 1;
  var tbl_transl_block = 2;
  var tbl_lhs = 3;
  var tbl_len = 4;
  var tbl_defred = 5;
  var tbl_dgoto = 6;
  var tbl_sindex = 7;
  var tbl_rindex = 8;
  var tbl_gindex = 9;
  var tbl_tablesize = 10;
  var tbl_table = 11;
  var tbl_check = 12;
  // var _tbl_error_function = 13;
  // var _tbl_names_const = 14;
  // var _tbl_names_block = 15;

  if (!tables.dgoto) {
    tables.defred = caml_lex_array (FIELD(tables,tbl_defred));
    tables.sindex = caml_lex_array (FIELD(tables,tbl_sindex));
    tables.check  = caml_lex_array (FIELD(tables,tbl_check));
    tables.rindex = caml_lex_array (FIELD(tables,tbl_rindex));
    tables.table  = caml_lex_array (FIELD(tables,tbl_table));
    tables.len    = caml_lex_array (FIELD(tables,tbl_len));
    tables.lhs    = caml_lex_array (FIELD(tables,tbl_lhs));
    tables.gindex = caml_lex_array (FIELD(tables,tbl_gindex));
    tables.dgoto  = caml_lex_array (FIELD(tables,tbl_dgoto));
  }

  var res = 0, n, n1, n2, state1;

  // RESTORE
  var sp = FIELD(env,env_sp);
  var state = FIELD(env,env_state);
  var errflag = FIELD(env,env_errflag);

  exit:for (;;) {
    switch(cmd) {
    case 0://START:
      state = 0;
      errflag = 0;
      // Fall through

    case 6://loop:
      n = tables.defred[state];
      if (n != 0) { cmd = reduce; break; }
      if (FIELD(env,env_curr_char) >= 0) { cmd = testshift; break; }
      res = READ_TOKEN;
      break exit;
                                  /* The ML code calls the lexer and updates */
                                  /* symb_start and symb_end */
    case 1://TOKEN_READ:
      if (arg instanceof Array) {
        FIELD(env,env_curr_char) = FIELD(tables,tbl_transl_block)[arg[0]];
        FIELD(env,env_lval) = arg[1];
      } else {
        FIELD(env,env_curr_char) = FIELD(tables,tbl_transl_const)[arg];
        FIELD(env,env_lval) = 0;
      }
      // Fall through

    case 7://testshift:
      n1 = tables.sindex[state];
      n2 = n1 + FIELD(env,env_curr_char);
      if (n1 != 0 && n2 >= 0 && n2 <= FIELD(tables,tbl_tablesize) &&
          tables.check[n2] == FIELD(env,env_curr_char)) {
        cmd = shift; break;
      }
      n1 = tables.rindex[state];
      n2 = n1 + FIELD(env,env_curr_char);
      if (n1 != 0 && n2 >= 0 && n2 <= FIELD(tables,tbl_tablesize) &&
          tables.check[n2] == FIELD(env,env_curr_char)) {
        n = tables.table[n2];
        cmd = reduce; break;
      }
      if (errflag <= 0) {
        res = CALL_ERROR_FUNCTION;
        break exit;
      }
      // Fall through
                                  /* The ML code calls the error function */
    case 5://ERROR_DETECTED:
      if (errflag < 3) {
        errflag = 3;
        for (;;) {
          state1 = FIELD(env,env_s_stack)[sp];
          n1 = tables.sindex[state1];
          n2 = n1 + ERRCODE;
          if (n1 != 0 && n2 >= 0 && n2 <= FIELD(tables,tbl_tablesize) &&
              tables.check[n2] == ERRCODE) {
            cmd = shift_recover; break;
          } else {
            if (sp <= FIELD(env,env_stackbase)) return RAISE_PARSE_ERROR;
                                    /* The ML code raises Parse_error */
            sp--;
          }
        }
      } else {
        if (FIELD(env,env_curr_char) == 0) return RAISE_PARSE_ERROR;
                                    /* The ML code raises Parse_error */
        FIELD(env,env_curr_char) = -1;
        cmd = loop; break;
      }
      // Fall through
    case 8://shift:
      FIELD(env,env_curr_char) = -1;
      if (errflag > 0) errflag--;
      // Fall through
    case 9://shift_recover:
      state = tables.table[n2];
      sp++;
      if (sp >= FIELD(env,env_stacksize)) {
        res = GROW_STACKS_1;
        break exit;
      }
      // Fall through
                                   /* The ML code resizes the stacks */
    case 2://STACKS_GROWN_1:
      FIELD(env,env_s_stack)[sp] = state;
      FIELD(env,env_v_stack)[sp] = FIELD(env,env_lval);
      FIELD(env,env_symb_start_stack)[sp] = FIELD(env,env_symb_start);
      FIELD(env,env_symb_end_stack)[sp] = FIELD(env,env_symb_end);
      cmd = loop;
      break;

    case 10://reduce:
      var m = tables.len[n];
      FIELD(env,env_asp) = sp;
      FIELD(env,env_rule_number) = n;
      FIELD(env,env_rule_len) = m;
      sp = sp - m;
      m = tables.lhs[n];
      state1 = FIELD(env,env_s_stack)[sp];
      n1 = tables.gindex[m];
      n2 = n1 + state1;
      if (n1 != 0 && n2 >= 0 && n2 <= FIELD(tables,tbl_tablesize) &&
          tables.check[n2] == state1)
        state = tables.table[n2];
      else
        state = tables.dgoto[m];
      if (sp >= FIELD(env,env_stacksize)) {
        res = GROW_STACKS_2;
        break exit;
      }
      // Fall through
                                  /* The ML code resizes the stacks */
    case 3://STACKS_GROWN_2:
      res = COMPUTE_SEMANTIC_ACTION;
      break exit;
                                  /* The ML code calls the semantic action */
    case 4://SEMANTIC_ACTION_COMPUTED:
      FIELD(env,env_s_stack)[sp] = state;
      FIELD(env,env_v_stack)[sp] = arg;
      var asp = FIELD(env,env_asp);
      FIELD(env,env_symb_end_stack)[sp] = FIELD(env,env_symb_end_stack)[asp];
      if (sp > asp) {
        /* This is an epsilon production. Take symb_start equal to symb_end. */
        FIELD(env,env_symb_start_stack)[sp] = FIELD(env,env_symb_end_stack)[asp];
      }
      cmd = loop; break;
                                  /* Should not happen */
    default:
      return RAISE_PARSE_ERROR;
    }
  }
  // SAVE
  FIELD(env,env_sp) = sp;
  FIELD(env,env_state) = state;
  FIELD(env,env_errflag) = errflag;
  return res;
}

//Provides: caml_set_parser_trace const
//Dummy function!
function caml_set_parser_trace() { return 0; }
