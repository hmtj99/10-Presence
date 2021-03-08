import { user } from '../models';
 import { downloadResource } from '../util';

 const controller = {};

 controller.download = async (req, res) => {
  const fields = [
    {
      label: 'Student ID',
      value: 'googleID'
    },
    {
      label: 'Student Name',
      value: 'name'
    },
    {
     label: 'Attendance Percentage',
      value: 'attendance_percentage'
    }
  ];
  const data = await user.findAll();

  return downloadResource(res, 'Attendance.csv', fields, data);
 }

 export default controller;