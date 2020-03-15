start
    = seq:ObjectSequence { return { objects: seq }; }

ObjectSequence
    = head:Object tail:ObjectSequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:Object { return [base]; }
    
Object
    = Message / Enum

Message
    = _ "message" _ name:variable _ "{" _ properties:PropertySequence _ "}" _ {
        return {
            type: 'message',
            name: name.join(''),
            properties
        };
    }

PropertySequence
    = head:Property tail:PropertySequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:Property { return [base]; }

Property
    = _ isArray:"repeated"? _ type:type _ name:variable _ "=" _ digits _ ";" _ {
        return {
            type,
            name: name.join(''),
            isArray: isArray ? true : false
        };
    }
    / _ "oneof" _ name:variable _ "{" _ options:PropertySequence _ "}" _ {
        return {
            type: 'oneof',
            name: name.join(''),
            options
        }
    }
    / Enum

Enum
    = _ "enum" _ name:variable _ "{" _ values:EnumValueSequence _ "}" _ {
        return {
            type: 'enum',
            name: name.join(''),
            values
        }
    }

EnumValueSequence
    = head:EnumValue tail:EnumValueSequence {
        if (tail) tail.unshift(head); return tail ? tail : [];
    }
    / base:EnumValue { return [base]; }

EnumValue
    = _ name:[A-Z]+ _ "=" _ value:digits _ ";" _ {
        return {
            name: name.join(''),
            value: parseInt(value.join(''), 10)
        }
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
