export interface Offers {
  versions: OfferVersion[];
  id: string;
  href: string;
}

export interface OfferVersion {
  characteristics: Characteristic[];
  productOfferingPrices?: ProductOfferingPrice[];
  name: string;
  id: string;
}

export interface Characteristic {
  versions: CharacteristicVersion[];
  id: string;
}

export interface CharacteristicVersion {
  validFor: ValidFor;
  valueType: ValueType;
  name: string;
  id: string;
  type: Type;
  characteristicValues?: CharacteristicValue[];
  properties?: Property[];
  displayValue?: string;
  value?: string;
  valueTypeSpecification?: ValueTypeSpecification;
}

export interface CharacteristicValue {
  displayValue: DisplayValue;
  isDefault: boolean;
  validFor: ValidFor;
  valueType: ValueType;
  value: string;
}

export enum DisplayValue {
  Active = 'ACTIVE',
  Migrated = 'MIGRATED',
  New = 'NEW',
  Suspended = 'SUSPENDED',
  Terminated = 'TERMINATED',
  The0Meses = '0 Meses',
}

export interface ValidFor {
  startDateTime: Date;
}

export enum ValueType {
  Boolean = 'Boolean',
  CodeTable = 'CodeTable',
  Number = 'Number',
  String = 'String',
}

export interface Property {
  isSelected: boolean;
  value: Value;
}

export enum Value {
  Conf = 'CONF',
  Readonly = 'READONLY',
  SaveToSR = 'SaveToSR',
  TCRMFlag = 'TCRMFlag',
}

export enum Type {
  InfoModelSystemAttribute = 'infoModelSystemAttribute',
  InfoModelUserAttribute = 'infoModelUserAttribute',
  LifeCycle = 'lifeCycle',
  PscmSystemAttribute = 'pscmSystemAttribute',
  PscmUserAttribute = 'pscmUserAttribute',
}

export interface ValueTypeSpecification {
  id: ValueTypeSpecificationID;
}

export enum ValueTypeSpecificationID {
  ClaseImpuesto = 'ClaseImpuesto',
  TipoPrecio = 'TipoPrecio',
}

export interface ProductOfferingPrice {
  versions: ProductOfferingPriceVersion[];
  id: PlaIDEnum;
}

export enum PlaIDEnum {
  CTTecPrecioBaseOTC = 'CT_TecPrecioBaseOTC',
  CTTecPromocionFueraPrecioBaseOT = 'CT_TecPromocionFueraPrecioBaseOT',
  CTTecPromocionPrecioBaseOTCD = 'CT_TecPromocionPrecioBaseOTCD',
  CTTecTaxIVA = 'CT_TecTaxIVA',
}

export interface ProductOfferingPriceVersion {
  characteristics?: Characteristic[];
  markup: number;
  price: Price;
  percentage: number;
  name: Name;
  id: PlaIDEnum;
  plaId: PlaIDEnum;
  popType: PopType;
  frequency: Frequency;
}

export enum Frequency {
  O = 'O',
}

export enum Name {
  DescuentofueroPrecioBaseTecnologia = 'DescuentofueroPrecioBaseTecnologia',
  IVATecnologia = 'IVA Tecnologia',
  PrecioBaseTecnologia = 'PrecioBaseTecnologia',
  PromocionPrecioBaseTecnologia = 'PromocionPrecioBaseTecnologia',
}

export enum PopType {
  Discount = 'Discount',
  ImpuestoIVA = 'ImpuestoIVA',
  PrecioBaseOneTime = 'PrecioBaseOne-Time',
  PrecioVentaOneTime = 'PrecioVentaOne-Time',
}

export interface Price {
  amount: number;
  units: Units;
}

export interface Units {
  code: Code;
  name: Code;
}

export enum Code {
  Cop = 'COP',
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toOffers(json: string): Offers[] {
    return cast(JSON.parse(json), a(r('Offers')));
  }

  public static offersToJson(value: Offers[]): string {
    return JSON.stringify(uncast(value, a(r('Offers'))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Offers: o(
    [
      { json: 'versions', js: 'versions', typ: a(r('OfferVersion')) },
      { json: 'id', js: 'id', typ: '' },
      { json: 'href', js: 'href', typ: '' },
    ],
    false
  ),
  OfferVersion: o(
    [
      {
        json: 'characteristics',
        js: 'characteristics',
        typ: a(r('Characteristic')),
      },
      {
        json: 'productOfferingPrices',
        js: 'productOfferingPrices',
        typ: u(undefined, a(r('ProductOfferingPrice'))),
      },
      { json: 'name', js: 'name', typ: '' },
      { json: 'id', js: 'id', typ: '' },
    ],
    false
  ),
  Characteristic: o(
    [
      { json: 'versions', js: 'versions', typ: a(r('CharacteristicVersion')) },
      { json: 'id', js: 'id', typ: '' },
    ],
    false
  ),
  CharacteristicVersion: o(
    [
      { json: 'validFor', js: 'validFor', typ: r('ValidFor') },
      { json: 'valueType', js: 'valueType', typ: r('ValueType') },
      { json: 'name', js: 'name', typ: '' },
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('Type') },
      {
        json: 'characteristicValues',
        js: 'characteristicValues',
        typ: u(undefined, a(r('CharacteristicValue'))),
      },
      {
        json: 'properties',
        js: 'properties',
        typ: u(undefined, a(r('Property'))),
      },
      { json: 'displayValue', js: 'displayValue', typ: u(undefined, '') },
      { json: 'value', js: 'value', typ: u(undefined, '') },
      {
        json: 'valueTypeSpecification',
        js: 'valueTypeSpecification',
        typ: u(undefined, r('ValueTypeSpecification')),
      },
    ],
    false
  ),
  CharacteristicValue: o(
    [
      { json: 'displayValue', js: 'displayValue', typ: r('DisplayValue') },
      { json: 'isDefault', js: 'isDefault', typ: true },
      { json: 'validFor', js: 'validFor', typ: r('ValidFor') },
      { json: 'valueType', js: 'valueType', typ: r('ValueType') },
      { json: 'value', js: 'value', typ: '' },
    ],
    false
  ),
  ValidFor: o(
    [{ json: 'startDateTime', js: 'startDateTime', typ: Date }],
    false
  ),
  Property: o(
    [
      { json: 'isSelected', js: 'isSelected', typ: true },
      { json: 'value', js: 'value', typ: r('Value') },
    ],
    false
  ),
  ValueTypeSpecification: o(
    [{ json: 'id', js: 'id', typ: r('ValueTypeSpecificationID') }],
    false
  ),
  ProductOfferingPrice: o(
    [
      {
        json: 'versions',
        js: 'versions',
        typ: a(r('ProductOfferingPriceVersion')),
      },
      { json: 'id', js: 'id', typ: r('PlaIDEnum') },
    ],
    false
  ),
  ProductOfferingPriceVersion: o(
    [
      {
        json: 'characteristics',
        js: 'characteristics',
        typ: u(undefined, a(r('Characteristic'))),
      },
      { json: 'markup', js: 'markup', typ: 0 },
      { json: 'price', js: 'price', typ: r('Price') },
      { json: 'percentage', js: 'percentage', typ: 0 },
      { json: 'name', js: 'name', typ: r('Name') },
      { json: 'id', js: 'id', typ: r('PlaIDEnum') },
      { json: 'plaId', js: 'plaId', typ: r('PlaIDEnum') },
      { json: 'popType', js: 'popType', typ: r('PopType') },
      { json: 'frequency', js: 'frequency', typ: r('Frequency') },
    ],
    false
  ),
  Price: o(
    [
      { json: 'amount', js: 'amount', typ: 3.14 },
      { json: 'units', js: 'units', typ: r('Units') },
    ],
    false
  ),
  Units: o(
    [
      { json: 'code', js: 'code', typ: r('Code') },
      { json: 'name', js: 'name', typ: r('Code') },
    ],
    false
  ),
  DisplayValue: [
    'ACTIVE',
    'MIGRATED',
    'NEW',
    'SUSPENDED',
    'TERMINATED',
    '0 Meses',
  ],
  ValueType: ['Boolean', 'CodeTable', 'Number', 'String'],
  Value: ['CONF', 'READONLY', 'SaveToSR', 'TCRMFlag'],
  Type: [
    'infoModelSystemAttribute',
    'infoModelUserAttribute',
    'lifeCycle',
    'pscmSystemAttribute',
    'pscmUserAttribute',
  ],
  ValueTypeSpecificationID: ['ClaseImpuesto', 'TipoPrecio'],
  PlaIDEnum: [
    'CT_TecPrecioBaseOTC',
    'CT_TecPromocionFueraPrecioBaseOT',
    'CT_TecPromocionPrecioBaseOTCD',
    'CT_TecTaxIVA',
  ],
  Frequency: ['O'],
  Name: [
    'DescuentofueroPrecioBaseTecnologia',
    'IVA Tecnologia',
    'PrecioBaseTecnologia',
    'PromocionPrecioBaseTecnologia',
  ],
  PopType: [
    'Discount',
    'ImpuestoIVA',
    'PrecioBaseOne-Time',
    'PrecioVentaOne-Time',
  ],
  Code: ['COP'],
};
