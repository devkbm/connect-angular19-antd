export class SearchStaff {
  constructor(
    public id: string,
    public name: string = '',
    public deptType: string = '',
    public deptCode: string = '',
    public deptCodeList: string[]
    ) {
      // 설정되지 않은 필드 제거
      /*if (name === undefined)
          delete this.name;            */
  }
}
