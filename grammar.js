/// <reference types="tree-sitter-cli/dsl" />

module.exports = grammar({
  name: "liquid_doc",

  extras: ($) => [],

  rules: {
    document: ($) =>
      repeat(
        choice(
          $.description,
          $.param_tag,
          $.example_tag,
          $._newline,
          $._whitespace,
        ),
      ),

    description: ($) =>
      token(
        seq(
          /[^@\n\s]/,
          /[^\n]*/,
        ),
      ),

    param_tag: ($) =>
      prec.right(seq(
        alias("@param", $.tag_name),
        $._whitespace,
        $.type,
        $._whitespace,
        $.param_name,
        optional(seq($._whitespace, "-", $._whitespace, $.param_description)),
      )),

    type: ($) => token(seq("{", /[^}]+/, "}")),

    param_name: ($) => choice(
      /[a-zA-Z_][a-zA-Z0-9_]*/,
      token(seq("[", /[a-zA-Z_][a-zA-Z0-9_]*/, "]")),
    ),

    param_description: ($) => /[^\n]+/,

    example_tag: ($) =>
      prec.right(
        seq(
          alias("@example", $.tag_name),
          repeat(seq($._newline, optional($.example_content))),
        ),
      ),

    example_content: ($) => /[ \t]+[^\n]+/,

    _newline: ($) => /\n/,

    _whitespace: ($) => /[ \t]+/,
  },
});
