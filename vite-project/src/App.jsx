import {
  ArrowLeft,
  Bell,
  BedDouble,
  Building2,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  FileBarChart,
  Home,
  Menu,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Upload,
  Users,
  Wallet,
  X,
  BarChart3,
  Clock3,
} from "lucide-react";

import { useRef, useState } from "react";
import readXlsxFile from "read-excel-file/browser";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newTenantCount, setNewTenantCount] = useState(0);
  const [addTenantOpen, setAddTenantOpen] = useState(false);
  const [bulkUploadMessage, setBulkUploadMessage] = useState("");
  const [bulkUploadError, setBulkUploadError] = useState(false);
  const tenantFileInputRef = useRef(null);
  const [tenantForm, setTenantForm] = useState({
    name: "",
    phone: "",
    unit: "",
    bedrooms: "1",
    building: "",
    buildingLocation: "",
    entryDate: "",
  });
  const [rentPaymentDate, setRentPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [showAllOccupants, setShowAllOccupants] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [selectedOccupant, setSelectedOccupant] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [rentReminders, setRentReminders] = useState(true);

  const stats = [
    {
      title: "Total Occupants",
      value: String(16 + newTenantCount),
      description: "↑ 2 this month",
      icon: Users,
      iconBg: "bg-cyan-400/15",
      iconColor: "text-cyan-300",
      border: "border-cyan-300/20",
      background: "bg-gradient-to-br from-[#123b61] to-[#102a49]",
      descriptionColor: "text-emerald-500",
    },
    {
      title: "Total Rent (Monthly)",
      value: "₦6,410,000",
      description: "↑ 5% from last month",
      icon: Home,
      iconBg: "bg-emerald-400/15",
      iconColor: "text-emerald-300",
      border: "border-emerald-300/20",
      background: "bg-gradient-to-br from-[#123b55] to-[#102a49]",
      descriptionColor: "text-emerald-500",
    },
    {
      title: "Total Units",
      value: "34",
      description: "Across 5 buildings",
      icon: ClipboardList,
      iconBg: "bg-sky-400/15",
      iconColor: "text-sky-300",
      border: "border-sky-300/20",
      background: "bg-gradient-to-br from-[#15395b] to-[#102a49]",
      descriptionColor: "text-sky-300",
    },
    {
      title: "Vacant Rooms",
      value: "4",
      description: "Available for new tenants",
      icon: CalendarDays,
      iconBg: "bg-amber-400/15",
      iconColor: "text-amber-300",
      border: "border-amber-300/20",
      background: "bg-gradient-to-br from-[#3a3a4a] to-[#102a49]",
      descriptionColor: "text-amber-300",
    },
  ];

  const activities = [
    {
      icon: Wallet,
      title: "Rent payment received",
      description: "Amina Ibrahim - Block C - ₦30,000",
      time: "2 hours ago",
      color: "bg-emerald-500",
    },
    {
      icon: Users,
      title: "New occupant added",
      description: "Chukwu Happiness - Block B - Room 12",
      time: "5 hours ago",
      color: "bg-blue-500",
    },
    {
      icon: CalendarDays,
      title: "Vacant room updated",
      description: "Room 8 - Block A",
      time: "1 day ago",
      color: "bg-orange-500",
    },
    {
      icon: Building2,
      title: "New building added",
      description: "Green Villa",
      time: "2 days ago",
      color: "bg-purple-500",
    },
  ];

  const [occupants, setOccupants] = useState([
    {
      number: 1,
      initials: "AO",
      name: "Adekunle Oladipo",
      unit: "1 Room",
      bedrooms: 1,
      building: "Block A - Green Villa",
      entry: "Jan 2025",
      balance: "₦0.00",
      status: "Paid",
      lastPaidDate: null,
      rentExpiryDate: null,
      avatar: "bg-indigo-400",
    },
    {
      number: 2,
      initials: "MO",
      name: "Mariam Olabisi",
      unit: "2 Rooms",
      bedrooms: 2,
      building: "Block A - Green Villa",
      entry: "Dec 2024",
      balance: "₦0.00",
      status: "Paid",
      lastPaidDate: null,
      rentExpiryDate: null,
      avatar: "bg-purple-500",
    },
    {
      number: 3,
      initials: "EC",
      name: "Emeka John Chinedu",
      unit: "1 Room",
      bedrooms: 1,
      building: "Block B - Sunshine Court",
      entry: "Feb 2025",
      balance: "₦50,000",
      status: "Partial",
      lastPaidDate: null,
      rentExpiryDate: null,
      avatar: "bg-orange-400",
    },
    {
      number: 4,
      initials: "UC",
      name: "Uche Faith Okafor",
      unit: "2 Rooms",
      bedrooms: 2,
      building: "Block C - Palm View",
      entry: "Jun 2025",
      balance: "₦0.00",
      status: "Paid",
      lastPaidDate: null,
      rentExpiryDate: null,
      avatar: "bg-cyan-500",
    },
  ]);

  const filteredOccupants = occupants.filter((occupant) =>
    `${occupant.name} ${occupant.unit} ${occupant.building} ${occupant.buildingLocation || ""} ${occupant.status}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );
  const visibleOccupants = filteredOccupants.slice(
    0,
    showAllOccupants ? filteredOccupants.length : 3
  );
  const visibleActivities = activities.slice(
    0,
    showAllActivities ? activities.length : 3
  );
  const chartLabels = selectedMonth === "This Month"
    ? ["Sep 1", "Sep 5", "Sep 10", "Sep 15", "Sep 20", "Sep 25", "Sep 30"]
    : selectedMonth === "Last Month"
      ? ["Aug 1", "Aug 5", "Aug 10", "Aug 15", "Aug 20", "Aug 25", "Aug 31"]
      : ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"];

  const handleNavigation = (label) => {
    setActiveNav(label);
    setSidebarOpen(false);

    if (label === "Settings") {
      setSettingsOpen(true);
      return;
    }

    const targetIds = {
      "Occupant & Rent Ledger": "occupants",
      Buildings: "buildings",
      Reports: "rent-report",
    };
    const target = targetIds[label];

    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddTenant = (event) => {
    event.preventDefault();

    const nextNumber = occupants.reduce(
      (highestNumber, occupant) => Math.max(highestNumber, occupant.number),
      0
    ) + 1;
    const entryDate = new Date(`${tenantForm.entryDate}T00:00:00`);
    const initials = tenantForm.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const avatarColors = ["bg-indigo-400", "bg-purple-500", "bg-orange-400", "bg-cyan-500"];

    setOccupants((currentOccupants) => [
      {
        number: nextNumber,
        initials,
        name: tenantForm.name.trim(),
        phone: tenantForm.phone.trim(),
        unit: tenantForm.unit.trim(),
        bedrooms: tenantForm.bedrooms ? Number(tenantForm.bedrooms) : null,
        building: tenantForm.building.trim(),
        buildingLocation: tenantForm.buildingLocation.trim(),
        entry: entryDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        balance: "₦0.00",
        status: "Pending",
        lastPaidDate: null,
        rentExpiryDate: null,
        avatar: avatarColors[(nextNumber - 1) % avatarColors.length],
      },
      ...currentOccupants,
    ]);
    setNewTenantCount((count) => count + 1);
    setShowAllOccupants(true);
    setSearchQuery("");
    setTenantForm({ name: "", phone: "", unit: "", bedrooms: "1", building: "", buildingLocation: "", entryDate: "" });
    setAddTenantOpen(false);
  };

  const handleBulkTenantUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBulkUploadMessage("");
    setBulkUploadError(false);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!["csv", "xlsx"].includes(extension)) {
        throw new Error("Choose a CSV or XLSX spreadsheet.");
      }

      let spreadsheetRows;
      if (extension === "csv") {
        const text = await file.text();
        spreadsheetRows = [];
        let row = [];
        let field = "";
        let insideQuotes = false;

        for (let index = 0; index < text.length; index += 1) {
          const character = text[index];
          if (insideQuotes) {
            if (character === '"' && text[index + 1] === '"') {
              field += '"';
              index += 1;
            } else if (character === '"') {
              insideQuotes = false;
            } else {
              field += character;
            }
          } else if (character === '"' && field.length === 0) {
            insideQuotes = true;
          } else if (character === ",") {
            row.push(field);
            field = "";
          } else if (character === "\n" || character === "\r") {
            if (character === "\r" && text[index + 1] === "\n") index += 1;
            row.push(field);
            spreadsheetRows.push(row);
            row = [];
            field = "";
          } else {
            field += character;
          }
        }

        if (insideQuotes) throw new Error("The CSV file contains an unclosed quoted value.");
        if (field.length > 0 || row.length > 0) {
          row.push(field);
          spreadsheetRows.push(row);
        }
      } else {
        const sheets = await readXlsxFile(file);
        spreadsheetRows = sheets[0]?.data ?? [];
      }

      if (spreadsheetRows.length < 2) throw new Error("The spreadsheet has no tenant rows.");
      const [headers, ...dataRows] = spreadsheetRows;
      const rows = dataRows.map((values) =>
        Object.fromEntries(
          headers.map((header, index) => [String(header ?? ""), values[index] ?? ""])
        )
      );

      const aliases = {
        name: ["name", "tenantname", "fullname"],
        phone: ["phone", "phonenumber", "mobile", "mobilenumber"],
        unit: ["unit", "room", "unitroom"],
        bedrooms: ["bedrooms", "bedroomcount", "numberofbedrooms"],
        building: ["building", "property", "propertybuilding"],
        entryDate: ["entrydate", "moveindate", "datejoined", "startdate"],
      };
      const normalizeHeader = (header) => String(header).toLowerCase().replace(/[^a-z0-9]/g, "");
      const columns = Object.keys(rows[0]).reduce((matched, header) => {
        const normalized = normalizeHeader(header);
        Object.entries(aliases).forEach(([field, acceptedHeaders]) => {
          if (acceptedHeaders.includes(normalized)) matched[field] = header;
        });
        return matched;
      }, {});
      const requiredFields = ["name", "unit", "building", "entryDate"];
      const missingFields = requiredFields.filter((field) => !columns[field]);
      if (missingFields.length > 0) {
        throw new Error(
          `Missing required column${missingFields.length > 1 ? "s" : ""}: ${missingFields.join(", ")}.`
        );
      }

      const parseEntryDate = (value) => {
        if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
        if (typeof value === "number") {
          const excelSerial = value >= 60 ? value - 1 : value;
          const parsed = new Date(Date.UTC(1899, 11, 31) + excelSerial * 86400000);
          if (!Number.isNaN(parsed.getTime())) {
            return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
          }
        }
        if (typeof value === "string" && /^\d{4}-\d{1,2}-\d{1,2}$/.test(value.trim())) {
          const [year, month, day] = value.trim().split("-").map(Number);
          const parsed = new Date(year, month - 1, day);
          if (
            parsed.getFullYear() === year &&
            parsed.getMonth() === month - 1 &&
            parsed.getDate() === day
          ) {
            return parsed;
          }
          return null;
        }
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      };

      const tenantRows = rows.filter((row) =>
        Object.values(row).some((value) => String(value).trim() !== "")
      );
      const rowErrors = [];
      const importedTenants = tenantRows.map((row, index) => {
        const name = String(row[columns.name] ?? "").trim();
        const unit = String(row[columns.unit] ?? "").trim();
        const building = String(row[columns.building] ?? "").trim();
        const entryDate = parseEntryDate(row[columns.entryDate]);
        const rowNumber = index + 2;
        const missing = [
          !name && "tenant name",
          !unit && "unit / room",
          !building && "building",
          !entryDate && "valid move-in date",
        ].filter(Boolean);

        if (missing.length > 0) {
          rowErrors.push(`Row ${rowNumber}: missing or invalid ${missing.join(", ")}`);
          return null;
        }

        return {
          name,
          phone: columns.phone ? String(row[columns.phone] ?? "").trim() : "",
          unit,
          bedrooms: columns.bedrooms &&
            /^\d+$/.test(String(row[columns.bedrooms]).trim()) &&
            Number(row[columns.bedrooms]) > 0
            ? Number(row[columns.bedrooms])
            : null,
          building,
          entry: entryDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          balance: "₦0.00",
          status: "Pending",
          lastPaidDate: null,
          rentExpiryDate: null,
        };
      });

      if (tenantRows.length === 0) throw new Error("The spreadsheet has no tenant rows.");
      if (rowErrors.length > 0) {
        const details = rowErrors.slice(0, 3).join("; ");
        const additionalRows = rowErrors.length > 3 ? `; and ${rowErrors.length - 3} more` : "";
        throw new Error(`${rowErrors.length} row${rowErrors.length > 1 ? "s" : ""} need attention: ${details}${additionalRows}.`);
      }

      setOccupants((currentOccupants) => {
        const firstNumber = currentOccupants.reduce(
          (highestNumber, occupant) => Math.max(highestNumber, occupant.number),
          0
        ) + 1;
        const avatarColors = ["bg-indigo-400", "bg-purple-500", "bg-orange-400", "bg-cyan-500"];
        const additions = importedTenants.map((tenant, index) => ({
          ...tenant,
          number: firstNumber + index,
          initials: tenant.name
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase(),
          avatar: avatarColors[(firstNumber + index - 1) % avatarColors.length],
        }));
        return [...additions, ...currentOccupants];
      });
      setNewTenantCount((count) => count + importedTenants.length);
      setShowAllOccupants(true);
      setSearchQuery("");
      setBulkUploadMessage(`Added ${importedTenants.length} tenant${importedTenants.length === 1 ? "" : "s"} from ${file.name}.`);
    } catch (error) {
      setBulkUploadError(true);
      setBulkUploadMessage(error instanceof Error ? error.message : "Unable to read this spreadsheet.");
    } finally {
      event.target.value = "";
    }
  };

  const openOccupantDetails = (occupant) => {
    setSelectedOccupant(occupant);
    setRentPaymentDate(occupant.lastPaidDate || new Date().toISOString().slice(0, 10));
  };

  const handleRecordRentPayment = (event) => {
    event.preventDefault();
    const paidOn = new Date(`${rentPaymentDate}T00:00:00`);
    if (Number.isNaN(paidOn.getTime())) return;

    const expiry = new Date(paidOn);
    expiry.setFullYear(expiry.getFullYear() + 1);
    const updatedOccupant = {
      ...selectedOccupant,
      lastPaidDate: rentPaymentDate,
      rentExpiryDate: [
        expiry.getFullYear(),
        String(expiry.getMonth() + 1).padStart(2, "0"),
        String(expiry.getDate()).padStart(2, "0"),
      ].join("-"),
      balance: "₦0.00",
      status: "Paid",
    };

    setOccupants((currentOccupants) =>
      currentOccupants.map((occupant) =>
        occupant.number === updatedOccupant.number ? updatedOccupant : occupant
      )
    );
    setSelectedOccupant(updatedOccupant);
  };

  if (selectedOccupant) {
    const lastPaidDate = selectedOccupant.lastPaidDate
      ? new Date(`${selectedOccupant.lastPaidDate}T00:00:00`)
      : null;
    const rentExpiryDate = selectedOccupant.rentExpiryDate
      ? new Date(`${selectedOccupant.rentExpiryDate}T00:00:00`)
      : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysRemaining = rentExpiryDate
      ? Math.ceil((rentExpiryDate.getTime() - today.getTime()) / 86400000)
      : null;
    const rentProgress = lastPaidDate && rentExpiryDate
      ? Math.min(
          100,
          Math.max(
            0,
            ((today.getTime() - lastPaidDate.getTime()) /
              (rentExpiryDate.getTime() - lastPaidDate.getTime())) *
              100
          )
        )
      : 0;
    const formatFullDate = (date) =>
      date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    return (
      <main className="min-h-screen bg-[#071b36] px-4 py-6 text-[#e7f0ff] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[#355778] px-3 py-2 text-sm font-semibold text-[#d7e5f5] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            onClick={() => setSelectedOccupant(null)}
          >
            <ArrowLeft size={17} />
            Back to tenants
          </button>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white ${selectedOccupant.avatar}`}>
              {selectedOccupant.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-cyan-200">Tenant profile</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{selectedOccupant.name}</h1>
              <p className="mt-1 text-sm text-[#a9bdd8]">{selectedOccupant.building}</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${selectedOccupant.status === "Paid" ? "bg-emerald-400/15 text-emerald-300" : "bg-orange-400/15 text-orange-300"}`}>
              {selectedOccupant.status}
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr]">
            <section className="rounded-2xl border border-[#294867] bg-[#102a49] p-5 sm:p-6">
              <h2 className="text-lg font-bold">Tenant details</h2>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
                <div>
                  <dt className="text-[#a9bdd8]">Room / unit</dt>
                  <dd className="mt-1 font-semibold">{selectedOccupant.unit}</dd>
                </div>
                <div>
                  <dt className="text-[#a9bdd8]">Bedrooms</dt>
                  <dd className="mt-1 inline-flex items-center gap-1.5 font-semibold">
                    <BedDouble size={16} className="text-cyan-200" />
                    {selectedOccupant.bedrooms
                      ? `${selectedOccupant.bedrooms} bedroom${selectedOccupant.bedrooms === 1 ? "" : "s"}`
                      : "Not recorded"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#a9bdd8]">Building</dt>
                  <dd className="mt-1 font-semibold">{selectedOccupant.building}</dd>
                </div>
                <div>
                  <dt className="text-[#a9bdd8]">Move-in date</dt>
                  <dd className="mt-1 font-semibold">{selectedOccupant.entry}</dd>
                </div>
                {selectedOccupant.buildingLocation && (
                  <div className="col-span-2">
                    <dt className="text-[#a9bdd8]">Building address</dt>
                    <dd className="mt-1 font-semibold">{selectedOccupant.buildingLocation}</dd>
                  </div>
                )}
                {selectedOccupant.phone && (
                  <div className="col-span-2">
                    <dt className="text-[#a9bdd8]">Phone number</dt>
                    <dd className="mt-1 font-semibold">{selectedOccupant.phone}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[#a9bdd8]">Balance</dt>
                  <dd className="mt-1 font-semibold">{selectedOccupant.balance}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-[#294867] bg-[#102a49] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <CalendarClock size={20} className="text-cyan-200" />
                <h2 className="text-lg font-bold">Rent payment tracker</h2>
              </div>

              {lastPaidDate && rentExpiryDate ? (
                <div className="mt-5 rounded-xl border border-[#355778] bg-[#0b2340] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#a9bdd8]">Last rent payment</p>
                      <p className="mt-1 inline-flex items-center gap-2 font-semibold">
                        <CalendarCheck2 size={17} className="text-emerald-300" />
                        {formatFullDate(lastPaidDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#a9bdd8]">Rent expires</p>
                      <p className="mt-1 font-semibold">{formatFullDate(rentExpiryDate)}</p>
                    </div>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#294867]" aria-label={`Rent term ${Math.round(rentProgress)}% elapsed`}>
                    <div className={`h-full rounded-full ${daysRemaining < 0 ? "bg-rose-400" : daysRemaining <= 30 ? "bg-amber-300" : "bg-cyan-300"}`} style={{ width: `${rentProgress}%` }} />
                  </div>
                  <p className={`mt-2 text-right text-xs font-medium ${daysRemaining < 0 ? "text-rose-300" : daysRemaining <= 30 ? "text-amber-200" : "text-[#a9bdd8]"}`}>
                    {daysRemaining < 0
                      ? `Expired ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) === 1 ? "" : "s"} ago`
                      : daysRemaining === 0
                        ? "Expires today"
                        : `${daysRemaining} days remaining`}
                  </p>
                </div>
              ) : (
                <p className="mt-5 rounded-xl border border-dashed border-[#426382] bg-[#0b2340] p-4 text-sm leading-6 text-[#b6c9df]">
                  No rent payment date has been recorded yet. Record a payment below to start the 12-month expiry tracker.
                </p>
              )}

              <form className="mt-5 border-t border-[#294867] pt-5" onSubmit={handleRecordRentPayment}>
                <label className="block text-sm font-medium" htmlFor="rent-payment-date">
                  Payment date
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="rent-payment-date"
                    required
                    type="date"
                    value={rentPaymentDate}
                    onChange={(event) => setRentPaymentDate(event.target.value)}
                    className="h-11 min-w-0 flex-1 rounded-lg border border-[#355778] bg-[#0b2340] px-3 text-sm text-white outline-none focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  >
                    <CalendarCheck2 size={16} />
                    Record payment
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#8fa8c5]">
                  Recording a payment marks the rent as paid and sets expiry 12 months after this date.
                </p>
              </form>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#071b36] text-[#e7f0ff]">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-70.5
          flex-col bg-[#071b36] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* Logo */}
        <div className="flex h-22.5 items-center border-b border-white/10 px-6">

          <div className="mr-4 flex h-12 w-12 items-center justify-center">
            <Home
              size={47}
              strokeWidth={1.8}
              className="text-blue-500"
            />
          </div>

          <div>
            <h1 className="text-[18px] font-bold">
              Housing Manager
            </h1>

            <p className="mt-1 text-[13px] text-blue-300">
              Manage • Track • Grow
            </p>
          </div>

          <button
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">

          <SidebarItem
            icon={Home}
            text="Dashboard"
            active={activeNav === "Dashboard"}
            onClick={() => handleNavigation("Dashboard")}
          />

          <SidebarItem
            icon={Users}
            text="Occupant & Rent Ledger"
            active={activeNav === "Occupant & Rent Ledger"}
            onClick={() => handleNavigation("Occupant & Rent Ledger")}
          />

          <SidebarItem
            icon={Building2}
            text="Buildings"
            active={activeNav === "Buildings"}
            onClick={() => handleNavigation("Buildings")}
          />

          <SidebarItem
            icon={FileBarChart}
            text="Reports"
            active={activeNav === "Reports"}
            onClick={() => handleNavigation("Reports")}
          />

          <SidebarItem
            icon={Settings}
            text="Settings"
            active={activeNav === "Settings"}
            onClick={() => handleNavigation("Settings")}
          />

        </nav>

        {/* Bottom User */}
        <div className="border-t border-white/10 p-5">

          <div className="flex items-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-200">
              <CircleUserRound size={30} />
            </div>

            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold">
                Admin
              </p>

              <p className="text-xs text-blue-300">
                Housing Manager
              </p>
            </div>

            <ChevronRight
              size={21}
              className="text-blue-200"
            />

          </div>

        </div>
      </aside>

      {/* MAIN */}
      <main className="lg:ml-70.5">

        {/* TOP NAVBAR */}
        <header className="flex h-17 items-center justify-between gap-3 border-b border-[#294867] bg-[#0d2748] px-3 sm:px-5 lg:px-6">

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">

            <button
              className="shrink-0 rounded-lg p-1.5 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={24} />
            </button>

            {/* Search */}
            <div className="relative min-w-0 w-full max-w-97.5">

              <Search
                size={21}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300"
              />

              <input
                type="text"
                placeholder="Search occupants, buildings, or units..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search occupants, buildings, or units"
                className="
                  h-9.5 w-full rounded-lg
                  border border-[#355778]
                  bg-[#102a49] pl-10 pr-4
                  text-xs text-[#e7f0ff] sm:text-sm
                  outline-none
                  placeholder:text-[#9cb5d2]
                  focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20
                "
              />

            </div>
          </div>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-5">

            <div className="relative">
              <button
                type="button"
                className="relative rounded-lg p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
                onClick={() => setNotificationsOpen((open) => !open)}
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={21} className="text-cyan-200" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[#355778] bg-[#102a49] p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold">Notifications</h2>
                    <button className="rounded p-1 hover:bg-white/10" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications">
                      <X size={16} />
                    </button>
                  </div>
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.title} className="border-t border-[#294867] py-2 first:border-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-[#a9bdd8]">{activity.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-[#355778]" />

            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label="Open account menu"
                aria-expanded={profileOpen}
              >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/15">
                <CircleUserRound
                  size={25}
                  className="text-cyan-200"
                />
              </div>

              <span className="hidden text-sm font-medium text-[#e7f0ff] sm:block">
                Admin
              </span>

              <ChevronDown
                size={16}
                className="text-[#c7d8ec]"
              />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-[#355778] bg-[#102a49] p-2 shadow-xl">
                  <p className="px-3 py-2 text-sm font-semibold">Admin</p>
                  <button
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                    onClick={() => { setProfileOpen(false); handleNavigation("Settings"); }}
                  >
                    Account settings
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <div className="p-5 lg:p-6">

          {/* HERO */}
          <section
            className="
              relative mb-4 min-h-43.75
              overflow-hidden rounded-xl
              bg-linear-to-r from-[#123d64] via-[#123656]
              to-[#16405a]
            "
          >

            {/* Building image effect */}
            <div
              className="
                absolute right-0 top-0
                h-full w-[55%]
                bg-linear-to-l from-cyan-300/20 via-sky-300/10 to-transparent
                opacity-90
              "
            />

            {/* White gradient over image */}
            <div
              className="
                absolute inset-0
                bg-linear-to-r
                from-[#123d64] via-[#123d64]/75
                to-transparent
              "
            />

            <div className="relative z-10 px-5 py-8 lg:px-5">

              <p className="text-[15px] font-semibold text-cyan-200">
                Good morning, Admin 👋
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white lg:text-[34px]">
                Welcome to Housing Manager
              </h1>

              <p className="mt-2 max-w-137.5 text-[15px] leading-6 text-[#c1d2e7]">
                Easily manage your buildings, occupants,
                rents and track payments all in one place.
              </p>

            </div>
          </section>

          {/* STATS */}
          <section id="buildings" className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className={`
                    min-h-40.5 rounded-xl border
                    ${stat.border}
                    ${stat.background}
                    p-5
                  `}
                >

                  <div
                    className={`
                      mb-3 flex h-11 w-11
                      items-center justify-center
                      rounded-full
                      ${stat.iconBg}
                    `}
                  >
                    <Icon
                      size={23}
                      className={stat.iconColor}
                    />
                  </div>

                  <p className="text-sm font-semibold text-[#d7e5f5]">
                    {stat.title}
                  </p>

                  <h2 className="mt-1 text-[27px] font-bold text-white">
                    {stat.value}
                  </h2>

                  <p
                    className={`
                      mt-1 text-xs font-medium
                      ${stat.descriptionColor}
                    `}
                  >
                    {stat.description}
                  </p>

                </div>
              );
            })}

          </section>

          {/* CHART + ACTIVITY */}
          <section className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_0.9fr]">

            {/* RENT COLLECTION */}
            <div id="rent-report" className="scroll-mt-5 rounded-xl border border-[#294867] bg-[#102a49] p-4 shadow-sm sm:p-5">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/15">
                    <BarChart3
                      size={18}
                      className="text-cyan-200"
                    />
                  </div>

                  <h2 className="text-[16px] font-bold">
                    Rent Collection Overview
                  </h2>

                </div>

                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg border border-[#355778] px-3 py-1.5 text-xs font-medium text-[#d7e5f5] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
                    onClick={() => setMonthMenuOpen((open) => !open)}
                    aria-expanded={monthMenuOpen}
                  >
                    {selectedMonth}
                    <ChevronDown size={14} />
                  </button>
                  {monthMenuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-[#355778] bg-[#102a49] p-1 shadow-lg">
                      {["This Month", "Last Month", "This Year"].map((period) => (
                        <button
                          key={period}
                          className={`w-full rounded-md px-3 py-2 text-left text-xs hover:bg-white/10 ${selectedMonth === period ? "font-semibold text-cyan-200" : "text-[#c1d2e7]"}`}
                          onClick={() => { setSelectedMonth(period); setMonthMenuOpen(false); }}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <div className="flex flex-col gap-6 md:flex-row">

                {/* Chart */}
                <div className="relative h-47.5 flex-1">

                  {/* Grid */}
                  <div className="absolute inset-0 flex flex-col justify-between">

                    {["₦8M", "₦6M", "₦4M", "₦2M", "₦0"].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center"
                        >
                          <span className="w-10 text-[10px] text-[#a9bdd8]">
                            {item}
                          </span>

                          <div className="h-px flex-1 bg-[#294867]" />
                        </div>
                      )
                    )}

                  </div>

                  {/* SVG Chart */}
                  <svg
                    viewBox="0 0 500 190"
                    className="absolute left-10 right-0 top-0 h-full w-[calc(100%-40px)] overflow-visible"
                    preserveAspectRatio="none"
                  >

                    <defs>
                      <linearGradient
                        id="chartFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#1477f8"
                          stopOpacity="0.18"
                        />

                        <stop
                          offset="100%"
                          stopColor="#1477f8"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="
                        M 0 145
                        C 35 140, 45 132, 75 137
                        C 105 142, 110 118, 145 127
                        C 180 136, 180 91, 220 105
                        C 250 115, 260 96, 290 89
                        C 315 83, 330 99, 355 85
                        C 380 72, 410 88, 435 60
                        C 455 48, 470 52, 500 48
                        L 500 190
                        L 0 190 Z
                      "
                      fill="url(#chartFill)"
                    />

                    <path
                      d="
                        M 0 145
                        C 35 140, 45 132, 75 137
                        C 105 142, 110 118, 145 127
                        C 180 136, 180 91, 220 105
                        C 250 115, 260 96, 290 89
                        C 315 83, 330 99, 355 85
                        C 380 72, 410 88, 435 60
                        C 455 48, 470 52, 500 48
                      "
                      fill="none"
                      stroke="#1477f8"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />

                    {[
                      [0, 145],
                      [75, 137],
                      [145, 127],
                      [220, 105],
                      [290, 89],
                      [355, 85],
                      [435, 60],
                      [500, 48],
                    ].map(([cx, cy], index) => (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r="4"
                        fill="#1477f8"
                      />
                    ))}

                  </svg>

                  {/* X labels */}
                  <div className="absolute -bottom-5.75 left-10 right-0 flex justify-between">

                    {chartLabels.map((date) => (
                      <span
                        key={date}
                        className="text-[10px] text-[#a9bdd8]"
                      >
                        {date}
                      </span>
                    ))}

                  </div>

                </div>

                {/* Collection percentage */}
                <div className="flex min-w-42.5 flex-col items-center justify-center">

                  <div className="relative flex h-28 w-28 items-center justify-center">

                    <svg
                      className="absolute inset-0 h-full w-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#355778"
                        strokeWidth="10"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#18b77b"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="264"
                        strokeDashoffset="58"
                      />
                    </svg>

                    <div className="text-center">
                      <p className="text-xl font-bold">
                        78%
                      </p>

                      <p className="text-[9px] text-[#a9bdd8]">
                        Collection Rate
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 w-full space-y-3">

                    <div className="flex items-center justify-between text-xs">

                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        Collected
                      </span>

                      <strong>
                        ₦4,992,000
                      </strong>

                    </div>

                    <div className="flex items-center justify-between text-xs">

                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#7890aa]" />
                        Pending
                      </span>

                      <strong>
                        ₦1,418,000
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* RECENT ACTIVITY */}
            <div className="rounded-xl border border-[#294867] bg-[#102a49] p-5 shadow-sm">

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/15">
                    <Clock3
                      size={18}
                      className="text-cyan-200"
                    />
                  </div>

                  <h2 className="text-[16px] font-bold">
                    Recent Activity
                  </h2>

                </div>

                <button
                  className="rounded px-2 py-1 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
                  onClick={() => setShowAllActivities((showAll) => !showAll)}
                  aria-expanded={showAllActivities}
                >
                  {showAllActivities ? "Show less ↑" : "View all →"}
                </button>

              </div>

              <div>

                {visibleActivities.map((activity, index) => {

                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.title}
                      className={`
                        flex items-center gap-3 py-3
                        ${
                          index !== visibleActivities.length - 1
                            ? "border-b border-[#294867]"
                            : ""
                        }
                      `}
                    >

                      <div
                        className={`
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-full text-white
                          ${activity.color}
                        `}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-xs font-semibold text-[#e7f0ff]">
                          {activity.title}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-[#a9bdd8]">
                          {activity.description}
                        </p>

                      </div>

                      <span className="shrink-0 text-[10px] text-[#a9bdd8]">
                        {activity.time}
                      </span>

                    </div>
                  );
                })}

              </div>

            </div>

          </section>

          {/* RECENT OCCUPANTS */}
          <section id="occupants" className="scroll-mt-5 rounded-xl border border-[#294867] bg-[#102a49] p-4 shadow-sm lg:p-5">

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <Users
                  size={22}
                  className="text-cyan-200"
                />

                <h2 className="text-[16px] font-bold">
                  Recent Occupants
                </h2>

              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  onClick={() => setAddTenantOpen(true)}
                >
                  <Plus size={15} />
                  Add tenant
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#355778] px-3 py-2 text-xs font-semibold text-[#d7e5f5] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  onClick={() => tenantFileInputRef.current?.click()}
                >
                  <Upload size={15} />
                  Upload CSV / Excel
                </button>
                <input
                  ref={tenantFileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  aria-label="Upload tenant spreadsheet"
                  onChange={handleBulkTenantUpload}
                />
                <button
                  type="button"
                  className="rounded-lg border border-[#355778] px-3 py-2 text-xs font-semibold text-[#d7e5f5] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  onClick={() => setShowAllOccupants((showAll) => !showAll)}
                  aria-expanded={showAllOccupants}
                >
                  {showAllOccupants ? "Show fewer ↑" : "View all →"}
                </button>
                {bulkUploadMessage && (
                  <p
                    className={`basis-full text-xs ${bulkUploadError ? "text-rose-300" : "text-emerald-300"}`}
                    role={bulkUploadError ? "alert" : "status"}
                  >
                    {bulkUploadMessage}
                  </p>
                )}
              </div>

            </div>

            {visibleOccupants.length === 0 && (
              <p className="mb-4 rounded-lg bg-[#173555] px-4 py-6 text-center text-sm text-[#b6c9df]">
                No occupants match “{searchQuery}”. Try another name, unit, or building.
              </p>
            )}

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-[#173555] text-left">

                    <th className="px-3 py-3 text-[10px] font-semibold text-[#b6c9df]">
                      #
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold text-[#b6c9df]">
                      Name
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold text-[#b6c9df]">
                      Unit
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold text-[#b6c9df]">
                      Building
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold text-[#b6c9df]">
                      Entry Date
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold text-[#b6c9df]">
                      Balance
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold text-[#b6c9df]">
                      Status
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold text-[#b6c9df]">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {visibleOccupants.map((occupant) => (

                    <tr
                      key={occupant.number}
                      className="border-b border-[#294867]"
                    >

                      <td className="px-3 py-3 text-xs text-[#c1d2e7]">
                        {occupant.number}
                      </td>

                      <td className="px-3 py-3">

                        <div className="flex items-center gap-3">

                          <div
                            className={`
                              flex h-8 w-8
                              items-center justify-center
                              rounded-full
                              text-[10px] font-semibold text-white
                              ${occupant.avatar}
                            `}
                          >
                            {occupant.initials}
                          </div>

                          <button
                            type="button"
                            className="text-left text-xs font-medium text-[#e7f0ff] underline-offset-2 hover:text-cyan-200 hover:underline focus-visible:outline-2 focus-visible:outline-cyan-300"
                            onClick={() => openOccupantDetails(occupant)}
                          >
                            {occupant.name}
                          </button>

                        </div>

                      </td>

                      <td className="px-3 py-3 text-xs text-[#c1d2e7]">
                        {occupant.unit}
                      </td>

                      <td className="px-3 py-3 text-xs text-[#c1d2e7]">
                        <div>{occupant.building}</div>
                        {occupant.buildingLocation && (
                          <div className="mt-1 text-[10px] text-[#8fa8c5]">
                            {occupant.buildingLocation}
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3 text-xs text-[#c1d2e7]">
                        {occupant.entry}
                      </td>

                      <td className="px-3 py-3">

                        <span
                          className={`
                            rounded-full px-3 py-1
                            text-[10px] font-semibold
                            ${
                              occupant.balance === "₦0.00"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-600"
                            }
                          `}
                        >
                          {occupant.balance}
                        </span>

                      </td>

                      <td className="px-3 py-3">

                        <span
                          className={`
                            rounded-full px-3 py-1
                            text-[10px] font-semibold
                            ${
                              occupant.status === "Paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-orange-100 text-orange-600"
                            }
                          `}
                        >
                          {occupant.status}
                        </span>

                      </td>

                      <td className="px-3 py-3 text-center">

                        <button
                          type="button"
                          className="rounded p-1 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300"
                          aria-label={`View ${occupant.name}`}
                          onClick={() => openOccupantDetails(occupant)}
                        >
                          <MoreVertical
                            size={17}
                            className="text-[#c1d2e7]"
                          />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">

              {visibleOccupants.map((occupant) => (

                <div
                  key={occupant.number}
                  className="rounded-lg border border-[#294867] bg-[#132f50] p-3"
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${occupant.name}`}
                  onClick={() => openOccupantDetails(occupant)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openOccupantDetails(occupant);
                    }
                  }}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className={`
                          flex h-9 w-9 items-center justify-center
                          rounded-full text-xs font-semibold text-white
                          ${occupant.avatar}
                        `}
                      >
                        {occupant.initials}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {occupant.name}
                        </p>

                        <p className="text-xs text-[#a9bdd8]">
                          {occupant.building}
                        </p>
                        {occupant.buildingLocation && (
                          <p className="text-xs text-[#8fa8c5]">
                            {occupant.buildingLocation}
                          </p>
                        )}
                      </div>

                    </div>

                    <MoreVertical size={17} aria-hidden="true" />

                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">

                    <span>
                      {occupant.unit}
                    </span>

                    <span>
                      {occupant.entry}
                    </span>

                    <span
                      className={`
                        rounded-full px-2 py-1
                        ${
                          occupant.status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-600"
                        }
                      `}
                    >
                      {occupant.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </section>

        </div>
      </main>

      {addTenantOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-[#020b17]/75 p-4"
          onClick={(event) => { if (event.target === event.currentTarget) setAddTenantOpen(false); }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="add-tenant-title" className="my-auto w-full max-w-lg rounded-2xl border border-[#355778] bg-[#102a49] p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="add-tenant-title" className="text-xl font-bold">Add a tenant</h2>
                <p className="mt-1 text-sm text-[#a9bdd8]">Enter tenant and unit details to add them to your ledger.</p>
              </div>
              <button type="button" className="rounded-lg p-2 hover:bg-white/10" onClick={() => setAddTenantOpen(false)} aria-label="Close add tenant form">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTenant}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium sm:col-span-2">
                  Tenant name <span className="text-cyan-200">*</span>
                  <input
                    required
                    autoFocus
                    value={tenantForm.name}
                    onChange={(event) => setTenantForm({ ...tenantForm, name: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#355778] bg-[#0b2340] px-3 text-sm text-white outline-none placeholder:text-[#7892af] focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20"
                    placeholder="e.g. Amina Ibrahim"
                  />
                </label>
                <label className="text-sm font-medium">
                  Phone number
                  <input
                    type="tel"
                    value={tenantForm.phone}
                    onChange={(event) => setTenantForm({ ...tenantForm, phone: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#355778] bg-[#0b2340] px-3 text-sm text-white outline-none placeholder:text-[#7892af] focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20"
                    placeholder="e.g. +234 800 000 0000"
                  />
                </label>
                <label className="text-sm font-medium">
                  Unit / room <span className="text-cyan-200">*</span>
                  <input
                    required
                    value={tenantForm.unit}
                    onChange={(event) => setTenantForm({ ...tenantForm, unit: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#355778] bg-[#0b2340] px-3 text-sm text-white outline-none placeholder:text-[#7892af] focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20"
                    placeholder="e.g. Room 12"
                  />
                </label>
                <label className="text-sm font-medium">
                  Bedrooms
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={tenantForm.bedrooms}
                    onChange={(event) => setTenantForm({ ...tenantForm, bedrooms: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#355778] bg-[#0b2340] px-3 text-sm text-white outline-none focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20"
                  />
                </label>
                <label className="text-sm font-medium">
                  Building <span className="text-cyan-200">*</span>
                  <input
                    required
                    value={tenantForm.building}
                    onChange={(event) => setTenantForm({ ...tenantForm, building: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#355778] bg-[#0b2340] px-3 text-sm text-white outline-none placeholder:text-[#7892af] focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20"
                    placeholder="e.g. Block A - Green Villa"
                  />
                </label>
                <label className="text-sm font-medium">
                  Building location
                  <input
                    value={tenantForm.buildingLocation}
                    onChange={(event) => setTenantForm({ ...tenantForm, buildingLocation: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#355778] bg-[#0b2340] px-3 text-sm text-white outline-none placeholder:text-[#7892af] focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20"
                    placeholder="e.g. 12 Allen Avenue, Ikeja"
                  />
                </label>
                <label className="text-sm font-medium">
                  Move-in date <span className="text-cyan-200">*</span>
                  <input
                    required
                    type="date"
                    value={tenantForm.entryDate}
                    onChange={(event) => setTenantForm({ ...tenantForm, entryDate: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#355778] bg-[#0b2340] px-3 text-sm text-white outline-none focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/20"
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" className="rounded-lg border border-[#355778] px-4 py-2.5 text-sm font-semibold text-[#d7e5f5] hover:bg-white/10" onClick={() => setAddTenantOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
                  <Plus size={16} />
                  Add tenant
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {settingsOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-[#020b17]/75 p-4"
          onClick={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="settings-title" className="w-full max-w-md rounded-2xl border border-[#355778] bg-[#102a49] p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="settings-title" className="text-xl font-bold">Dashboard settings</h2>
                <p className="mt-1 text-sm text-[#a9bdd8]">Manage your local notification preferences.</p>
              </div>
              <button className="rounded-lg p-2 hover:bg-white/10" onClick={() => setSettingsOpen(false)} aria-label="Close settings">
                <X size={20} />
              </button>
            </div>
            {[
              ["Email notifications", emailNotifications, setEmailNotifications],
              ["Rent reminders", rentReminders, setRentReminders],
            ].map(([label, checked, setChecked]) => (
              <div key={label} className="flex items-center justify-between border-t border-[#294867] py-4">
                <span className="text-sm font-medium">{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  aria-label={label}
                  onClick={() => setChecked((value) => !value)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-cyan-600" : "bg-[#526981]"}`}
                >
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "left-6" : "left-1"}`} />
                </button>
              </div>
            ))}
            <button className="mt-3 w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500" onClick={() => setSettingsOpen(false)}>
              Done
            </button>
          </section>
        </div>
      )}

    </div>
  );
};


/* SIDEBAR ITEM */
const SidebarItem = ({
  icon: Icon,
  text,
  active = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`
        mb-1 flex w-full items-center
        rounded-lg px-4 py-3
        text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400
        ${
          active
            ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20"
            : "text-white/90 hover:bg-white/10"
        }
      `}
    >
      <Icon
        size={23}
        strokeWidth={active ? 2.5 : 2}
      />

      <span className="ml-4 text-sm font-medium">
        {text}
      </span>
    </button>
  );
};

export default Dashboard;