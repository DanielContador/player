package cl.dl_distancia_a481.player_tablet.utils;

/**
 * Created by alejandro on 14-03-18.
 */

import android.content.Context;
import android.util.Log;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.text.SimpleDateFormat;


public class ExcelLib {
    Context context;
    DbHelper dbHelper;

    /*Excel HEADER*/
    static final int TipoObjeto = 0;
    static final int ImagenEvento = 1;
    static final int NombreObjeto = 2;
    static final int DescripEvento = 3;
    static final int MaxIntentos = 4;
    static final int TipoContenido = 5;
    static final int CantActividades = 6;
    static final int NombreCarpeta = 7;

    static final String TipoObjetoEvento = "evento";
    static final String TipoObjetoContenido = "contenido";
    static final String TipoObjetoNoticia = "noticia";


    public ExcelLib(Context c) {
        context = c;

        //Init BD Object
        dbHelper = DbHelper.getHelper(context);
    }

    public void ReadExcel() {
        Log.i("Excel", "Reading XSLX");

        try {
            InputStream stream = context.getResources().getAssets().open("config/cursos_distancia.xlsx");
            XSSFWorkbook workbook = new XSSFWorkbook(stream);
            XSSFSheet sheet = workbook.getSheetAt(0);
            int rowsCount = sheet.getPhysicalNumberOfRows();
            FormulaEvaluator formulaEvaluator = workbook.getCreationHelper().createFormulaEvaluator();
            int Evento = 0;
            for (int r = 1; r < rowsCount; r++) {
                Row row = sheet.getRow(r);
                //int cellsCount = row.getPhysicalNumberOfCells();

                String Tipo = getCellAsString(row, TipoObjeto, formulaEvaluator);

                switch (Tipo) {
                    case TipoObjetoEvento:
                        //READ AND SAVE EVENTO
                        dbHelper.InsertEventADistancia(
                                r,                                                          //Correlativo según la fila
                                getCellAsString(row, NombreObjeto, formulaEvaluator),       //Nombre Objeto
                                getCellAsString(row, ImagenEvento, formulaEvaluator),       //Imagen que se asocia al Evento
                                getCellAsString(row, DescripEvento, formulaEvaluator)       //Descripción del evento
                        );
                        Evento = r;
                        break;
                    case TipoObjetoContenido:
                        dbHelper.InsertContentADistancia(
                                r,                                                          //Correlativo según la fila
                                getCellAsString(row, NombreCarpeta, formulaEvaluator),      //Nombre de la carpeta del paquete Scorm
                                getCellAsString(row, NombreObjeto, formulaEvaluator),       //Nombre de la carpeta del paquete Scorm
                                Evento,                                                     //Id Evento
                                Math.round(Float.parseFloat(getCellAsString(row, MaxIntentos, formulaEvaluator)) * 100) / 100,        //Máximos intentos
                                Math.round(Float.parseFloat(getCellAsString(row, TipoContenido, formulaEvaluator)) * 100) / 100,      //Evalua o No Evalua
                                Math.round(Float.parseFloat(getCellAsString(row, CantActividades, formulaEvaluator)) * 100) / 100     //Cant de Actividades
                        );
                        break;
                    case TipoObjetoNoticia:
                        dbHelper.InsertNoticias(
                                r,
                                getCellAsString(row, NombreObjeto, formulaEvaluator),
                                getCellAsString(row, ImagenEvento, formulaEvaluator),
                                getCellAsString(row, DescripEvento, formulaEvaluator)
                        );
                        break;
                    default:
                        //ERROR LEYENDO
                        Log.i("EXCEL", "ERROR LEYENDO EXCEL DE CONFIGURACION");
                        break;
                }

                /*for (int c = 0; c<cellsCount; c++) {
                    String value = getCellAsString(row, c, formulaEvaluator);
                    String cellInfo = "r:"+r+"; c:"+c+"; v:"+value;
                    Log.i("Excel", cellInfo );
                }*/
            }
        } catch (Exception e) {
            Log.i("Excel", e.toString());
        }
    }

    protected String getCellAsString(Row row, int c, FormulaEvaluator formulaEvaluator) {
        String value = "";
        try {
            Cell cell = row.getCell(c);
            CellValue cellValue = formulaEvaluator.evaluate(cell);
            switch (cellValue.getCellType()) {
                case Cell.CELL_TYPE_BOOLEAN:
                    value = "" + cellValue.getBooleanValue();
                    break;
                case Cell.CELL_TYPE_NUMERIC:
                    double numericValue = cellValue.getNumberValue();
                    if (HSSFDateUtil.isCellDateFormatted(cell)) {
                        double date = cellValue.getNumberValue();
                        SimpleDateFormat formatter =
                                new SimpleDateFormat("dd/MM/yy");
                        value = formatter.format(HSSFDateUtil.getJavaDate(date));
                    } else {
                        value = "" + numericValue;
                    }
                    break;
                case Cell.CELL_TYPE_STRING:
                    value = "" + cellValue.getStringValue();
                    break;
                default:
            }
        } catch (NullPointerException e) {
            Log.i("Excel", e.toString());
        }
        return value;
    }

}