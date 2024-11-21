"use client";

import { NavBar } from "../components/nav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useEffect } from "react";
import { useState } from "react";

export default function Landing() {
  const [Data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const getList = async () => {
    const response = await fetch("/api/workouts");
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    setData(data);
    setLoading(false);
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      <NavBar />
      <div className="pl-10 pr-10">
        {loading ? (
          <div>Loading...</div>
        ) : Data ? (
          <DataTable data={Data} />
        ) : (
          <div>No workouts available.</div>
        )}
      </div>
    </>
  );
}

interface workout {
  category: string;
  equipment: string;
  force: string;
  id: string;
  images: [string];
  instructions: [string];
  level: string;
  mechanic: string;
  name: string;
  primaryMuscles: [string];
  secondaryMuscles: [string];
  video?: string;
}

interface DataTableProps {
  data: workout[];
}
const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const tableData = Array.isArray(data) ? data : [];
  const columns = [
    {
      accessorKey: "name",
      header: "Exercise Name",
      cell: ({ row }: { row: Row<workout> }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: { row: Row<workout> }) => (
        <div className="capitalize">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }: { row: Row<workout> }) => (
        <div className="capitalize">{row.getValue("level")}</div>
      ),
    },
    {
      accessorKey: "equipment",
      header: "Equipment",
      cell: ({ row }: { row: Row<workout> }) => (
        <div className="capitalize">{row.getValue("equipment")}</div>
      ),
    },
    {
      accessorKey: "primaryMuscles",
      header: "Primary Muscles",
      cell: ({ row }: { row: Row<workout> }) => (
        <div className="capitalize">
          {row.original.primaryMuscles.join(", ")}
        </div>
      ),
    },
    {
      accessorKey: "mechanic",
      header: "Mechanic",
      cell: ({ row }: { row: Row<workout> }) => (
        <div className="capitalize">{row.getValue("mechanic")}</div>
      ),
    },
    {
      accessorKey: "instructions",
      header: "Instructions",
      cell: ({ row }: { row: Row<workout> }) => (
        <div className="max-w-md">
          <Button
            variant="ghost"
            className="h-8 w-full justify-start p-2 text-left text-sm"
            onClick={() => {
              console.log(row.original.instructions);
            }}
          >
            View Instructions
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4 text-slate-300">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {table
          .getAllColumns()
          .filter((column) =>
            [
              "name",
              "category",
              "level",
              "equipment",
              "primaryMuscles",
              "mechanic",
            ].includes(column.id)
          )
          .map((column) => (
            <div key={column.id}>
              <Input
                placeholder={`Filter ${column.id}...`}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(e) => column.setFilterValue(e.target.value)}
                className="max-w-xs"
              />
            </div>
          ))}
      </div>

      <div className="rounded-md border bg-slate-950 bg-opacity-90">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No workouts available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {tableData.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
