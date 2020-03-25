var _ = require('lodash');

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
    constructor(syntax, imports, pkg, objects) {
        super();
        this.syntax = syntax;
        this.imports = imports;
        this.pkg = pkg;
        this.objects = objects;
    }

    eval() {
        return [
            `import { Observable } from 'rxjs';\n\n`,
            this.objects.map(obj => obj.eval(0)).join('\n\n')
        ].join('');
    }
}

class TsService extends TsBase {
    constructor(name, methods) {
        super();
        this.name = name;
        this.methods = methods;
    }

    eval(spaces) {
        const indentation = ' '.repeat(spaces);
        const evalMethods =
            this.methods.map((meth) => meth.eval(spaces + 4)).join('\n');
        return [
            `${indentation}export interface I${this.name} {`,
            evalMethods,
            `${indentation}}`
        ].join('\n');
    }
}

class TsMethod extends TsBase {
    constructor(name, param, res) {
        super();
        this.name = _.camelCase(name);
        this.param = param;
        this.res = res;
    }

    eval(spaces) {
        return ' '.repeat(spaces) +
        `${this.name}` +
        `(data: ${this.param}): ` +
        `Observable\<${this.res}\>;`;
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
            `export ${indentation}type ${this.name} = {`,
            evalProperties,
            `${indentation}}`
        ].join('\n');
    }
}

class TsProperty extends TsBase {
    constructor(type, name, position, isArray) {
        super();
        this.type = type;
        this.name = _.camelCase(name);
        this.position = position;
        this.isArray = isArray;
    }

    eval(spaces) {
        return ' '.repeat(spaces) +
        `${this.name}\?\: ` +
        `${typeMapper[this.type] ? typeMapper[this.type] : this.type }` +
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
        const indentation = ' '.repeat(spaces);

        return [
            `export ${indentation}enum ${this.name} {`,
            this.values.map(val => val.eval(spaces + 4)).join('\n'),
            `${indentation}}`
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

class TsPath extends TsBase {
    constructor(path) {
        super();
        this.path = path.substring(path.lastIndexOf('.') + 1);
    }

    toString() {
        return this.eval();
    }

    eval() {
        return `${this.path}`;
    }
}

module.exports = {
    TsProto,
    TsService,
    TsMethod,
    TsMessage,
    TsProperty,
    TsOneOf,
    TsEnum,
    TsEnumValue,
    TsPath
}