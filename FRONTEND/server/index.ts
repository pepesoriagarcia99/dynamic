import express from 'express';
import cors from 'cors';
import { users } from './data.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


interface FilterEvent {
  field: string; // El campo es profundo, por ejemplo: 'address.city'
  value: any;
}

interface SortEvent {
  field: string; // El campo es profundo, por ejemplo: 'address.city'
  order: 'asc' | 'desc';
}

const getDeepValue = (obj: any, path: string): any =>
  path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

const filter = (data: any[]) => (events: FilterEvent[]) => {
  if (!events || events.length === 0) return data;

  return data.filter((item) =>
    events.every(({ field, value }) => {
      const fieldValue = getDeepValue(item, field);
      if (fieldValue == null) return false;

      if (typeof value === 'string') {
        return String(fieldValue).toLowerCase().includes(value.toLowerCase());
      }

      if (typeof value === 'number') {
        return Number(fieldValue) === value;
      }

      return fieldValue === value;
    })
  );
}

const paginate = (data: any[]) => (page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;

  return data.slice(start, end);
}

const sort = (data: any[]) => (events: SortEvent[]) => {
  if (!events || events.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const { field, order } of events) {
      const valA = getDeepValue(a, field);
      const valB = getDeepValue(b, field);

      let comparison = 0;

      if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA ?? '').localeCompare(String(valB ?? ''));
      }

      if (comparison !== 0) {
        return order === 'desc' ? -comparison : comparison;
      }
    }

    return 0;
  });
}

app.get('/api/users', (req, res) => {
  const queryPage = req.query.page;
  const queryLimit = req.query.limit;
  const headerFilter = req.headers['X-Filters'];
  const headerSort = req.headers['X-Sorts'];

  const page = queryPage ? parseInt(queryPage as string) : 1;
  const limit = queryLimit ? parseInt(queryLimit as string) : 100;
  const filterEvents = headerFilter ? JSON.parse(headerFilter as string) : [];
  const sortEvents = headerSort ? JSON.parse(headerSort as string) : [];

  const filteredData = filter(users)(filterEvents);
  const sortedData = sort(filteredData)(sortEvents);
  const paginatedData = paginate(sortedData)(page, limit);


  res.status(200).json({
    count: filteredData.length,
    data: paginatedData,
  }).end();
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});