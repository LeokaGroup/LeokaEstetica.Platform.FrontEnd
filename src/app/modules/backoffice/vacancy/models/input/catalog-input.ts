export class vacancyCatalogInput {
  filters: {
    salary: string, 
    pay: string,
    experience: string,
    employmentsValues: string,
    employments: Array<1 | string>,
  } = { 
    salary: 'Date',
    pay: 'UnknownPay',
    experience: 'UnknownExperience',
    employmentsValues: "1",
    employments: [1]
  };

  lastId: string = "0";

  paginationRows: number = 20;

  searchText: string = '';
}
