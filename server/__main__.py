import click
import uvicorn

@click.group()
def cli():
    pass

@cli.command("run")
@click.option('--host', default='localhost')
@click.option('--port', default=8000)
@click.option('--log_level', default="info")
def run_server(host, port, log_level):
    """
    Command to run the server using uvicorn.
    """
    click.echo("Running server...")

    if __name__ == "__main__":
        uvicorn.run("server.main:app", port=port, log_level=log_level)

@cli.command("seeder")
def seeder():
    """
    Command to execute the seeder script.
    """
    import server.seeder


if __name__ == "__main__":
    cli()
