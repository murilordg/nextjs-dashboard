import prisma from './prisma';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue(): Promise<Revenue[]> {
  try {

    const data = await prisma.revenue.findMany();

    return data as Revenue[];

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoice.findMany({
      take: 5,
      orderBy: {
        date: 'desc',
      },
      include: {
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        }
      }
    });

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {

    const invoiceCountPromise = prisma.invoice.count();
    const customerCountPromise = prisma.customer.count();
    const invoiceStatusPromise = prisma.invoice.groupBy({
      by: ['status'],
      _sum: {
        amount: true
      }
    });
    const totalPaidPromise = prisma.invoice.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'paid'
      }
    });
    const totalPendingPromise = prisma.invoice.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'pending'
      }
    });
    const [invoiceCount, customerCount, invoiceStatus, totalPaid, totalPending] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
      totalPaidPromise,
      totalPendingPromise,
    ]);

    const numberOfInvoices = Number(invoiceCount ?? '0');
    const numberOfCustomers = Number(customerCount ?? '0');
    const totalPaidInvoices = formatCurrency(Number(totalPaid._sum.amount ?? '0'));
    const totalPendingInvoices = formatCurrency(Number(totalPending._sum.amount ?? '0'));

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoice.findMany({
      take: ITEMS_PER_PAGE,
      skip: offset,
      orderBy: {
        date: 'desc',
      },
      where: {
        OR: [
          {
            customer: {
              name: { contains: query, mode: 'insensitive' },
            },
          },
          {
            customer: {
              email: { contains: query, mode: 'insensitive' },
            },
          },
          {
            status: { contains: query, mode: 'insensitive' },
          },
        ],
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
    });

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoice.count({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: 'insensitive' } } },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findFirstOrThrow({
      where: { id: id }
    });

    return {
      ...invoice,
      amount: invoice.amount / 100,
    };

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: 'asc', },
    });

    return customers;

  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findFirstOrThrow({
      where: { id: id }
    });

    return customer;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await prisma.$queryRaw<CustomersTableType[]>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
      `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const count = await prisma.customer.count({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}
