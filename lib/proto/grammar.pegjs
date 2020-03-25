{ let AST = options.ast; }

start
    = syntax:Syntax imports:ImportSequence pkg:Package objects:ObjectSequence { return new AST.TsProto(syntax, imports, pkg, objects); }

Syntax
    = _ "syntax" _ "=" _ "'" syntax:variable "'" _ ";" _ { return syntax; }

ImportSequence
    = head:Import tail:ImportSequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:Import { return [base]; }
    / _ { return []; }

Import
    = _ "import" _ '"' imp:(variable / '/' / '.')+ '"' _ ";" _ { return imp; }

Package
    = _ "package" _ pkg:(variable / '.')+ _ ";" { return pkg; }

ObjectSequence
    = head:Object tail:ObjectSequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:Object { return [base]; }
    / _ { return []; }

Object
    = Service / Message / Enum

Service
    = _ "service" _ name:variable _ "{" _ methods:MethodSequence _ "}" {
        return new AST.TsService(name, methods);
    }

MethodSequence
    = head:Method tail:MethodSequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:Method { return [base]; }
    / _ { return []; }

Method
    = _ "rpc" _ name:variable _ "(" _ param:path _ ")" _ "returns" _ "(" res:path ")" _ ";" {
        return new AST.TsMethod(name, param, res);
    }

Message
    = _ "message" _ name:variable _ "{" _ properties:PropertySequence _ "}" _ {
        return new AST.TsMessage(name, properties);
    }

PropertySequence
    = head:Property tail:PropertySequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:Property { return [base]; }
    / _ { return []; }

Property
    = _ isArray:"repeated"? _ type:(type / path) _ name:variable _ "=" _ pos:digits _ ";" _ {
        return new AST.TsProperty(
            type,
            name,
            parseInt(pos.join('')),
            isArray ? true : false
        );
    }
    / _ "oneof" _ name:variable _ "{" _ options:PropertySequence _ "}" _ {
        return new AST.TsOneOf(name, options);
    }
    / Enum

Enum
    = _ "enum" _ name:variable _ "{" _ values:EnumValueSequence _ "}" _ {
        return new AST.TsEnum(name, values);
    }

EnumValueSequence
    = head:EnumValue tail:EnumValueSequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:EnumValue { return [base]; }
    / _ { return []; }

EnumValue
    = _ key:[A-Z_]+ _ "=" _ value:digits _ ";" _ {
        return new AST.TsEnumValue(key.join(''), parseInt(value.join(''), 10));
    }

type
    = "double" / "float" / "int32" / "int64" / "uint32" / "uint64"
    / "sint32" / "sint64" / "fixed32" / "fixed64" / "sfixed32" / "sfixed64"
    / "bool" / "string" / "bytes"

path
    = p:(variable / '.')+ { return new AST.TsPath(p.join('')); }

variable
    = name:[a-zA-Z0-9_]+ { return name.join(''); }

digits
    = [0-9]+

_ "whitespace"
    = (comment / [ \t\n\r])*

comment
    = ('//')+ [ \t\ra-zA-Z0-9_.;~!@#$%&*^()`:.,?/><"'{}\[\]=+-]*
