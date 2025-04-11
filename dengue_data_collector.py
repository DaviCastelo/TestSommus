import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, Integer, Float, String, Date, BigInteger, DECIMAL
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.dialects.mysql import insert
from dengue_api_client import InfoDengueClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

Base = declarative_base()

class DengueAlerts(Base):
    __tablename__ = 'denguealerts'
    
    Id = Column(BigInteger, primary_key=True, autoincrement=True)
    SemanaEpidemiologica = Column(Integer, nullable=False)
    DataIniSETimestamp = Column(BigInteger, nullable=False)
    CasosEstimados = Column(DECIMAL(10, 2), nullable=False)
    CasosEstimadosMin = Column(DECIMAL(10, 2), nullable=False)
    CasosEstimadosMax = Column(DECIMAL(10, 2), nullable=False)
    CasosNotificados = Column(Integer, nullable=False)
    ProbabilidadeRt1 = Column(DECIMAL(10, 2), nullable=False)
    IncidenciaPor100k = Column(DECIMAL(10, 2), nullable=False)
    NivelAlerta = Column(Integer, nullable=False)
    NumeroReprodutivoEfetivo = Column(DECIMAL(10, 2), nullable=False)
    Populacao = Column(Integer, nullable=False)
    Receptividade = Column(Integer, nullable=False)
    Transmissao = Column(Integer, nullable=False)
    NivelIncidencia = Column(Integer, nullable=False)
    NotificacoesAcumuladasAno = Column(Integer, nullable=False)

def calculate_epidemiological_weeks():
    """Calculate epidemiological weeks for the last 6 months"""
    today = datetime.now()
    six_months_ago = today - timedelta(days=180)
    
    # Convert to epidemiological weeks
    start_week = six_months_ago.isocalendar()[1]
    start_year = six_months_ago.year
    end_week = today.isocalendar()[1]
    end_year = today.year
    
    return start_week, start_year, end_week, end_year, six_months_ago, today

def main():
    # Get database credentials from environment variables
    db_user = os.getenv('DB_USER', 'root')
    db_password = os.getenv('DB_PASSWORD', '')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_name = os.getenv('DB_NAME', 'denguedb')
    
    # Initialize database connection
    DATABASE_URL = f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}"
    engine = create_engine(DATABASE_URL)
    
    try:

        with engine.connect() as connection:
            print("Successfully connected to the database!")
        
        Base.metadata.create_all(engine)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        
        client = InfoDengueClient()
        
        
        ew_start, ey_start, ew_end, ey_end, six_months_ago, today = calculate_epidemiological_weeks()
        
        
        df = client.get_dengue_data(
            geocode=3106200,
            disease="dengue",
            format="csv",
            ew_start=ew_start,
            ew_end=ew_end,
            ey_start=ey_start,
            ey_end=ey_end
        )
        
        print(f"Fetched {len(df)} records for Belo Horizonte")
        print("\nDataFrame columns:", df.columns.tolist())
        print("\nFirst row of data:")
        print(df.iloc[0])
        
        
        records_to_insert = []
        for _, row in df.iterrows():
            try:
                
                data = pd.to_datetime(row['data_iniSE'])
                timestamp = int(data.timestamp() * 1000)
                
                record_data = {
                    'SemanaEpidemiologica': int(row['SE']),
                    'DataIniSETimestamp': timestamp,
                    'CasosEstimados': float(row['casos_est']),
                    'CasosEstimadosMin': float(row['casos_est_min']),
                    'CasosEstimadosMax': float(row['casos_est_max']),
                    'CasosNotificados': int(row['casos']),
                    'ProbabilidadeRt1': float(row['p_rt1']),
                    'IncidenciaPor100k': float(row['p_inc100k']),
                    'NivelAlerta': int(row['nivel']),
                    'NumeroReprodutivoEfetivo': float(row['Rt']),
                    'Populacao': int(row['pop']),
                    'Receptividade': int(row['receptivo']),
                    'Transmissao': int(row['transmissao']),
                    'NivelIncidencia': int(row['nivel_inc']),
                    'NotificacoesAcumuladasAno': int(row['notif_accum_year'])
                }
                
                records_to_insert.append(record_data)
                
            except Exception as e:
                print(f"Error processing row: {e}")
                print("Row data:", row.to_dict())
                raise
        
        if records_to_insert:
            stmt = insert(DengueAlerts).values(records_to_insert)
            stmt = stmt.on_duplicate_key_update(
                CasosEstimados=stmt.inserted.CasosEstimados,
                CasosEstimadosMin=stmt.inserted.CasosEstimadosMin,
                CasosEstimadosMax=stmt.inserted.CasosEstimadosMax,
                CasosNotificados=stmt.inserted.CasosNotificados,
                ProbabilidadeRt1=stmt.inserted.ProbabilidadeRt1,
                IncidenciaPor100k=stmt.inserted.IncidenciaPor100k,
                NivelAlerta=stmt.inserted.NivelAlerta,
                NumeroReprodutivoEfetivo=stmt.inserted.NumeroReprodutivoEfetivo,
                Populacao=stmt.inserted.Populacao,
                Receptividade=stmt.inserted.Receptividade,
                Transmissao=stmt.inserted.Transmissao,
                NivelIncidencia=stmt.inserted.NivelIncidencia,
                NotificacoesAcumuladasAno=stmt.inserted.NotificacoesAcumuladasAno
            )
            
            session.execute(stmt)
            session.commit()
            print("Data successfully stored/updated in database")
        
        print("\nData Summary:")
        print(f"Time period: {six_months_ago.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')}")
        print(f"Total records: {len(df)}")
        print(f"Average cases: {df['casos'].mean():.2f}")
        print(f"Maximum alert level: {df['nivel'].max()}")
        
        print("\nSample of stored data:")
        sample_records = session.query(DengueAlerts).limit(5).all()
        for record in sample_records:
            print(f"Week {record.SemanaEpidemiologica}: {record.CasosNotificados} cases, Alert level: {record.NivelAlerta}")
        
    except Exception as e:
        print(f"Error: {e}")
        if 'session' in locals():
            session.rollback()
    finally:
        if 'session' in locals():
            session.close()

if __name__ == "__main__":
    main() 