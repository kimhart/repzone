def get_bio_text(df):
    import re
    import requests
    from bs4 import BeautifulSoup
    import pandas as pd

    ## Loop thorugh every senator to get bios
    for i in range(len(df)):
        ## Go to url of each senator
        url = 'http://bioguide.congress.gov/scripts/biodisplay.pl?index={}'.format(df.loc[i, 'bioguide_id'])
        r = requests.get(url)
        c = r.content
        soup = BeautifulSoup(c, "lxml")

        ## Save bio text in data set
        bio_text = str(soup.findAll('p')[0])
        df.loc[i, 'bio_text'] = re.sub("<[^>]*>","",bio_text).replace('\r','').replace('\n','')
    return df

def put_into_sql(data_set):
    import sqlite3
    import pandas as pd
    from sqlalchemy import create_engine

    engine = create_engine('sqlite:///rep_zone.db')
    connection = sqlite3.connect("rep_zone.db")

    cursor = connection.cursor()

    # delete 
    try:
        cursor.execute("""DROP TABLE current_rep_bio;""")
    except:
        'table did not exist'

    sql_command = """
    CREATE TABLE current_rep_bio (
    address varchar(255), 
    bioguide_id PRIMARY KEY, 
    class_ varchar(255), 
    email Hyperlink, 
    first_name varchar(255), 
    last_name varchar(255), 
    leadership_position varchar(255), 
    member_full varchar(255), 
    party varchar(255), 
    phone varchar(255), 
    state varchar(255), 
    website Hyperlink,
    bio_text LONGTEXT);"""

    cursor.execute(sql_command)

    for i in range(len(data_set)):
        x = list(data_set.loc[i,])

        for p in [x]:
            format_str = """INSERT INTO current_rep_bio (
            address, 
            bioguide_id, 
            class_, 
            email, 
            first_name, 
            last_name, 
            leadership_position, 
            member_full, 
            party, 
            phone, 
            state, 
            website,
            bio_text)
            VALUES ("{address}", "{bioguide_id}", "{class_}", "{email}", "{first_name}", "{last_name}", 
            "{leadership_position}", "{member_full}", "{party}", "{phone}", "{state}",
            "{website}", "{bio_text}");"""

            sql_command = format_str.format(address=p[0], bioguide_id=p[1], class_=p[2], email=p[3], first_name=p[4], last_name=p[5], 
                              leadership_position=p[6], member_full=p[7], party=p[8],phone=p[9], state=p[10],
                              website=p[11], bio_text=p[12])
            cursor.execute(sql_command)

    # never forget this, if you want the changes to be saved:
    connection.commit()

    connection.close()


def get_senator_info():
    
    import pandas as pd
    import requests
    from json import dumps
    from xmljson import badgerfish as bf
    from xml.etree.ElementTree import fromstring
    from pandas.io.json import json_normalize
    import sqlalchemy
    import sqlite3

    url = 'http://www.senate.gov/general/contact_information/senators_cfm.xml'
    r = requests.get(url)
    x = json_normalize(pd.DataFrame(bf.data(fromstring(r.content))).loc['member', 'contact_information'])
    x.columns = x.columns.str.replace('$', '').str.replace('.', '')
    
    ## Collect bios before I sent to sql db
    get_bio_text(x)
    
    ## Put into sql
    ## code below is depricated for now
    #x.to_sql('current_rep_bio', 'sqlite:///rep_zone.db', if_exists='replace', index=False, 
    #         index_label='bioguide_id', flavor='mysql')
    put_into_sql(x)

    print 'done!'

get_senator_info()

