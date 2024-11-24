// Update report status
export const updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { disasterStatus } = req.body;

  try {
    const report = await Report.findByIdAndUpdate(
      id,
      { disasterStatus },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report); // Return the updated report
  } catch (error) {
    res.status(500).json({ message: 'Failed to update report status', error: error.message });
  }
};
