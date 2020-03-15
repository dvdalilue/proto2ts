const typeMapper = {
    'int32': 'number',
    'string': 'string',
    'bool': 'boolean'
}

class TsBase {
    eval(...params) {
        return 'non implemented eval function';
    }
}

class TsProto extends TsBase {
    constructor(objects) {
        super();
        this.objects = objects;
    }

    eval() {
        return this.objects.map(obj => obj.eval(0)).join('\n');
    }
}

class TsMessage extends TsBase {
    constructor(name, properties) {
        super();
        this.name = name;
        this.properties = properties;
    }

    eval(spaces) {
        const indentation = ' '.repeat(spaces);
        const evalProperties =
            this.properties.map((prop) => prop.eval(spaces + 4)).join('\n');
        return [
            `${indentation}type ${this.name} = {`,
            evalProperties,
            `${indentation}}`
        ].join('\n');
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

    eval(spaces) {
        return ' '.repeat(spaces) +
        `${this.name}\?\: ` +
        `${typeMapper[this.type]}` +
        `${this.isArray ? '[]' : ''};`;
    }
}

class TsOneOf extends TsBase {
    constructor(name, options) {
        super();
        this.name = name;
        this.options = options;
    }

    eval(spaces) {
        const evalOptions =
            this.options.map(opt => opt.eval(spaces)).join('\n');

        const optionNames = '(' +
            this.options.map(opt => `\"${opt.name}\"`).join(' | ') +
            ')';

        return [
            evalOptions,
            ' '.repeat(spaces) + `${this.name}\?\: ` + optionNames + ';'
        ].join('\n');
    }
}

class TsEnum extends TsBase {
    constructor(name, values) {
        super();
        this.name = name;
        this.values = values;
    }

    eval(spaces) {
        return [
            `enum ${this.name} {`,
            this.values.map(val => val.eval(spaces + 4)).join('\n'),
            '}'
        ].join('\n');
    }
}

class TsEnumValue extends TsBase {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }

    eval(spaces) {
        return ' '.repeat(spaces) + `${this.key} = ` + `${this.value},`;
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