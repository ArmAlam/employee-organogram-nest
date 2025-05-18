import dataSource from 'db/data-source';
import { Employee } from 'src/employee/entities/employee.entity';

const seed = async () => {
  await dataSource.initialize();

  const employeeRepository = dataSource.getRepository(Employee);

  await employeeRepository.clear();

  const ceo = employeeRepository.create({
    name: 'John Doe',
    position: 'CTO',
    manager: null,
  });
  await employeeRepository.save(ceo);

  const senior1 = employeeRepository.create({
    name: 'Alice',
    position: 'Senior Engineer',
    manager: ceo,
  });

  const senior2 = employeeRepository.create({
    name: 'Bob',
    position: 'Senior Engineer',
    manager: ceo,
  });

  await employeeRepository.save([senior1, senior2]);

  const engineer1 = employeeRepository.create({
    name: 'Charlie',
    position: 'Engineer',
    manager: senior1,
  });

  const engineer2 = employeeRepository.create({
    name: 'Dave',
    position: 'Engineer',
    manager: senior2,
  });

  await employeeRepository.save([engineer1, engineer2]);

  await dataSource.destroy();
};

seed()
  .then(() => console.log('Seed successful'))
  .catch((error) => {
    console.error('Error seeding database ', error);
  });
