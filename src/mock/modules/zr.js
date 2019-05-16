// 获取工程管理数据
export function getPoj () {
  return {
    url: 'zr/getPoj',
    type: 'get',
    data: {
      'massage': 'success',
      'status': 200,
      'data':[{
        reportNum:'1xxxxaas',
        contractName:'11asd4',
        contractPerson:'asdsda',
        contractAmount:'22aasd',
        totalAmount:'333cc',
        manageCost:'22',
        department:'管道科',
        workLoad:'20000',
        beginDateString:'2018-1-8',
        endDateString:'2018-1-8',
        creater:'张三',
        notes:'无'
      },
        {
          reportNum:'1',
          contractName:'11asd4',
          contractPerson:'asd',
          contractAmount:'22',
          totalAmount:'333',
          manageCost:'22',
          workLoad:'200000',
          department:'管道科',
          beginDateString:'2018-1-8',
          endDateString:'2018-1-8',
          creater:'张三',
          notes:'无'
        }
      ]
    }
  }
}
