using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using System.Xml.Linq;
using System.Xml.Serialization;
using System.Linq;
using Yokogawa.Data.Infrastructure.Utils.Excel.Elements;

namespace Yokogawa.Data.Infrastructure.Utils.Excel
{
    public class ExcelUtils
    {
        public Elements.Mapping ReadExcel(string fileUrl, string configFileName, string mappingId)
        {
            Elements.Mapping mapping = null;

            try
            {
                // read template
                ExcelPackage pck = new ExcelPackage(new FileInfo(fileUrl));

                //create xml object
                XmlSerializer serializer = new XmlSerializer(typeof(Mappings));
                Mappings result = null;
                using (FileStream fileStream = new FileStream(configFileName, FileMode.Open))
                {
                    result = (Mappings)serializer.Deserialize(fileStream);
                }


                if (result != null)
                {
                    mapping = !string.IsNullOrEmpty(mappingId) ? result.MappingList.Where(o => o.Id == mappingId).FirstOrDefault() : result.MappingList[0];
                    mapping.FileName = fileUrl;
                    ReadExcel(pck, mapping);
                }
                else
                {
                    mapping = new Elements.Mapping() { Error = "Cannot load configuration file" };

                }
            }
            catch (Exception ex)
            {
                return new Elements.Mapping() { Error = ex.Message };
            }

            return mapping;
        }

        public Elements.Mapping getConfigurationFile(string configFileName, string mappingId)
        {
            Elements.Mapping configFile = new Elements.Mapping();
            try
            {
                if (string.IsNullOrEmpty(configFileName) || string.IsNullOrEmpty(mappingId))
                    return configFile;

                XmlSerializer serializer = new XmlSerializer(typeof(Mappings));
                using (FileStream fileStream = new FileStream(configFileName, FileMode.Open))
                {
                    Mappings result = (Mappings)serializer.Deserialize(fileStream);
                    if (null != result && null != result.MappingList)
                        configFile = result.MappingList.Find(o => o.Id == mappingId);
                }
            }
            catch (Exception ex)
            {
                configFile.Error = ex.Message;
            }


            return configFile;
        }
        public void ReadExcel(ExcelPackage pck, Elements.Mapping mapping)
        {
            try
            {
                if (null == mapping || null == pck || null == pck.Workbook || !string.IsNullOrEmpty(mapping.Error) || null == mapping.Sheets)
                    return;

                List<int> emptySheets = new List<int>();

                // read template
                #region  //Get Sheet
                int index = -1;
                foreach (Sheet sheet in mapping.Sheets)
                {
                    var worksheet = !string.IsNullOrEmpty(sheet.Name) ? pck.Workbook.Worksheets[sheet.Name] : pck.Workbook.Worksheets.Where(o => o.Hidden == eWorkSheetHidden.Visible).FirstOrDefault();
                    index++;
                    if (null == worksheet)
                    {
                        emptySheets.Add(index);
                        continue;
                    }

                    #region  //Get Field
                    foreach (Field field in sheet.Fields)
                    {
                        field.Text = worksheet.Cells[field.Text].Value == null ? "" : worksheet.Cells[field.Text].Value.ToString();
                        if (field.Name.ToLower().Contains("date") && !string.IsNullOrEmpty(field.Text))
                        {
                            double doubleDate = 0;
                            DateTime? current;
                            if (double.TryParse(field.Text, out doubleDate))
                                current = DateTime.FromOADate(double.Parse(field.Text));
                            else
                            {
                                current = string.IsNullOrEmpty(field.Format) ? DateTime.Parse(field.Text) : DateTime.ParseExact(field.Text, field.Format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None);
                            }
                            field.Text = current.HasValue ? current.Value.ToString("dd MMM yyyy") : (string.IsNullOrEmpty(field.Format) ? field.Text : string.Empty);

                        }
                    }
                    #endregion

                    #region//Get Special Instructions FieldArea
                    foreach (FieldArea fieldArea in sheet.FieldAreas)
                    {
                        for (var r = int.Parse(fieldArea.RowStart); r <= int.Parse(fieldArea.RowEnd); r++)
                        {
                            for (var c = int.Parse(fieldArea.ColStart); c <= int.Parse(fieldArea.ColEnd); c++)
                            {
                                fieldArea.Text += worksheet.Cells[r, c].Value == null ? "" : " " + worksheet.Cells[r, c].Value.ToString();
                            }
                        }
                    }
                    #endregion

                    #region //Get List
                    foreach (List list in sheet.Lists)
                    {
                        list.Rows = list.Rows ?? new List<Row>();
                        int rowIndex = 1;
                        int rowEnd = string.IsNullOrEmpty(list.RowEnd) ? worksheet.Dimension.End.Row : int.Parse(list.RowEnd);
                        for (int i = int.Parse(list.RowStart); i <= rowEnd; i++)
                        {
                            Row newRow = new Row() { Columns = new List<Column>() };

                            foreach (Column column in list.RowDefinition.Columns)
                            {
                                Column newColumn = new Column() { Name = column.Name };

                                if (!string.IsNullOrEmpty(column.RowNo) && column.RowNo == "true")
                                {
                                    newColumn.Text = rowIndex.ToString();
                                }
                                else
                                {
                                    var currentCellName = column.Text + i.ToString();

                                    if (null != worksheet.Cells[currentCellName].Value)
                                        newRow.RowNo = rowIndex;

                                    newColumn.Text = worksheet.Cells[currentCellName].Value == null ? "" : worksheet.Cells[currentCellName].Value.ToString();

                                    if (column.Name.ToLower().Contains("date") && !string.IsNullOrEmpty(newColumn.Text.Replace("\r\n", "").Replace(" ", "")))
                                    {
                                        double doubleDate = 0;
                                        DateTime? current = null;
                                        if (!string.IsNullOrEmpty(column.Format))
                                        {
                                            try
                                            {
                                                current = DateTime.ParseExact(newColumn.Text, column.Format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None);
                                            }
                                            catch (Exception ex)
                                            {
                                                mapping.Error = "Row No " + newRow.RowNo + " " + newColumn.Name + "_" + newColumn.Text + ":" + ex.Message;
                                                newColumn.Text = "";
                                            }
                                        }
                                        else
                                        {
                                            DateTime dateResult;
                                            if (DateTime.TryParse(newColumn.Text, out dateResult))
                                                current = dateResult;
                                            else if (double.TryParse(newColumn.Text, out doubleDate))
                                                current = DateTime.FromOADate(doubleDate);
                                        }

                                        newColumn.Text = current.HasValue ? current.Value.ToString("dd MMM yyyy") : newColumn.Text;
                                    }
                                }
                                newRow.Columns.Add(newColumn);

                            }

                            if (newRow.RowNo > 0)
                            {
                                list.Rows.Add(newRow);
                                rowIndex++;
                            }

                        }
                    }

                    #endregion
                }
                #endregion

                for (int i = 0; i < emptySheets.Count(); i++)
                    mapping.Sheets.RemoveAt(emptySheets[i]);

            }
            catch (Exception ex)
            {
                mapping.Error = "ReadExcel:" + ex.Message;
            }
        }

        public List<Elements.Mapping> ReadExcelFiles(string folderName, string configureFileName, string mappingId, ref string error)
        {
            List<Elements.Mapping> result = new List<Elements.Mapping>();
            if (!Directory.Exists(folderName))
                return result;

            string[] fileNameList = Directory.GetFiles(folderName);

            foreach (string fileName in fileNameList)
            {
                Elements.Mapping mapping = null;
                string extension = Path.GetExtension(fileName).ToLower();
                if (extension != ".xls" && extension != ".xlsx")
                    continue;

                try
                {
                    ExcelPackage pck = new ExcelPackage(new FileInfo(fileName));
                    mapping = getConfigurationFile(configureFileName, mappingId);
                    mapping.FileName = fileName;
                    ReadExcel(pck, mapping);

                }
                catch (Exception ex)
                {
                    error += string.Format("Fails to load the content from file {0}, due to {1}/n", fileName, ex.Message);
                }

                if (null != mapping && string.IsNullOrEmpty(mapping.Error))
                    result.Add(mapping);
                else
                if (null != mapping && !string.IsNullOrEmpty(mapping.Error))
                    error += mapping.Error + "/n";
            }

            return result;
        }
        public List<Elements.Mapping> ReadExcelFiles(string[] fileNameList, string configureFileName, string mappingId, ref string error)
        {
            List<Elements.Mapping> result = new List<Elements.Mapping>();

            foreach (string fileName in fileNameList)
            {
                Elements.Mapping mapping = null;

                try
                {
                    ExcelPackage pck = new ExcelPackage(new FileInfo(fileName));
                    mapping = getConfigurationFile(configureFileName, mappingId);
                    mapping.FileName = fileName;
                    ReadExcel(pck, mapping);

                }
                catch (Exception ex)
                {
                    error += string.Format("Fails to load the content from file {0}, due to {1}/n", fileName, ex.Message);
                }

                if (null != mapping && string.IsNullOrEmpty(mapping.Error))
                    result.Add(mapping);
                else
                if (null != mapping && !string.IsNullOrEmpty(mapping.Error))
                    error += mapping.Error + "/n";
            }

            return result;
        }


        public string ExportToExcel(string jsonData, string configureFileName, string mappingId, string sheetName, string fileUrl, string fileTemplateUrl = "")
        {
            string error = string.Empty;

            if (!string.IsNullOrEmpty(fileTemplateUrl) && !File.Exists(fileTemplateUrl))
                return "cannot find file:" + fileTemplateUrl;


            Elements.Mapping mapping = this.ConvertJSONToMapping(jsonData, configureFileName, mappingId, sheetName);
            Sheet sheet = mapping.Sheets.Where(o => o.Name == sheetName).FirstOrDefault();
            ExcelPackage pck = !string.IsNullOrEmpty(fileTemplateUrl) ? new ExcelPackage(new FileInfo(fileTemplateUrl)) : new ExcelPackage();

            if (string.IsNullOrEmpty(fileTemplateUrl))
                pck.Workbook.Worksheets.Add(sheetName);

            if (pck.Workbook.Worksheets.Count() > 0)
            {
                var workSheet = pck.Workbook.Worksheets[sheetName];
                try
                {
                    if (null != workSheet)
                    {
                        foreach (Field field in sheet.Fields)
                        {
                            workSheet.Cells[field.Name].Value = field.Text;
                        }

                        foreach (FieldArea area in sheet.FieldAreas)
                        {
                            //var range = cellName + ":" + lastcell;
                            // workSheet.Cells[range].Merge = true;
                            int rowStart = int.Parse(area.RowStart);
                            int colStart = int.Parse(area.ColStart);
                            int rowEnd = int.Parse(area.RowEnd);
                            int colEnd = int.Parse(area.ColEnd);
                            workSheet.Cells[rowStart, colStart, rowEnd, colEnd].Merge = true;
                            workSheet.Cells[rowStart, colStart, rowEnd, colEnd].Value = area.Text;
                        }

                        foreach (List list in sheet.Lists)
                        {
                            foreach (Row row in list.Rows)
                            {
                                foreach (Column col in row.Columns)
                                {
                                    if (col.DataType == null)
                                        workSheet.Cells[col.Name].Value = col.Text;
                                    else
                                    {
                                        if (col.Text.Length == 0)
                                            continue;
                                        switch (col.DataType)
                                        {
                                            case "int":
                                                workSheet.Cells[col.Name].Value = Convert.ToInt32(col.Text);
                                                if (col.Format != null)
                                                    workSheet.Cells[col.Name].Style.Numberformat.Format = col.Format;
                                                break;
                                            case "decimal":
                                                workSheet.Cells[col.Name].Value = Convert.ToDecimal(col.Text);
                                                if (col.Format != null)
                                                    workSheet.Cells[col.Name].Style.Numberformat.Format = col.Format;
                                                break;
                                        }
                                    }

                                }
                            }
                        }



                        pck.SaveAs(new FileInfo(fileUrl));

                    }
                }
                catch (Exception ex)
                {
                    error = "Fails to edit cell:" + ex.Message;
                    return error;
                }
            }

            return error;

        }

        public Elements.Mapping ConvertJSONToMapping(string jsonString, string configureFileName, string mappingId, string sheetName)
        {
            Elements.Mapping mapping = getConfigurationFile(configureFileName, mappingId);
            if (null == mapping)
                return mapping;

            Sheet sheet = mapping.Sheets.Where(o => o.Name == sheetName).FirstOrDefault();
            if (null == sheet)
                return mapping;
            JObject input = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(jsonString);
            var removeList = new List<List>();
            //assign fields
            foreach (Field field in sheet.Fields)
            {
                JValue token = (Newtonsoft.Json.Linq.JValue)input.SelectToken(field.Name);
                field.Name = field.Text;
                field.Text = token == null ? string.Empty : Convert.ToString(token.Value);
            }

            //assign Area
            foreach (FieldArea area in sheet.FieldAreas)
            {
                JValue token = (Newtonsoft.Json.Linq.JValue)input.SelectToken(area.Name);
                area.Name = area.Text;
                area.Text = token == null ? string.Empty : Convert.ToString(token.Value);
            }

            //assign List
            if (sheet.Lists != null)
            {
                foreach (List list in sheet.Lists)
                {
                    JToken value = input.SelectToken(list.Name);
                    if (value == null)
                    {
                        removeList.Add(list);
                        continue;
                    }

                    JArray array = (Newtonsoft.Json.Linq.JArray)value;

                    List<JToken> listTable = array.ToList();

                    int index = Convert.ToInt32(list.RowStart);

                    if (listTable != null && listTable.Count() > 0)
                    {
                        list.Rows = list.Rows ?? new List<Row>();
                        int i = 0;
                        foreach (JToken row in listTable)
                        {
                            Row newRow = new Row();
                            newRow.Columns = newRow.Columns ?? new List<Column>();
                            list.Rows.Add(newRow);
                            foreach (Column column in list.RowDefinition.Columns)
                            {
                                Column col = new Column();
                                newRow.Columns.Add(col);
                                col.Name = column.Text + (index + i).ToString();
                                JValue token = (Newtonsoft.Json.Linq.JValue)row.SelectToken(column.Name);
                                col.DataType = column.DataType;
                                col.Format = column.Format;
                                col.Text = token != null ? Convert.ToString(token.Value) : string.Empty;

                            }
                            i++;

                        }

                    }

                }

                foreach (var list in removeList)
                    sheet.Lists.Remove(list);
            }

            return mapping;

        }

        public static string ConvertExcelMappingToJSON(Elements.Mapping mapping)
        {
            string jsonFile = string.Empty;
            try
            {
                foreach (Field field in mapping.Sheets[0].Fields)
                {
                    if (!string.IsNullOrEmpty(field.Text))
                    {
                        field.Text = field.Text.Contains("\"") ? field.Text.Replace("\"", "\\\"") : field.Text;
                        jsonFile += string.Format("\"{0}\":\"{1}\",", field.Name, field.Text);
                    }

                }

                foreach (FieldArea area in mapping.Sheets[0].FieldAreas)
                {
                    if (!string.IsNullOrEmpty(area.Text))
                    {
                        area.Text = area.Text.Contains("\"") ? area.Text.Replace("\"", "\\\"") : area.Text;
                        jsonFile += string.Format("\"{0}\":\"{1}\",", area.Name, area.Text);
                    }

                }

                string listJson = string.Empty;
                if (mapping.Sheets[0].Lists != null)
                {
                    string temp = string.Empty;
                    foreach (List list in mapping.Sheets[0].Lists)
                    {
                        foreach (Row row in list.Rows)
                        {
                            string coltemp = string.Empty; //string.Format("\"OrganizationLevel\":\"{0}\",", row.RowNo);
                            foreach (Column col in row.Columns)
                            {
                                coltemp += string.Format("\"{0}\":\"{1}\",", col.Name, col.Text);

                            }

                            coltemp = "{" + coltemp.TrimEnd(',') + "},";
                            temp += coltemp;
                        }
                        jsonFile += !string.IsNullOrEmpty(list.Name) ? string.Format("\"{0}\":{1},", list.Name, "[" + temp + "]") : "[" + temp + "]";
                    }
                }

                if (mapping.Sheets[0].Fields.Count() > 0 || mapping.Sheets[0].FieldAreas.Count > 0)
                    jsonFile = "{" + jsonFile + "}";
            }
            catch (Exception ex)
            {
                mapping.Error = ex.Message;
            }


            return jsonFile;
        }

        public static string MoveFile(string sourcePath, string targetLocation)
        {
            try
            {
                if (File.Exists(sourcePath))
                {
                    if (!Directory.Exists(targetLocation))
                        Directory.CreateDirectory(targetLocation);
                    string fileName = Path.GetFileName(sourcePath);
                    File.Move(sourcePath, Path.Combine(targetLocation, fileName));
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                return "Move File Fails:" + ex.Message;
            }

        }
    }
}
