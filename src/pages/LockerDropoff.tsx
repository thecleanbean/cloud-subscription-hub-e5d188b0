import LockerDropoffForm from "@/components/locker/LockerDropoffForm";

const LockerDropoff = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <div className="container mx-auto py-8">
      <LockerDropoffForm onSubmit={handleSubmit} />
    </div>
  );
};

export default LockerDropoff;
