import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "react-native-vector-icons"; // Import MaterialCommunityIcons

const StatisticsScreen = () => {
  const placeholderChartData = {
    labels: ["No Data"],
    datasets: [
      { data: [0], color: () => "#FF6384" },
      { data: [0], color: () => "#36A2EB" },
    ],
  };

  const placeholderPieData = [
    {
      name: "No Data",
      population: 0,
      color: "#808080",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const [chartData, setChartData] = useState(placeholderChartData);
  const [pieChartData, setPieChartData] = useState(placeholderPieData);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState(new Date("2024-09-11"));

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Function to clear data and reset charts
  const resetCharts = () => {
    console.log("Resetting charts...");
    setChartData(placeholderChartData);
    setPieChartData(placeholderPieData);

    // Optionally reset dates to default or null
    setStartDate(new Date("2023-01-01"));
    setEndDate(new Date("2024-09-11"));

    // Stop data loading until the user picks new dates
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.get("http://192.168.1.6:5010/api/overallStats");
      const { dailyData } = response.data;

      if (dailyData) {
        const filteredData = dailyData.filter((entry) => {
          const date = new Date(entry.date);
          return date >= startDate && date <= endDate;
        });

        const labels = filteredData.map((entry) => entry.date.substring(5)); // Extract MM-DD
        const totalReports = filteredData.map((entry) => entry.totalReports);
        const totalReportsSolved = filteredData.map((entry) => entry.totalReportsSolved);

        setChartData({
          labels: labels.length > 0 ? labels : ["No Data"],
          datasets: [
            {
              data: totalReports.length > 0 ? totalReports : [0],
              color: () => "#FF6384", // Red
            },
            {
              data: totalReportsSolved.length > 0 ? totalReportsSolved : [0],
              color: () => "#36A2EB", // Blue
            },
          ],
        });

        const totalReportsCount = totalReports.reduce((acc, num) => acc + num, 0);
        const totalReportsSolvedCount = totalReportsSolved.reduce((acc, num) => acc + num, 0);

        setPieChartData(
          totalReportsCount > 0 || totalReportsSolvedCount > 0
            ? [
                {
                  name: "Total Reports",
                  population: totalReportsCount,
                  color: "#FF6384",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Solved Reports",
                  population: totalReportsSolvedCount,
                  color: "#36A2EB",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
              ]
            : placeholderPieData
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios" ? true : false);
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios" ? true : false);
    setEndDate(currentDate);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Daily Reports</Text>

      {/* Date Pickers */}
      <View style={styles.datePickerContainer}>
        <Button onPress={() => setShowStartDatePicker(true)} title="Select Start Date" />
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        {/* Reset/Refresh Button */}
        <TouchableOpacity onPress={resetCharts} style={styles.refreshButton}>
          <MaterialCommunityIcons name="reload" size={24} color="#FFF" />
        </TouchableOpacity>

        <Button onPress={() => setShowEndDatePicker(true)} title="Select End Date" />
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            minimumDate={startDate}
          />
        )}
      </View>

      {/* Line Chart */}
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: chartData.datasets,
        }}
        width={Dimensions.get("window").width - 40}
        height={300}
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#071025",
          backgroundGradientFrom: "#071025",
          backgroundGradientTo: "#071025",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        style={styles.chart}
      />

      {/* Legend for Line Chart */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#FF6384" }]} />
          <Text style={styles.legendText}>Total Reports</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#36A2EB" }]} />
          <Text style={styles.legendText}>Solved Reports</Text>
        </View>
      </View>

      {/* Pie Chart */}
      <Text style={styles.pieChartTitle}>Reports Breakdown</Text>
      <PieChart
        data={pieChartData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#071025",
          backgroundGradientFrom: "#071025",
          backgroundGradientTo: "#071025",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        style={styles.pieChart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#071025",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFF",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071025",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  legendText: {
    color: "#fff",
    fontSize: 14,
  },
  refreshButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pieChartTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  pieChart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});

export default StatisticsScreen;
