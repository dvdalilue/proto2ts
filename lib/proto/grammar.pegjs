{ let AST = options.ast; }

start
    = seq:ObjectSequence { return new AST.TsProto(seq); }

ObjectSequence
    = head:Object tail:ObjectSequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:Object { return [base]; }
    
Object
    = Message / Enum

Message
    = _ "message" _ name:variable _ "{" _ properties:PropertySequence _ "}" _ {
        return new AST.TsMessage(name.join(''), properties);
    }

PropertySequence
    = head:Property tail:PropertySequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:Property { return [base]; }

Property
    = _ isArray:"repeated"? _ type:type _ name:variable _ "=" _ pos:digits _ ";" _ {
        return new AST.TsProperty(
            type,
            name.join(''),
            parseInt(pos.join('')),
            isArray ? true : false
        );
    }
    / _ "oneof" _ name:variable _ "{" _ options:PropertySequence _ "}" _ {
        return new AST.TsOneOf(name.join(''), options);
    }
    / Enum

Enum
    = _ "enum" _ name:variable _ "{" _ values:EnumValueSequence _ "}" _ {
        return new AST.TsEnum(name.join(''), values);
    }

EnumValueSequence
    = head:EnumValue tail:EnumValueSequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:EnumValue { return [base]; }

EnumValue
    = _ key:[A-Z_]+ _ "=" _ value:digits _ ";" _ {
        return new AST.TsEnumValue(key.join(''), parseInt(value.join(''), 10));
    }

type
    = "double" / "float" / "int32" / "int64" / "uint32" / "uint64"
    / "sint32" / "sint64" / "fixed32" / "fixed64" / "sfixed32" / "sfixed64"
    / "bool" / "string" / "bytes" 

variable
    = [a-zA-Z0-9_]+

digits
    = [0-9]+

_ "whitespace"
    = [ \t\n\r]*
