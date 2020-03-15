class TsBase {
    eval(...params) {
        console.log('non implemented eval function');
    }
}

class TsProto extends TsBase {
    constructor(objects) {
        super();
        this.objects = objects;
    }
}

class TsMessage extends TsBase {
    constructor(name, properties) {
        super();
        this.name = name;
        this.properties = properties;
    }
}

class TsProperty extends TsBase {
    constructor(type, name, position, isArray) {
        super();
        this.type = type;
        this.name = name;
        this.position = position;
        this.isArray = isArray;
    }
}

class TsOneOf extends TsBase {
    constructor(name, options) {
        super();
        this.name = name;
        this.options = options;
    }
}

class TsEnum extends TsBase {
    constructor(name, values) {
        super();
        this.name = name;
        this.values = values;
    }
}

class TsEnumValue extends TsBase {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }
}

module.exports = {
    TsProto,
    TsMessage,
    TsProperty,
    TsOneOf,
    TsEnum,
    TsEnumValue
}