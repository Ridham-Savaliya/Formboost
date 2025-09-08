import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here

const columnHelper = createMRTColumnHelper();

const defaultColumns = [
  columnHelper.accessor("id", {
    header: "ID",
    size: 40,
  }),
  columnHelper.accessor("firstName", {
    header: "First Name",
    size: 120,
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
    size: 120,
  }),
  columnHelper.accessor("company", {
    header: "Company",
    size: 300,
  }),
  columnHelper.accessor("city", {
    header: "City",
  }),
  columnHelper.accessor("country", {
    header: "Country",
    size: 220,
  }),
];

const defaultData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    company: "Company A",
    city: "New York",
    country: "USA",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Doe",
    company: "Company B",
    city: "Los Angeles",
    country: "USA",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Doe",
    company: "Company B",
    city: "Los Angeles",
    country: "USA",
  },
  // more data...
];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const CommonTable = ({ columns = defaultColumns, data = defaultData }) => {
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "px",
          padding: "px",
          flexWrap: "wrap",
        }}
      >
        {/* <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >

        </Button> */}
        {/* <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button> */}
        {/* <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button> */}
        {/* <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button> */}
      </Box>
    ),
  });

  // const [title, settitle] = useState("User");

  return (
    <div className="mt-0">
      <MaterialReactTable table={table} />
    </div>
  );
};

7;
export default CommonTable;
