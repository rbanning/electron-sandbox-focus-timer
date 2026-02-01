
export type NewableWithNoParameter<T> = { new(): T };
export type NewableWithObjectParameter<T> = { new(obj?: unknown): T }



//====  SAMPLE =====//

// interface ITest {
//   name: string;
//   age: number;
// }

// class Test implements ITest {
//   name: string;
//   age: number;

//   constructor(obj?: any) {
//     this.name = obj?.name || 'Rob';
//     this.age = obj?.age || 20;
//   }
// }

// const makeX = <T>(ctor: NewableWithNoParameter<T>) => {
//   return new ctor();
// }
// const makeY = <T>(ctor: NewableWithObjectParameter<T>, obj: any) => {
//   return new ctor(obj);
// }

// const x = makeX<ITest>(Test);
// const y = makeY<ITest>(Test, { name: "Gwen", age: 44 });

// console.log("testing test", {x, y});

