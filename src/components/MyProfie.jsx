import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { getImageUrl } from "../utils/getImageUrl";

const MyProfile = ({ profile }) => {
  const navigate = useNavigate();

  const [userDataFromStorage, setUserDataFromStorage] = useState(null);

  useEffect(() => {
    const userDataRaw = localStorage.getItem("user");
    if (userDataRaw) {
      setUserDataFromStorage(JSON.parse(userDataRaw));
    }
  }, []); // runs once on mount

  const userType = userDataFromStorage?.userType;

  const userData = useMemo(() => {
    if (!profile) return {};

    if (profile.user) return profile.user;
    if (profile.principal) return profile.principal;
    if (profile.student) return profile.student;
    if (profile.parents) return profile.parents;

    return {};
  }, [profile]);

  const profileImage =
    userData?.photo
      ? getImageUrl(userData.photo)
      : userDataFromStorage?.photo
      ? getImageUrl(userDataFromStorage.photo)
      : "https://cdn-icons-png.flaticon.com/512/7162/7162728.png";

  const renderTeacherFields = () => (
    <>
      <ProfileField label="Teacher ID" value={userData.teacherId} />
      {/* <ProfileField label="Class ID" value={userData.classId} /> */}
      <ProfileField
        label="Assigned Class"
        value={`${userData.assignedClass} - ${userData.assignedSection}`}
      />
      <ProfileField label="Specialization" value={userData.specialization} />
      <ProfileField label="Subjects" value={userData.subjects} />
      <ProfileField label="Qualification" value={userData.qualification} />
      <ProfileField label="Experience" value={`${userData.experience} years`} />
    </>
  );

  const renderPrincipalFields = () => (
    <>
      <ProfileField label="Principal ID" value={userData.LoguserID} />
      <ProfileField label="Full Name" value={userData.fullName} />
      <ProfileField label="Email" value={userData.email} />
    </>
  );

  const renderStudentFields = () => (
    <>
      <ProfileField label="Student Name" value={userData.studentName} />
      <ProfileField label="Class" value={userData.class} />
      <ProfileField label="Section" value={userData.section} />
      <ProfileField label="Roll No" value={userData.rollNumber} />
    </>
  );

  const renderParentFields = () => (
    <>
      <ProfileField label="Parent Name" value={userData.fullName} />
      <ProfileField label="Email" value={userData.email} />
      <ProfileField label="Phone" value={userData.phone} />
    </>
  );

  const renderCommonFields = () => (
    <>
      {userData.address && (
        <ProfileField label="Address" value={userData.address} />
      )}
      {userData.joiningDate && (
        <ProfileField
          label="Joining Date"
          value={new Date(userData.joiningDate).toLocaleDateString()}
        />
      )}
      {userData.dateOfBirth && (
        <ProfileField
          label="Date of Birth"
          value={new Date(userData.dateOfBirth).toLocaleDateString()}
        />
      )}
      {userData.createdAt && (
        <ProfileField
          label="Account Created"
          value={new Date(userData.createdAt).toLocaleDateString()}
        />
      )}
    </>
  );

  const handleLogout = () => {
    // Get user type from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userType = userData?.userType;

    // Clear specific token based on user type
    switch (userType) {
      case "principal":
        localStorage.removeItem("principal_token");
        break;
      case "teacher":
        localStorage.removeItem("teacher_token");
        break;
      case "student":
        localStorage.removeItem("student_token");
        break;
      case "parents":
        localStorage.removeItem("parents_token");
        break;
      default:
        break;
    }

    // Clear common storage items
    localStorage.removeItem("user");

    // Navigate to login page
    navigate("/login");
  };
  return (
    <div className="min-h-screen text-black">
      <div className="max-w-screen-md mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border object-cover"
          />
          <div className="ml-6">
            <h2 className="text-xl font-bold">{userData.fullName}</h2>
            <p className="text-gray-600 capitalize">{userType}</p>
            {userData.phone && (
              <p className="text-gray-600">Phone: {userData.phone}</p>
            )}
          </div>
        </div>

        {/* Additional Profile Information */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-4 space-y-2">
          {userType === "teacher" && renderTeacherFields()}
          {userType === "principal" && renderPrincipalFields()}
          {userType === "student" && renderStudentFields()}
          {userType === "parent" && renderParentFields()}
          {renderCommonFields()}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 rounded-lg hover:bg-[#F1F2F5] w-full transition-all"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Field Component
const ProfileField = ({ label, value }) => (
  <p className="text-gray-600">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

export default MyProfile;
