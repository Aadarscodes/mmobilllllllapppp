import React, { useState, useEffect } from "react";
import { UserPlus, Search, Edit, Trash, X, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdmissionSkeleton from "../../Loading/AdmissionsLoading";
import DailyAttendanceSummary from "./DailyAttendanceSummary";
import Modal from "react-modal";

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const schools = user?.user?.schools || user?.schools || [];
  const schoolId = schools[0]?.id || null;

  const principal_token = localStorage.getItem("principal_token");

  useEffect(() => {
    if (!schoolId) {
      setTeachers([]);
      setLoading(false);
      return;
    }
    fetch(
      `https://api.jsic.in/api/teacher/teachers/by-school/${schoolId}`,
      {
        headers: {
          Authorization: `Bearer ${principal_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data.teachers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTeachers([]);
        setLoading(false);
      });
  }, [schoolId, principal_token]);

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleView = (teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    fetch(`https://api.jsic.in/api/teacher/teacher/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${principal_token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Teacher deleted successfully");
          setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
        } else {
          toast.error("Failed to delete teacher");
        }
      })
      .catch(() => toast.error("Error deleting teacher"));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleSelectTeacher = (teacherId) => {
    setSelectedTeacherId(teacherId);
  };

  const filteredTeachers = (teachers || []).filter((teacher) =>
    teacher.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <AdmissionSkeleton />;
  }

  // Custom styles for the modal
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "600px",
      width: "90%",
      borderRadius: "8px",
      padding: "0",
      border: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
        </div>
        <Link to="/principal/register-teacher">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Add Teacher
          </button>
        </Link>
      </div>

      {/* Add DailyAttendanceSummary Component */}
      <DailyAttendanceSummary
        schoolId={schoolId}
        token={principal_token}
        teacherId={selectedTeacherId}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center gap-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search teachers..."
            className="flex-1 border-none outline-none text-sm text-gray-800 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Joined Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {teacher.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {teacher.subjects}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {teacher.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {teacher.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(teacher.joiningDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(teacher)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-sm text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(teacher.id)}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                    <button
                      className="text-sm text-green-600 hover:text-green-800"
                      onClick={() => {
                        handleSelectTeacher(teacher.id);
                        handleView(teacher);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Teacher Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={handleCloseViewModal}
        style={customStyles}
        contentLabel="Teacher Details"
      >
        {selectedTeacher && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Teacher Details
              </h2>
              <button
                onClick={handleCloseViewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-sm text-gray-800">
                    {selectedTeacher.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Teacher ID
                  </p>
                  <p className="text-sm text-gray-800">
                    {selectedTeacher.teacherId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-800">
                    {selectedTeacher.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-800">
                    {selectedTeacher.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Subjects</p>
                  <p className="text-sm text-gray-800">
                    {selectedTeacher.subjects}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Specialization
                  </p>
                  <p className="text-sm text-gray-800">
                    {selectedTeacher.specialization}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Class/Section
                  </p>
                  <p className="text-sm text-gray-800">
                    {selectedTeacher.assignedClass || "N/A"} -{" "}
                    {selectedTeacher.assignedSection || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Joining Date
                  </p>
                  <p className="text-sm text-gray-800">
                    {new Date(selectedTeacher.joiningDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedTeacher.setSelectedMonthIndex && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Salary Paid Months
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTeacher.setSelectedMonthIndex
                      .split(",")
                      .map((month) => (
                        <span
                          key={month}
                          className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                        >
                          {month}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Teachers;
